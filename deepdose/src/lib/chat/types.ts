export type ChatMessage = {
  id: string
  conversationId: string
  senderId: string
  body: string
  createdAt: string
}

export type ChatInboxItem = {
  conversationId: string
  peerUserId: string
  peerDisplayName: string
  lastMessageBody: string | null
  lastMessageAt: string | null
  sourceMatchId: string | null
}

export type ChatThreadPeer = {
  userId: string
  displayName: string
}
