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
