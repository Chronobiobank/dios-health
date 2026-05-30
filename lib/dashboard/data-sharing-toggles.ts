export type DataSharingKey = 'gp' | 'research' | 'policy'

export type DataSharingColumn =
  | 'data_share_gp'
  | 'data_share_research'
  | 'data_share_policy'

export const DATA_SHARING_TOGGLES: {
  key: DataSharingKey
  column: DataSharingColumn
  label: string
  description: string
}[] = [
  {
    key: 'gp',
    column: 'data_share_gp',
    label: 'Share with my GP',
    description: 'Your doctor sees your body clock data to inform your prescriptions.',
  },
  {
    key: 'research',
    column: 'data_share_research',
    label: 'Contribute to research',
    description: 'Anonymised data shared with researchers. You are never identifiable.',
  },
  {
    key: 'policy',
    column: 'data_share_policy',
    label: 'Contribute to health policy',
    description:
      'Anonymised population data shared with policy organisations developing timing-based health models. You are never identifiable.',
  },
]

export function dataSharingValuesFromPatient(patient: {
  data_share_gp: boolean
  data_share_research: boolean
  data_share_policy: boolean
}): Record<DataSharingKey, boolean> {
  return {
    gp: patient.data_share_gp,
    research: patient.data_share_research,
    policy: patient.data_share_policy,
  }
}
