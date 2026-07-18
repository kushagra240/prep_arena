import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/problems(.*)',
  '/leaderboard(.*)',
  '/subjects(.*)',
  '/profile(.*)',
  '/onboarding(.*)',
  '/settings(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const authObj = (await auth()) as any;
    // Protect the route
    authObj.protect();

    // Check if onboarded
    const sessionClaims = authObj.sessionClaims;
    // Clerk session claims metadata is typed as CustomFlowMetadata in some contexts, but can be retrieved via metadata or publicMetadata
    const metadata = (sessionClaims?.metadata || {}) as Record<string, any>;
    const onboarded = metadata.onboarded === true;
    const isOnboardingRoute = req.nextUrl.pathname.startsWith('/onboarding');

    if (!onboarded && !isOnboardingRoute) {
      const onboardingUrl = new URL('/onboarding', req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
