import fs from 'fs';

let envStr = fs.readFileSync('.env.local', 'utf8');
let apiKey = '';
envStr.split('\n').forEach(line => {
    if (line.startsWith('VITE_GEMINI_API_KEY=')) {
        apiKey = line.split('=')[1].trim().replace(/"/g, '').replace(/'/g, '');
    }
});

async function fetchModels() {
    console.log("Fetching for key:", apiKey.substring(0, 10) + "...");
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    if (data.models) {
        console.log("AVAILABLE MODELS:");
        data.models.filter(m => m.supportedGenerationMethods.includes("generateContent")).forEach(m => console.log(m.name, m.version));
    } else {
        console.log("Failed to list models:", data);
    }
}

fetchModels();
