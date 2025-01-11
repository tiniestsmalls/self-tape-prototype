import fs from "fs";
import path from "path";
import { synthesizeAudio } from "./openai_client.js";

async function generateAudio(jsonFilePath) {
    // Create audio directory if it doesn't exist
    const audioDir = './audio';
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir);
    }

    // Read and parse JSON file
    const jsonContent = await fs.promises.readFile(jsonFilePath, 'utf8');
    const jsonArray = JSON.parse(jsonContent);

    // Process each object in the array
    for (let i = 0; i < jsonArray.length; i++) {
        const text = jsonArray[i].line;
        const outputPath = path.join(audioDir, `${i}_${jsonArray[i].character}.mp3`);
        
        try {
            await synthesizeAudio(text, outputPath);
            console.log(`Generated audio file: ${outputPath}`);
        } catch (error) {
            console.error(`Error generating audio for index ${i}:`, error);
        }
    }
}

// Example usage:
generateAudio('./test_script.json');

