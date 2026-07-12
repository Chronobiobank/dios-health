/**
 * Fixed demo peers for Connect / Sync Chat → create_or_get_dm.
 * UUIDs seeded in migration 20260712000024_connect_demo_chat_peers.
 */

export const CONNECT_DEMO_PEER_BY_MATCH_ID = {
  'match-1': {
    userId: 'a0000000-0000-4000-8000-000000000011',
    displayName: 'Ash R.',
  },
  'match-2': {
    userId: 'a0000000-0000-4000-8000-000000000012',
    displayName: 'Kai T.',
  },
  'match-3': {
    userId: 'a0000000-0000-4000-8000-000000000013',
    displayName: 'River M.',
  },
  'match-4': {
    userId: 'a0000000-0000-4000-8000-000000000014',
    displayName: 'Sage L.',
  },
  'match-5': {
    userId: 'a0000000-0000-4000-8000-000000000015',
    displayName: 'Rowan K.',
  },
  'match-6': {
    userId: 'a0000000-0000-4000-8000-000000000016',
    displayName: 'Sol A.',
  },
} as const

export type ConnectDemoMatchId = keyof typeof CONNECT_DEMO_PEER_BY_MATCH_ID

export function isConnectDemoMatchId(id: string): id is ConnectDemoMatchId {
  return id in CONNECT_DEMO_PEER_BY_MATCH_ID
}

export function peerUserIdForMatch(matchId: string): string | null {
  if (!isConnectDemoMatchId(matchId)) return null
  return CONNECT_DEMO_PEER_BY_MATCH_ID[matchId].userId
}

/** Soft-gate: signed-in → start DM; guest → home with next back to start. */
export function connectChatHref(matchId: string, signedIn: boolean): string {
  const path = `/chat/start/${matchId}`
  return signedIn ? path : `/?next=${encodeURIComponent(path)}`
}
