import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

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

export function readUsers(): UserRecord[] {
  try {
    const data = readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(data)
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

