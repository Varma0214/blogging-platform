import { useState } from 'react';
import axios from 'axios';
import './BlogForm.css';

function BlogForm({ post, onSubmit }) {
  const [title, setTitle] = useState(post ? post.title : '');
  const [content, setContent] = useState(post ? post.content : '');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      if (post) {
        await axios.put(`https://blogging-platform-backend-cp1y.onrender.com/api/posts/${post._id}`, formData, config);
      } else {
        await axios.post('https://blogging-platform-backend-cp1y.onrender.com/api/posts', formData, config);
      }
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving post');
    }
  };

  return (
    <div className="blog-form">
      <h2>{post ? 'Edit Post' : 'Create Post'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <button type="submit">{post ? 'Update Post' : 'Create Post'}</button>
      </form>
    </div>
  );
}

export default BlogForm;
