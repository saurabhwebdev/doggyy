import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About PawPedia | Your Ultimate Dog Breed Resource',
  description: 'Learn about PawPedia, the ultimate dog breed directory powered by AI. Our mission is to help dog lovers find their perfect canine companion with comprehensive breed information.',
  alternates: {
    canonical: 'https://www.pawpedia.xyz/about'
  }
};

// Using Dog CEO API for images
const dogImages = {
  golden: 'https://dog.ceo/api/breed/retriever/golden/images/random',
  husky: 'https://dog.ceo/api/breed/husky/images/random',
  corgi: 'https://dog.ceo/api/breed/corgi/images/random'
};

async function getRandomDogImages() {
  try {
    const [goldenRes, huskyRes, corgiRes] = await Promise.all([
      fetch(dogImages.golden, { next: { revalidate: 3600 } }),
      fetch(dogImages.husky, { next: { revalidate: 3600 } }),
      fetch(dogImages.corgi, { next: { revalidate: 3600 } })
    ]);
    
    const goldenData = await goldenRes.json();
    const huskyData = await huskyRes.json();
    const corgiData = await corgiRes.json();
    
    return {
      golden: goldenData.message,
      husky: huskyData.message,
      corgi: corgiData.message
    };
  } catch (error) {
    console.error('Error fetching dog images:', error);
    // Fallback images in case the API fails
    return {
      golden: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg',
      husky: 'https://images.dog.ceo/breeds/husky/n02110185_10047.jpg',
      corgi: 'https://images.dog.ceo/breeds/corgi-cardigan/n02113186_10752.jpg'
    };
  }
}

export default async function AboutPage() {
  const dogImageUrls = await getRandomDogImages();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 relative inline-block">
            About PawPedia
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500 rounded-full"></span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to PawPedia, the ultimate AI-powered resource for dog lovers. Our mission is to help people find their perfect canine companion by providing comprehensive information about dog breeds from around the world.
          </p>
        </div>
        
        {/* Image Gallery - Now using Dog CEO API */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <div className="relative h-64 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
            <Image 
              src={dogImageUrls.golden} 
              alt="Happy golden retriever dog"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
            <Image 
              src={dogImageUrls.husky} 
              alt="Beautiful husky dog"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
            <Image 
              src={dogImageUrls.corgi} 
              alt="Adorable corgi dog"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          {/* Our Story Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="text-blue-500 mr-2">🐾</span> Our Story
            </h2>
            <p className="mb-4">
              PawPedia was born from a simple idea: to create the most comprehensive and accessible resource for dog lovers everywhere. Founded by a team of passionate dog enthusiasts, veterinarians, and tech experts, we set out to build a platform that combines accurate breed information with cutting-edge AI technology.
            </p>
            <p>
              Today, PawPedia has grown into a trusted resource for dog owners, prospective pet parents, and canine professionals around the world. Our commitment to accuracy, usability, and the welfare of dogs remains at the heart of everything we do.
            </p>
          </div>
          
          {/* Our Mission Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="text-blue-500 mr-2">🎯</span> Our Mission
            </h2>
            <p className="mb-4">
              At PawPedia, we believe that finding the right dog breed is essential for a happy and fulfilling relationship between humans and their canine companions. Our comprehensive dog breed directory is designed to help you make an informed decision when choosing a dog that matches your lifestyle, preferences, and needs.
            </p>
            <p>
              We're committed to promoting responsible dog ownership, supporting animal welfare, and helping create lasting bonds between dogs and their human families.
            </p>
          </div>
          
          {/* What We Offer Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="text-blue-500 mr-2">🏆</span> What We Offer
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">AI-Powered Breed Information</h3>
                <p>Detailed profiles of hundreds of dog breeds, enhanced with AI-generated insights about characteristics, temperament, care requirements, and more.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Beautiful Photo Galleries</h3>
                <p>High-quality images of each breed to help you visualize your potential furry friend and appreciate the unique beauty of every dog type.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Expert Advice & Resources</h3>
                <p>Tips and guidance on dog care, training, nutrition, and health from experienced dog professionals and veterinarians.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">User-Friendly Experience</h3>
                <p>An intuitive and easy-to-navigate website with powerful search tools that make finding the perfect dog breed a breeze.</p>
              </div>
            </div>
          </div>
          
          {/* Our Team Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="text-blue-500 mr-2">👥</span> Our Team
            </h2>
            <p>
              PawPedia is created and maintained by a team of passionate dog lovers, veterinarians, animal behavior experts, and technology specialists. We are dedicated to providing accurate, up-to-date, and helpful information to dog enthusiasts around the world.
            </p>
            <p className="mt-4">
              Our content is regularly reviewed and updated to ensure it reflects the latest understanding of canine health, behavior, and care practices.
            </p>
          </div>
          
          {/* Contact Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="text-blue-500 mr-2">📞</span> Get In Touch
            </h2>
            <p className="mb-6">
              Have questions, suggestions, or feedback? We'd love to hear from you! Visit our <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">Contact page</Link> to get in touch with our team.
            </p>
            
            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Join Our Community</h3>
              <p className="mb-6">
                Connect with fellow dog lovers and stay updated on the latest dog-related news, tips, and stories by following us on social media.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow text-blue-600 hover:text-blue-800">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  Facebook
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow text-blue-600 hover:text-blue-800">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  Twitter
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow text-blue-600 hover:text-blue-800">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 