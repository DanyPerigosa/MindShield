import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ Variável GOOGLE_API_KEY não encontrada no .env");
  process.exit(1);
}

console.log("🔑 Testando chave:", GEMINI_API_KEY.slice(0, 10) + "...");

const url = `https://generativelanguage.googleapis.com/v1/models`;
const headers = { "Content-Type": "application/json" };

fetch(`${url}?key=${GEMINI_API_KEY}`, { headers })
  .then(async (res) => {
    const data = await res.json();
    console.log("📡 Código HTTP:", res.status);
    console.log("🧾 Resposta:", JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.error("❌ Erro ao testar chave:", err);
  });
