import Script from 'next/script';

interface OrganizationJsonLdProps {
  name: string;
  url: string;
  logoUrl: string;
  sameAs?: string[];
}

export default function OrganizationJsonLd({
  name,
  url,
  logoUrl,
  sameAs = [],
}: OrganizationJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name,
    url: url,
    logo: logoUrl,
    sameAs: sameAs,
  };

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 