import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import FeaturedBreeds from '@/components/FeaturedBreeds';
import Link from 'next/link';
import Image from 'next/image';
import { WebsiteJsonLd, FAQJsonLd } from '@/components/JsonLd';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata: Metadata = {
  title: 'PawPedia - The Ultimate Dog Breed Directory',
  description: 'Discover the perfect dog breed for you. Explore our comprehensive dog breed directory with detailed information, characteristics, and beautiful photos.',
  alternates: {
    canonical: 'https://www.pawpedia.xyz'
  }
};

export default function Home() {
  // FAQ data for structured data
  const faqQuestions = [
    {
      question: 'How do I choose the right dog breed for my lifestyle?',
      answer: 'Consider factors like your living space, activity level, time commitment, and whether you have children or other pets. Research breeds that match your lifestyle and preferences. Some breeds require more exercise, grooming, or training than others. Take into account your daily routine and how a dog would fit into it. Many breed-specific rescue organizations can help match you with the right dog for your situation.'
    },
    {
      question: 'What are the most family-friendly dog breeds?',
      answer: 'Some of the most family-friendly dog breeds include Labrador Retrievers, Golden Retrievers, Beagles, Bulldogs, and Collies. These breeds are known for their gentle temperament and patience with children. They tend to be adaptable, trainable, and have the right energy level to play with kids while also being calm enough for family life. Always supervise interactions between dogs and young children regardless of breed.'
    },
    {
      question: 'How much exercise do dogs need?',
      answer: 'Exercise needs vary by breed, age, and individual dog. Working and sporting breeds typically need 1-2 hours of exercise daily, while smaller or less active breeds may need 30-60 minutes. Consult breed-specific information for guidance. Puppies and young dogs generally need more play and shorter exercise sessions, while older dogs may prefer gentle walks. Mental stimulation through training and puzzle toys is also important for a dog\'s wellbeing.'
    },
    {
      question: 'What should I feed my dog?',
      answer: 'Dogs need a balanced diet with protein, carbohydrates, fats, vitamins, and minerals. Choose high-quality commercial dog food appropriate for your dog\'s age, size, and activity level, or consult with a veterinarian about a homemade diet. Puppies, adult dogs, and seniors have different nutritional needs. Some dogs may have specific dietary requirements due to allergies or health conditions. Always provide fresh water and monitor your dog\'s weight to ensure they\'re getting the right amount of food.'
    },
    {
      question: 'How often should I take my dog to the vet?',
      answer: 'Puppies need several visits during their first year for vaccinations and check-ups. Adult dogs should see a veterinarian at least once a year for a wellness exam and vaccinations. Senior dogs (typically 7+ years depending on breed) benefit from twice-yearly check-ups. Additionally, you should take your dog to the vet any time they show signs of illness or injury. Regular preventative care can help catch health issues early and save on long-term medical costs.'
    }
  ];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <WebsiteJsonLd 
        url="https://www.pawpedia.xyz"
        name="PawPedia"
        description="The ultimate dog breed directory with comprehensive information about dog breeds, characteristics, temperament, and care requirements."
        logoUrl="https://www.pawpedia.xyz/logo.png"
      />
      <FAQJsonLd questions={faqQuestions} />
      
      <Hero />
      <FeaturedBreeds />
      
      {/* Breed Finder Promotion Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <span className="inline-block px-4 py-2 rounded-full bg-indigo-800 text-indigo-100 font-medium text-sm mb-4">
                AI-Powered Tool
              </span>
              <h2 className="text-4xl font-bold mb-6">
                Find Your Perfect <span className="text-yellow-300">Dog Match</span>
              </h2>
              <p className="text-xl mb-8 text-indigo-100">
                Not sure which dog breed is right for you? Our AI-powered Breed Finder will analyze your lifestyle and preferences to recommend the perfect canine companion.
              </p>
              <Link 
                href="/breed-finder" 
                className="inline-block px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors shadow-lg transform hover:scale-105 transition-transform"
              >
                Try Breed Finder
                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
            <div className="md:w-2/5">
              <div className="bg-white p-6 rounded-xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                  <h3 className="text-indigo-800 font-semibold mb-2">How it works:</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Answer simple questions about your lifestyle
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Our AI analyzes your preferences
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Get personalized breed recommendations
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-500">Join thousands of happy dog owners who found their perfect match!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Dog Care Tips Section */}
      <section className="py-24 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full opacity-30 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mb-4">
              Expert Advice
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dog Care <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Essentials</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to keep your furry friend happy and healthy with our expert dog care advice.
              Proper care is essential for your dog's wellbeing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <svg className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">Nutrition</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Proper nutrition is essential for your dog's health. Learn about balanced diets, feeding schedules, and nutritional requirements for different breeds and life stages.
              </p>
              <Link href="/blog" className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-800 transition-colors">
                Read more
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <svg className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors">Exercise</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Regular exercise keeps your dog physically fit and mentally stimulated. Discover breed-specific exercise needs and fun activities to keep your dog active and engaged.
              </p>
              <Link href="/blog" className="inline-flex items-center text-indigo-600 font-semibold group-hover:text-indigo-800 transition-colors">
                Read more
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <svg className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors">Training</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Effective training strengthens the bond between you and your dog. Explore positive reinforcement techniques and training tips for dogs of all ages and temperaments.
              </p>
              <Link href="/blog" className="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-800 transition-colors">
                Read more
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-40 left-0 w-72 h-72 rounded-full bg-indigo-50 opacity-70 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-50 opacity-70 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-4">
              Got Questions?
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about dog breeds, care, and ownership.
              We're here to help you provide the best care for your canine companion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Left column - Image and stats */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.dog.ceo/breeds/labrador/n02099712_4323.jpg"
                    alt="Labrador dog looking at camera"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                {/* Stats cards */}
                <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">95% Satisfaction</p>
                      <p className="text-sm text-gray-500">From dog owners</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-white p-5 rounded-2xl shadow-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">24/7 Support</p>
                      <p className="text-sm text-gray-500">Expert advice</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional info */}
              <div className="mt-16 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Still have questions?</h3>
                <p className="text-gray-700 mb-6">
                  Our team of dog experts is here to help you with any questions about dog breeds, training, health, or care.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  Contact Us
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Right column - FAQ accordion */}
            <div className="lg:col-span-3">
              <FAQAccordion faqQuestions={faqQuestions} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-10"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Find Your Perfect Canine Companion</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            With hundreds of dog breeds to explore, PawPedia helps you discover the perfect match for your lifestyle and preferences.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/breeds" 
              className="px-8 py-4 bg-white text-indigo-600 hover:bg-gray-100 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Explore All Dog Breeds
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-indigo-600 font-bold rounded-xl transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

