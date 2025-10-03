
const express = require('express');
const path = require('path');
require('dotenv').config();

const { generateQuestions } = require('./geminiClient');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));


app.post('/api/generate-questions', async (req, res) => {
  try {
    const { jobRole } = req.body;
    if (!jobRole) {
      return res.status(400).json({ error: 'jobRole is required' });
    }
    const questions = await generateQuestions(jobRole);
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
