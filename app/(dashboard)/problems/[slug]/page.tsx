import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_PROBLEMS, MOCK_SUBJECTS } from '@/lib/supabase/client';
import { ProblemSolvingClient } from '@/components/problems/ProblemSolvingClient';

interface Props {
  params: { slug: string };
}

// Generate dynamic metadata for dynamic problem solving pages
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const problem = MOCK_PROBLEMS.find(p => p.slug === params.slug);
  if (!problem) {
    return {
      title: 'Problem Not Found — PrepArena'
    };
  }

  const subject = MOCK_SUBJECTS.find(s => s.id === problem.subject_id)?.name || 'ICSE Board Practice';
  
  // Build the dynamic OG URL calling app edge route api/og/route.tsx
  const ogUrl = new URL('https://preparena.org/api/og');
  ogUrl.searchParams.set('title', problem.title);
  ogUrl.searchParams.set('subject', subject);
  ogUrl.searchParams.set('difficulty', problem.difficulty);

  const cleanDescription = problem.question_text.length > 155 
    ? `${problem.question_text.slice(0, 152)}...` 
    : problem.question_text;

  return {
    title: `${problem.title} | PrepArena Board Solver`,
    description: cleanDescription,
    openGraph: {
      title: `${problem.title} | PrepArena Board Solver`,
      description: cleanDescription,
      type: 'article',
      url: `https://preparena.org/problems/${problem.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: problem.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${problem.title} | PrepArena Board Solver`,
      description: cleanDescription,
      images: [ogUrl.toString()]
    }
  };
}

export default function ProblemSolvingPage({ params }: Props) {
  const problemExists = MOCK_PROBLEMS.some(p => p.slug === params.slug);
  if (!problemExists) {
    notFound();
  }

  return <ProblemSolvingClient slug={params.slug} />;
}
