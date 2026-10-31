/** Regras do formulário "Reportar um problema", usadas no navegador e no servidor. */
export const FEEDBACK_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 200 },
  message: { min: 10, max: 4000 },
} as const;

export type FeedbackInput = {
  name: string;
  email: string;
  message: string;
  page?: string;
  /** Campo invisível: se vier preenchido, quem enviou foi um robô. */
  website?: string;
};

export type FeedbackErrors = Partial<
  Record<'name' | 'email' | 'message', string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateFeedback(input: FeedbackInput): FeedbackErrors {
  const errors: FeedbackErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  if (name.length < FEEDBACK_LIMITS.name.min) errors.name = 'Informe seu nome.';
  else if (name.length > FEEDBACK_LIMITS.name.max)
    errors.name = 'O nome está muito longo.';
  if (!EMAIL_PATTERN.test(email) || email.length > FEEDBACK_LIMITS.email.max)
    errors.email = 'Informe um e-mail válido, para podermos responder.';
  if (message.length < FEEDBACK_LIMITS.message.min)
    errors.message =
      'Conte um pouco mais sobre o problema (pelo menos 10 letras).';
  else if (message.length > FEEDBACK_LIMITS.message.max)
    errors.message = `A descrição pode ter no máximo ${FEEDBACK_LIMITS.message.max} caracteres.`;
  return errors;
}
