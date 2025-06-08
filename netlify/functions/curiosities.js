const admin = require("firebase-admin");

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  console.log("Firebase Private Key (processed):"); // Log para depuração
  console.log(privateKey ? privateKey.substring(0, 50) + "..." : "Not found");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: privateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
      authUri: "https://accounts.google.com/o/oauth2/auth",
      tokenUri: "https://oauth2.googleapis.com/token",
      authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
      clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL
    })
  });
}

const db = admin.firestore();
const COLLECTION_NAME = "curiosities";
// const ADMIN_PASSWORD = "6453"; // Removido

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };

  // Responder a requisições OPTIONS (preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  try {
    const method = event.httpMethod;
    const path = event.path;

    switch (method) {
      case "GET":
        // Buscar todas as curiosidades
        const snapshot = await db.collection(COLLECTION_NAME).orderBy("createdAt", "asc").get();
        const curiosities = [];
        snapshot.forEach(doc => {
          curiosities.push({
            id: doc.id,
            ...doc.data()
          });
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(curiosities)
        };

      case "POST":
        // Adicionar nova curiosidade
        const newData = JSON.parse(event.body);
        
        // // Verificar senha - REMOVIDO
        // if (newData.password !== ADMIN_PASSWORD) {
        //   return {
        //     statusCode: 401,
        //     headers,
        //     body: JSON.stringify({ error: "Senha incorreta" })
        //   };
        // }

        // // Remover a senha dos dados antes de salvar - REMOVIDO
        // const { password, ...curiosityData } = newData;
        const curiosityData = newData; // Usar todos os dados recebidos
        
        // Adicionar timestamp
        curiosityData.createdAt = admin.firestore.FieldValue.serverTimestamp();
        curiosityData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

        const docRef = await db.collection(COLLECTION_NAME).add(curiosityData);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ 
            id: docRef.id, 
            ...curiosityData,
            message: "Curiosidade adicionada com sucesso" 
          })
        };

      case "PUT":
        // Atualizar curiosidade existente
        const updateData = JSON.parse(event.body);
        const curiosityId = event.queryStringParameters?.id;

        if (!curiosityId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "ID da curiosidade é obrigatório" })
          };
        }

        // // Verificar senha - REMOVIDO
        // if (updateData.password !== ADMIN_PASSWORD) {
        //   return {
        //     statusCode: 401,
        //     headers,
        //     body: JSON.stringify({ error: "Senha incorreta" })
        //   };
        // }

        // // Remover a senha dos dados antes de salvar - REMOVIDO
        // const { password: updatePassword, ...updateCuriosityData } = updateData;
        const updateCuriosityData = updateData; // Usar todos os dados recebidos
        
        // Adicionar timestamp de atualização
        updateCuriosityData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

        await db.collection(COLLECTION_NAME).doc(curiosityId).update(updateCuriosityData);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            id: curiosityId,
            ...updateCuriosityData,
            message: "Curiosidade atualizada com sucesso" 
          })
        };

      case "DELETE":
        // Deletar curiosidade
        const deleteId = event.queryStringParameters?.id;
        // const deletePassword = event.queryStringParameters?.password; // REMOVIDO

        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "ID da curiosidade é obrigatório" })
          };
        }

        // // Verificar senha - REMOVIDO
        // if (deletePassword !== ADMIN_PASSWORD) {
        //   return {
        //     statusCode: 401,
        //     headers,
        //     body: JSON.stringify({ error: "Senha incorreta" })
        //   };
        // }

        await db.collection(COLLECTION_NAME).doc(deleteId).delete();
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: "Curiosidade deletada com sucesso" })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: "Método não permitido" })
        };
    }

  } catch (error) {
    console.error("Erro na função:", error);
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


