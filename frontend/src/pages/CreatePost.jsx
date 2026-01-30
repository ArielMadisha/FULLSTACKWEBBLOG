import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '../api/client.js';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const form = new FormData();
      form.append('title', title);
      form.append('subtitle', subtitle);
      form.append('content', content);
      if (image) form.append('image', image);

      const res = await api.post('/api/posts', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create post');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="h1">Create Blog Post</h1>

      <form className="form" onSubmit={onSubmit}>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
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
          placeholder="Write your article..."
        />
        <input className="input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />

        {error ? <p className="error">{error}</p> : null}

        <button className="btn btnPrimary" disabled={busy} type="submit">
          {busy ? 'Publishing…' : 'Publish'}
        </button>
      </form>
    </div>
  );
}
