import { categories, type Business } from '@/data/directory';

export function savedCategorySuggestions(all: Business[]) {
  return categories.map((category) => ({ category, count: all.filter((b) => b.category === category.slug).length }))
    .filter((entry) => entry.count > 0).sort((a, b) => b.count - a.count || a.category.slug.localeCompare(b.category.slug)).slice(0, 3);
}