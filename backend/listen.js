import recorder from 'node-record-lpcm16';
import fs from 'fs';
import { transcribeAudioAPI } from './openai_client.js';

export async function listenAndTranscribe() {
  try {
    console.log('Listening... (speak now)');
    const audioFile = './audio/recording.wav';
    const recording = recorder.record({
      sampleRate: 16000,
      channels: 1,
      audioType: 'wav',
      endOnSilence: true,
    });
    recording.stream().pipe(fs.createWriteStream(audioFile)).on('close', () => {
      transcribeAudioAPI(audioFile);
    });
  } catch (error) {
    console.error('Recording error:', error.message);
  }
}
