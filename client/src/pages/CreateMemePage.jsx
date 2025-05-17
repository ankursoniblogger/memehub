import { useState } from 'react';
import { getToken } from '../utils/auth';

export default function CreateMemePage() {
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
  });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
     const res = await fetch('http://localhost:5000/api/memes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || 'Error creating meme');

      setMsg('Meme posted successfully!');
      setFormData({ title: '', imageUrl: '' });
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="create-meme-form-container">
      <h2>Create a Meme</h2>
      <form onSubmit={handleSubmit} className="create-meme-form">
        <input
          type="text"
          name="title"
          placeholder="Meme title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />
        <button type="submit">Post Meme</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
