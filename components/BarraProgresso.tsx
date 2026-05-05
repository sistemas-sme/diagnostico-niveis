'use client';

import { motion } from 'framer-motion';

interface BarraProgressoProps {
  atual: number;
  total: number;
}

export default function BarraProgresso({ atual, total }: BarraProgressoProps) {
  const progresso = (atual / total) * 100;

  return (
    <div
      className="w-full h-0.5 bg-white/[0.08]"
      role="progressbar"
      aria-valuenow={atual}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Pergunta ${atual} de ${total}`}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-[#00c8be] to-[#7df0ec]"
        initial={{ width: 0 }}
        animate={{ width: `${progresso}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}
