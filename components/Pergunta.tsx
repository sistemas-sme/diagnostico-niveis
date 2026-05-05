'use client';

import { motion } from 'framer-motion';
import { Pergunta as PerguntaType } from '@/lib/tipos';
import Alternativa from './Alternativa';

interface PerguntaProps {
  pergunta: PerguntaType;
  alternativasEmbaralhadas: PerguntaType['alternativas'];
  alternativaSelecionada: string | null;
  onSelecionar: (id: string, pontos: number) => void;
}

export default function Pergunta({
  pergunta,
  alternativasEmbaralhadas,
  alternativaSelecionada,
  onSelecionar,
}: PerguntaProps) {
  const numeroFormatado = String(pergunta.id).padStart(2, '0');

  return (
    <motion.div
      key={pergunta.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="space-y-5"
    >
      {/* Question number + text */}
      <div className="relative mb-7">
        {/* Giant muted number behind */}
        <span
          className="absolute -top-6 left-0 text-[6rem] font-black leading-none text-white/[0.07] select-none pointer-events-none"
          aria-hidden="true"
        >
          {numeroFormatado}
        </span>

        {/* Question text */}
        <h2 className="relative text-xl md:text-2xl font-bold text-white leading-snug pt-10">
          {pergunta.pergunta}
        </h2>
      </div>

      {/* Alternatives */}
      <div
        className="space-y-3"
        role="radiogroup"
        aria-label={pergunta.pergunta}
      >
        {alternativasEmbaralhadas.map((alt, index) => (
          <Alternativa
            key={alt.id}
            alternativa={alt}
            selecionada={alternativaSelecionada === alt.id}
            onSelecionar={onSelecionar}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}
