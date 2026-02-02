import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { kv } from '@vercel/kv'

export type ConsultationStatus = 'pending' | 'confirmed' | 'completed'

export type ConsultationRecord = {
  id: string
  name: string
  email: string | null
  phone: string | null
  message: string
  locale: string
  preferredDate?: string | null
  status: ConsultationStatus
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

const CONSULTATIONS_FILE = join(process.cwd(), 'src', 'data', 'consultations.json')
const KV_CONSULTATIONS_INDEX_KEY = 'consultations:index'
const KV_CONSULTATION_PREFIX = 'consultation:'

async function readConsultationsFromKV(): Promise<ConsultationRecord[] | null> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const ids = (await kv.get<string[]>(KV_CONSULTATIONS_INDEX_KEY)) || []
      if (ids.length === 0) {
        return []
      }

      const keys = ids.map((id) => `${KV_CONSULTATION_PREFIX}${id}`)
      const records = await kv.mget<ConsultationRecord[]>(...keys)
      return records.filter(Boolean) as ConsultationRecord[]
    }
  } catch (error) {
    console.error('Failed to read consultations from KV:', error)
  }
  return null
}

async function writeConsultationsToKV(records: ConsultationRecord[]): Promise<void> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const ids = records.map((record) => record.id)
      await kv.set(KV_CONSULTATIONS_INDEX_KEY, ids)

      await Promise.all(
        records.map((record) => kv.set(`${KV_CONSULTATION_PREFIX}${record.id}`, record))
      )
      return
    }
  } catch (error) {
    console.error('Failed to write consultations to KV:', error)
  }
  throw new Error('KV not configured')
}

export async function readConsultations(): Promise<ConsultationRecord[]> {
  try {
    const data = await readFile(CONSULTATIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Failed to read consultations file:', error)
    return []
  }
}

export async function writeConsultations(records: ConsultationRecord[]) {
  await writeFile(CONSULTATIONS_FILE, JSON.stringify(records, null, 2), 'utf-8')
}

export async function readConsultationsAsync(): Promise<ConsultationRecord[]> {
  const kvRecords = await readConsultationsFromKV()
  if (kvRecords !== null && kvRecords.length > 0) {
    return kvRecords
  }

  try {
    const fileRecords = await readConsultations()
    if (fileRecords.length > 0 && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        await writeConsultationsToKV(fileRecords)
      } catch (err) {
        console.error('Failed to migrate consultations to KV:', err)
      }
    }
    return fileRecords
  } catch (error) {
    console.error('Failed to read consultations from file system:', error)
    return []
  }
}

export async function writeConsultationsAsync(records: ConsultationRecord[]) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    await writeConsultationsToKV(records)
    if (process.env.NODE_ENV !== 'production') {
      await writeConsultations(records)
    }
    return
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('KV not configured')
  }

  await writeConsultations(records)
}
