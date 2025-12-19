import { fetchSolarParks, fetchSheepFarms } from './data-service';

// Base URL for the site
const BASE_URL = 'https://ombaa.com';

// Static pages that should be included in sitemaps
const STATIC_PAGES = [
  '',
  '/directory',
  '/about',
  '/contact',
];

// Country-specific landing pages
const COUNTRY_PAGES = [
  '/netherlands',
  '/belgium',
  '/france',
  '/germany',
];

// Function to format date for sitemap (last modified)
function formatDateForSitemap(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Function to generate XML sitemap from URLs
function generateSitemapXML(urls: Array<{
  url: string;
  lastModified?: string;
  changeFrequency?: string;
  priority?: string;
}>): string {
  const urlElements = urls.map(({ url, lastModified, changeFrequency, priority }) => {
    const loc = `<loc>${BASE_URL}${url}</loc>`;
    const lastmod = lastModified ? `<lastmod>${lastModified}</lastmod>` : '';
    const changefreq = changeFrequency ? `<changefreq>${changeFrequency}</changefreq>` : '';
    const prio = priority ? `<priority>${priority}</priority>` : '';
    
    return `<url>${loc}${lastmod}${changefreq}${prio}</url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

// Function to generate sitemap index
export async function generateSitemapIndex(): Promise<string> {
  const now = formatDateForSitemap(new Date());
  
  const sitemapEntries = [
    { loc: `${BASE_URL}/sitemap-static.xml`, lastmod: now },
    { loc: `${BASE_URL}/sitemap-countries.xml`, lastmod: now },
    { loc: `${BASE_URL}/sitemap-solar-parks.xml`, lastmod: now },
    { loc: `${BASE_URL}/sitemap-sheep-farms.xml`, lastmod: now },
  ];

  const sitemapElements = sitemapEntries.map(({ loc, lastmod }) => {
    return `<sitemap>
  <loc>${loc}</loc>
  <lastmod>${lastmod}</lastmod>
</sitemap>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
}

// Function to generate static pages sitemap
export async function generateStaticPagesSitemap(): Promise<string> {
  const urls = STATIC_PAGES.map(page => ({
    url: page,
    lastModified: formatDateForSitemap(new Date()),
    changeFrequency: 'monthly',
    priority: '0.8',
  }));

  return generateSitemapXML(urls);
}

// Function to generate country pages sitemap
export async function generateCountryPagesSitemap(): Promise<string> {
  const urls = COUNTRY_PAGES.map(country => ({
    url: country,
    lastModified: formatDateForSitemap(new Date()),
    changeFrequency: 'weekly',
    priority: '0.9',
  }));

  return generateSitemapXML(urls);
}

// Function to generate solar parks sitemap
export async function generateSolarParksSitemap(): Promise<string> {
  try {
    // Fetch all solar parks (no filtering for complete sitemap)
    const response = await fetchSolarParks({ limit: 1000 }); // High limit for sitemap
    const solarParks = response.data;

    const urls = solarParks.map(park => ({
      url: `/solarparks/${park.country.toLowerCase()}/${encodeURIComponent(park.name)}`,
      lastModified: formatDateForSitemap(new Date()),
      changeFrequency: 'monthly',
      priority: '0.7',
    }));

    return generateSitemapXML(urls);
  } catch (error) {
    console.error('Error generating solar parks sitemap:', error);
    return generateSitemapXML([]);
  }
}

// Function to generate sheep farms sitemap
export async function generateSheepFarmsSitemap(): Promise<string> {
  try {
    // Fetch all sheep farms (no filtering for complete sitemap)
    const response = await fetchSheepFarms({ limit: 1000 }); // High limit for sitemap
    const sheepFarms = response.data;

    const urls = sheepFarms.map(farm => ({
      url: `/sheepfarms/${farm.country.toLowerCase()}/${encodeURIComponent(farm.name)}`,
      lastModified: formatDateForSitemap(new Date()),
      changeFrequency: 'monthly',
      priority: '0.7',
    }));

    return generateSitemapXML(urls);
  } catch (error) {
    console.error('Error generating sheep farms sitemap:', error);
    return generateSitemapXML([]);
  }
}