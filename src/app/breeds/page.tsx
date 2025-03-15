import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ChatbotButton from '@/components/ChatbotButton';
import BreedsClientWrapper from '@/components/BreedsClientWrapper';

export const metadata: Metadata = {
  title: 'Dog Breeds Directory | PawPedia',
  description: 'Browse our comprehensive collection of dog breeds. Find detailed information about each breed including characteristics, temperament, and care requirements.',
  alternates: {
    canonical: 'https://www.pawpedia.xyz/breeds'
  }
};

// This is a server component, so we need to fetch data on the server
async function getAllBreeds() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    if (!response.ok) {
      throw new Error('Failed to fetch breeds');
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error fetching breeds:', error);
    return {};
  }
}

async function getBreedImage(breed: string) {
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
    
    // Add console log for debugging
    console.log(`Fetching image for breed: ${breed}, API format: ${apiBreed}`);
    
    // Try to fetch the image with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    // For special cases, try both formats if needed
    let response;
    try {
      response = await fetch(`https://dog.ceo/api/breed/${apiBreed}/images/random`, {
        signal: controller.signal
      });
      
      // If the first attempt fails for special breeds, try the reverse order
      if (!response.ok && specialBreeds[breed]) {
        const reversedFormat = apiBreed.split('/').reverse().join('/');
        console.log(`First attempt failed, trying reversed format: ${reversedFormat}`);
        
        response = await fetch(`https://dog.ceo/api/breed/${reversedFormat}/images/random`, {
          signal: controller.signal
        });
      }
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image for ${breed} (${apiBreed}): ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error(`Error fetching image for ${breed}:`, error);
    // Return a working fallback image URL
    return 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg';
  }
}

