// public/js/main.js

// --- CHAT IA ---
const chatForm = document.getElementById("chat-form");
const inputText = document.getElementById("input-text");
const inputName = document.getElementById("input-name");
const messages = document.getElementById("messages");

chatForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = inputText.value.trim();
  const user = inputName.value.trim() || "Usuário";

  if (!text) return;

  addMessage(user, text, "user");
  inputText.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, message: text }),
    });
    const data = await res.json();
    addMessage("MindShield IA", data.reply, "bot");
  } catch (err) {
    console.error("Erro:", err);
    addMessage("MindShield IA", "Desculpe, houve um erro ao enviar sua mensagem.", "bot");
  }
});

function addMessage(sender, text, type) {
  const div = document.createElement("div");
  div.classList.add("msg", type);
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// --- PHQ-9 ---
const phqForm = document.getElementById("phq9-form");
const phqResult = document.getElementById("phq9-result");

phqForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(phqForm);
  const scores = Array.from(formData.values()).map(Number);
  const score = scores.reduce((a, b) => a + b, 0);

  let severity = "Leve";
  if (score >= 15) severity = "Grave";
  else if (score >= 10) severity = "Moderada";
  else if (score >= 5) severity = "Leve";

  phqResult.style.display = "block";
  phqResult.innerHTML = `Pontuação total: <b>${score}</b> — Severidade: <b>${severity}</b>`;

  await fetch("/api/phq9", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score, severity, timestamp: new Date().toISOString() }),
  });
});
