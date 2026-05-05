export type Alternativa = {
  id: string;
  texto: string;
  pontos: 1 | 2 | 3 | 4 | 5;
};

export type Pergunta = {
  id: number;
  pergunta: string;
  alternativas: Alternativa[];
};

export type Resposta = {
  perguntaId: number;
  alternativaId: string;
  pontos: number;
};

export type Resultado = {
  nivel: 1 | 2 | 3 | 4 | 5;
  nome: "Visão" | "Drone" | "Escala" | "Equity" | "Jogo Infinito";
  total: number;
  frase: string;
};
