'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  CircleCheck,
  LoaderCircle,
  MessageSquareWarning,
  Send,
  X,
} from 'lucide-react';
import Notice from '@/components/notice';
import {
  FEEDBACK_LIMITS,
  validateFeedback,
  type FeedbackErrors,
} from '@/lib/feedback';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const fieldClass =
  'w-full rounded-md border bg-background px-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/25 aria-invalid:border-destructive';

const serverMessages: Record<string, string> = {
  MUITOS_ENVIOS:
    'Você enviou várias mensagens seguidas. Aguarde alguns minutos e tente de novo.',
  ENVIO_NAO_CONFIGURADO:
    'O envio de mensagens ainda não está disponível. Tente novamente mais tarde.',
};

export default function FeedbackWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    website: '',
  });
  const [errors, setErrors] = useState<FeedbackErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const ids = { name: useId(), email: useId(), message: useId() };

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  // Ao abrir (ou ao voltar para o formulário depois de enviar), leva o cursor
  // ao primeiro campo. Não roda de novo em caso de erro, para não tirar o
  // cursor de onde a pessoa está.
  const showingForm = open && status !== 'sent';
  useEffect(() => {
    if (showingForm) firstFieldRef.current?.focus();
  }, [showingForm]);

  // Esc e clique fora fecham.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (status === 'sending') return;
      if (rootRef.current && !rootRef.current.contains(event.target as Node))
        setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, status]);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (field in errors)
      setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function submit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const nextErrors = validateFeedback(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStatus('sending');
    setErrorMessage('');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, page: pathname }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        errors?: FeedbackErrors;
      };
      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        setErrorMessage(
          serverMessages[data.error ?? ''] ??
            'Não foi possível enviar agora. Verifique sua conexão e tente novamente.',
        );
        setStatus('error');
        return;
      }
      setStatus('sent');
      setForm({ name: form.name, email: form.email, message: '', website: '' });
    } catch {
      setErrorMessage(
        'Não foi possível enviar agora. Verifique sua conexão e tente novamente.',
      );
      setStatus('error');
    }
  }

  const sending = status === 'sending';

  return (
    <div
      ref={rootRef}
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-40 sm:right-6 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
    >
      {open && (
        <dialog
          open
          aria-labelledby={titleId}
          className="absolute right-0 bottom-16 left-auto m-0 w-[min(22rem,calc(100vw-2rem))] p-0 overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-xl"
        >
          <header className="flex items-center justify-between gap-3 border-b border-border bg-subtle px-4 py-2.5">
            <h2 id={titleId} className="text-sm font-semibold">
              Reportar um problema
            </h2>
            <button
              type="button"
              onClick={close}
              className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              aria-label="Fechar"
            >
              <X className="size-4" />
            </button>
          </header>

          {status === 'sent' ? (
            <div className="space-y-3 p-4 text-sm">
              <p className="flex items-start gap-2">
                <CircleCheck
                  className="mt-0.5 size-4 shrink-0 text-link"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold">Obrigado!</strong> Sua
                  mensagem foi enviada. Se precisarmos de mais detalhes,
                  responderemos no seu e-mail.
                </span>
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="h-8 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-accent"
                >
                  Enviar outra
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="h-8 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-3 p-4">
              <p className="text-xs leading-5 text-muted-foreground">
                Encontrou um erro num texto, num versículo ou no site? Conte
                para nós. A página que você está vendo é enviada junto.
              </p>

              <div className="space-y-1">
                <label htmlFor={ids.name} className="text-xs font-semibold">
                  Nome
                </label>
                <input
                  ref={firstFieldRef}
                  id={ids.name}
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  autoComplete="name"
                  maxLength={FEEDBACK_LIMITS.name.max}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? `${ids.name}-erro` : undefined
                  }
                  className={cn(
                    fieldClass,
                    'h-9',
                    errors.name ? 'border-destructive' : 'border-input',
                  )}
                />
                {errors.name && (
                  <p
                    id={`${ids.name}-erro`}
                    className="text-xs text-danger-foreground"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor={ids.email} className="text-xs font-semibold">
                  E-mail
                </label>
                <input
                  id={ids.email}
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  maxLength={FEEDBACK_LIMITS.email.max}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? `${ids.email}-erro` : undefined
                  }
                  className={cn(
                    fieldClass,
                    'h-9',
                    errors.email ? 'border-destructive' : 'border-input',
                  )}
                />
                {errors.email && (
                  <p
                    id={`${ids.email}-erro`}
                    className="text-xs text-danger-foreground"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor={ids.message} className="text-xs font-semibold">
                  Descrição do problema
                </label>
                <textarea
                  id={ids.message}
                  value={form.message}
                  onChange={(event) => update('message', event.target.value)}
                  rows={4}
                  maxLength={FEEDBACK_LIMITS.message.max}
                  placeholder="Ex.: na pergunta 12, a referência Is 45:6 abre o versículo errado."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? `${ids.message}-erro` : undefined
                  }
                  className={cn(
                    fieldClass,
                    'resize-y py-2 leading-5',
                    errors.message ? 'border-destructive' : 'border-input',
                  )}
                />
                {errors.message && (
                  <p
                    id={`${ids.message}-erro`}
                    className="text-xs text-danger-foreground"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Armadilha para robôs: invisível para pessoas. */}
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px overflow-hidden"
              >
                <label>
                  Site
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(event) => update('website', event.target.value)}
                  />
                </label>
              </div>

              {status === 'error' && (
                <Notice tone="danger" className="px-3 py-2 text-xs leading-5">
                  {errorMessage}
                </Notice>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={close}
                  className="h-8 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-accent"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  aria-disabled={sending}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 aria-disabled:cursor-wait aria-disabled:opacity-60"
                >
                  {sending ? (
                    <LoaderCircle
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Send className="size-4" aria-hidden="true" />
                  )}
                  {sending ? 'Enviando…' : 'Enviar'}
                </button>
              </div>
            </form>
          )}
        </dialog>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={
          open ? 'Fechar formulário de problemas' : 'Reportar um problema'
        }
        title="Reportar um problema"
        className={cn(
          'grid size-12 place-items-center rounded-full border shadow-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          open
            ? 'border-border bg-background text-foreground hover:bg-accent'
            : 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        )}
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <MessageSquareWarning className="size-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
