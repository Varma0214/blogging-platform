import './BlogPost.css';

function BlogPost({ post }) {
  return (
    <div className="blog-post">
      {post.image && (
        <img
          src={`http://localhost:5000${post.image}`}
          alt={post.title}
          className="blog-image"
        />
      )}
      <h2>{post.title}</h2>
      <p>{post.content.substring(0, 200)}...</p>
      <p className="date">
        Published on {new Date(post.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default BlogPost;