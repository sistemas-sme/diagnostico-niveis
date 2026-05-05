import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: turma, error: turmaError } = await supabase
    .from('turmas')
    .select('*')
    .eq('id', id)
    .single();

  if (turmaError) {
    return NextResponse.json({ error: turmaError.message }, { status: 404 });
  }

  const { data: respostas, error: respostasError } = await supabase
    .from('respostas')
    .select('*')
    .eq('turma_id', id)
    .order('created_at', { ascending: false });

  if (respostasError) {
    return NextResponse.json({ error: respostasError.message }, { status: 500 });
  }

  // Compute stats per nivel
  const statsMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  (respostas ?? []).forEach((r) => {
    if (r.nivel >= 1 && r.nivel <= 5) statsMap[r.nivel]++;
  });

  const total = respostas?.length ?? 0;
  const stats = [1, 2, 3, 4, 5].map((nivel) => ({
    nivel,
    count: statsMap[nivel],
    percent: total > 0 ? Math.round((statsMap[nivel] / total) * 100) : 0,
  }));

  return NextResponse.json({ turma, respostas: respostas ?? [], stats });
}
