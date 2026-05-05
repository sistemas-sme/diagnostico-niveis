import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { turma_codigo, nome, empresa, email, whatsapp, nivel, pontos } = body;

  let turma_id: string | null = null;

  if (turma_codigo) {
    const { data: turma } = await supabase
      .from('turmas')
      .select('id')
      .eq('codigo', turma_codigo)
      .single();
    turma_id = turma?.id ?? null;
  }

  const { data, error } = await supabase
    .from('respostas')
    .insert({
      turma_id,
      nome: nome ?? null,
      empresa: empresa ?? null,
      email: email ?? null,
      whatsapp: whatsapp ?? null,
      nivel: nivel ?? null,
      pontos: pontos ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
