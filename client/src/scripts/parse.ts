import { LlamaParseReader } from "llamaindex";
import { writeFileSync } from "fs";

const fileToUint8Array = (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        resolve(uint8Array);
      };
      
      reader.onerror = () => reject(reader.error);
      
      reader.readAsArrayBuffer(file);
    });
  };

export async function parseScreenplay(pdf: File): Promise<string> {
    const reader = new LlamaParseReader({ 
        resultType: "markdown",
        language: ["en"],
        apiKey: "llx-JQhwMFhiqaSSuaJzLPvG3uhPb1B6FDuH1i7xINAzv8gh2BIC",
        parsingInstruction: "Extract the screenplay in the format of a JSON object with the following fields: character, line. Don't include anything in parentheses.",
    });
    
    try {
        const typedArray = await fileToUint8Array(pdf)
        const result = await reader.loadDataAsContent(typedArray);
        console.log(result[0].text);
        const parsedScript = JSON.parse(result[0].text.substring(7, result[0].text.length - 3));
        console.log(parsedScript);
        // Write to JSON file
        writeFileSync(
            'parsed_script.json', 
            JSON.stringify(parsedScript, null, 2)
        );

        console.log("Successfully parsed screenplay to parsed_script.json");
        return 'parsed_script.json';
    } catch (error) {
        console.error("Error parsing screenplay:", error);
        process.exit(1);
    }
}

/*if (process.argv.length < 3) {
    console.error("Please provide a PDF file path as argument");
    process.exit(1);
}

const pdfPath = process.argv[2];

parseScreenplay(pdfPath);*/


