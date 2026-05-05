import { Resposta, Resultado } from "./tipos";

const frases: Record<number, string> = {
  1: "Você está jogando o jogo de 90% dos empresários brasileiros. É hora de subir.",
  2: "Você acendeu os primeiros fósforos do quarto escuro. Bom começo.",
  3: "Você entendeu: distribuição come produção no café da manhã.",
  4: "Você joga o jogo dos grandes. Negocia pelo valor futuro.",
  5: "Você está entre os 2%. Joga o jogo infinito.",
};

export function calcularNivel(respostas: Resposta[]): Resultado {
  const total = respostas.reduce((acc, r) => acc + r.pontos, 0);

  let nivel: 1 | 2 | 3 | 4 | 5;
  let nome: Resultado["nome"];

  if (total <= 15) {
    nivel = 1;
    nome = "Visão";
  } else if (total <= 22) {
    nivel = 2;
    nome = "Inevitável";
  } else if (total <= 32) {
    nivel = 3;
    nome = "Escala";
  } else if (total <= 42) {
    nivel = 4;
    nome = "Equity";
  } else {
    nivel = 5;
    nome = "Jogo Infinito";
  }

  return {
    nivel,
    nome,
    total,
    frase: frases[nivel],
  };
}
