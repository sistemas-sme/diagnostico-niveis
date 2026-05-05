'use client';

import { motion } from 'framer-motion';
import { Alternativa as AlternativaType } from '@/lib/tipos';

interface AlternativaProps {
  alternativa: AlternativaType;
  selecionada: boolean;
  onSelecionar: (id: string, pontos: number) => void;
  index: number;
}

export default function Alternativa({
  alternativa,
  selecionada,
  onSelecionar,
  index,
}: AlternativaProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      onClick={() => onSelecionar(alternativa.id, alternativa.pontos)}
      className={`w-full text-left px-5 py-4 rounded-2xl border backdrop-blur-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00c8be]/40 cursor-pointer ${
        selecionada
          ? 'border-[#00c8be]/60 bg-[#00c8be]/[0.12] text-white shadow-[0_0_20px_rgba(0,200,190,0.12)]'
          : 'border-white/[0.08] bg-white/[0.03] text-white/65 hover:border-white/20 hover:bg-white/[0.07] hover:text-white'
      }`}
      style={{
        boxShadow: selecionada
          ? '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(0,200,190,0.15), 0 0 20px rgba(0,200,190,0.12)'
          : '0 8px 32px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.03)',
      }}
      role="radio"
      aria-checked={selecionada}
    >
      <div className="flex items-start gap-4">
        {/* Radio circle */}
        <div
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            selecionada
              ? 'border-[#00c8be] bg-[#00c8be]/20'
              : 'border-white/25'
          }`}
        >
          {selecionada && (
            <span className="w-2 h-2 rounded-full bg-[#00c8be]" />
          )}
        </div>

        {/* Text */}
        <span className="text-sm md:text-base leading-snug font-medium pt-0.5">
          {alternativa.texto}
        </span>
      </div>
    </motion.button>
  );
}
