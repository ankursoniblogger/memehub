import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentInputs, setCommentInputs] = useState({}); // memeId => input text
  const [localComments, setLocalComments] = useState({}); // memeId => array of comments

  // Fetch memes from backend
  const fetchMemes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/memes');
      const data = await res.json();
      setMemes(data);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  // Like a meme
  const handleLike = async (memeId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to like memes!');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/memes/${memeId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType: 'upvote' }),  // backend expects 'upvote' or 'downvote'
      });

      const result = await res.json();
      if (res.ok) {
        fetchMemes(); // Refresh memes with updated votes
      } else {
        alert(result.msg || 'Failed to like meme');
      }
    } catch (err) {
      console.error('Like error:', err);
      alert('Failed to like meme');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for comments
  const handleCommentChange = (memeId, text) => {
    setCommentInputs((prev) => ({ ...prev, [memeId]: text }));
  };

  // Submit comment to backend
  const handleCommentSubmit = async (memeId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to comment!');
      return;
    }

    const commentText = commentInputs[memeId];
    if (!commentText || commentText.trim() === '') {
      alert('Comment cannot be empty');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/memes/${memeId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      const newComment = await res.json();

      if (res.ok) {
        // Clear input box for that meme
        setCommentInputs((prev) => ({ ...prev, [memeId]: '' }));

        // Add this new comment to localComments state to show instantly
        setLocalComments((prev) => {
          const existingComments = prev[memeId] || [];
          return { ...prev, [memeId]: [...existingComments, newComment] };
        });
      } else {
        alert(newComment.msg || 'Failed to post comment');
      }
    } catch (err) {
      console.error('Comment error:', err);
      alert('Failed to post comment');
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  return (
    <div className="container">
      <h1 className="heading">🔥 Meme Feed</h1>

      {memes.length === 0 ? (
        <p>No memes available.</p>
      ) : (
        memes.map((meme) => {
          // Comments to show = backend comments (if exist) + local newly added comments
          const backendComments = meme.comments || [];
          const addedComments = localComments[meme._id] || [];
          const allComments = [...backendComments, ...addedComments];

          return (
            <div key={meme._id} className="meme-card">
              <div className="meme-caption">{meme.topText || meme.caption || ''} {meme.bottomText || ''}</div>
              <img className="meme-image" src={meme.imageUrl} alt="Meme" />
              <div className="meme-actions">
                <div className="buttons">
                  <button
                    className="like-btn"
                    onClick={() => handleLike(meme._id)}
                    disabled={loading}
                  >
                    👍 {meme.upvotes || (meme.votes?.length || 0)} Like{(meme.upvotes || (meme.votes?.length || 0)) === 1 ? '' : 's'}
                  </button>
                </div>
                <span className="timestamp">
                  🕒 {new Date(meme.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <h4>Comments</h4>
                {allComments.length > 0 ? (
                  allComments.map((comment) => (
                    <div key={comment._id || comment.createdAt} className="comment-item">
                      <strong>{comment.user?.username || 'User'}:</strong> {comment.text}
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}

                {/* Comment Input */}
                <div className="comment-input">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[meme._id] || ''}
                    onChange={(e) => handleCommentChange(meme._id, e.target.value)}
                  />
                  <button onClick={() => handleCommentSubmit(meme._id)}>Post</button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Home;
