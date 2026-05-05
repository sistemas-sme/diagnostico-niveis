'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes } from 'react';

interface BotaoProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onDrag' | 'onDragEnd' | 'onDragStart' | 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop'
  > {
  variante?: 'primario' | 'secundario' | 'outline';
  tamanho?: 'sm' | 'md' | 'lg';
}

export default function Botao({
  children,
  variante = 'primario',
  tamanho = 'lg',
  className = '',
  disabled,
  ...props
}: BotaoProps) {
  const base =
    'group inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#030718] cursor-pointer select-none';

  const tamanhos = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-base w-full',
  };

  const variantes = {
    primario:
      'bg-gradient-to-r from-[#00c8be] to-[#008c88] text-black shadow-[0_0_30px_rgba(0,200,190,0.25)] focus:ring-[#00c8be]/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
    secundario:
      'bg-[#1535b0] text-white shadow-lg shadow-[#1535b0]/30 focus:ring-[#1535b0]/50 disabled:opacity-40 disabled:cursor-not-allowed',
    outline:
      'border border-white/15 bg-white/5 backdrop-blur text-white focus:ring-white/20 disabled:opacity-40 disabled:cursor-not-allowed',
  };

  const hoverVariants = {
    primario: 'hover:brightness-110 hover:scale-[1.01]',
    secundario: 'hover:bg-[#1a43d4]',
    outline: 'hover:bg-white/10',
  };

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      whileHover={disabled ? {} : { scale: variante === 'primario' ? 1.01 : 1.005 }}
      className={`${base} ${tamanhos[tamanho]} ${variantes[variante]} ${hoverVariants[variante]} ${className}`}
      disabled={disabled}
      onClick={props.onClick as React.MouseEventHandler<HTMLButtonElement>}
      type={props.type ?? 'button'}
    >
      {children}
    </motion.button>
  );
}
