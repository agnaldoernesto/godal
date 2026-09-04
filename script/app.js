let currentType = "device";
const WORKER_URL = "https://godal.agnaldoernesto99.workers.dev/";

function selectType(type) {
  currentType = type;
  document.getElementById("btn-device").classList.toggle("active", type === "device");
  document.getElementById("btn-person").classList.toggle("active", type === "person");
  
  const input = document.getElementById("search-input");
  input.placeholder = type === "device" 
    ? "Ex: iPhone 15 Pro Max, Nokia 3310..." 
    : "Ex: Aguinaldo Machava, Satya Nadella...";
}

function handleKeyPress(e) {
  if (e.key === "Enter") executeSearch();
}

async function executeSearch() {
  const input = document.getElementById("search-input");
  const query = input.value.trim();

  if (!query) return;

  const btnText = document.getElementById("btn-label");
  const btnSpinner = document.getElementById("btn-spinner");
  const resultBox = document.getElementById("result-container");

  // Ativa estado de carregamento
  btnText.classList.add("hidden");
  btnSpinner.classList.remove("hidden");
  resultBox.classList.add("hidden");

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: currentType, query: query })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Ocorreu um erro na requisição.");
    }

    renderResult(data);

  } catch (error) {
    resultBox.innerHTML = `
      <div style="color: #ef4444; background: #fef2f2; padding: 12px; border-radius: 8px; font-size: 0.9rem;">
        ⚠️ <b>Erro:</b> ${error.message}
      </div>
    `;
  } finally {
    btnText.classList.remove("hidden");
    btnSpinner.classList.add("hidden");
    resultBox.classList.remove("hidden");
  }
}

function renderResult(data) {
  const resultBox = document.getElementById("result-container");
  
  // Trata array (ex: lista de pessoas) ou objeto único
  const items = Array.isArray(data) ? data : [data];

  let html = `<div class="res-title">✨ Resultados Encontrados</div><div class="grid-info">`;

  items.forEach(item => {
    for (const [key, value] of Object.entries(item)) {
      const formattedKey = key.replace(/_/g, " ");
      const formattedValue = (typeof value === "object" && value !== null) 
        ? JSON.stringify(value) 
        : (value || "Não informado");

      html += `
        <div class="info-item">
          <div class="info-label">${formattedKey}</div>
          <div class="info-value">${formattedValue}</div>
        </div>
      `;
    }
  });

  html += `</div>`;
  resultBox.innerHTML = html;
}
