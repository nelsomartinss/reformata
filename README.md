# Reformata

**A fé reformada em seus textos.** Um leitor web, simples e direto, dos principais
documentos da tradição reformada, com as passagens bíblicas sempre à mão.

Feito para qualquer pessoa: sem cadastro, sem termos técnicos e com navegação
pensada para quem nunca leu um catecismo.

## O que dá para fazer

- **Ler** o Catecismo Maior, o Breve Catecismo e a Confissão de Fé de Westminster,
  pergunta por pergunta ou parágrafo por parágrafo, com índice e botões
  Anterior/Próxima.
- **Ver as provas bíblicas** de cada resposta, com o texto completo dos versículos.
- **Ler a Bíblia inteira** (66 livros) e descobrir onde cada versículo é citado
  nos documentos.
- **Ler as 95 Teses** de Martinho Lutero.
- **Buscar** em todos os textos de uma vez (atalho: tecla `/`).
- **Copiar** o link ou o texto com a referência para compartilhar.
- **Reportar um problema** pelo botão no canto da tela.
- **Modo claro e escuro**, seguindo automaticamente o tema do aparelho.

## Tecnologias

[Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript ·
Tailwind CSS 4 · componentes [Base UI](https://base-ui.com)/shadcn ·
ícones [Lucide](https://lucide.dev) · lint e formatação com oxlint/oxfmt.

O texto bíblico (Bíblia Livre) fica no próprio repositório, em JSON: o site não
depende de nenhuma API externa para exibir as Escrituras.

## Como rodar

Requisitos: **Node.js 22.13 ou mais recente** e npm.

```bash
git clone https://github.com/nelsomartinss/reformata.git
cd reformata
npm install
cp .env.example .env.local   # opcional, veja abaixo
npm run dev
```

Abra http://localhost:3000.

### Variáveis de ambiente

Todas são opcionais para rodar o site localmente. Coloque-as em `.env.local`
(esse arquivo é ignorado pelo Git — nunca commite chaves).

| Variável | Para que serve |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Endereço público do site, usado no mapa do site e nos metadados. |
| `RESEND_API_KEY` | Chave do [Resend](https://resend.com) para enviar as mensagens do formulário "Reportar um problema". |
| `FEEDBACK_TO` | E-mail que recebe essas mensagens. |
| `FEEDBACK_FROM` | Remetente das mensagens (padrão: `Reformata <onboarding@resend.dev>`). |

Sem `RESEND_API_KEY` e `FEEDBACK_TO`, o formulário avisa que o envio não está
disponível; o resto do site funciona normalmente.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento. |
| `npm run build` / `npm start` | Build de produção e servidor de produção. |
| `npm run lint` | Verificação de código (oxlint, com checagem de tipos). |
| `npm run format` | Formatação (oxfmt). |
| `npm run validate:content` | Confere a estrutura dos documentos (números, perguntas, referências). |
| `npm run test:references` | Confere que todas as 3.784 referências bíblicas abrem o texto certo na Bíblia Livre. |

Scripts de manutenção:

- `node scripts/import-biblia-livre.mjs <porbr2018_vpl.txt>` — reimporta a Bíblia
  Livre a partir do arquivo do eBible.org.
- `node scripts/audit-references.mjs <fontes> <saída>` — refaz a auditoria das
  referências bíblicas contra as provas de Westminster (instruções no topo do
  arquivo).

## Estrutura

```
app/                rotas (páginas e API) do Next.js
  api/              busca, passagens bíblicas e formulário de problemas
components/         interface (cabeçalho, leitores, painéis, busca…)
content/            textos dos documentos e da Bíblia Livre (ver content/README.md)
docs/auditoria/     relatório da auditoria das referências bíblicas
lib/                regras de negócio: leitura de referências, busca, tema…
scripts/            importação, validação e testes do conteúdo
```

## Contribuindo

Encontrou um erro num texto ou numa referência bíblica? Use o botão
"Reportar um problema" no site ou abra uma *issue* aqui, informando o documento,
a pergunta ou parágrafo e, se possível, a edição em que conferiu.

Para mudanças no código, abra um *pull request*. Antes, rode:

```bash
npm run lint && npm run validate:content && npm run test:references && npm run build
```

## Licença

O **código** do Reformata está sob a licença [MIT](LICENSE).

Os **textos** não estão cobertos pela licença MIT:

- **Bíblia Livre (BLIVRE)** — Copyright © Diego Santos, Mario Sérgio e Marco
  Teles, 2018, sob a licença
  [Creative Commons Atribuição 4.0 Brasil](https://creativecommons.org/licenses/by/4.0/deed.pt-br).
  Veja [`content/biblia-livre/LICENCA.md`](content/biblia-livre/LICENCA.md).
- **Documentos de Westminster e 95 Teses** — os originais (1517 e 1647) estão em
  domínio público; os direitos das traduções em português usadas aqui estão
  descritos em [`content/README.md`](content/README.md).
- **Imagem** `public/95-teses-pintura.webp` — pintura histórica usada apenas
  como ilustração.

---

Feito por [Nelson Martins](https://nelsondev-blue.vercel.app/pt) com ☕ e ✳️.
