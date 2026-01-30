import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const canEdit = useMemo(() => {
    return Boolean(user);
  }, [user]);

  useEffect(() => {
    let mounted = true;
    api
      .get(`/api/posts/${id}`)
      .then((res) => {
        if (!mounted) return;
        const p = res.data;
        setTitle(p.title || '');
        setSubtitle(p.subtitle || '');
        setContent(p.content || '');
        setExistingImageUrl(p.imageUrl || '');
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message || 'Failed to load post');
      })
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canEdit) return;

    setError('');
    setBusy(true);

    try {
      const form = new FormData();
      form.append('title', title);
      form.append('subtitle', subtitle);
      form.append('content', content);
      if (image) form.append('image', image);

      const res = await api.put(`/api/posts/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update post');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="muted">Loading…</p>;

  return (
    <div>
      <h1 className="h1">Edit Blog Post</h1>

      {existingImageUrl ? (
        <div className="card" style={{ marginBottom: 16 }}>
          <img className="cover" src={existingImageUrl} alt="Current" />
        </div>
      ) : null}

      <form className="form" onSubmit={onSubmit}>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input
          className="input"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Subtitle (optional)"
        />
        <textarea
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Update your article..."
        />
        <input className="input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />

        {error ? <p className="error">{error}</p> : null}

        <button className="btn btnPrimary" disabled={busy} type="submit">
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
