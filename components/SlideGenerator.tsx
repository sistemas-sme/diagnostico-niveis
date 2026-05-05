'use client';

import { useState } from 'react';

interface SlideGeneratorProps {
  turma: { nome: string; codigo: string };
  stats: { nivel: number; count: number; percent: number }[];
}

const NIVEL_NOMES: Record<number, string> = {
  5: 'Jogo Infinito',
  4: 'Equity',
  3: 'Escala',
  2: 'Drone',
  1: 'Visão',
};

const NIVEIS_ORDER = [5, 4, 3, 2, 1];

function drawSlide(
  canvas: HTMLCanvasElement,
  turmaName: string,
  stats: { nivel: number; count: number; percent: number }[]
) {
  const W = 1920;
  const H = 1080;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d')!;
  const maxCount = Math.max(...stats.map((s) => s.count), 0);

  // ── Background ────────────────────────────────────────────────
  ctx.fillStyle = '#030718';
  ctx.fillRect(0, 0, W, H);

  const glow1 = ctx.createRadialGradient(500, 320, 0, 500, 320, 900);
  glow1.addColorStop(0, 'rgba(21,53,176,0.28)');
  glow1.addColorStop(1, 'rgba(3,7,24,0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, W, H);

  const glow2 = ctx.createRadialGradient(1720, 980, 0, 1720, 980, 600);
  glow2.addColorStop(0, 'rgba(0,200,190,0.07)');
  glow2.addColorStop(1, 'rgba(3,7,24,0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // ── SME logo ─────────────────────────────────────────────────
  ctx.font = '900 40px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.textAlign = 'left';
  ctx.fillText('SME', 90, 108);

  ctx.fillStyle = '#00c8be';
  ctx.fillRect(90, 118, 78, 2);

  ctx.font = '600 15px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillText('THE NEW ECONOMY', 90, 144);

  // ── Turma name (top center) ───────────────────────────────────
  ctx.font = 'bold 56px sans-serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(turmaName, W / 2, 108);

  // Teal underline
  const nameW = ctx.measureText(turmaName).width;
  ctx.fillStyle = '#00c8be';
  ctx.fillRect(W / 2 - nameW / 2, 120, nameW, 2);

  // ── PYRAMID (left side, centered at x=500) ───────────────────
  const CX = 500;
  const PY_TOP = 190;
  const LAYER_H = 132;
  const GAP = 10;
  const APEX_W = 70;
  const BASE_W = 580;
  const TOTAL_PY_H = 5 * LAYER_H + 4 * GAP; // 700

  function wAt(relY: number) {
    return APEX_W + (BASE_W - APEX_W) * (relY / TOTAL_PY_H);
  }

  NIVEIS_ORDER.forEach((nivel, index) => {
    const stat = stats.find((s) => s.nivel === nivel) ?? { nivel, count: 0, percent: 0 };
    const isMostPopular = maxCount > 0 && stat.count === maxCount;
    const hasData = stat.count > 0;

    const relY1 = index * (LAYER_H + GAP);
    const relY2 = relY1 + LAYER_H;
    const y1 = PY_TOP + relY1;
    const y2 = PY_TOP + relY2;
    const w1 = wAt(relY1);
    const w2 = wAt(relY2);
    const midRelY = (relY1 + relY2) / 2;
    const midY = (y1 + y2) / 2;
    const wMid = wAt(midRelY);

    // Trapezoid fill
    ctx.beginPath();
    ctx.moveTo(CX - w1 / 2, y1);
    ctx.lineTo(CX + w1 / 2, y1);
    ctx.lineTo(CX + w2 / 2, y2);
    ctx.lineTo(CX - w2 / 2, y2);
    ctx.closePath();

    if (isMostPopular) {
      const grad = ctx.createLinearGradient(CX - w2 / 2, y1, CX + w2 / 2, y2);
      grad.addColorStop(0, '#7df0ec');
      grad.addColorStop(0.55, '#00c8be');
      grad.addColorStop(1, '#008c88');
      ctx.fillStyle = grad;
    } else if (hasData) {
      ctx.fillStyle = 'rgba(0,200,190,0.18)';
    } else {
      const grad = ctx.createLinearGradient(CX, y1, CX, y2);
      grad.addColorStop(0, 'rgba(255,255,255,0.07)');
      grad.addColorStop(1, 'rgba(255,255,255,0.02)');
      ctx.fillStyle = grad;
    }
    ctx.fill();

    // Stroke
    ctx.strokeStyle = isMostPopular
      ? 'rgba(0,200,190,0.55)'
      : 'rgba(255,255,255,0.09)';
    ctx.lineWidth = isMostPopular ? 2 : 1;
    ctx.stroke();

    // N label left of pyramid
    const leftEdge = CX - wMid / 2;
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = isMostPopular
      ? 'rgba(0,210,200,0.8)'
      : 'rgba(255,255,255,0.22)';
    ctx.textAlign = 'right';
    ctx.fillText(`N${nivel}`, leftEdge - 14, midY + 7);
  });

  // ── RIGHT SIDE stats ──────────────────────────────────────────
  const SX = 920;   // stats column x start
  const SY = 190;   // stats column y start
  const ROW_H = (5 * LAYER_H + 4 * GAP) / 5; // same row height as pyramid layers

  // Section label
  ctx.font = '500 24px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.textAlign = 'left';
  ctx.fillText('Distribuição por nível', SX, SY - 30);

  // Divider
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.fillRect(SX, SY - 12, 960, 1);

  const total = stats.reduce((acc, s) => acc + s.count, 0);

  NIVEIS_ORDER.forEach((nivel, index) => {
    const stat = stats.find((s) => s.nivel === nivel) ?? { nivel, count: 0, percent: 0 };
    const isMostPopular = maxCount > 0 && stat.count === maxCount;
    const hasData = stat.count > 0;

    const rowY = SY + index * (LAYER_H + GAP) + ROW_H / 2;

    // N badge
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = isMostPopular
      ? 'rgba(0,210,200,0.8)'
      : 'rgba(255,255,255,0.25)';
    ctx.textAlign = 'left';
    ctx.fillText(`N${nivel}`, SX, rowY - 16);

    // Level name
    ctx.font = `${isMostPopular ? '700' : '400'} 28px sans-serif`;
    ctx.fillStyle = isMostPopular ? 'white' : 'rgba(255,255,255,0.45)';
    ctx.fillText(NIVEL_NOMES[nivel], SX + 60, rowY - 16);

    // Count (big)
    ctx.font = `900 80px sans-serif`;
    ctx.fillStyle = isMostPopular
      ? '#00c8be'
      : hasData
      ? 'rgba(255,255,255,0.50)'
      : 'rgba(255,255,255,0.12)';
    ctx.textAlign = 'right';
    ctx.fillText(String(stat.count), SX + 760, rowY + 28);

    // Percent
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = isMostPopular
      ? 'rgba(0,200,190,0.75)'
      : 'rgba(255,255,255,0.22)';
    ctx.fillText(`${stat.percent}%`, SX + 960, rowY + 28);

    // Row divider
    if (index < 4) {
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(SX, rowY + 56, 960, 1);
    }
  });

  // Total respondentes
  ctx.font = '500 20px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.textAlign = 'right';
  ctx.fillText(`${total} respondente${total !== 1 ? 's' : ''}`, SX + 960, SY + TOTAL_PY_H + 36);

  // ── Bottom bar ────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(0, H - 56, W, 1);

  ctx.font = '400 18px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.textAlign = 'center';
  ctx.fillText(
    'SME · The New Economy · Diagnóstico de Consciência Empresarial',
    W / 2,
    H - 22
  );
}

export default function SlideGenerator({ turma, stats }: SlideGeneratorProps) {
  const [generating, setGenerating] = useState<'real' | 'padrao' | null>(null);

  function handleGenerate(isDefault: boolean) {
    const type = isDefault ? 'padrao' : 'real';
    setGenerating(type);

    // Use requestAnimationFrame to not block the UI
    requestAnimationFrame(() => {
      const canvas = document.createElement('canvas');
      const displayStats = isDefault
        ? NIVEIS_ORDER.map((n) => ({ nivel: n, count: 0, percent: 0 }))
        : stats;
      const displayName = isDefault ? 'Imagem Padrão' : turma.nome;

      drawSlide(canvas, displayName, displayStats);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `slide-${type}-${turma.codigo}.png`;
          a.click();
          setGenerating(null);
        },
        'image/png'
      );
    });
  }

  return (
    <div
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-6"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Gerar imagem para slide</h2>
          <p className="text-xs text-white/35 mt-0.5">Exporta PNG 1920×1080 (16:9) com a distribuição da turma</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleGenerate(false)}
            disabled={!!generating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-[#00c8be] to-[#008c88] shadow-[0_0_20px_rgba(0,200,190,0.2)] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {generating === 'real' ? 'Gerando...' : 'Imagem Real'}
          </button>

          <button
            onClick={() => handleGenerate(true)}
            disabled={!!generating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white border border-white/15 bg-white/5 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {generating === 'padrao' ? 'Gerando...' : 'Imagem Padrão'}
          </button>
        </div>
      </div>

      <p className="text-xs text-white/20 italic">
        A <span className="text-white/40 font-medium">Imagem Real</span> usa os dados atuais da turma.
        A <span className="text-white/40 font-medium">Imagem Padrão</span> usa conteúdo fixo — defina com o admin quando necessário.
      </p>
    </div>
  );
}
