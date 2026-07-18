import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters
    const title = searchParams.get('title') || 'ICSE Board Exam Practice';
    const subject = searchParams.get('subject') || 'General Practice';
    const difficulty = searchParams.get('difficulty') || 'balanced';

    // Difficulty accent colors
    const difficultyColor = 
      difficulty.toLowerCase() === 'easy' ? '#10B981' : 
      difficulty.toLowerCase() === 'hard' ? '#EF4444' : '#F59E0B';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0A0F1E',
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 45%)',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top Row: App branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#6366F1',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              Prep<span style={{ color: '#FFFFFF' }}>Arena</span>
            </span>
            <span
              style={{
                height: '6px',
                width: '6px',
                borderRadius: '50%',
                backgroundColor: '#475569',
              }}
            />
            <span
              style={{
                fontSize: '18px',
                fontWeight: 'semibold',
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              Class 10 ICSE
            </span>
          </div>

          {/* Middle Row: Question Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              width: '100%',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#6366F1',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              Board Problem Sheet
            </span>
            <span
              style={{
                fontSize: '44px',
                fontWeight: '900',
                color: '#FFFFFF',
                lineHeight: '1.25',
                letterSpacing: '-1px',
                maxHeight: '180px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </span>
          </div>

          {/* Bottom Row: Metadata Badges */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* Subject Badge */}
            <div
              style={{
                display: 'flex',
                padding: '10px 20px',
                borderRadius: '12px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#818CF8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {subject}
              </span>
            </div>

            {/* Difficulty Badge */}
            <div
              style={{
                display: 'flex',
                padding: '10px 20px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${difficultyColor}60`,
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: difficultyColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {difficulty}
              </span>
            </div>

            {/* Platform Accent */}
            <div style={{ display: 'flex', marginLeft: 'auto' }}>
              <span
                style={{
                  fontSize: '14px',
                  color: '#475569',
                  fontWeight: 'medium',
                }}
              >
                preparena.org/problems
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate the OG image: ${e.message}`, {
      status: 500,
    });
  }
}
