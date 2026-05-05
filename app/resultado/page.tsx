'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import Piramide from '@/components/Piramide';

const NIVEL_INFO: Record<number, { nome: string; frase: string }> = {
  1: {
    nome: 'Visão',
    frase: 'Você está jogando o jogo de 90% dos empresários brasileiros. É hora de subir.',
  },
  2: {
    nome: 'Drone',
    frase: 'Você acendeu os primeiros fósforos do quarto escuro. Bom começo.',
  },
  3: {
    nome: 'Escala',
    frase: 'Você entendeu: distribuição come produção no café da manhã.',
  },
  4: {
    nome: 'Equity',
    frase: 'Você joga o jogo dos grandes. Negocia pelo valor futuro.',
  },
  5: {
    nome: 'Jogo Infinito',
    frase: 'Você está entre os 2%. Joga o jogo infinito.',
  },
};

const CTA_URL = process.env.NEXT_PUBLIC_CTA_URL || '#';

const fadeUp = (delay: number, duration = 0.5) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

function ResultadoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nivelParam = searchParams.get('nivel');
  const nivel = nivelParam
    ? (Math.min(5, Math.max(1, parseInt(nivelParam, 10))) as 1 | 2 | 3 | 4 | 5)
    : 1;
  const info = NIVEL_INFO[nivel] ?? NIVEL_INFO[1];

  function handleShare() {
    const url = `${window.location.origin}/resultado?nivel=${nivel}`;
    const text = `Fiz o diagnóstico SME e estou no Nível ${nivel} — ${info.nome}! "${info.frase}" Faça o seu:`;

    if (navigator.share) {
      navigator.share({ title: 'Diagnóstico SME', text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${url}`).then(() => {
        alert('Link copiado para a área de transferência!');
      });
    }
  }

  function handleReiniciar() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sme_respostas');
      sessionStorage.removeItem('sme_shuffled');
      sessionStorage.removeItem('sme_lead');
    }
    router.push('/');
  }

  return (
    <main className="relative flex flex-col flex-1 min-h-screen px-5 py-12 overflow-hidden">

      {/* Background layer */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#030718]" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#1535b0]/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#00c8be]/[0.06] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col gap-8">

        {/* Logo */}
        <motion.div
          {...fadeUp(0, 0.4)}
          className="text-center"
        >
          <span className="text-xl font-black tracking-[0.3em] text-white/50">SME</span>
          <div className="mt-1.5 h-px w-10 bg-gradient-to-r from-[#00c8be] to-[#008c88] mx-auto" />
        </motion.div>

        {/* Result hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4"
        >
          {/* Teal badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c8be]/30 bg-[#00c8be]/[0.10]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c8be]" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#00c8be] uppercase">
                Seu Resultado
              </span>
            </div>
          </div>

          {/* NÍVEL label */}
          <p className="text-sm font-bold tracking-[0.3em] text-white/40 uppercase">Nível</p>

          {/* Giant level number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-[8rem] md:text-[10rem] font-black leading-none bg-gradient-to-br from-[#7df0ec] via-[#00c8be] to-[#008c88] bg-clip-text text-transparent"
            style={{ lineHeight: 0.9 }}
          >
            {nivel}
          </motion.div>

          {/* Level name */}
          <motion.h2
            {...fadeUp(0.4)}
            className="text-2xl font-bold text-white/80"
          >
            {info.nome}
          </motion.h2>
        </motion.div>

        {/* Identity phrase glass card */}
        <motion.div {...fadeUp(0.5)}>
          <div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl px-7 py-6"
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          >
            <p className="text-base md:text-lg text-white/75 font-medium text-center leading-relaxed italic">
              &ldquo;{info.frase}&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Pyramid glass card */}
        <motion.div {...fadeUp(0.6)}>
          <div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl px-5 py-7"
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          >
            <Piramide nivelAtual={nivel} />
          </div>
        </motion.div>

        {/* CTA section */}
        <motion.div {...fadeUp(0.75)} className="space-y-3">
          <p className="text-center text-sm text-white/40 font-medium">
            Pronto para subir de nível?
          </p>

          {/* Primary CTA */}
          <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="block">
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01, filter: 'brightness(1.08)' }}
              className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-black bg-gradient-to-r from-[#00c8be] to-[#008c88] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00c8be]/50 cursor-pointer"
              style={{ boxShadow: '0 0 30px rgba(0,200,190,0.25)' }}
            >
              Quero participar
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:rotate-45"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </motion.button>
          </a>

          {/* Share button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.005 }}
            onClick={handleShare}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white border border-white/15 bg-white/[0.05] backdrop-blur hover:bg-white/[0.10] transition-all duration-200 focus:outline-none cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Compartilhar resultado
          </motion.button>

          {/* Restart link */}
          <button
            onClick={handleReiniciar}
            className="w-full text-center text-xs text-white/20 hover:text-white/50 transition-colors py-2 focus:outline-none cursor-pointer"
          >
            Refazer o diagnóstico
          </button>
        </motion.div>
      </div>
    </main>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen">
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[#030718]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#1535b0]/20 blur-[120px]" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-2 border-white/10 border-t-[#00c8be] rounded-full"
          />
        </div>
      }
    >
      <ResultadoContent />
    </Suspense>
  );
}
