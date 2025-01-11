import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: "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" });

export async function synthesizeAudio(text, outputPath) {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(outputPath, buffer);
}

export async function transcribeAudioAPI(audioFilePath) {
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-1",
      });
      console.log(transcription.text);
}