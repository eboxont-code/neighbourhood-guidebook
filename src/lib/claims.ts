import { z } from 'zod';
export const claimRoles = ['owner', 'manager', 'staff', 'other'] as const;
export const claimWants = ['hours', 'photos', 'services', 'phone', 'address', 'other'] as const;
export const claimStatuses = ['new', 'verified', 'rejected'] as const;
export const claimSchema = z.object({
  listing_slug: z.string().trim().min(1, 'errListing').max(100, 'errTooLong'),
  listing_id: z.string().max(100).nullable(),
  name: z.string().trim().min(1, 'errName').max(100, 'errTooLong'),
  role: z.enum(claimRoles, { message: 'errChoice' }),
  contact: z.string().trim().max(150, 'errTooLong').refine((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) || (/^\+?[\d ()-]+$/.test(s) && s.replace(/\D/g, '').length >= 7 && s.replace(/\D/g, '').length <= 15), 'errReach'),
  proof_url: z.string().trim().max(500, 'errTooLong').url('erUrl').refine((s) => /^https?:\/\/[^\s]+$/i.test(s), 'erUrl'),
  wants: z.array(z.enum(claimWants)).max(6).transform((v) => [...new Set(v)]),
  note: z.string().trim().max(2000, 'errTooLong').transform((s) => s || null),
});