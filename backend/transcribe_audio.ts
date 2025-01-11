import whisper from 'node-whisper';
import { transcribeAudioAPI } from './openai_client.js';

export async function transcribeAudio(audioFilePath) {
  try {
    console.log(`Transcribing ${audioFilePath}`);
    const data = await whisper(audioFilePath, {
      output_format: 'json',
      output_dir: 'transcripts',
      language: 'en',
      model: 'turbo',
      verbose: true,
    });
    console.log('Transcriptions:', data); // all the selected files paths (default: json, tsv, srt, txt, vtt)
    const JSONcontent = await data.json.getContent();
    console.log(JSONcontent); // the content of the file
    // or if you provide all output_format and you want to read them all at once
    const contents = await whisper.readAllFiles(data);
    console.log(contents); // all the returned files parsed
  } catch (error) {
    console.error('Error:', error.message);
  }
}

transcribeAudioAPI("./audio/0_Alice.mp3");