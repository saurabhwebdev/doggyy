'use client';

import { useState } from 'react';
import { BlogComment } from '@/services/blogService';
import { formatRelativeTime } from '@/utils/dateUtils';
import { addCommentToPost } from '@/services/blogService';

interface CommentSectionProps {
  postId: number;
  comments: BlogComment[];
}

export default function CommentSection({ postId, comments }: CommentSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [localComments, setLocalComments] = useState<BlogComment[]>(comments);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setIsSubmitting(true);
    
    try {
      const success = await addCommentToPost({
        post_id: postId,
        author_name: name,
        author_email: email,
        content
      });
      
      if (success) {
        setIsSuccess(true);
        
        // Add a temporary comment to the UI
        // In a real app, you would fetch the new comment from the server
        const tempComment: BlogComment = {
          id: Date.now(), // Temporary ID
          post_id: postId,
          author_name: name,
          author_email: email,
          content,
          is_approved: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setLocalComments([...localComments, tempComment]);
        
        // Reset form
        setName('');
        setEmail('');
        setContent('');
      } else {
        setError('Failed to submit comment. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Comments ({localComments.length})</h2>
      
      {/* Comments list */}
      {localComments.length > 0 ? (
        <div className="space-y-6 mb-10">
          {localComments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{comment.author_name}</h3>
                <span className="text-sm text-gray-500">{formatRelativeTime(comment.created_at)}</span>
              </div>
              <p className="mt-2 text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center mb-10">
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        </div>
      )}
      
      {/* Comment form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Leave a Comment</h3>
        
        {isSuccess && !error && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>Thank you for your comment! It will be visible after moderation.</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email * (will not be published)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Comment *
            </label>
            <textarea
              id="comment"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
      </div>
    </div>
  );
} 