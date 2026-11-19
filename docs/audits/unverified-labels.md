# Sewa undated verification review

Read-only published-listing query, 19 November 2026. These 20 records store `source_checked` without `lastChecked`. Eight, not nine, also store `hoursVerified: true`. No stored business data was changed.

Public trust logic returns `needed` without a valid calendar check date. Hours confirmation additionally requires a recorded hours source. The EN/NE `notYetVerified` label is used for undated sources.

| ID | Recorded business name | Hours flag also needs review |
|---|---|---|
| b10 | Club Oasis, Hyatt Regency Kathmandu | No |
| b11 | Lavish Salon & Academy | No |
| b12 | Nuad Thai Spa, Panipokhari | No |
| b13 | Kathmandu Spa | No |
| b14 | Kaya Healing Spa | No |
| b15 | Crest Club and Spa | No |
| b16 | The New Barber, Thamel branch | Yes |
| b17 | The New Barber, Boudha branch | Yes |
| b18 | Bliss by Sakil Kunwar | Yes |
| b19 | Annapurna Salon & Spa | Yes |
| b20 | Hair n Shanti, Kamaladi | No |
| b3 | Femina Flaunt Studio Salon | Yes |
| b31 | Fitness Studio Nepal | No |
| b32 | Thamel Physical Fitness | No |
| b36 | Radisson Hotel Kathmandu | No |
| b4 | TONI&GUY Nepal | No |
| b5 | Munney Salon, Durbar Marg | Yes |
| b7 | Plush Unisex Salon | Yes |
| b8 | Deezy Cuts | Yes |
| b9 | Serene Salon & Spa | No |

Administrator follow-up: check the recorded source, then record the actual review date and field-specific evidence. Never backfill a date by inference. Regression: `src/test/trust-date.test.ts`.