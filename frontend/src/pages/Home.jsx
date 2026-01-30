import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../api/client.js';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get('/api/posts')
      .then((res) => {
        if (!mounted) return;
        setPosts(res.data || []);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message || 'Failed to load posts');
      })
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="h1">Developer Blog Posts</h1>
      <p className="muted">Read and share technical articles with images.</p>

      {loading ? <p className="muted">Loading…</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="grid">
        {posts.map((p) => (
          <article key={p._id} className="card">
            {p.imageUrl ? <img className="cover" src={p.imageUrl} alt={p.title} /> : null}
            <div className="cardBody">
              <h2 className="h2">{p.title}</h2>
              {p.subtitle ? <p className="muted">{p.subtitle}</p> : null}
              <p className="muted">
                By {p.author?.username || 'Unknown'} • {new Date(p.createdAt).toLocaleString()}
              </p>
              <div className="row">
                <Link className="btn btnPrimary" to={`/posts/${p._id}`}>
                  View Blog
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && posts.length === 0 ? <p className="muted">No posts yet.</p> : null}
    </div>
  );
}
