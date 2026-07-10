'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useTransition } from 'react'

import { CHAT_MESSAGE_MAX_LENGTH } from '@/lib/chat/constants'
import type { ChatMessage, ChatThreadPeer } from '@/lib/chat/types'
import { createClient } from '@/lib/supabase/client'

type ChatThreadProps = {
  conversationId: string
  currentUserId: string
  peer: ChatThreadPeer
  initialMessages: ChatMessage[]
}

export function ChatThread({
  conversationId,
  currentUserId,
  peer,
  initialMessages,
}: ChatThreadProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const bottomRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string
            conversation_id: string
            sender_id: string
            body: string
            created_at: string
          }
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev
            return [
              ...prev,
              {
                id: row.id,
                conversationId: row.conversation_id,
                senderId: row.sender_id,
                body: row.body,
                createdAt: row.created_at,
              },
            ]
          })
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [conversationId])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = draft.trim()
    if (!body || pending) return

    setError(null)
    const optimisticId = `optimistic-${Date.now()}`
    const optimistic: ChatMessage = {
      id: optimisticId,
      conversationId,
      senderId: currentUserId,
      body,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])
    setDraft('')

    startTransition(async () => {
      try {
        const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body }),
        })
        const data = (await res.json()) as { message?: ChatMessage; error?: string }
        if (!res.ok || !data.message) {
          setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
          setDraft(body)
          setError(data.error ?? 'Could not send')
          return
        }
        setMessages((prev) => {
          const withoutOptimistic = prev.filter((m) => m.id !== optimisticId)
          if (withoutOptimistic.some((m) => m.id === data.message!.id)) return withoutOptimistic
          return [...withoutOptimistic, data.message!]
        })
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
        setDraft(body)
        setError('Could not send')
      }
    })
  }

  return (
    <div className="dd-chat dd-chat__thread">
      <header className="dd-chat__header">
        <Link href="/chat" className="dd-chat__back" aria-label="Back to inbox">
          ←
        </Link>
        <div>
          <h1 className="dd-chat__title">{peer.displayName}</h1>
        </div>
      </header>

      <div className="dd-chat__messages" ref={listRef} role="log" aria-live="polite">
        {messages.map((m) => {
          const mine = m.senderId === currentUserId
          return (
            <div
              key={m.id}
              className={mine ? 'dd-chat__bubble dd-chat__bubble--mine' : 'dd-chat__bubble dd-chat__bubble--theirs'}
            >
              {m.body}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form className="dd-chat__composer" onSubmit={onSubmit}>
        <textarea
          className="dd-chat__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, CHAT_MESSAGE_MAX_LENGTH))}
          placeholder="Message…"
          rows={1}
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
          aria-label="Message"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              e.currentTarget.form?.requestSubmit()
            }
          }}
        />
        <button
          type="submit"
          className="dd-chat__send"
          disabled={pending || !draft.trim()}
          aria-label="Send"
        >
          ↑
        </button>
      </form>
      {error ? <p className="dd-chat__error">{error}</p> : null}
    </div>
  )
}
