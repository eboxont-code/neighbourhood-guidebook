import type { Key } from '@/lib/i18n';
export const contactTopics = ['claim', 'fix', 'website', 'add', 'other'] as const;
export type ContactTopic = typeof contactTopics[number];
export const correctionTypes = ['closed', 'phone', 'hours', 'location', 'category', 'duplicate', 'other'] as const;
export const submissionStatuses = ['new', 'approved', 'rejected', 'duplicate'] as const;
export function topicFromSource(from?: string): ContactTopic | '' {
  return from === 'claim' ? 'claim' : from === 'preview' ? 'website' : '';
}
export function optionLabel(prefix: 'topic' | 'correction' | 'subStatus', value: string): Key | null {
  const options = prefix === 'topic' ? contactTopics : prefix === 'correction' ? correctionTypes : submissionStatuses;
  return (options as readonly string[]).includes(value) ? `${prefix}_${value}` as Key : null;
}
