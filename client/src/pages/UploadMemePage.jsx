import React, { useState } from "react";
import "./UploadMemePage.css";

const UploadMemePage = () => {
  const [image, setImage] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [isDraft, setIsDraft] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Meme submitted!");
    // Future: Send to backend here
  };

  return (
    <div className="upload-container">
      <h2>Upload a Meme</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        <input
          type="text"
          placeholder="Top Text"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Bottom Text"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
          required
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isDraft}
            onChange={(e) => setIsDraft(e.target.checked)}
          />
          Save as Draft
        </label>
        <button type="submit">Submit Meme</button>
      </form>

      {image && (
        <div className="preview">
          <h3>Preview:</h3>
          <img src={image} alt="Preview" />
          <div className="caption">{topText}</div>
          <div className="caption bottom">{bottomText}</div>
        </div>
      )}
    </div>
  );
};

export default UploadMemePage;
