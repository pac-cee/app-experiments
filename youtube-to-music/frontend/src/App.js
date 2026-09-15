import React, { useState } from 'react';
import './App.css';
import { FaCheckCircle, FaTimesCircle, FaMusic } from 'react-icons/fa';

function App() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [platform, setPlatform] = useState('spotify');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleTransfer = async () => {
    setLoading(true);
    setResults(null);
    setError('');
    setSuccess(false);
    try {
      // Step 1: Fetch songs from YouTube playlist (mocked)
      const ytRes = await fetch('http://localhost:4000/api/fetch-youtube-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistUrl })
      });
      if (!ytRes.ok) throw new Error('Failed to fetch playlist.');
      const { songs } = await ytRes.json();
      // Step 2: Search for songs on Spotify (mocked)
      const spRes = await fetch('http://localhost:4000/api/search-spotify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songs })
      });
      if (!spRes.ok) throw new Error('Failed to search Spotify.');
      const { results } = await spRes.json();
      setResults(results);
      setSuccess(true);
    } catch (e) {
      setError(e.message);
