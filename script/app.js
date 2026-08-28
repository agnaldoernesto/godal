// Gerenciamento de abas
function switchTab(tabName) {
    document.querySelectorAll('.search-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`${tabName}-section`).classList.add('active');
    event.target.classList.add('active');
}

// Lógica de requisição
async function searchData(type) {
    const queryInput = type === 'device' ? document.getElementById('device-query') : document.getElementById('people-query');
    const query = queryInput.value.trim();
    const resultContainer = document.getElementById('result-container');
    const loader = document.getElementById('loader');

    if (!query) {
        alert("Por favor, insira um termo para pesquisa.");
        return;
    }

    resultContainer.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        const response = await fetch('https://godal.agnaldoernesto99.workers.dev/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: type, query: query })
        });

        if (!response.ok) throw new Error("Falha na requisição ao servidor seguro.");

        const data = await response.json();
        
        // Renderização para Dispositivos
        if (type === 'device') {
            resultContainer.innerHTML = `
                <h3 style="margin-top:0; color: #2563eb;">${data.marca || 'N/A'} ${data.modelo || ''}</h3>
                <ul style="list-style: none; padding: 0; line-height: 1.6;">
                    <li><strong>Ano de Fabrico:</strong> ${data.ano_de_fabrico || 'N/A'}</li>
                    <li><strong>Preço Oficial:</strong> ${data.preco_oficial || 'N/A'}</li>
                    <li><strong>Preço Segunda Mão:</strong> ${data.preco_segunda_mao || 'N/A'}</li>
                    <li><strong>Preço Marketplace:</strong> ${data.preco_marketplace || 'N/A'}</li>
                    <li><strong>Intervalo Sugerido:</strong> <span style="color: #16a34a; font-weight: bold;">${data.intervalo_preco_sugerido || 'N/A'}</span></li>
                </ul>
            `;
        } 
        // Renderização para Pessoas
        else if (type === 'person') {
            let html = '<h3 style="margin-top:0; color: #2563eb;">Resultados da Busca</h3>';
            
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(person => {
                    html += `
                        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                            <h4 style="margin: 0 0 10px 0;">${person.nome_sobrenome || 'Nome Desconhecido'}</h4>
                            <p style="margin: 4px 0;"><strong>Idade:</strong> ${person.idade || 'N/A'}</p>
                            <p style="margin: 4px 0;"><strong>Residência:</strong> ${person.residencia || 'N/A'}</p>
                            <p style="margin: 4px 0;"><strong>Formação:</strong> ${person.escola_formacao || 'N/A'}</p>
                            <p style="margin: 4px 0;"><strong>Trabalho:</strong> ${person.trabalho_atual_antigo || 'N/A'} - ${person.cargo || 'N/A'}</p>
                            <p style="margin: 4px 0;"><strong>Números:</strong> ${person.numeros_associados || 'N/A'}</p>
                            <p style="margin: 4px 0;"><strong>Familiares:</strong> ${person.familiares || 'N/A'}</p>
                            <p style="margin: 4px 0;"><strong>Redes Sociais:</strong> ${person.redes_sociais || 'N/A'}</p>
                            <p style="margin: 4px 0;"><strong>Info Adicional:</strong> ${person.informacoes_adicionais || 'N/A'}</p>
                        </div>
                    `;
                });
            } else {
                html += `<p>Nenhum perfil encontrado com os parâmetros exigidos.</p>`;
            }
            resultContainer.innerHTML = html;
        }
        
    } catch (error) {
        resultContainer.innerHTML = `<p style="color: red; font-weight: bold;">Erro de Conexão: ${error.message}</p>`;
    } finally {
        loader.classList.add('hidden');
        resultContainer.classList.remove('hidden');
    }
}