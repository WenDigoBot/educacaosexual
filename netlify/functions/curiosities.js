const admin = require("firebase-admin");

// Decodifica a chave privada Base64
// Garante que a chave privada seja interpretada corretamente com as quebras de linha
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();
const COLLECTION_NAME = "curiosities";

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };

  // Responder a requisições OPTIONS (preflight)
  if (event.httpMethod === "OPTIONS" ) {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  try {
    const method = event.httpMethod;
    const path = event.path;

    switch (method ) {
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
        const curiosityData = newData; 
        
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

        const updateCuriosityData = updateData; 
        
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

        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "ID da curiosidade é obrigatório" })
          };
        }

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
          body: "Method Not Allowed",
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
