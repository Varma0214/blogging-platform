import { useState, useEffect } from 'react';
import axios from 'axios';
import BlogForm from './BlogForm';
import './AdminDashboard.css';

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('https://blogging-platform-backend-cp1y.onrender.com/api/posts');
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://blogging-platform-backend-cp1y.onrender.com/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <BlogForm
        post={editingPost}
        onSubmit={() => {
          setEditingPost(null);
          fetchPosts();
        }}
      />
      <h2>All Posts</h2>
      <div className="admin-grid">
        {posts.map((post) => (
          <div key={post._id} className="admin-post">
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}...</p>
            {post.image && (
              <img
                src={`http://localhost:5000${post.image}`}
                alt={post.title}
                className="post-image"
              />
            )}
            <p className="date">
              Published on {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <div className="actions">
              <button
                className="edit-btn"
                onClick={() => setEditingPost(post)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(post._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
