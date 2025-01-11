import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ debug: true });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function synthesizeAudio(text, outputPath) {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(outputPath, buffer);
}

export async function transcribeAudioAPI(audioFilePath): Promise<string> {
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-1",
      });
      console.log(transcription.text);
      return transcription.text;
}