// Format breed name for display
const formatBreedName = (name: string) => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default async function BreedsPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  // Get all breeds
  const breedsObj = await getAllBreeds();
  
  // Convert the breeds object to a flat array of breed names
  // The API returns an object with breed names as keys and sub-breeds as values
  let allBreeds: string[] = [];
  
  for (const [breed, subBreeds] of Object.entries(breedsObj)) {
    // Add the main breed
    allBreeds.push(breed);
    
    // Add sub-breeds if they exist
    if (Array.isArray(subBreeds) && subBreeds.length > 0) {
      subBreeds.forEach((subBreed: string) => {
        allBreeds.push(`${breed}-${subBreed}`);
      });
    }
  }
  
  // Sort breeds alphabetically
  allBreeds.sort();
  
  // Filter breeds based on search query
  const searchQuery = typeof searchParams?.search === 'string' ? searchParams.search.toLowerCase() : '';
  const filteredBreeds = searchQuery
    ? allBreeds.filter(breed => 
        breed.toLowerCase().includes(searchQuery) ||
        breed.replace(/-/g, ' ').toLowerCase().includes(searchQuery)
      )
    : allBreeds;
  
  // Pagination settings
  const itemsPerPage = 20;
  const currentPage = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) || 1 : 1;
  const totalPages = Math.ceil(filteredBreeds.length / itemsPerPage);
  
  // Get breeds for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageBreeds = filteredBreeds.slice(startIndex, endIndex);
  
  // Fetch images for current page breeds only
  const breedsWithImages = await Promise.all(
    currentPageBreeds.map(async (breed) => {
      try {
        const imageUrl = await getBreedImage(breed);
        return {
          name: breed,
          imageUrl: imageUrl || 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg'
        };
      } catch (error) {
        console.error(`Error processing breed ${breed}:`, error);
        return {
          name: breed,
          imageUrl: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg'
        };
      }
    })
  );

  // Get popular breeds for featured section
  const popularBreeds = ['labrador', 'poodle', 'german-shepherd', 'bulldog', 'golden-retriever', 'beagle'];
  const featuredBreeds = breedsWithImages.filter(breed => 
    popularBreeds.some(popular => breed.name.includes(popular))
  ).slice(0, 6);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 to-blue-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-10"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Your Perfect <span className="text-yellow-300">Canine Companion</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-10 leading-relaxed">
              Explore our comprehensive collection of dog breeds and find the perfect match for your lifestyle.
            </p>
            
            {/* Search Form */}
            <form className="max-w-xl mx-auto mb-8 relative" action="/breeds" method="get">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                name="search"
                placeholder="Search for a dog breed..."
                defaultValue={searchQuery}
                className="w-full pl-12 pr-24 py-4 rounded-full text-gray-800 bg-white border border-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
              >
                Search
              </button>
            </form>
            
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-indigo-200">Popular searches:</span>
              {popularBreeds.slice(0, 5).map((breed) => (
                <Link 
                  key={breed}
                  href={`/breeds?search=${breed}`}
                  className="text-yellow-300 hover:text-yellow-100 transition-colors"
                >
                  {formatBreedName(breed)}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12 md:h-16" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
      </section>
      
      {/* Results Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {filteredBreeds.length === 0
                ? 'No Breeds Found'
                : searchQuery
                  ? `Results for "${searchQuery}"`
                  : 'All Dog Breeds'
              }
            </h2>
            <p className="text-xl text-gray-600">
              {filteredBreeds.length === 0
                ? 'Try a different search term or browse our featured breeds below.'
                : searchQuery
                  ? `Found ${filteredBreeds.length} breed${filteredBreeds.length === 1 ? '' : 's'} matching your search.`
                  : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredBreeds.length)} of ${filteredBreeds.length} dog breeds in our directory.`
              }
            </p>
          </div>
          
          {/* Wrap the content that changes during pagination with the client wrapper */}
          <BreedsClientWrapper>
            {/* Featured Breeds (only show if no search or no results or on first page) */}
            {(!searchQuery || filteredBreeds.length === 0 || currentPage === 1) && featuredBreeds.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Breeds</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredBreeds.map((breed) => (
                    <div key={breed.name} className="group">
                      <Link href={`/breeds/${breed.name}`} className="block">
                        <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all">
                          <Image
                            src={breed.imageUrl}
                            alt={formatBreedName(breed.name)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h4 className="text-2xl font-bold text-white mb-2">{formatBreedName(breed.name)}</h4>
                            <div className="flex items-center text-white/80">
                              <span className="text-sm">Learn more</span>
                              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* All Breeds Grid */}
            {filteredBreeds.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {breedsWithImages.map((breed, index) => (
                    <Link 
                      key={breed.name} 
                      href={`/breeds/${breed.name}`}
                      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={breed.imageUrl}
                          alt={formatBreedName(breed.name)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          priority={index < 8}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          loading={index < 8 ? "eager" : "lazy"}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {formatBreedName(breed.name)}
                        </h3>
                        <div className="mt-2 flex items-center text-blue-600 text-sm font-medium">
                          <span>View details</span>
                          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center space-x-2">
                      {/* Previous page button */}
                      {currentPage > 1 && (
                        <Link
                          href={`/breeds?${searchQuery ? `search=${searchQuery}&` : ''}page=${currentPage - 1}`}
                          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                          </svg>
                        </Link>
                      )}
                      
                      {/* Page numbers */}
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          // Show pages around current page
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Link
                              key={pageNum}
                              href={`/breeds?${searchQuery ? `search=${searchQuery}&` : ''}page=${pageNum}`}
                              className={`px-4 py-2 rounded-md ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              } transition-colors`}
                            >
                              {pageNum}
                            </Link>
                          );
                        })}
                        
                        {/* Show ellipsis if there are more pages */}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <span className="px-4 py-2">...</span>
                        )}
                        
                        {/* Show last page if not visible in the range */}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <Link
                            href={`/breeds?${searchQuery ? `search=${searchQuery}&` : ''}page=${totalPages}`}
                            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            {totalPages}
                          </Link>
                        )}
                      </div>
                      
                      {/* Next page button */}
                      {currentPage < totalPages && (
                        <Link
                          href={`/breeds?${searchQuery ? `search=${searchQuery}&` : ''}page=${currentPage + 1}`}
                          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </BreedsClientWrapper>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full opacity-30 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Need Help Finding Your Perfect Match?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our AI assistant can help you find the perfect dog breed based on your lifestyle, living situation, and preferences.
          </p>
          <ChatbotButton />
        </div>
      </section>
    </div>
  );
} 