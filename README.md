# 🚀 Godal Engine — Buscador Inteligente

Interface web minimalista e motor de busca estruturado alimentado pela API do **Google Gemini 3.6 Flash**, rodando em uma arquitetura 100% *serverless* e de **custo zero** com **Cloudflare Pages** e **Cloudflare Workers**.

![Versão](https://img.shields.io/badge/Gemini-3.6_Flash-7c3aed?style=flat-square)
![Infra](https://img.shields.io/badge/Cloudflare-Workers_%26_Pages-f38020?style=flat-square)
![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue?style=flat-square)

---

## ✨ Funcionalidades

- 📱 **Análise de Dispositivos Eletrônicos:** Consulta dados de mercado, especificações, preços oficiais, valores de segunda mão e médias sugeridas para compra/venda.
- 👤 **Pesquisa de Perfis Profissionais:** Consolida dados abertos de fontes públicas (OSINT) como formação acadêmica, histórico de trabalho, redes e contatos.
- 🔒 **Arquitetura Segura (Proxy Serverless):** A chave da API (`LLM_API_KEY`) é mantida estritamente protegida dentro das variáveis de ambiente do Cloudflare Worker, impedindo qualquer exposição no *frontend*.
- 🎨 **Interface UI/UX Minimalista:** Design responsivo em tons de roxo/violeta, estilizado com a tipografia *Plus Jakarta Sans*, cards estruturados e suporte a *feedback* visual de carregamento.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Função |
| :--- | :--- | :--- |
| **Frontend** | HTML5 / CSS3 / Vanilla JS | Interface de usuário limpa, sem frameworks pesados |
| **Hospedagem Web** | Cloudflare Pages | Entrega rápida da aplicação estática via CDN global |
| **Backend / Proxy** | Cloudflare Workers | Proxy seguro para lidar com CORS e requisições para a API |
| **Inteligência Artificial** | Google Gemini 3.6 Flash | Processamento e estruturação de respostas em formato JSON |

---

## 📁 Estrutura do Repositório

```text
godal/
├── script/app.js    # Scripts JavaScript de manipulação da DOM e chamadas ao Worker
├── src/index.js     # Código-fonte do Cloudflare Worker (Backend/Proxy)
├── style/style.css  # Folhas de estilo CSS do sistema visual (Purple Theme)
├── index.html       # Estrutura principal da interface gráfica
├── wrangler.toml    # Arquivo de configuração de ambiente e deploy do Wrangler
├── LICENSE          # Licença de uso do código
└── README.md        # Documentação completa do projeto
