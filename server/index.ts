import { generateAudio } from "./generate_audio.ts";
import { readThrough } from "./readthrough.ts";
import { parseScreenplay } from "./parse.ts";

async function main() {
   if (process.argv.length < 3) {
        console.error("Please provide a PDF file path as argument");
        process.exit(1);
    }
    
    try {
        // Parse PDF
        console.log("Parsing PDF...");
        const jsonPath = await parseScreenplay(process.argv[2]);

        // Generate audio
        console.log("Generating audio files...");
        await generateAudio(jsonPath);
        
        // Run readthrough
        console.log("Starting readthrough...");
        await readThrough(jsonPath);

        console.log("Workflow completed successfully!");
        
    } catch (error) {
        console.error("Error in workflow:", error);
        process.exit(1);
    }
}

main();
