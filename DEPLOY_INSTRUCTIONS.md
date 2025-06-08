# Instruções para Deploy no Netlify com Firebase Firestore

## Pré-requisitos

1. **Conta no Firebase**: Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. **Conta no Netlify**: Acesse [netlify.com](https://netlify.com)

## Configuração do Firebase

### 1. Criar Projeto Firebase
1. Acesse o [Console do Firebase](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nome do projeto: `educacao-sexual-site` (ou outro nome de sua escolha)
4. Siga os passos de configuração

### 2. Configurar Firestore Database
1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Selecione uma localização próxima (ex: `southamerica-east1` para Brasil)

### 3. Configurar Service Account (Já feito)
As credenciais do Firebase já foram fornecidas. Você precisará configurá-las como variáveis de ambiente no Netlify.

## Deploy no Netlify

### Opção 1: Deploy via Drag & Drop (Mais Simples)

1. **Preparar os arquivos:**
   - Baixe todos os arquivos do projeto
   - Certifique-se de que a pasta `dist` foi gerada (comando `npm run build`)

2. **Upload no Netlify:**
   - Acesse [netlify.com](https://netlify.com) e faça login
   - Na página inicial, arraste a pasta do projeto inteira para a área "Want to deploy a new site without connecting to Git?"
   - Aguarde o upload e deploy automático

3. **Configurar Variáveis de Ambiente:**
   - No dashboard do site criado, vá para "Site settings"
   - Clique em "Environment variables"
   - Adicione as seguintes variáveis (uma por vez):

   ```
   FIREBASE_PROJECT_ID = educacao-sexual-site
   FIREBASE_PRIVATE_KEY_ID = ee324acb836721591afdcf6ef48374b1b88d0292
   FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----
MIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCyEXZbR9CmCd+p
Co4sHUeqEeINeHUUqzuD9DHOkQn06s9gcR5mplpGIY57BNBNR4pUwX7d8iuJYeoG
fi+eIpYKl13697ohQWm9xpLNpr96Vh23DwxAtPcVFl3ybyJ9WhL8lF/7/QZaTFhV
wMuzzdR8W/PihPyR75QL/QbxU757xUwgoYh9MAEhrJ2nX1hxctozyycreE9AGGB2
luWatn/MIKX5LbgjrgA1z3okrmULguWD8OEbXMFBC1Gp53fpniqwBy3JpfIJdO1a
oBvRVkkG6cUZ9s0KxKweBrDrw1l/SmxjsuP/hoy4AxwEVg7ZjOQya8trnJiCSohR
lH3wi6SpAgMBAAECgf8Ql5gM1bV6O3pQd2MOE+gIeDtvsqOp2GfkMVZgQu2hNt05
hhp6cfqmBg5xI2EUroHYo8Fo73Uryhch3I12L/t9poCiBXnDOYjUv05FglNDK9LG
yrposqM9ySQwTquFpphW+NDJ3Dyj1E908spKBmK1+FWVCT/cx9kCLK6VuI1eVC3E
EDWEUTFu4MCyMwgeQWNBdyVblHI96rtjxajXalc89kLgsAnmL/o48v1nm4xs5rYD
tWqDm7L1aDN2JU5JI4/74CE/yTlNNzZoS60ORpHOkGukm50QueOlqeC7UFXe3JM1
44G5jL0/nzrDjQoU+jxZNYmqUj79syyJuu6BF78CgYEA+BlCc/ZK/pqd6D6Kk6OV
6H/JbNJJbxN816DYO+kJ1FfCko42EjDtNXFR6s993u6tor1nPmlcD3JVCw9S9PBg
N1urivUObwh5uQ3ZA2FWnGjXpQ0je+M9U24ShydQndVOj9M0vE5oF6k5fGi9XRoE
NI3ZqUfPTJ8dLRexLhcvFfsCgYEAt70/J1J8SikIf0LH0ebIzaaL7/7684mkKER7
FN2OucdckfnVFAnzGSahjjXi/S+bmjvDlqieoSDTXzV7S/6pxRi6fQk3AsN5QGur
XuDtGiDp5oKBG2pBo+Vitr2Me9WAYQhh2NWvvjsCrIY+hKmfXWt8Dayn8vd7FM0Y
ltoEAqsCgYAzHREhzvY4aiZqOKhYLnWuBtW6w8A5UCyCSDMEdMh/pO0DQKVHLilQ
v13/IGxwR4AibR8eLpq22/lFZAzVRcis3wgCguZMXdSmGYJCPgWYB8mVyZUr6u8x
hxXuHl1vhwi+fOb6fLTZWxXq2bFZwwhmw2q6g37j7EwYhC8OrdwXjQKBgQCAKpdq
A4TFalgOBXRDO7voj/tfPrqotON4X0SH6oCLoMA251G197bGXYcmHvqmZ9YfwP6P
EjIM7UvkRvcprIuZ+8TiQVJJMDddM33H4hgiOMFP1MrgZ78/51tzY0cifmxdwy4V
xgEgLiOQWtgzS+rpjHdtRnmk5vLJMMOtPoi7nwKBgD6FpmZAVAKGZFqqqwp4edcD
h7oYRUZBdaKovz+qMj4nJ2NO33igHfcLC3CIXUVnIq9ne1QV3j0r9ufAa9zrnqJ9
AhTBQrMY+8/tHRRjz+DgXGCFMUEfGtki2Ju/3MBFN2nOZfYMhDhuxyHo0I1S4f8T
TOvzqd4wYRS+TDbKJxEE
-----END PRIVATE KEY-----
   FIREBASE_CLIENT_EMAIL = firebase-adminsdk-fbsvc@educacao-sexual-site.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID = 107105664565696865132
   FIREBASE_CLIENT_X509_CERT_URL = https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40educacao-sexual-site.iam.gserviceaccount.com
   ```

4. **Redeployar:**
   - Vá para "Deploys"
   - Clique em "Trigger deploy" > "Deploy site"

### Opção 2: Deploy via Git (Recomendado para atualizações futuras)

1. **Conectar ao Git:**
   - Suba o projeto para um repositório GitHub
   - No Netlify, clique em "New site from Git"
   - Conecte sua conta GitHub e selecione o repositório

2. **Configurar Build:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

3. **Configurar Variáveis de Ambiente:**
   - Antes de fazer o deploy, vá para "Site settings" > "Environment variables"
   - Adicione todas as variáveis do Firebase listadas acima

4. **Deploy:**
   - Clique em "Deploy site"

## Funcionalidades Implementadas

### ✅ Curiosidades Atualizadas
- 8 novas curiosidades sobre saúde sexual
- Textos de verdade/mito com revelações personalizadas

### ✅ Ícones Flutuantes Melhorados
- Ícones maiores e mais visíveis
- Flutuação por toda a tela
- Melhor opacidade e animação

### ✅ Textos Aumentados
- Texto de introdução maior na página inicial
- Textos finais com tamanho aumentado

### ✅ Favicon Personalizado
- Favicon customizado com a imagem fornecida

### ✅ Backend Completo
- Netlify Functions para persistência
- Firebase Firestore para armazenamento
- Proteção por senha (6453)

### ✅ Sistema de Autenticação
- Tela de login para acesso ao painel admin
- Verificação de senha para todas as operações
- Proteção contra acesso não autorizado

## Testando o Site

1. **Acesso público:** Qualquer pessoa pode ver as curiosidades
2. **Painel admin:** Clique no ícone de configurações e digite a senha `6453`
3. **Adicionar curiosidades:** Use o painel para adicionar novas curiosidades
4. **Editar/Excluir:** Todas as operações exigem a senha de confirmação

## Suporte

Se houver problemas:
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme se o Firebase Firestore está ativo
3. Verifique os logs do Netlify em "Functions" > "View logs"

O site está pronto para uso em produção! 🚀

