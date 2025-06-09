const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Responder a requisições OPTIONS (preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  // Apenas aceitar requisições POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    // Verificar se as variáveis de ambiente estão configuradas
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER;
    const githubRepo = process.env.GITHUB_REPO;

    if (!githubToken || !githubOwner || !githubRepo) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "Variáveis de ambiente não configuradas",
          details: "GITHUB_TOKEN, GITHUB_OWNER e GITHUB_REPO são obrigatórias"
        })
      };
    }

    // Parsear os dados recebidos
    const { curiosities, password } = JSON.parse(event.body);

    // Verificar senha (mesma senha do frontend)
    if (password !== "admin123") {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Senha incorreta" })
      };
    }

    // Verificar se as curiosidades foram enviadas
    if (!curiosities || !Array.isArray(curiosities)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Dados de curiosidades inválidos" })
      };
    }

    // Inicializar cliente do GitHub
    const octokit = new Octokit({
      auth: githubToken,
    });

    // Caminho do arquivo no repositório
    const filePath = "src/data/curiosities.json";

    // Obter o SHA do arquivo atual (necessário para atualizar)
    let currentSha;
    try {
      const { data: currentFile } = await octokit.rest.repos.getContent({
        owner: githubOwner,
        repo: githubRepo,
        path: filePath,
      });
      currentSha = currentFile.sha;
    } catch (error) {
      // Se o arquivo não existir, currentSha será undefined
      if (error.status !== 404) {
        throw error;
      }
    }

    // Preparar o conteúdo do arquivo
    const fileContent = JSON.stringify(curiosities, null, 2);
    const encodedContent = Buffer.from(fileContent).toString('base64');

    // Criar ou atualizar o arquivo no GitHub
    const commitMessage = `Atualizar curiosidades - ${new Date().toLocaleString('pt-BR')}`;
    
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: githubOwner,
      repo: githubRepo,
      path: filePath,
      message: commitMessage,
      content: encodedContent,
      sha: currentSha, // Incluir SHA apenas se o arquivo já existir
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: "Curiosidades atualizadas no GitHub com sucesso!",
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error("Erro na função update-github:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Erro interno do servidor",
        details: error.message 
      })
    };
  }
};

