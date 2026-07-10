import Link from 'next/link'

import type { ChatInboxItem } from '@/lib/chat/types'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase()
  return `${parts[0]!.slice(0, 1)}${parts[1]!.slice(0, 1)}`.toUpperCase()
}

function formatInboxTime(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

type ChatInboxProps = {
  items: ChatInboxItem[]
}

export function ChatInbox({ items }: ChatInboxProps) {
  return (
    <div className="dd-chat">
      <header className="dd-chat__header">
        <div className="dd-chat__header-copy">
          <h1 className="seco-page__title dd-chat__title">
            <span className="seco-landing__hero-spectrum">Your messages</span>
          </h1>
        </div>
        <Link href="/connect" className="dd-chat__header-cta">
          Find matches
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="dd-chat__empty">
          <p className="dd-chat__empty-title">No chats yet</p>
          <p className="dd-chat__empty-body">
            When you match on chemistry, message them here — lean, private, no feed.
          </p>
          <Link href="/connect" className="dd-chat__empty-cta">
            Open Connect
          </Link>
        </div>
      ) : (
        <ul className="dd-chat__inbox">
          {items.map((item) => (
            <li key={item.conversationId}>
              <Link href={`/chat/${item.conversationId}`} className="dd-chat__row">
                <span className="dd-chat__avatar" aria-hidden>
                  {initials(item.peerDisplayName)}
                </span>
                <span className="dd-chat__row-main">
                  <p className="dd-chat__row-name">{item.peerDisplayName}</p>
                  <p className="dd-chat__row-preview">
                    {item.lastMessageBody ?? 'Say hello'}
                  </p>
                </span>
                <time
                  className="dd-chat__row-time"
                  dateTime={item.lastMessageAt ?? undefined}
                >
                  {formatInboxTime(item.lastMessageAt)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
