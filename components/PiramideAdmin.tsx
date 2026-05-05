'use client';

interface PiramideAdminProps {
  stats: { nivel: number; count: number; percent: number }[];
}

const NIVEIS = [
  { nivel: 5, nome: 'Jogo Infinito' },
  { nivel: 4, nome: 'Equity' },
  { nivel: 3, nome: 'Escala' },
  { nivel: 2, nome: 'Drone' },
  { nivel: 1, nome: 'Visão' },
];

// Pyramid geometry (same as Piramide.tsx)
const LAYER_H = 51;
const GAP = 3;
const LAYERS = 5;
const TOTAL_H = LAYERS * LAYER_H + (LAYERS - 1) * GAP; // 267

const VW = 400;
const VH = TOTAL_H + 4;

const CX = 110;
const APEX_W = 16;
const BASE_W = 200;

const LINE_END_X = 234;
const LABEL_X = 241;

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

export default function PiramideAdmin({ stats }: PiramideAdminProps) {
  const maxCount = Math.max(...stats.map((s) => s.count), 0);

  const getStatForNivel = (nivel: number) =>
    stats.find((s) => s.nivel === nivel) ?? { nivel, count: 0, percent: 0 };

  return (
    <div className="flex items-center justify-center w-full">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full max-w-[380px] md:max-w-[440px]"
        aria-label="Pirâmide de consciência empresarial com estatísticas por nível"
        role="img"
      >
        <defs>
          <linearGradient id="adminTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7df0ec" />
            <stop offset="55%" stopColor="#00c8be" />
            <stop offset="100%" stopColor="#008c88" />
          </linearGradient>
          <linearGradient id="adminInactiveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
          <filter id="adminTealGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {NIVEIS.map((item, index) => {
          const layer = getLayer(index);
          const stat = getStatForNivel(item.nivel);
          const isMostPopular = maxCount > 0 && stat.count === maxCount;
          const hasResponses = stat.count > 0;

          let fill: string;
          let stroke: string;
          let filterProp: string | undefined;

          if (isMostPopular) {
            fill = 'url(#adminTealGrad)';
            stroke = 'rgba(0,200,190,0.55)';
            filterProp = 'url(#adminTealGlow)';
          } else if (hasResponses) {
            fill = 'rgba(0,200,190,0.15)';
            stroke = 'rgba(0,200,190,0.35)';
            filterProp = undefined;
          } else {
            fill = 'url(#adminInactiveGrad)';
            stroke = 'rgba(255,255,255,0.09)';
            filterProp = undefined;
          }

          let labelFill: string;
          if (isMostPopular) {
            labelFill = '#00c8be';
          } else if (hasResponses) {
            labelFill = 'rgba(255,255,255,0.50)';
          } else {
            labelFill = 'rgba(255,255,255,0.20)';
          }

          const lineStroke = isMostPopular
            ? 'rgba(0,200,190,0.45)'
            : hasResponses
            ? 'rgba(0,200,190,0.20)'
            : 'rgba(255,255,255,0.10)';

          const dotFill = isMostPopular
            ? '#00c8be'
            : hasResponses
            ? 'rgba(0,200,190,0.40)'
            : 'rgba(255,255,255,0.18)';

          const countLabel = `${stat.count} · ${stat.percent}%`;

          return (
            <g key={item.nivel}>
              {/* Pyramid layer */}
              <polygon
                points={layer.points}
                fill={fill}
                stroke={stroke}
                strokeWidth={isMostPopular ? 1 : 0.75}
                filter={filterProp}
              />

              {/* Left: N1–N5 label */}
              <text
                x={layer.leftEdge - 7}
                y={layer.midY + 3.5}
                textAnchor="end"
                fontSize="7.5"
                fontWeight="700"
                letterSpacing="0.06em"
                fill={isMostPopular ? 'rgba(0,210,200,0.75)' : 'rgba(255,255,255,0.20)'}
                style={{ userSelect: 'none' }}
              >
                N{item.nivel}
              </text>

              {/* Right: connector line */}
              <line
                x1={layer.rightEdge + 5}
                y1={layer.midY}
                x2={LINE_END_X}
                y2={layer.midY}
                stroke={lineStroke}
                strokeWidth="0.75"
                strokeDasharray={isMostPopular ? 'none' : '2 2'}
              />

              {/* Right: dot at line end */}
              <circle
                cx={LINE_END_X}
                cy={layer.midY}
                r={isMostPopular ? 2.5 : 1.8}
                fill={dotFill}
              />

              {/* Right: count · percent (line 1, destaque) */}
              <text
                x={LABEL_X}
                y={layer.midY - 3}
                textAnchor="start"
                fontSize={isMostPopular ? '11' : '10'}
                fontWeight={isMostPopular ? '800' : '600'}
                fill={labelFill}
                style={{ userSelect: 'none' }}
              >
                {countLabel}
              </text>

              {/* Right: level name (line 2, discreto) */}
              <text
                x={LABEL_X}
                y={layer.midY + 10}
                textAnchor="start"
                fontSize="7.5"
                fontWeight="400"
                fill={isMostPopular ? 'rgba(0,200,190,0.50)' : 'rgba(255,255,255,0.20)'}
                style={{ userSelect: 'none' }}
              >
                {item.nome}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
