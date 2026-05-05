import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function randomChars(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function GET() {
  const { data: turmas, error } = await supabase
    .from('turmas')
    .select('*, respostas(count)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(turmas);
}

export async function POST(request: NextRequest) {
  const { nome } = await request.json();

  if (!nome || typeof nome !== 'string') {
    return NextResponse.json({ error: 'Nome is required' }, { status: 400 });
  }

  const slug = slugify(nome);
  const codigo = `${slug}-${randomChars(4)}`;

  const { data, error } = await supabase
    .from('turmas')
    .insert({ nome: nome.trim(), codigo })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
