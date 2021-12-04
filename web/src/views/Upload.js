import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import Axios from 'axios';

import Loading from '../components/Loading';

import Main from '../components/Main';

export default function Upload({ showError }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendPost, setSendPost] = useState(false);
  const [caption, setCaption] = useState('');
  const navigate = useNavigate();

  async function handleUpload(e) {
    e.preventDefault();
    setLoading(true);
    const file = e.target.files[0];
    const config = {
      headers: {
        'Content-Type': file.type,
      },
    };

    try {
      const { data } = await Axios.post('/api/v1/posts/upload', file, config);
      setImageUrl(data.url);
    } catch (error) {
      console.error(error.response.data.error);
      showError(error.response.data.message);
    }

    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (sendPost) {
      return;
    }
    if (loading) {
      showError('Please wait until the image is uploaded.');
      return;
    }
    if (!imageUrl) {
      showError('Please upload an image.');
      return;
    }
    try {
      setSendPost(true);
      const body = {
        url: imageUrl,
        caption,
      };
      await Axios.post('/api/v1/posts', body);
      setSendPost(false);
      navigate('/');
    } catch (error) {
      console.error(error.response.data.error);
      showError(error.response.data.message);
    }
    setSendPost(false);
  }

  return (
    <Main center>
      <div className="upload">
        <form onSubmit={handleSubmit}>
          <div className="Upload__image-section">
            <SectionUploadImage loading={loading} imageUrl={imageUrl} handleUpload={handleUpload} />
          </div>
          <textarea
            name="caption"
            className="Upload__caption"
            placeholder="Write a caption..."
            maxLength="180"
            required
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          ></textarea>
          <button className="Upload__submit" type="submit">
            Post
          </button>
        </form>
      </div>
    </Main>
  );
}

function SectionUploadImage({ loading, imageUrl, handleUpload }) {
  if (loading) {
    return <Loading />;
  } else if (imageUrl) {
    return <img src={imageUrl} alt="Uploaded image" />;
  }

  return (
    <div className="Upload__image-label">
      <FontAwesomeIcon icon={faUpload} />
      <p>Drag and drop an image or click to select a file to upload.</p>
      <input type="file" name="image" onChange={handleUpload} />
    </div>
  );
}
