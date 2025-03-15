'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import supabase from '@/utils/supabase';
import { BlogPost, BlogCategory } from '@/services/blogService';

interface PostEditorProps {
  post?: BlogPost;
  categories: BlogCategory[];
  onCancel: () => void;
}

// Array of random author names for generation
const RANDOM_AUTHORS = [
  'Alex Johnson', 'Sam Wilson', 'Taylor Smith', 
  'Jordan Lee', 'Casey Brown', 'Morgan Davis',
  'Riley Green', 'Quinn Miller', 'Avery Thompson',
  'Jamie Garcia', 'Drew Martinez', 'Reese Anderson'
];

export default function PostEditor({ post, categories, onCancel }: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!post;

  // Form state
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
  const [author, setAuthor] = useState(post?.author || '');
  const [category, setCategory] = useState(post?.category || (categories[0]?.name || ''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // Generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Validate form
      if (!title || !slug || !content || !excerpt || !featuredImage || !author || !category) {
        setError('All fields are required');
        setIsSubmitting(false);
        return;
      }

      const postData = {
        title,
        slug,
        content,
        excerpt,
        featured_image: featuredImage,
        author,
        category,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let result;

      if (isEditing) {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);
      } else {
        // Insert new post
        result = await supabase
          .from('blog_posts')
          .insert([postData]);
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      setSuccess(isEditing ? 'Post updated successfully!' : 'Post created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate random dog image from Dog CEO API
  const generateRandomDogImage = async () => {
    try {
      setIsLoadingImage(true);
      setError('');
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await response.json();
      
      if (data.status === 'success') {
        setFeaturedImage(data.message);
      } else {
        throw new Error('Failed to fetch dog image');
      }
    } catch (err) {
      console.error('Error fetching dog image:', err);
      setError('Failed to fetch random dog image. Please try again or enter URL manually.');
    } finally {
      setIsLoadingImage(false);
    }
  };

  // Generate random author name
  const generateRandomAuthor = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_AUTHORS.length);
    setAuthor(RANDOM_AUTHORS[randomIndex]);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <div className="flex justify-between mb-6">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                !previewMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                previewMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Preview
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting
                ? isEditing
                  ? 'Updating...'
                  : 'Publishing...'
                : isEditing
                ? 'Update Post'
                : 'Publish Post'}
            </button>
          </div>
        </div>

        {previewMode ? (
          <div className="prose prose-lg max-w-none">
            <h1>{title || 'Untitled Post'}</h1>
            <p className="text-gray-500">By {author || 'Anonymous'}</p>
            {featuredImage && (
              <div className="relative w-full h-96 my-6">
                <Image
                  src={featuredImage}
                  alt={title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
          </div>
        ) : (
          <form className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug * <span className="text-xs text-gray-500">(Auto-generated from title)</span>
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                placeholder="enter-post-slug"
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                    Author *
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomAuthor}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Generate Random Author
                  </button>
                </div>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Author name"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
                  Featured Image URL *
                </label>
                <button
                  type="button"
                  onClick={generateRandomDogImage}
                  disabled={isLoadingImage}
                  className={`text-xs text-blue-600 hover:text-blue-800 ${isLoadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoadingImage ? 'Loading...' : 'Generate Random Dog Image'}
                </button>
              </div>
              <input
                type="text"
                id="featuredImage"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                placeholder="https://example.com/image.jpg"
              />
              {featuredImage && (
                <div className="mt-2 relative w-full h-40">
                  <Image
                    src={featuredImage}
                    alt="Featured image preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out resize-y"
                placeholder="Brief summary of the post"
              ></textarea>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content * (Markdown supported)
              </label>
              <textarea
                id="content"
                rows={15}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out resize-y font-mono"
                placeholder="# Your post content here"
              ></textarea>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}