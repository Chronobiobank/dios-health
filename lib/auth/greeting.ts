export function getTimeGreeting(date = new Date()): 'morning' | 'afternoon' | 'evening' {
  const hour = date.getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || 'there'
}
