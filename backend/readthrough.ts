import fs from "fs";
import readline from "readline";
import { promisify } from "util";
import { exec } from "child_process";
import { listenAndTranscribe } from "./listen.js";
const execAsync = promisify(exec);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function playAudio(filepath) {
    // This uses the 'play' command from sox on Linux/Mac or 'start' on Windows
    const cmd = process.platform === 'win32' 
        ? `start ${filepath}`
        : `play ${filepath}`;
    
    try {
        await execAsync(cmd);
    } catch (error) {
        console.error('Error playing audio:', error);
    }
}

async function readThrough() {
    // Get the character the user is playing
    const userCharacter = await question("Which character are you playing (Alice/Bob)? ");
    
    // Read and parse the script
    const scriptContent = await fs.promises.readFile('./test_script.json', 'utf8');
    const script = JSON.parse(scriptContent);
    
    console.log("\nStarting readthrough...\n");
    
    // Go through each line in the script
    for (let i = 0; i < script.length; i++) {
        const line = script[i];
        
        if (line.character === userCharacter) {
            // If it's the user's line, prompt them to say it
            console.log(`\n[Your line as ${userCharacter}]:`);
            console.log(line.line);
            await listenAndTranscribe();
            await question("\n...");
        } else {
            // If it's the other character's line, play the audio
            console.log(`\n[${line.character}]: ${line.line}`);
            const audioFile = `./audio/${i}_${line.character}.mp3`;
            await playAudio(audioFile);
        }
    }
    
    console.log("\nReadthrough complete!");
    rl.close();
}

readThrough().catch(console.error);
