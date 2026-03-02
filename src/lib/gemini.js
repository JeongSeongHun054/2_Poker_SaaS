import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API using the key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY");

/**
 * Converts a File object to a base64 string suitable for the Gemini API.
 */
function fileToGenerativePart(file, base64Data) {
    return {
        inlineData: {
            data: base64Data.split(",")[1], // Remove the data:image/png;base64, prefix
            mimeType: file.type
        },
    };
}

/**
 * Parses multiple poker screenshots (WPL or WPT) using Gemini Vision in one single request.
 * @param {Array<{file: File, base64Data: string}>} filesData Array of image objects
 * @returns {Promise<Array>} The parsed session data for all images combined
 */
export async function parsePokerScreenshots(filesData) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
    You are an expert poker data extractor. I am giving you ONE OR MORE screenshots of a poker game lobby, result screen, or a "Hand History" table.
    They will likely be from 'WPL' (Korean platform) or 'WPT Global'.
    
    Please extract the historical sessions from ALL provided images and return ONLY a valid JSON ARRAY of objects representing the extracted rows from all images combined. Do not include markdown formatting like \`\`\`json.
    
    For each row or game you find across ANY of the images, extract:
    1. "platform": Return "WPL" if it looks like WPL (Korean text, units like 억/만). Return "WPT" if it looks like WPT Global (USD, English).
    2. "format": The type of game and name. For WPL, prefix with the type if visible (e.g., "홀덤", "AoF", "토너먼트"). Example: "[홀덤] 홀덤 고수 [23]" or "[AoF] AoF 헤즈업 자유2" or "[토너먼트] 몬스터 스택 400억 GTD".
    3. "stakes": The buy-in or blinds amount. 
       - If WPL Cash game and you see "50만/100만", write "50만/100만".
       - IMPORTANT for WPL Tournaments: Look at the name (e.g., "몬스터 스택 400억 GTD"). The number like "400억" is the GUARANTEE (GTD), NOT the buy-in! Instead, estimate the actual buy-in amount.
    4. "result": The net profit or prize money in NUMBER format based on the platform's primary unit.
       - For WPL, the primary unit is "억" (100 million). So if the prize is "1억 3727만", the result should be 1.3727. If it's "-24만 2916", the result is -0.0024. If there is no result (e.g. tournament in progress or 0), return 0.
       - For WPT, the primary unit is USD. So if the prize is "$150", return 150.
    5. "date": The date of the session in YYYY-MM-DD format (if visible in the UI, otherwise make a logical guess based on current context).

    Example resulting JSON Structure:
    [
      {
        "platform": "WPL",
        "format": "[홀덤] 홀덤 고수 [23]",
        "stakes": "50만/100만",
        "result": 1.3727,
        "date": "2026-02-24"
      },
      {
        "platform": "WPL",
        "format": "[토너먼트] 몬스터 스택 400억 GTD",
        "stakes": "400억",
        "result": 0,
        "date": "2026-02-24"
      }
    ]
    `;

        // Map over all files to generate the required inlineData array points
        const imageParts = filesData.map(data => fileToGenerativePart(data.file, data.base64Data));

        const result = await model.generateContent([prompt, ...imageParts]);
        const responseText = result.response.text();

        // Clean up potential markdown formatting from the response
        let cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const parsed = JSON.parse(cleanJson);
            return parsed;
        } catch (e) {
            console.error("Failed to parse Gemini JSON:", cleanJson);
            throw new Error("AI returned invalid data format.");
        }
    } catch (error) {
        console.error("API Error during vision processing:", error);
        throw error;
    }
}
