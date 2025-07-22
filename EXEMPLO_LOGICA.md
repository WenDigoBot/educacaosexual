# Lógica de Feedback Implementada

## Como Funciona o Feedback

A lógica de feedback agora funciona da seguinte forma:

### Exemplo 1: Curiosidade VERDADEIRA
**Pergunta:** "O preservativo masculino tem 98% de eficácia quando usado corretamente."
**Resposta Correta:** `true` (Verdadeiro)

- Se o usuário clicar em **"Verdadeiro"** → Mostra **"CERTO!"** ✅
- Se o usuário clicar em **"Falso"** → Mostra **"ERRADO!"** ❌

### Exemplo 2: Curiosidade FALSA
**Pergunta:** "A pílula anticoncepcional protege contra todas as ISTs."
**Resposta Correta:** `false` (Falso)

- Se o usuário clicar em **"Falso"** → Mostra **"CERTO!"** ✅
- Se o usuário clicar em **"Verdadeiro"** → Mostra **"ERRADO!"** ❌

## Código da Lógica

```javascript
// No arquivo CuriosityCard.jsx
const handleAnswer = (answer) => {
  setUserAnswer(answer);
  
  // Verificar se a resposta está correta
  const correct = answer === curiosity.isTrue;
  setIsCorrect(correct);
  
  // Mostrar resultado imediatamente
  setShowResult(true);
  
  // Chamar callback para atualizar pontuação
  onAnswer(correct);
};
```

A variável `correct` será:
- `true` quando `answer` (escolha do usuário) for igual a `curiosity.isTrue` (resposta correta)
- `false` quando forem diferentes

## Feedback Visual

- **CERTO!** - Aparece em verde com ícone de check ✅
- **ERRADO!** - Aparece em vermelho com ícone de X ❌

Esta lógica garante que o feedback seja baseado na comparação direta entre a escolha do usuário e a resposta correta da curiosidade.

