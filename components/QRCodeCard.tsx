'use client';

import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeCardProps {
  url: string;
}

export default function QRCodeCard({ url }: QRCodeCardProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownloadQR() {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode-turma.svg';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-6"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
    >
      <h2 className="text-base font-bold text-white mb-4">Link desta turma</h2>

      {/* URL input + copy */}
      <div className="flex gap-2 mb-6">
        <input
          readOnly
          value={url}
          className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.05] text-white/70 text-sm font-mono focus:outline-none focus:border-[#00c8be]/40 transition-all"
        />
        <button
          onClick={handleCopy}
          className="shrink-0 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 hover:border-[#00c8be]/40 transition-all cursor-pointer"
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>

      {/* QR Code */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div
          ref={qrRef}
          className="bg-white p-3 rounded-xl shrink-0"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
        >
          <QRCodeSVG
            value={url}
            size={180}
            bgColor="#ffffff"
            fgColor="#0a0f24"
            level="M"
          />
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <p className="text-sm text-white/50 leading-relaxed">
            Compartilhe este QR code com os participantes da turma. Ao escanear, eles serão direcionados diretamente para o diagnóstico.
          </p>
          <button
            onClick={handleDownloadQR}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 hover:border-[#00c8be]/40 transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Baixar QR
          </button>
        </div>
      </div>
    </div>
  );
}
