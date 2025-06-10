import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { mockVideos } from '../data/mockData';
import { Video } from '../types/video';
import './vedio.css';

export function Videos() {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVideo: Omit<Video, 'id' | 'thumbnail'> & { thumbnailFile?: File | null } = {
      title,
      description,
      url,
      createdAt: new Date().toISOString().split('T')[0],
      thumbnailFile: thumbnail,
    };
    const mockNewVideo: Video = {
      ...newVideo,
      id: (videos.length + 1).toString(),
    };
    setVideos([mockNewVideo, ...videos]); 
    setTitle('');
    setDescription('');
    setUrl('');
    setThumbnail(null);
    const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="videos-page">
      <Header title="Videos" />
      
      <div className="video-form-container">
       
        <form onSubmit={handleSubmit} className="video-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="Video Title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={3}
              placeholder="Video Description"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="url" className="form-label">
              Video URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="form-input"
              placeholder="https://example.com/video"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="thumbnail" className="form-label">
              Thumbnail
            </label>
            <input
              type="file"
              id="thumbnail"
              onChange={handleThumbnailChange}
              className="form-file-input"
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="submit-button"
          >
            Add Video
          </button>
        </form>
      </div>
    </div>
  );
}