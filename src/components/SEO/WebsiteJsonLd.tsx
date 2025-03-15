import Script from 'next/script';

interface WebsiteJsonLdProps {
  url: string;
  name: string;
  description: string;
  logoUrl: string;
}

export default function WebsiteJsonLd({
  url,
  name,
  description,
  logoUrl,
}: WebsiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: url,
    name: name,
    description: description,
    publisher: {
      '@type': 'Organization',
      name: 'PawPedia',
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 