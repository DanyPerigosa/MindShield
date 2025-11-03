// =============================
// 🌟 MindShield Server (Gemini 2.5 - FINAL)
// =============================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// === Servir arquivos estáticos ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// === Configuração da API ===
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ ERRO: GOOGLE_API_KEY não encontrada no .env");
  process.exit(1);
}

// 👉 MODELO CORRETO (segundo sua resposta da API)
const GEMINI_MODEL = "models/gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/${GEMINI_MODEL}:generateContent`;

// =============================
// 🔹 Rota principal do Chat
// =============================
app.post("/api/chat", async (req, res) => {
  try {
    const { mensagem, historico = [] } = req.body;
    if (!mensagem) {
      return res.status(400).json({ resposta: "Mensagem vazia recebida." });
    }

    // Contexto
    const contexto = [
      {
        role: "user",
        parts: [
          {
            text: `
Você é a MindShield IA — uma assistente empática e acolhedora que oferece apoio emocional com respeito e leveza.
Evite diagnósticos. Fale como um amigo compreensivo e humano.

Histórico:
${historico.map(h => `${h.role === "user" ? "Usuário" : "MindShield"}: ${h.content}`).join("\n")}
Usuário: ${mensagem}
`
          }
        ]
      }
    ];

    const resposta = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: contexto })
    });

    const data = await resposta.json();

    if (!resposta.ok) {
      console.error("❌ Erro na resposta Gemini:", data);
      return res.status(500).json({
        resposta: "⚠️ Erro ao se comunicar com o modelo Gemini. Verifique sua chave API ou limite de uso."
      });
    }

    const respostaIA =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Desculpe, não consegui entender sua mensagem.";

    res.json({ resposta: respostaIA });

  } catch (erro) {
    console.error("❌ Erro ao processar mensagem:", erro);
    res.status(500).json({
      resposta: "⚠️ Erro ao se comunicar com o modelo Gemini. Verifique sua chave API."
    });
  }
});

// =============================
// 🔹 Inicialização
// =============================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Servidor MindShield rodando em http://localhost:${PORT}`));

