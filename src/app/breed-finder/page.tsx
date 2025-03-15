import type { Metadata } from 'next';
import BreedRecommender from '@/components/BreedRecommender';

export const metadata: Metadata = {
  title: 'Find Your Perfect Dog Breed Match | PawPedia',
  description: 'Answer a few questions about your lifestyle and preferences, and our AI-powered tool will recommend the best dog breeds for you.',
  openGraph: {
    title: 'Find Your Perfect Dog Breed Match | PawPedia',
    description: 'Answer a few questions about your lifestyle and preferences, and our AI-powered tool will recommend the best dog breeds for you.',
    images: [
      {
        url: 'https://www.pawpedia.xyz/breed-finder-og.jpg',
        width: 1200,
        height: 630,
        alt: 'PawPedia Breed Finder'
      }
    ]
  }
};

export default function BreedFinderPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
          Find Your Perfect Dog Breed Match
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our AI-powered breed finder will help you discover the ideal dog breed based on your lifestyle, living situation, and preferences.
        </p>
      </div>
      
      <BreedRecommender />
      
      <div className="mt-16 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-700">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Answer Questions</h3>
            <p className="text-gray-600">Tell us about your lifestyle, living situation, and preferences.</p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-700">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600">Our AI analyzes your answers to find the best breed matches for you.</p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-700">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Get Recommendations</h3>
            <p className="text-gray-600">Receive personalized breed recommendations with detailed explanations.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 