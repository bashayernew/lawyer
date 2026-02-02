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
const KV_TEAM_INDEX_KEY = 'team:index'
const KV_TEAM_PREFIX = 'team:'

async function readTeamFromKV(): Promise<TeamMemberRecord[] | null> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const ids = (await kv.get<string[]>(KV_TEAM_INDEX_KEY)) || []
      if (ids.length === 0) {
        return []
      }

      const keys = ids.map((id) => `${KV_TEAM_PREFIX}${id}`)
      const records = await kv.mget<TeamMemberRecord[]>(...keys)
      return records.filter(Boolean) as TeamMemberRecord[]
    }
  } catch (error) {
    console.error('Failed to read team from KV:', error)
  }
  return null
}

async function writeTeamToKV(members: TeamMemberRecord[]): Promise<void> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const ids = members.map((member) => member.id)
      await kv.set(KV_TEAM_INDEX_KEY, ids)

      await Promise.all(
        members.map((member) => kv.set(`${KV_TEAM_PREFIX}${member.id}`, member))
      )
      return
    }
  } catch (error) {
    console.error('Failed to write team to KV:', error)
  }
  throw new Error('KV not configured')
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
        await writeTeamToKV(fileMembers)
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
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    await writeTeamToKV(members)
    if (process.env.NODE_ENV !== 'production') {
      writeTeam(members)
    }
    return
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('KV not configured')
  }

  writeTeam(members)
}
