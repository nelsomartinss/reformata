import { cn } from '@/lib/utils';

/**
 * Marca do Reformata: uma Bíblia dentro de uma janela de terminal.
 * A janela usa a cor do texto e os detalhes usam a cor de fundo, então a
 * marca se inverte sozinha entre os modos claro e escuro.
 */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0 text-foreground', className)}
    >
      <rect x="1" y="2.5" width="30" height="27" rx="5" fill="currentColor" />
      <g fill="var(--background)">
        <circle cx="6" cy="7" r="1.25" />
        <circle cx="10" cy="7" r="1.25" />
        <circle cx="14" cy="7" r="1.25" />
      </g>
      <g
        stroke="var(--background)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 15.5 8.5 18.75 5 22" strokeWidth="2" />
        <path
          d="M26.5 11.5H16.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10z"
          strokeWidth="1.8"
        />
        <path d="M14.5 24.5a2 2 0 0 1 2-2h10" strokeWidth="1.6" />
        <path d="M20.5 14v6.5M18 16.5h5" strokeWidth="1.6" />
      </g>
    </svg>
  );
}
