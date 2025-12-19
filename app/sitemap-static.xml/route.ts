import { NextResponse } from 'next/server';
import { generateStaticPagesSitemap } from '@/lib/sitemap-generator';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const sitemap = await generateStaticPagesSitemap();
    
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating static pages sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}