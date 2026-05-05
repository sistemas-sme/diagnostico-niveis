'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PiramideAdmin from '@/components/PiramideAdmin';
import QRCodeCard from '@/components/QRCodeCard';
import SlideGenerator from '@/components/SlideGenerator';

interface Turma {
  id: string;
  nome: string;
  codigo: string;
  created_at: string;
}

interface Resposta {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  whatsapp: string;
  nivel: number;
  pontos: number;
  created_at: string;
}

interface NivelStat {
  nivel: number;
  count: number;
  percent: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function TurmaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [turma, setTurma] = useState<Turma | null>(null);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [stats, setStats] = useState<NivelStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/turmas/${id}`);
    if (res.ok) {
      const data = await res.json();
      setTurma(data.turma);
      setRespostas(data.respostas);
      setStats(data.stats);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  }

  async function handleDeleteResposta(respostaId: string) {
    if (!confirm('Tem certeza que deseja excluir esta resposta?')) return;
    const res = await fetch(`/api/respostas/${respostaId}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  }

  const nivelMedio =
    respostas.length > 0
      ? (respostas.reduce((sum, r) => sum + r.nivel, 0) / respostas.length).toFixed(1)
      : '–';

  const nivelMaisFrequente = (() => {
    if (respostas.length === 0) return '–';
    const counts: Record<number, number> = {};
    respostas.forEach((r) => { counts[r.nivel] = (counts[r.nivel] ?? 0) + 1; });
    return String(Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '–');
  })();

  const quizUrl = turma ? `${origin}/?turma=${turma.codigo}` : '';

  if (loading) {
    return (
      <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen bg-[#030718]">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#00c8be] rounded-full animate-spin" />
      </div>
    );
  }

  if (!turma) {
    return (
      <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen bg-[#030718]">
        <p className="text-white/40">Turma não encontrada.</p>
        <Link href="/admin/turmas" className="mt-4 text-[#00c8be] text-sm">← Voltar</Link>
      </div>
    );
  }

  return (
    <main className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#030718]" />
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#1535b0]/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#00c8be]/[0.06] blur-[120px]" />
      </div>

      {/* Top bar */}
      <header className="w-full border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/turmas"
              className="text-sm font-semibold text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Turmas
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-sm font-bold text-white/70">SME Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-white/40 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 cursor-pointer"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="flex-1 w-full max-w-5xl mx-auto px-5 py-10 flex flex-col gap-8">
        {/* Turma header */}
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-white">{turma.nome}</h1>
            <span className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.05] text-xs font-mono text-white/50">
              {turma.codigo}
            </span>
          </div>
          <p className="text-sm text-white/40">Criada em {formatDate(turma.created_at)}</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total respondentes', value: String(respostas.length) },
            { label: 'Nível médio', value: nivelMedio },
            { label: 'Nível mais frequente', value: nivelMaisFrequente },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur p-5"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
            >
              <p className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase mb-2">
                {card.label}
              </p>
              <p className="text-3xl font-black text-white">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Pyramid section */}
        <div
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-6"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <h2 className="text-base font-bold text-white mb-5">Distribuição por nível</h2>
          <PiramideAdmin stats={stats} />
        </div>

        {/* Slide generator */}
        <SlideGenerator turma={turma} stats={stats} />

        {/* QR + Link section */}
        {origin && <QRCodeCard url={quizUrl} />}

        {/* Participants table */}
        <div
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl overflow-hidden"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h2 className="text-base font-bold text-white">
              Participantes
              <span className="ml-2 text-xs font-normal text-white/40">({respostas.length})</span>
            </h2>
          </div>

          {respostas.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-white/30">
              Nenhum respondente ainda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Nome', 'Empresa', 'Nível', 'Data', ''].map((col) => (
                      <th
                        key={col}
                        className="text-left px-6 py-3 text-[10px] font-bold tracking-[0.12em] text-white/30 uppercase"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {respostas.map((r) => (
                    <tr key={r.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3 text-white/70 font-medium">{r.nome || '–'}</td>
                      <td className="px-6 py-3 text-white/60">{r.empresa || '–'}</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#00c8be]/10 border border-[#00c8be]/20 text-[#00c8be] font-bold text-xs">
                          {r.nivel}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-white/40">{formatDate(r.created_at)}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeleteResposta(r.id)}
                          className="text-white/20 hover:text-red-400 transition-colors cursor-pointer"
                          title="Excluir resposta"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
