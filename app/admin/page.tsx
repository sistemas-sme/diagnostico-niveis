'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin/turmas');
      } else {
        setError('Senha incorreta');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex flex-col flex-1 items-center justify-center min-h-screen px-5 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#030718]" />
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#1535b0]/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#00c8be]/[0.06] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col gap-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <span className="text-3xl font-black tracking-[0.3em] text-white">SME</span>
          <div className="h-px w-12 bg-gradient-to-r from-[#00c8be] to-[#008c88] mx-auto" />
          <p className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">Painel Admin</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-7"
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.05] text-white placeholder-white/[0.20] focus:outline-none focus:border-[#00c8be]/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-[#00c8be]/20 transition-all duration-200 text-sm"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 font-medium text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base text-black bg-gradient-to-r from-[#00c8be] to-[#008c88] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00c8be]/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ boxShadow: '0 0 24px rgba(0,200,190,0.2)' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
