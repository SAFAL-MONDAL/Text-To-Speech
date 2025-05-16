import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getConversionHistory } from '../api/tts';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Howl } from 'howler';

const DashboardPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getConversionHistory(localStorage.getItem('token'));
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    
    fetchHistory();
  }, []);

  const playAudio = (audioUrl) => {
    if (currentAudio) {
      currentAudio.stop();
    }
    
    const sound = new Howl({
      src: [audioUrl],
      format: ['mp3'],
      onend: () => setCurrentAudio(null),
    });
    
    sound.play();
    setCurrentAudio(sound);
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.stop();
      setCurrentAudio(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Conversion History
      </Typography>
      
      <List>
        {history.map((item, index) => (
          <Box key={item._id}>
            <ListItem>
              <ListItemText
                primary={item.text}
                secondary={`Voice: ${item.voiceId} • ${new Date(item.createdAt).toLocaleString()}`}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => playAudio(item.audioUrl)}
                >
                  Play
                </Button>
                <Button 
                  variant="outlined" 
                  size="small"
                  component="a"
                  href={item.audioUrl}
                  download={`speech-${index}.mp3`}
                >
                  Download
                </Button>
              </Box>
            </ListItem>
            {index < history.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default DashboardPage;