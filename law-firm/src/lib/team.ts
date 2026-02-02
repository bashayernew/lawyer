import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { kv } from '@vercel/kv'

export type TeamMemberRecord = {
  id: string
  name: string
  role?: string
  description: string
  image: string
  createdAt: string
  updatedAt: string
}

const TEAM_FILE = join(process.cwd(), 'src', 'data', 'team.json')
const KV_TEAM_KEY = 'team:all'

async function readTeamFromKV(): Promise<TeamMemberRecord[] | null> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      let members = await kv.get<TeamMemberRecord[]>(KV_TEAM_KEY)

      if (!members || members.length === 0) {
        const fileMembers = readTeam()
        if (fileMembers.length > 0) {
          await kv.set(KV_TEAM_KEY, fileMembers)
          members = fileMembers
        }
      }

      return members || []
    }
  } catch (error) {
    console.error('Failed to read team from KV:', error)
  }
  return null
}

async function writeTeamToKV(members: TeamMemberRecord[]): Promise<boolean> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set(KV_TEAM_KEY, members)
      return true
    }
  } catch (error) {
    console.error('Failed to write team to KV:', error)
  }
  return false
}

export function readTeam(): TeamMemberRecord[] {
  try {
    const data = readFileSync(TEAM_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading team:', error)
    return []
  }
}

export function writeTeam(members: TeamMemberRecord[]): void {
  try {
    writeFileSync(TEAM_FILE, JSON.stringify(members, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing team:', error)
    throw error
  }
}

export async function readTeamAsync(): Promise<TeamMemberRecord[]> {
  const kvMembers = await readTeamFromKV()
  if (kvMembers !== null && kvMembers.length > 0) {
    return kvMembers
  }

  try {
    const fileMembers = readTeam()
    if (fileMembers.length > 0 && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        await kv.set(KV_TEAM_KEY, fileMembers)
      } catch (err) {
        console.error('Failed to migrate team to KV:', err)
      }
    }
    return fileMembers
  } catch (error) {
    console.error('Failed to read team from file system:', error)
    return []
  }
}

export async function writeTeamAsync(members: TeamMemberRecord[]): Promise<void> {
  const kvWritten = await writeTeamToKV(members)
  if (!kvWritten) {
    writeTeam(members)
  } else {
    writeTeam(members)
  }
}
