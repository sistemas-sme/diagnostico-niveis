'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import perguntas from '@/lib/perguntas';
import { calcularNivel } from '@/lib/calcularNivel';
import { Resposta, Pergunta } from '@/lib/tipos';
import BarraProgresso from '@/components/BarraProgresso';
import PerguntaComp from '@/components/Pergunta';

// Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const LOADING_MESSAGES = [
  'Analisando suas respostas...',
  'Calculando seu nível...',
  'Preparando seu diagnóstico...',
];

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [alternativaSelecionada, setAlternativaSelecionada] = useState<string | null>(null);
  const [shuffledPerguntas, setShuffledPerguntas] = useState<
    (Pergunta & { alternativasEmbaralhadas: Pergunta['alternativas'] })[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  // Store turma codigo from URL into sessionStorage
  useEffect(() => {
    const turma = searchParams.get('turma');
    if (turma && typeof window !== 'undefined') {
      sessionStorage.setItem('sme_turma_codigo', turma);
    }
  }, [searchParams]);

  useEffect(() => {
    const stored = sessionStorage.getItem('sme_shuffled');
    if (stored) {
      setShuffledPerguntas(JSON.parse(stored));
    } else {
      const shuffled = perguntas.map((p) => ({
        ...p,
        alternativasEmbaralhadas: shuffleArray(p.alternativas),
      }));
      sessionStorage.setItem('sme_shuffled', JSON.stringify(shuffled));
      setShuffledPerguntas(shuffled);
    }

    const storedRespostas = sessionStorage.getItem('sme_respostas');
    if (storedRespostas) {
      const parsed: Resposta[] = JSON.parse(storedRespostas);
      setRespostas(parsed);
      setCurrentIndex(Math.min(parsed.length, perguntas.length - 1));
    }
  }, []);

  useEffect(() => {
    if (respostas.length > 0) {
      sessionStorage.setItem('sme_respostas', JSON.stringify(respostas));
    }
  }, [respostas]);

  useEffect(() => {
    if (shuffledPerguntas.length === 0) return;
    const perguntaAtual = shuffledPerguntas[currentIndex];
    if (!perguntaAtual) return;
    const resposta = respostas.find((r) => r.perguntaId === perguntaAtual.id);
    setAlternativaSelecionada(resposta ? resposta.alternativaId : null);
  }, [currentIndex, shuffledPerguntas, respostas]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 800);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSelecionar = useCallback(
    (id: string, pontos: number) => {
      if (!shuffledPerguntas[currentIndex]) return;
      setAlternativaSelecionada(id);
      setRespostas((prev) => {
        const perguntaId = shuffledPerguntas[currentIndex].id;
        const filtered = prev.filter((r) => r.perguntaId !== perguntaId);
        return [...filtered, { perguntaId, alternativaId: id, pontos }];
      });
    },
    [currentIndex, shuffledPerguntas]
  );

  const handleProxima = useCallback(async () => {
    if (!alternativaSelecionada) return;

    const isLast = currentIndex === perguntas.length - 1;

    if (isLast) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const resultado = calcularNivel(respostas);

      // Save result to DB
      try {
        const lead = JSON.parse(sessionStorage.getItem('sme_lead') ?? '{}');
        const turma_codigo = sessionStorage.getItem('sme_turma_codigo') ?? undefined;
        await fetch('/api/respostas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            turma_codigo,
            nome: lead.nome ?? null,
            empresa: lead.empresa ?? null,
            email: lead.email ?? null,
            whatsapp: lead.whatsapp ?? null,
            nivel: resultado.nivel,
            pontos: resultado.total,
          }),
        });
      } catch {
        // Non-blocking: fail silently
      }

      router.push(`/resultado?nivel=${resultado.nivel}`);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [alternativaSelecionada, currentIndex, respostas, router]);

  const handleVoltar = useCallback(() => {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  // Initial loading (shuffling)
  if (shuffledPerguntas.length === 0) {
    return (
      <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen">
        {/* Background */}
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
    );
  }

  // Loading screen after last question
  if (isLoading) {
    return (
      <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[#030718]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1535b0]/25 blur-[130px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-10"
        >
          {/* Spinner with glow */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-[#00c8be]/10 blur-2xl animate-pulse" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="relative w-16 h-16 border-2 border-white/10 border-t-[#00c8be] rounded-full"
            />
          </div>

          {/* Rotating messages */}
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingMsgIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="text-xl font-bold text-white"
            >
              {LOADING_MESSAGES[loadingMsgIndex]}
            </motion.p>
          </AnimatePresence>

          <p className="text-sm text-white/25">Um momento...</p>
        </motion.div>
      </div>
    );
  }

  const perguntaAtual = shuffledPerguntas[currentIndex];

  return (
    <main className="relative flex flex-col flex-1 min-h-screen overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#030718]" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#1535b0]/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[#00c8be]/[0.06] blur-[100px]" />
      </div>

      {/* Full-width progress bar — flush at very top */}
      <BarraProgresso atual={currentIndex + 1} total={perguntas.length} />

      {/* Header row */}
      <div className="w-full max-w-lg mx-auto px-5 pt-5 pb-2 flex items-center justify-between">
        <span className="text-sm font-black tracking-[0.25em] text-white/40">SME</span>
        <span className="text-sm font-semibold text-white/30 tabular-nums">
          {String(currentIndex + 1).padStart(2, '0')} / {perguntas.length}
        </span>
      </div>

      {/* Question area */}
      <div className="w-full max-w-lg mx-auto flex flex-col flex-1 px-5 pb-8 gap-8">
        <div className="flex-1 pt-4">
          <AnimatePresence mode="wait">
            <PerguntaComp
              key={perguntaAtual.id}
              pergunta={perguntaAtual}
              alternativasEmbaralhadas={perguntaAtual.alternativasEmbaralhadas}
              alternativaSelecionada={alternativaSelecionada}
              onSelecionar={handleSelecionar}
            />
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <motion.button
            whileTap={!alternativaSelecionada ? {} : { scale: 0.97 }}
            whileHover={!alternativaSelecionada ? {} : { scale: 1.01, filter: 'brightness(1.08)' }}
            onClick={handleProxima}
            disabled={!alternativaSelecionada}
            className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-black bg-gradient-to-r from-[#00c8be] to-[#008c88] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00c8be]/50 focus:ring-offset-2 focus:ring-offset-[#030718] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            style={{ boxShadow: alternativaSelecionada ? '0 0 30px rgba(0,200,190,0.25)' : 'none' }}
          >
            {currentIndex === perguntas.length - 1 ? 'Ver meu resultado' : 'Próxima'}
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
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </motion.button>

          {currentIndex > 0 && (
            <button
              onClick={handleVoltar}
              className="w-full text-center text-sm text-white/25 hover:text-white/60 transition-colors py-2 focus:outline-none cursor-pointer"
            >
              ← Voltar
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen">
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[#030718]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#1535b0]/20 blur-[120px]" />
          </div>
          <div className="w-10 h-10 border-2 border-white/10 border-t-[#00c8be] rounded-full animate-spin" />
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
