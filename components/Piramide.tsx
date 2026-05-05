'use client';

import { motion } from 'framer-motion';

interface PiramideProps {
  nivelAtual: 1 | 2 | 3 | 4 | 5;
}

const NIVEIS = [
  { nivel: 5, nome: 'Jogo Infinito' },
  { nivel: 4, nome: 'Equity' },
  { nivel: 3, nome: 'Escala' },
  { nivel: 2, nome: 'Drone' },
  { nivel: 1, nome: 'Visão' },
];

// Pyramid geometry
const LAYER_H = 51;
const GAP = 3;
const LAYERS = 5;
const TOTAL_H = LAYERS * LAYER_H + (LAYERS - 1) * GAP; // 267

// SVG canvas
const VW = 310;
const VH = TOTAL_H + 4;

// Pyramid shape
const CX = 104;      // horizontal center
const APEX_W = 16;   // width at apex
const BASE_W = 192;  // width at base

// Right-side label layout
const LINE_END_X = 218;
const LABEL_X = 225;

function wAt(y: number) {
  return APEX_W + (BASE_W - APEX_W) * (y / TOTAL_H);
}

function getLayer(index: number) {
  const y1 = index * (LAYER_H + GAP);
  const y2 = y1 + LAYER_H;
  const midY = (y1 + y2) / 2;
  const w1 = wAt(y1);
  const w2 = wAt(y2);
  return {
    points: `${CX - w1 / 2},${y1} ${CX + w1 / 2},${y1} ${CX + w2 / 2},${y2} ${CX - w2 / 2},${y2}`,
    midY,
    rightEdge: CX + wAt(midY) / 2,
    leftEdge: CX - wAt(midY) / 2,
  };
}

export default function Piramide({ nivelAtual }: PiramideProps) {
  return (
    <div className="flex items-center justify-center w-full">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full max-w-[300px] md:max-w-[340px]"
        aria-label={`Pirâmide de consciência empresarial. Nível atual: ${nivelAtual}`}
        role="img"
      >
        <defs>
          <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7df0ec" />
            <stop offset="55%" stopColor="#00c8be" />
            <stop offset="100%" stopColor="#008c88" />
          </linearGradient>
          <linearGradient id="inactiveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
          <filter id="tealGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {NIVEIS.map((item, index) => {
          const layer = getLayer(index);
          const isActive = item.nivel === nivelAtual;
          const delay = (LAYERS - 1 - index) * 0.07; // bottom layers animate first

          return (
            <g key={item.nivel}>

              {/* ── Pyramid layer ── */}
              <motion.polygon
                points={layer.points}
                fill={isActive ? 'url(#tealGrad)' : 'url(#inactiveGrad)'}
                stroke={isActive ? 'rgba(0,200,190,0.55)' : 'rgba(255,255,255,0.09)'}
                strokeWidth={isActive ? 1 : 0.75}
                filter={isActive ? 'url(#tealGlow)' : undefined}
                initial={{ opacity: 0, scaleY: 0.4 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: `${CX}px ${layer.midY}px` }}
              />

              {/* ── Left: N1–N5 label ── */}
              <motion.text
                x={layer.leftEdge - 7}
                y={layer.midY + 3.5}
                textAnchor="end"
                fontSize="7.5"
                fontWeight="700"
                letterSpacing="0.06em"
                fill={isActive ? 'rgba(0,210,200,0.75)' : 'rgba(255,255,255,0.20)'}
                style={{ userSelect: 'none' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.28, duration: 0.3 }}
              >
                N{item.nivel}
              </motion.text>

              {/* ── Right: connector line from layer edge to label ── */}
              <motion.line
                x1={layer.rightEdge + 5}
                y1={layer.midY}
                x2={LINE_END_X}
                y2={layer.midY}
                stroke={isActive ? 'rgba(0,200,190,0.45)' : 'rgba(255,255,255,0.10)'}
                strokeWidth="0.75"
                strokeDasharray={isActive ? 'none' : '2 2'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.3, duration: 0.35 }}
              />

              {/* ── Right: small dot at line end ── */}
              <motion.circle
                cx={LINE_END_X}
                cy={layer.midY}
                r={isActive ? 2.5 : 1.8}
                fill={isActive ? '#00c8be' : 'rgba(255,255,255,0.18)'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.38, duration: 0.2 }}
              />

              {/* ── Right: level name ── */}
              <motion.text
                x={LABEL_X}
                y={layer.midY + 4}
                textAnchor="start"
                fontSize={isActive ? '11' : '10'}
                fontWeight={isActive ? '700' : '400'}
                fill={isActive ? '#00c8be' : 'rgba(255,255,255,0.40)'}
                style={{ userSelect: 'none' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.32, duration: 0.35 }}
              >
                {item.nome}
              </motion.text>

            </g>
          );
        })}
      </svg>
    </div>
  );
}
