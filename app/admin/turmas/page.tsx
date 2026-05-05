'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Turma {
  id: string;
  nome: string;
  codigo: string;
  created_at: string;
  respostas: { count: number }[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function TurmasPage() {
  const router = useRouter();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [novaNome, setNovaNome] = useState('');
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchTurmas = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/turmas');
    if (res.ok) {
      const data = await res.json();
      setTurmas(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTurmas();
  }, [fetchTurmas]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  }

  async function handleCriarTurma(e: React.FormEvent) {
    e.preventDefault();
    if (!novaNome.trim()) return;
    setCreating(true);
    setModalError('');

    const res = await fetch('/api/turmas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: novaNome.trim() }),
    });

    if (res.ok) {
      setNovaNome('');
      setShowModal(false);
      fetchTurmas();
    } else {
      const err = await res.json();
      setModalError(err.error ?? 'Erro ao criar turma');
    }
    setCreating(false);
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
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <span className="text-base font-black tracking-[0.25em] text-white/70">SME Admin</span>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-white/40 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 cursor-pointer"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="flex-1 w-full max-w-5xl mx-auto px-5 py-10">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Turmas</h1>
            <p className="text-sm text-white/40 mt-1">
              {loading ? '...' : `${turmas.length} ${turmas.length === 1 ? 'turma' : 'turmas'}`}
            </p>
          </div>
          <button
            onClick={() => { setShowModal(true); setModalError(''); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-[#00c8be] to-[#008c88] transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#00c8be]/50 cursor-pointer shrink-0"
            style={{ boxShadow: '0 0 20px rgba(0,200,190,0.2)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" /><path d="M5 12h14" />
            </svg>
            Nova Turma
          </button>
        </div>

        {/* Turmas grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/10 border-t-[#00c8be] rounded-full animate-spin" />
          </div>
        ) : turmas.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm">
            Nenhuma turma criada ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {turmas.map((turma) => {
              const count = turma.respostas?.[0]?.count ?? 0;
              return (
                <div
                  key={turma.id}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur p-5 flex flex-col gap-4 hover:border-white/[0.14] hover:bg-white/[0.06] transition-all duration-200"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                >
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-white leading-snug">{turma.nome}</h2>
                    <p className="text-xs font-mono text-white/40 mt-1">{turma.codigo}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>{count} {count === 1 ? 'respondente' : 'respondentes'}</span>
                    <span>{formatDate(turma.created_at)}</span>
                  </div>

                  <Link
                    href={`/admin/turmas/${turma.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00c8be] hover:text-[#7df0ec] transition-colors"
                  >
                    Ver detalhes
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Turma Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div
            className="relative w-full max-w-sm rounded-2xl border border-white/[0.10] bg-[#0d1224] p-7"
            style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)' }}
          >
            <h2 className="text-lg font-bold text-white mb-5">Nova Turma</h2>

            <form onSubmit={handleCriarTurma} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="nome-turma"
                  className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase"
                >
                  Nome da turma
                </label>
                <input
                  id="nome-turma"
                  type="text"
                  value={novaNome}
                  onChange={(e) => setNovaNome(e.target.value)}
                  placeholder="ex: Turma Janeiro 2025"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.05] text-white placeholder-white/[0.20] focus:outline-none focus:border-[#00c8be]/50 focus:ring-2 focus:ring-[#00c8be]/20 transition-all duration-200 text-sm"
                />
              </div>

              {modalError && (
                <p className="text-sm text-red-400">{modalError}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/60 border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating || !novaNome.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-[#00c8be] to-[#008c88] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {creating ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
