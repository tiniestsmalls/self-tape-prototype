import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import { parseScreenplay } from './parse.ts';
import { generateAudio } from './generate_audio.ts';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname + '-' + uniqueSuffix)
  }
})
const app = express();
const upload = multer({ storage });
const port = 3001; // Use a different port than your React app (which typically runs on 3000)

app.use(cors());
app.use(express.json());

app.post('/api/parse-script', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const resultPath = await parseScreenplay(file.path);
    const result = await fs.readFileSync(resultPath, 'utf8');
    const parsedResult = JSON.parse(result);
    generateAudio(resultPath);
    res.json({ scriptContent: parsedResult, resultPath: resultPath.split('/').pop() });
  } catch (error) {
    console.error('Error parsing script:', error);
    res.status(500).json({ error: 'Failed to parse script' });
  }
});

app.get('/api/get-audio', (req: Request, res: Response) => {
  const { scriptId, lineIndex } = req.query as { scriptId?: string, lineIndex?: string };
  if (!scriptId || !lineIndex) {
    return res.status(400).json({ error: 'Missing scriptId or lineIndex parameter' });
  }

  const audioPath = `./audio/${scriptId}/${lineIndex}.mp3`;

  // Check if file exists
  if (!fs.existsSync(audioPath)) {
    return res.status(404).json({ error: 'Audio file not found' });
  }

  // Set headers for audio streaming
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', `attachment; filename="${lineIndex}.mp3"`);

  // Stream the audio file
  const audioStream = fs.createReadStream(audioPath);
  audioStream.pipe(res);
});

app.get('/', (req, res) => {
  res.send('<h1>Hello, Express.js Server!</h1>');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 