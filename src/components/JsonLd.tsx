import Script from 'next/script';

interface WebsiteJsonLdProps {
  url: string;
  name: string;
  description: string;
  logoUrl: string;
}

export function WebsiteJsonLd({ url, name, description, logoUrl }: WebsiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    name,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${url}/breeds?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl
      }
    }
  };

  return (
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface DogBreedJsonLdProps {
  name: string;
  description: string;
  imageUrl: string;
  url: string;
}

export function DogBreedJsonLd({ name, description, imageUrl, url }: DogBreedJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${name} - Dog Breed Information`,
    description,
    image: imageUrl,
    url,
    author: {
      '@type': 'Organization',
      name: 'PawPedia'
    },
    publisher: {
      '@type': 'Organization',
      name: 'PawPedia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.pawpedia.xyz/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };

  return (
    <Script
      id="dog-breed-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BlogPostJsonLdProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  datePublished: string;
  authorName: string;
}

export function BlogPostJsonLd({ 
  title, 
  description, 
  imageUrl, 
  url, 
  datePublished, 
  authorName 
}: BlogPostJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: imageUrl,
    url,
    datePublished,
    author: {
      '@type': 'Person',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: 'PawPedia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.pawpedia.xyz/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };

  return (
    <Script
      id="blog-post-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FAQJsonLdProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQJsonLd({ questions }: FAQJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  };

  return (
    <Script
      id="faq-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 