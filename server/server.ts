import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { parseScreenplay } from './parse.ts';

const app = express();
const upload = multer();
const port = 3001; // Use a different port than your React app (which typically runs on 3000)

app.use(cors());
app.use(express.json());

app.post('/api/parse-script', upload.single('file'), async (req, res) => {
  try {
    const file = req.body;
    const characterName = req.body.characterName;
    
    // Your parsing logic here
    const result = await parseScreenplay(file.buffer);
    
    res.json({ scriptContent: result });
  } catch (error) {
    console.error('Error parsing script:', error);
    res.status(500).json({ error: 'Failed to parse script' });
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello, Express.js Server!</h1>');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 