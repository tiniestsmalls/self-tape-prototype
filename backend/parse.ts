import { LlamaParseReader } from "llamaindex";
import fs from "fs";

async function parseScreenplay() {
    if (process.argv.length < 3) {
        console.error("Please provide a PDF file path as argument");
        process.exit(1);
    }

    const pdfPath = process.argv[2];
    const reader = new LlamaParseReader({ 
        resultType: "markdown",
        language: ["en"],
        apiKey: "llx-JQhwMFhiqaSSuaJzLPvG3uhPb1B6FDuH1i7xINAzv8gh2BIC",
        parsingInstruction: "Extract the screenplay in the format of a JSON object with the following fields: character, line",
    });
    
    try {
        const result = await reader.loadData(pdfPath);
        console.log(result[0].text);
        const parsedScript = JSON.parse(result[0].text.substring(7, result[0].text.length - 3)).dialogue;
        console.log(parsedScript);
        // Write to JSON file
        fs.writeFileSync(
            'parsed_script.json', 
            JSON.stringify(parsedScript, null, 2)
        );

        console.log("Successfully parsed screenplay to parsed_script.json");
        
    } catch (error) {
        console.error("Error parsing screenplay:", error);
        process.exit(1);
    }
}

parseScreenplay();


