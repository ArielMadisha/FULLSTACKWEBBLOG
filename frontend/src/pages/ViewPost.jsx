import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function ViewPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyDelete, setBusyDelete] = useState(false);

  const isOwner = useMemo(() => {
    if (!user || !post) return false;
    const authorId = post.author?._id || post.author;
    return String(authorId) === String(user.id);
  }, [user, post]);

  useEffect(() => {
    let mounted = true;
    api
      .get(`/api/posts/${id}`)
      .then((res) => {
        if (!mounted) return;
        setPost(res.data);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message || 'Failed to load post');
      })
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  async function onDelete() {
    if (!confirm('Delete this post?')) return;
    setBusyDelete(true);
    setError('');
    try {
      await api.delete(`/api/posts/${id}`);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete');
    } finally {
      setBusyDelete(false);
    }
  }

  if (loading) return <p className="muted">Loading…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!post) return <p className="muted">Not found.</p>;

  return (
    <article className="card">
      {post.imageUrl ? <img className="cover" src={post.imageUrl} alt={post.title} /> : null}
      <div className="cardBody">
        <h1 className="h1">{post.title}</h1>
        {post.subtitle ? <p className="muted">{post.subtitle}</p> : null}
        <p className="muted">
          By {post.author?.username || 'Unknown'} • {new Date(post.createdAt).toLocaleString()}
        </p>

        <div className="row" style={{ margin: '12px 0' }}>
          <Link className="btn" to="/">
            Back
          </Link>

          {token && isOwner ? (
            <>
              <Link className="btn btnPrimary" to={`/posts/${post._id}/edit`}>
                Edit
              </Link>
              <button className="btn btnDanger" onClick={onDelete} disabled={busyDelete} type="button">
                {busyDelete ? 'Deleting…' : 'Delete'}
              </button>
            </>
          ) : null}
        </div>

        <div className="content">{post.content}</div>
      </div>
    </article>
  );
}
