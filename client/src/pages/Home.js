import { useState, useEffect } from 'react';
import axios from 'axios';
import BlogPost from '../components/BlogPost';
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="home">
      <h1>Blog Posts</h1>
      <div className="blog-grid">
        {posts.map((post) => (
          <BlogPost key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;