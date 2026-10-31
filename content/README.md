# Conteúdo editorial

| Arquivo | Conteúdo | Origem |
|---|---|---|
| `catecismo-maior.json` | 196 perguntas e respostas do Catecismo Maior de Westminster, com referências bíblicas | Transcrição estruturada de uma fonte HTML pública |
| `breve-catecismo.json` | 107 perguntas e respostas do Breve Catecismo de Westminster | PDF editorial fornecido ao projeto |
| `confissao-de-fe.json` | 35 capítulos e 179 parágrafos da Confissão de Fé de Westminster (incluindo os capítulos 34 e 35, acrescentados em 1903) e a nota histórica | PDF editorial fornecido ao projeto |
| `95-teses.json` | As 95 Teses de Martinho Lutero (1517) | Tradução em português de origem não registrada |
| `biblia-livre/` | Texto completo da Bíblia Livre, um arquivo por livro | eBible.org — ver [`biblia-livre/LICENCA.md`](biblia-livre/LICENCA.md) |

## Direitos sobre os textos

Os documentos de Westminster (1647) e as 95 Teses (1517) estão em domínio
público no original, mas **traduções** podem ter direitos autorais próprios. A
edição portuguesa e a permissão de reprodução dos arquivos acima (exceto a
Bíblia Livre, que é CC BY 4.0) ainda precisam ser confirmadas. Esses textos
**não** estão cobertos pela licença MIT do código.

## Referências bíblicas

As referências dos três documentos foram auditadas contra as provas bíblicas de
Westminster; o relatório está em [`docs/auditoria/relatorio.md`](../docs/auditoria/relatorio.md).
Para verificar que todas abrem um texto na Bíblia Livre:

```
npm run validate:content
npm run test:references
```
