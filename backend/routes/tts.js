const express = require('express');
const AWS = require('aws-sdk');
const TTSConversion = require('../models/TTSConversion');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure AWS Polly
const polly = new AWS.Polly({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/audio');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Convert text to speech
router.post('/convert', async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    const params = {
      OutputFormat: 'mp3',
      Text: text,
      VoiceId: voiceId || 'Joanna' // Default voice
    };

    polly.synthesizeSpeech(params, async (err, data) => {
      if (err) {
        console.error('Polly error:', err);
        return res.status(500).json({ message: 'Error converting text to speech' });
      }

      // Save to database
      const conversion = new TTSConversion({
        userId: req.user.userId,
        text,
        voiceId: params.VoiceId,
        audioUrl: `/audio/${Date.now()}.mp3`
      });

      await conversion.save();

      // Return the audio data
      res.set('Content-Type', 'audio/mpeg');
      res.send(data.AudioStream);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's conversion history
router.get('/history', async (req, res) => {
  try {
    const conversions = await TTSConversion.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(conversions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;