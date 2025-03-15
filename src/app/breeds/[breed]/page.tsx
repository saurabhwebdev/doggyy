import type { Metadata } from 'next';
import BreedInfoGemini from '@/components/BreedInfoGemini';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DogBreedJsonLd } from '@/components/JsonLd';

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { breed: string };
}): Promise<Metadata> {
  const breedName = params.breed;
  
  // Format breed name for display
  const formatBreedName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const formattedBreedName = formatBreedName(breedName);
  
  return {
    title: `${formattedBreedName} - Dog Breed Information`,
    description: `Learn all about the ${formattedBreedName} dog breed. Discover characteristics, temperament, care requirements, and see beautiful photos of ${formattedBreedName} dogs.`,
    alternates: {
      canonical: `https://www.pawpedia.xyz/breeds/${breedName}`
    },
    openGraph: {
      title: `${formattedBreedName} - Dog Breed Information | PawPedia`,
      description: `Learn all about the ${formattedBreedName} dog breed. Discover characteristics, temperament, care requirements, and see beautiful photos.`,
      url: `https://www.pawpedia.xyz/breeds/${breedName}`,
      type: 'article',
    }
  };
}

// Validate the breed exists
async function validateBreed(breed: string) {
  try {
    // Handle breeds with hyphens for the API
    const parts = breed.split('-');
    const mainBreed = parts[0];
    const subBreed = parts.length > 1 ? parts.slice(1).join('-') : null;
    
    // First, check if the main breed exists
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    if (!response.ok) {
      throw new Error('Failed to fetch breeds');
    }
    
    const data = await response.json();
    const breeds = data.message;
    
    // Check if the main breed exists
    if (!breeds[mainBreed]) {
      return false;
    }
    
    // If there's a sub-breed, check if it exists
    if (subBreed) {
      const subBreeds = breeds[mainBreed];
      if (!Array.isArray(subBreeds) || !subBreeds.includes(subBreed)) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error validating breed:', error);
    return false;
  }
}

// Get breed images
async function getBreedImages(breed: string, count: number = 5) {
  try {
    // Handle special cases
    let apiBreed = breed;
    
    // Map of special cases where the API format is different from our display format
    const specialBreeds: Record<string, string> = {
      // For these breeds, we need to swap the order in the API call
      'sheepdog-shetland': 'shetland/sheepdog',
      'sheepdog-english': 'english/sheepdog',
      'wolfhound-irish': 'wolfhound/irish',
      'terrier-american': 'terrier/american',
      'spaniel-cocker': 'spaniel/cocker',
      'spaniel-blenheim': 'spaniel/blenheim',
      'mastiff-bull': 'mastiff/bull',
      'greyhound-italian': 'greyhound/italian',
      'bulldog-french': 'bulldog/french',
      'bulldog-english': 'bulldog/english'
    };
    
    // Check if this is a special case breed
    if (specialBreeds[breed]) {
      apiBreed = specialBreeds[breed];
    } else {
      // Standard handling for other breeds
      apiBreed = breed.replace(/-/g, '/');
    }
    
    // Try to fetch the images
    let response;
    try {
      response = await fetch(`https://dog.ceo/api/breed/${apiBreed}/images/random/${count}`);
      
      // If the first attempt fails for special breeds, try the reverse order
      if (!response.ok && specialBreeds[breed]) {
        const reversedFormat = apiBreed.split('/').reverse().join('/');
        console.log(`First attempt failed, trying reversed format: ${reversedFormat}`);
        
        response = await fetch(`https://dog.ceo/api/breed/${reversedFormat}/images/random/${count}`);
      }
    } catch (error) {
      console.error(`Error fetching images for ${breed}:`, error);
      return [];
    }
    
    if (!response.ok) {
      console.error(`Failed to fetch images for ${breed}: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error(`Error processing images for ${breed}:`, error);
    return [];
  }
}

export default async function BreedPage({
  params,
}: {
  params: { breed: string };
}) {
  const { breed } = params;
  
  // Validate the breed exists
  const isValidBreed = await validateBreed(breed);
  
  // If the breed doesn't exist, return 404
  if (!isValidBreed) {
    notFound();
  }
  
  // Get breed images
  const breedImages = await getBreedImages(breed);
  
  // Format breed name for display
  const formatBreedName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formattedBreedName = formatBreedName(breed);
  const breedDescription = `The ${formattedBreedName} is a wonderful companion dog known for its loyalty and friendly nature. These dogs are intelligent and trainable, making them excellent family pets.`;

  return (
    <div>
      {/* JSON-LD Structured Data */}
      <DogBreedJsonLd 
        name={formattedBreedName}
        description={breedDescription}
        imageUrl={breedImages[0] || ''}
        url={`https://www.pawpedia.xyz/breeds/${breed}`}
      />
      
      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/breeds" className="hover:text-blue-600 transition-colors">
              Dog Breeds
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">{formatBreedName(breed)}</span>
          </div>
        </div>
      </div>
      
      {/* Breed Information - Now using Gemini-powered component */}
      <BreedInfoGemini breed={breed} images={breedImages} />
      
      {/* Related Breeds Section - This would be enhanced with real related breeds in a production app */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            You Might Also Like
          </h2>
          
          <div className="text-center">
            <Link 
              href="/breeds" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Explore More Dog Breeds
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 