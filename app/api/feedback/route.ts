import { NextResponse } from 'next/server';
import { validateFeedback, type FeedbackInput } from '@/lib/feedback';

// Remetente padrão do Resend; troque por um endereço do seu domínio quando verificá-lo.
const DEFAULT_SENDER = 'Reformata <onboarding@resend.dev>';

// Limite simples por endereço IP: 5 mensagens a cada 10 minutos.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recentByIp = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (recentByIp.get(ip) ?? []).filter(
    (time) => now - time < WINDOW_MS,
  );
  if (recent.length >= MAX_PER_WINDOW) {
    recentByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentByIp.set(ip, recent);
  return false;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function sanitizePage(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.startsWith('/') ? value.slice(0, 300) : '';
}

export async function POST(request: Request) {
  let body: Partial<FeedbackInput>;
  try {
    body = (await request.json()) as Partial<FeedbackInput>;
  } catch {
    return NextResponse.json({ error: 'PEDIDO_INVALIDO' }, { status: 400 });
  }

  const input: FeedbackInput = {
    name: String(body.name ?? ''),
    email: String(body.email ?? ''),
    message: String(body.message ?? ''),
    page: sanitizePage(body.page),
    website: String(body.website ?? ''),
  };

  // Robôs costumam preencher o campo invisível: finge sucesso e descarta.
  if (input.website) return NextResponse.json({ ok: true });

  const errors = validateFeedback(input);
  if (Object.keys(errors).length > 0)
    return NextResponse.json(
      { error: 'DADOS_INVALIDOS', errors },
      { status: 422 },
    );

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (isRateLimited(ip))
    return NextResponse.json({ error: 'MUITOS_ENVIOS' }, { status: 429 });

  // O destino fica só na configuração do servidor, nunca no código.
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = process.env.FEEDBACK_TO?.trim();
  if (!apiKey || !recipient) {
    console.error(
      '[feedback] RESEND_API_KEY ou FEEDBACK_TO não configurada; mensagem não enviada.',
    );
    return NextResponse.json(
      { error: 'ENVIO_NAO_CONFIGURADO' },
      { status: 503 },
    );
  }

  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const page = input.page || '(não informada)';
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const sentAt = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });

  const text = [
    `Nome: ${name}`,
    `E-mail: ${email}`,
    `Página: ${site}${page}`,
    `Enviado em: ${sentAt}`,
    '',
    message,
  ].join('\n');
  const html = `<p><strong>Nome:</strong> ${escapeHtml(name)}<br><strong>E-mail:</strong> ${escapeHtml(email)}<br><strong>Página:</strong> ${escapeHtml(site + page)}<br><strong>Enviado em:</strong> ${escapeHtml(sentAt)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FEEDBACK_FROM?.trim() || DEFAULT_SENDER,
        to: [recipient],
        reply_to: email,
        subject: `[Reformata] Problema relatado por ${name.slice(0, 60)}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(
        '[feedback] Resend respondeu',
        response.status,
        await response.text(),
      );
      return NextResponse.json({ error: 'FALHA_NO_ENVIO' }, { status: 502 });
    }
  } catch (error) {
    console.error('[feedback] falha ao enviar', error);
    return NextResponse.json({ error: 'FALHA_NO_ENVIO' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
