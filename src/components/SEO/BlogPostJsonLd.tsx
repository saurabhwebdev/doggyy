import Script from 'next/script';

interface BlogPostJsonLdProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  datePublished: string;
  authorName: string;
  dateModified?: string;
}

export default function BlogPostJsonLd({
  title,
  description,
  imageUrl,
  url,
  datePublished,
  authorName,
  dateModified,
}: BlogPostJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: imageUrl,
    url: url,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PawPedia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.pawpedia.xyz/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <Script
      id="blog-post-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 