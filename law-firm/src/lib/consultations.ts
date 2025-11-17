import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

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

