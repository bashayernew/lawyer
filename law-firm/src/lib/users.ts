import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { kv } from '@vercel/kv'

export type UserRole = 'admin' | 'editor' | 'viewer'

export type UserRecord = {
  id: string
  name: string
  email: string
  password: string // In production, this should be hashed
  role: UserRole
  active: boolean
  createdAt: string
  updatedAt: string
}

const USERS_FILE = join(process.cwd(), 'src', 'data', 'users.json')
const KV_USERS_INDEX_KEY = 'users:index'
const KV_USER_PREFIX = 'user:'

function normalizeUser(record: UserRecord): UserRecord {
  return {
    ...record,
    id: String(record.id)
  }
}

async function readUsersFromKV(): Promise<UserRecord[] | null> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const ids = (await kv.get<string[]>(KV_USERS_INDEX_KEY)) || []
      if (ids.length === 0) {
        return []
      }

      const keys = ids.map((id) => `${KV_USER_PREFIX}${id}`)
      const records = await kv.mget<UserRecord[]>(...keys)
      return records.filter(Boolean).map((record) => normalizeUser(record as UserRecord))
    }
  } catch (error) {
    console.error('Error reading users from KV:', error)
  }
  return null
}

async function writeUsersToKV(users: UserRecord[]): Promise<void> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const normalized = users.map(normalizeUser)
      const ids = normalized.map((user) => user.id)
      await kv.set(KV_USERS_INDEX_KEY, ids)
      await Promise.all(
        normalized.map((user) => kv.set(`${KV_USER_PREFIX}${user.id}`, user))
      )
      return
    }
  } catch (error) {
    console.error('Error writing users to KV:', error)
  }
  throw new Error('KV not configured')
}

export function readUsers(): UserRecord[] {
  try {
    const data = readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(data).map((record: UserRecord) => normalizeUser(record))
  } catch (error) {
    console.error('Error reading users:', error)
    return []
  }
}

export function writeUsers(users: UserRecord[]): void {
  try {
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing users:', error)
    throw error
  }
}

export async function readUsersAsync(): Promise<UserRecord[]> {
  const kvUsers = await readUsersFromKV()
  if (kvUsers !== null && kvUsers.length > 0) {
    return kvUsers
  }

  try {
    const fileUsers = readUsers()
    if (fileUsers.length > 0 && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        await writeUsersToKV(fileUsers)
      } catch (err) {
        console.error('Failed to migrate users to KV:', err)
      }
    }
    return fileUsers
  } catch (error) {
    console.error('Error reading users from file system:', error)
    return []
  }
}

export async function writeUsersAsync(users: UserRecord[]): Promise<void> {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    await writeUsersToKV(users)
    if (process.env.NODE_ENV !== 'production') {
      writeUsers(users)
    }
    return
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('KV not configured')
  }

  writeUsers(users)
}

