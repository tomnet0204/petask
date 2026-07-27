import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { SymptomData, AnimalType } from './types';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export function getSymptomData(animal: AnimalType, symptomSlug: string): SymptomData | null {
  const filePath = path.join(CONTENT_ROOT, 'pets', `${animal}s`, `${symptomSlug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  // ai_generated はページとして公開しない
  if (data.reviewStatus === 'ai_generated') return null;

  return {
    frontmatter: data as SymptomData['frontmatter'],
    content,
    slug: symptomSlug,
  };
}

export function getAllSymptomSlugs(animal: AnimalType): string[] {
  const dir = path.join(CONTENT_ROOT, 'pets', `${animal}s`);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''));
}
