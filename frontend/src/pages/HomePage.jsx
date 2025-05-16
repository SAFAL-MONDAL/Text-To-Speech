import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { convertTextToSpeech } from '../api/tts';
import { Box, Button, TextField, Select, MenuItem, Typography } from '@mui/material';
import { Howl } from 'howler';

const voices = [
  { id: 'Joanna', name: 'Joanna (English)' },
  { id: 'Salli', name: 'Salli (English)' },
  { id: 'Aditi', name: 'Aditi (Hindi)' },
  { id: 'Kajal', name: 'Kajal (Hindi)' },
  { id: 'Raveena', name: 'Raveena (Hindi)' },
  { id: 'Arjun', name: 'Arjun (Hindi)' },
  { id: 'Kanya', name: 'Kanya (Bengali)' },
  { id: 'Krishna', name: 'Krishna (Odia)' },
];
const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState('Joanna');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleConvert = async () => {
    if (!text.trim()) return;
    
    try {
      const audioData = await convertTextToSpeech(text, voiceId, localStorage.getItem('token'));
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error('Conversion error:', error);
    }
  };

  const playAudio = () => {
    if (!audioUrl) return;
    
    const sound = new Howl({
      src: [audioUrl],
      format: ['mp3'],
      onplay: () => setIsPlaying(true),
      onend: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
    });
    
    sound.play();
  };

  const stopAudio = () => {
    Howler.stop();
    setIsPlaying(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Text to Speech Converter
      </Typography>
      
      {isAuthenticated && (
        <Typography variant="subtitle1" gutterBottom>
          Welcome, {user.username}!
        </Typography>
      )}
      
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="Enter text to convert to speech"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Select
        value={voiceId}
        onChange={(e) => setVoiceId(e.target.value)}
        sx={{ mb: 2, width: 200 }}
      >
        {voices.map((voice) => (
          <MenuItem key={voice.id} value={voice.id}>
            {voice.name}
          </MenuItem>
        ))}
      </Select>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button variant="contained" onClick={handleConvert}>
          Convert to Speech
        </Button>
        
        {audioUrl && (
          <>
            <Button 
              variant="outlined" 
              onClick={isPlaying ? stopAudio : playAudio}
            >
              {isPlaying ? 'Stop' : 'Play'}
            </Button>
            <Button 
              variant="outlined" 
              component="a"
              href={audioUrl}
              download="speech.mp3"
            >
              Download
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;