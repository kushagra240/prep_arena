import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SYLLABUS_MAP: Record<string, string> = {
  'mathematics': 'mathematics.json',
  'physics': 'physics.json',
  'chemistry': 'chemistry.json',
  'biology': 'biology.json',
  'computer-applications': 'computer.json',
  'english-literature': 'english-literature.json',
  'english-language': 'english-grammar.json',
  'hindi': 'hindi.json',
  'history-civics': 'history-civics.json',
  'geography': 'geography.json'
};

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const filename = SYLLABUS_MAP[slug];

  if (!filename) {
    return NextResponse.json({ error: 'Syllabus not found' }, { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), 'content', 'syllabus', filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading syllabus:', error);
    return NextResponse.json({ error: 'Failed to load syllabus' }, { status: 500 });
  }
}
