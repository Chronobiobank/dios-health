import type { SupabaseClient } from '@supabase/supabase-js'

import { CHAT_MESSAGE_MAX_LENGTH } from '@/lib/chat/constants'
import type { ChatInboxItem, ChatMessage, ChatThreadPeer } from '@/lib/chat/types'

type ConversationRow = {
  id: string
  last_message_at: string | null
  source_match_id: string | null
}

type MemberRow = {
  conversation_id: string
  user_id: string
}

type MessageRow = {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  created_at: string
}

type ProfileRow = {
  id: string
  display_name: string | null
}

function mapMessage(row: MessageRow): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    body: row.body,
    createdAt: row.created_at,
  }
}

export async function ensureGuideConversation(
  supabase: SupabaseClient
): Promise<{ conversationId: string | null; error: string | null }> {
  const { data, error } = await supabase.rpc('ensure_guide_dm')
  if (error) return { conversationId: null, error: error.message }
  return { conversationId: data as string, error: null }
}

export async function createOrGetDm(
  supabase: SupabaseClient,
  peerUserId: string,
  sourceMatchId?: string | null
): Promise<{ conversationId: string | null; error: string | null }> {
  const { data, error } = await supabase.rpc('create_or_get_dm', {
    peer_user_id: peerUserId,
    p_source_match_id: sourceMatchId ?? null,
  })
  if (error) return { conversationId: null, error: error.message }
  return { conversationId: data as string, error: null }
}

export async function listInbox(
  supabase: SupabaseClient,
  userId: string
): Promise<{ items: ChatInboxItem[]; error: string | null }> {
  const { data: memberships, error: memberError } = await supabase
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', userId)

  if (memberError) return { items: [], error: memberError.message }

  const conversationIds = (memberships ?? []).map((m) => m.conversation_id as string)
  if (conversationIds.length === 0) return { items: [], error: null }

  const { data: conversations, error: convError } = await supabase
    .from('conversations')
    .select('id, last_message_at, source_match_id')
    .in('id', conversationIds)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  if (convError) return { items: [], error: convError.message }

  const { data: allMembers, error: allMembersError } = await supabase
    .from('conversation_members')
    .select('conversation_id, user_id')
    .in('conversation_id', conversationIds)

  if (allMembersError) return { items: [], error: allMembersError.message }

  const peerIds = [
    ...new Set(
      ((allMembers ?? []) as MemberRow[])
        .filter((m) => m.user_id !== userId)
        .map((m) => m.user_id)
    ),
  ]

  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, display_name')
    .in('id', peerIds.length ? peerIds : ['00000000-0000-0000-0000-000000000000'])

  if (profileError) return { items: [], error: profileError.message }

  const profileById = new Map(
    ((profiles ?? []) as ProfileRow[]).map((p) => [p.id, p.display_name?.trim() || 'Member'])
  )

  const items: ChatInboxItem[] = []

  for (const conv of (conversations ?? []) as ConversationRow[]) {
    const peer = ((allMembers ?? []) as MemberRow[]).find(
      (m) => m.conversation_id === conv.id && m.user_id !== userId
    )
    if (!peer) continue

    let lastBody: string | null = null
    const { data: lastMsg } = await supabase
      .from('messages')
      .select('body')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    lastBody = (lastMsg as { body?: string } | null)?.body ?? null

    items.push({
      conversationId: conv.id,
      peerUserId: peer.user_id,
      peerDisplayName: profileById.get(peer.user_id) ?? 'Member',
      lastMessageBody: lastBody,
      lastMessageAt: conv.last_message_at,
      sourceMatchId: conv.source_match_id,
    })
  }

  items.sort((a, b) => {
    const at = a.lastMessageAt ? Date.parse(a.lastMessageAt) : 0
    const bt = b.lastMessageAt ? Date.parse(b.lastMessageAt) : 0
    return bt - at
  })

  return { items, error: null }
}

export async function getThreadPeer(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string
): Promise<{ peer: ChatThreadPeer | null; error: string | null }> {
  const { data: members, error } = await supabase
    .from('conversation_members')
    .select('user_id')
    .eq('conversation_id', conversationId)

  if (error) return { peer: null, error: error.message }

  const isMember = (members ?? []).some((m) => m.user_id === userId)
  if (!isMember) return { peer: null, error: 'Forbidden' }

  const peerId = (members ?? []).map((m) => m.user_id as string).find((id) => id !== userId)
  if (!peerId) return { peer: null, error: 'No peer' }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, display_name')
    .eq('id', peerId)
    .maybeSingle()

  if (profileError) return { peer: null, error: profileError.message }

  return {
    peer: {
      userId: peerId,
      displayName: (profile as ProfileRow | null)?.display_name?.trim() || 'Member',
    },
    error: null,
  }
}

export async function listMessages(
  supabase: SupabaseClient,
  conversationId: string,
  limit = 100
): Promise<{ messages: ChatMessage[]; error: string | null }> {
  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, body, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) return { messages: [], error: error.message }
  return { messages: ((data ?? []) as MessageRow[]).map(mapMessage), error: null }
}

export async function sendMessage(
  supabase: SupabaseClient,
  conversationId: string,
  senderId: string,
  body: string
): Promise<{ message: ChatMessage | null; error: string | null }> {
  const trimmed = body.trim()
  if (!trimmed || trimmed.length > CHAT_MESSAGE_MAX_LENGTH) {
    return { message: null, error: 'Message must be 1–2000 characters' }
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      body: trimmed,
    })
    .select('id, conversation_id, sender_id, body, created_at')
    .single()

  if (error) return { message: null, error: error.message }
  return { message: mapMessage(data as MessageRow), error: null }
}
