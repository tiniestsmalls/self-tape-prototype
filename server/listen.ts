import recorder from 'node-record-lpcm16';
import fs from 'fs';
import { transcribeAudioAPI } from './openai_client.js';

export async function listenAndTranscribe(): Promise<string> {
  var response = "";
  try {
    console.log('Listening... (speak now)');
    const audioFile = './audio/recording.wav';
    const recording = recorder.record({
      sampleRate: 16000,
      channels: 1,
      audioType: 'wav',
      endOnSilence: true,
    });
    return new Promise((resolve) => {
      recording.stream()
          .pipe(fs.createWriteStream(audioFile))
          .on('close', async () => {
              const response = await transcribeAudioAPI(audioFile);
              resolve(response);
          });
    });
  } catch (error: any) {
    console.error('Recording error:', error.message);
  }
  return response;
}
