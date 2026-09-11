const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Mocked YouTube playlist fetch
app.post('/api/fetch-youtube-playlist', (req, res) => {
  const { playlistUrl } = req.body;
  // Mocked song list
  res.json({
    songs: [
      { title: 'Blinding Lights', artist: 'The Weeknd' },
      { title: 'Levitating', artist: 'Dua Lipa' },
      { title: 'Watermelon Sugar', artist: 'Harry Styles' }
    ]
  });
});

// Mocked Spotify search
app.post('/api/search-spotify', (req, res) => {
  const { songs } = req.body;
  // Pretend only some songs are found
  const results = songs.map(song => ({
    ...song,
    found: song.title !== 'Levitating' // Simulate 'Levitating' not found
  }));
  res.json({ results });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
