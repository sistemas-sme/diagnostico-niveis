'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    nome: '',
    empresa: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleStart() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sme_lead', JSON.stringify(form));
      sessionStorage.removeItem('sme_respostas');
      sessionStorage.removeItem('sme_shuffled');

      // Store turma codigo if present in URL
      const turma = searchParams.get('turma');
      if (turma) {
        sessionStorage.setItem('sme_turma_codigo', turma);
      } else {
        sessionStorage.removeItem('sme_turma_codigo');
      }
    }

    const turma = searchParams.get('turma');
    router.push(turma ? `/quiz?turma=${turma}` : '/quiz');
  }

  return (
    <main className="relative flex flex-col flex-1 items-center justify-center min-h-screen px-5 py-16 overflow-hidden">

      {/* Background layer */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Deep dark base */}
        <div className="absolute inset-0 bg-[#030718]" />
        {/* Blue glow top-center */}
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#1535b0]/20 blur-[150px]" />
        {/* Teal glow bottom-right */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#00c8be]/[0.06] blur-[120px]" />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full max-w-lg mx-auto flex flex-col gap-10">

        {/* Top badge */}
        <motion.div {...fadeUp(0)} className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.10] bg-white/[0.04] backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c8be] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">
              SME · The New Economy
            </span>
          </div>
        </motion.div>

        {/* Hero headline */}
        <motion.div {...fadeUp(0.1)} className="text-center space-y-4">
          <p className="text-[10px] font-bold tracking-[0.3em] text-[#00c8be] uppercase">
            Em qual nível você está?
          </p>

          <h1 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">
            <span className="block text-white">Consciência</span>
            <span className="block bg-gradient-to-r from-[#7df0ec] via-[#00c8be] to-[#008c88] bg-clip-text text-transparent">
              Empresarial
            </span>
          </h1>

          <p className="text-sm md:text-base text-white/50 font-medium">
            Diagnóstico rápido. 10 perguntas. 5 minutos.
          </p>
        </motion.div>

        {/* Lead form */}
        <motion.div {...fadeUp(0.2)}>
          <div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-6 md:p-7"
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          >
            {/* 2-column grid on md, single col on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'nome', label: 'Nome', placeholder: 'Seu nome completo', type: 'text', autoComplete: 'name' },
                { name: 'empresa', label: 'Empresa', placeholder: 'Nome da empresa', type: 'text', autoComplete: 'organization' },
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={field.name}
                    className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    autoComplete={field.autoComplete}
                    className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.05] text-white placeholder-white/[0.20] focus:outline-none focus:border-[#00c8be]/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-[#00c8be]/20 transition-all duration-200 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0.3)} className="space-y-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01, filter: 'brightness(1.1)' }}
            onClick={handleStart}
            className="group w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg text-black bg-gradient-to-r from-[#00c8be] to-[#008c88] focus:outline-none focus:ring-2 focus:ring-[#00c8be]/50 focus:ring-offset-2 focus:ring-offset-[#030718] transition-all duration-200 cursor-pointer"
            style={{ boxShadow: '0 0 30px rgba(0,200,190,0.25)' }}
          >
            Começar diagnóstico
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </motion.button>

          <p className="text-center text-xs text-white/20 font-medium">
            Sem custo · Sem cadastro obrigatório
          </p>
        </motion.div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen bg-[#030718]">
          <div className="w-10 h-10 border-2 border-white/10 border-t-[#00c8be] rounded-full animate-spin" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
