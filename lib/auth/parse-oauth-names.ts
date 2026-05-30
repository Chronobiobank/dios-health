export type OAuthNameMetadata = {
  full_name?: string
  name?: string
  given_name?: string
  family_name?: string
}

export function parseOAuthNames(metadata: OAuthNameMetadata) {
  const given = metadata.given_name?.trim() ?? ''
  const family = metadata.family_name?.trim() ?? ''

  if (given || family) {
    return { firstName: given, familyName: family }
  }

  const combined = metadata.full_name?.trim() || metadata.name?.trim() || ''
  if (!combined) {
    return { firstName: '', familyName: '' }
  }

  const parts = combined.split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] ?? '',
    familyName: parts.slice(1).join(' '),
  }
}

export function buildFullName(firstName: string, familyName: string): string {
  return [firstName.trim(), familyName.trim()].filter(Boolean).join(' ')
}
