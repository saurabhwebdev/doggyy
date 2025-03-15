/**
 * Utility function to submit URLs to IndexNow API
 * This helps search engines like Bing and Yandex discover and index your content faster
 */

const API_KEY = 'f468ab61f6c644ada744fbdc836a2b60';
const SITE_URL = 'https://www.pawpedia.xyz'; // Update this with your actual domain when deployed

/**
 * Submit a single URL to IndexNow
 * @param url The URL to submit (without the domain)
 * @returns Promise with the response
 */
export async function submitUrlToIndexNow(url: string): Promise<Response> {
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  
  return fetch(`https://www.bing.com/indexnow?url=${encodeURIComponent(fullUrl)}&key=${API_KEY}`, {
    method: 'GET',
  });
}

/**
 * Submit multiple URLs to IndexNow
 * @param urls Array of URLs to submit (without the domain)
 * @returns Promise with the response
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<Response> {
  const fullUrls = urls.map(url => 
    url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`
  );
  
  return fetch('https://www.bing.com/indexnow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      host: new URL(SITE_URL).hostname,
      key: API_KEY,
      urlList: fullUrls,
    }),
  });
}

/**
 * Example usage:
 * 
 * // Submit a single URL
 * submitUrlToIndexNow('/breeds/golden-retriever');
 * 
 * // Submit multiple URLs
 * submitUrlsToIndexNow([
 *   '/breeds/labrador-retriever',
 *   '/breeds/german-shepherd',
 *   '/blog/top-10-family-dogs'
 * ]);
 */ 