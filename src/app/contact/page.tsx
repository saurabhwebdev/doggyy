import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact PawPedia | Get in Touch With Our Team',
  description: 'Get in touch with the PawPedia team. We welcome your questions, feedback, and suggestions about our dog breed directory.',
  alternates: {
    canonical: 'https://www.pawpedia.xyz/contact'
  }
};

// Using Dog CEO API for the contact page images
async function getDogImages() {
  try {
    // Get two different dog images for the contact page
    const [mainImage, decorativeImage] = await Promise.all([
      fetch('https://dog.ceo/api/breed/retriever/golden/images/random', { 
        next: { revalidate: 3600 } 
      }),
      fetch('https://dog.ceo/api/breed/spaniel/images/random', { 
        next: { revalidate: 3600 } 
      })
    ]);
    
    const mainData = await mainImage.json();
    const decorativeData = await decorativeImage.json();
    
    return {
      main: mainData.message,
      decorative: decorativeData.message
    };
  } catch (error) {
    console.error('Error fetching dog images:', error);
    // Fallback images in case the API fails
    return {
      main: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg',
      decorative: 'https://images.dog.ceo/breeds/spaniel-cocker/n02102318_3726.jpg'
    };
  }
}

export default async function ContactPage() {
  const dogImages = await getDogImages();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-screen overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -right-24 top-1/4 w-96 h-96 rounded-full bg-blue-300 blur-3xl"></div>
        <div className="absolute right-48 top-1/2 w-64 h-64 rounded-full bg-indigo-300 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 relative inline-block">
            Get in Touch
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500 rounded-full"></span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions, suggestions, or feedback? We'd love to hear from you and help with any inquiries about our dog breed directory.
          </p>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left Column - Contact Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-48 md:h-64 overflow-hidden">
                <Image 
                  src={dogImages.main}
                  alt="Happy dog"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h2 className="text-2xl font-bold">Send Us a Message</h2>
                    <p className="text-white/80">We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Question about dog breeds"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Your message here..."
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center group"
                    >
                      <span>Send Message</span>
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Right Column - Contact Info & FAQ */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl text-white overflow-hidden">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Contact Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-white/20 p-3 rounded-full mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white/90">Email</h3>
                        <a href="mailto:info@pawpedia.xyz" className="text-white hover:text-blue-200 transition-colors">
                          info@pawpedia.xyz
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-white/20 p-3 rounded-full mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white/90">Support Hours</h3>
                        <p className="text-white/80">Monday - Friday: 9AM - 5PM EST</p>
                        <p className="text-white/80">Weekend: 10AM - 2PM EST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-white/20 p-3 rounded-full mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white/90">Social Media</h3>
                        <div className="flex space-x-4 mt-2">
                          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
                            Facebook
                          </a>
                          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
                            Twitter
                          </a>
                          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
                            Instagram
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Dog Image */}
                <div className="relative h-40 overflow-hidden">
                  <Image 
                    src={dogImages.decorative}
                    alt="Cute dog"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-700/60"></div>
                </div>
              </div>
              
              {/* Quick Links Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Quick Links
                </h2>
                
                <div className="space-y-4">
                  <Link href="/" className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">Home Page</span>
                  </Link>
                  
                  <Link href="/about" className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">About Us</span>
                  </Link>
                  
                  <Link href="/breeds" className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">Browse Dog Breeds</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
              <span className="text-blue-500 mr-2">❓</span> Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">How can I contribute to PawPedia?</h3>
                <p className="text-gray-600">
                  We welcome contributions from dog experts and enthusiasts. Please contact us with your ideas or suggestions using the form above, and our team will get back to you to discuss collaboration opportunities.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Is the information on PawPedia accurate?</h3>
                <p className="text-gray-600">
                  We strive to provide accurate and up-to-date information. Our content is reviewed by dog experts and veterinarians, and we use reliable sources for all our breed information. If you spot any inaccuracies, please let us know.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Can I use PawPedia content for my website or publication?</h3>
                <p className="text-gray-600">
                  Please contact us for permission to use our content. We're happy to discuss licensing options and ensure proper attribution for any content used from our platform.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">How often is PawPedia updated?</h3>
                <p className="text-gray-600">
                  We regularly update our content to ensure it reflects the latest understanding of canine health, behavior, and care practices. Major updates are typically announced on our social media channels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 