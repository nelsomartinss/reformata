# Auditoria das referências bíblicas

Catecismo Maior, Breve Catecismo e Confissão de Fé de Westminster — Reformata.
Data: 31/10/2026. Tradução usada pelo site: Bíblia Livre (única).

> **Situação:** correções confirmadas aplicadas; pendências aguardando conferência na edição brasileira.

## Resumo

| | Quantidade |
|---|---:|
| Referências analisadas (todas as ocorrências dos três documentos) | 3784 |
| Conferidas — constam nas provas do mesmo trecho em pelo menos uma das edições de referência | 2702 |
| **Erros corrigidos nesta auditoria** (confirmados por duas fontes + revisão de sentido) | **64** |
| Correções determinadas pelo responsável (confirmadas) | 7 |
| Decisões do responsável mantidas como variante / pendência | 3 |
| Variantes editoriais (intervalo diferente, texto idêntico, seção revisada, erro das fontes) | 139 |
| Pendentes — provável erro, sugestão das duas fontes, **não aplicado** | 61 |
| Pendentes — possível erro apontado por só uma fonte, **não aplicado** | 26 |
| Pendentes — não constam nas edições de referência (edição brasileira usa provas diferentes) | 742 |
| Sem edição de referência (Confissão, capítulos 34 e 35, acrescentados em 1903) | 40 |
| Provas presentes nas duas fontes e ausentes no projeto (informativo, nada acrescentado) | 1598 |

Por documento:

| Documento | Analisadas | Conferidas | Corrigidas | Variantes | Pendentes |
|---|---|---|---|---|---|
| Catecismo Maior | 2209 | 1594 | 52 | 34 | 529 |
| Breve Catecismo | 390 | 206 | 0 | 28 | 156 |
| Confissão de Fé | 1185 | 902 | 19 | 78 | 146 |

Validação técnica (estado final): validação de conteúdo, lint, checagem de tipos e build sem erros; `npm run test:references` com 3.784 referências e 1.025 verificações sem falhas; todas as citações abrem texto na Bíblia Livre e os 1.189 capítulos da Bíblia abrem no site.

## Edições de referência

Não há edição brasileira das provas bíblicas disponível em formato que permita comparação automática (a edição da Cultura Cristã é comercial). Por isso, cada documento foi comparado com **duas** fontes em inglês de domínio público:

| Documento | Fonte A | Fonte B |
|---|---|---|
| Catecismo Maior | Edição de 1647 (*The Humble Advice*, archive.org), via Creeds.json | Provas tradicionais, thewestminsterstandard.org |
| Breve Catecismo | Provas tradicionais, thewestminsterstandard.org | Provas da OPC (opc.org/documents/SCLayout.pdf) |
| Confissão de Fé | Edição de 1647 (*The Humble Advice*, archive.org), via Creeds.json | Notas tradicionais, thewestminsterstandard.org |

**Limitações importantes**

1. **A edição brasileira usa um conjunto de provas diferente do de 1647.** Muitas perguntas do Catecismo Maior trazem referências que não existem nas edições inglesas (ex.: pergunta 152 cita Dt 32:6, Pv 13:21, Rm 6:21-23). Por isso a maior parte das pendências reflete diferença de edição, não erro. Só a edição brasileira impressa pode resolvê-las.
2. **As fontes não são totalmente independentes e têm erros próprios.** Exemplos verificados: Creeds.json traz 1 Tm 6:1 (pergunta 7), Hb 1:8 e Is 43:14 (pergunta 18) onde o correto é 1 Tm 6:15, Hb 1:3 e Is 63:14; as duas fontes trazem "2 Tim 2:5" na Confissão 8.1 e "Ezra 10:25" na Confissão 22.2, provavelmente herdados da mesma transcrição.
3. **A Confissão segue a revisão americana**: o §2 do capítulo 31 de 1647 foi suprimido (os demais foram realinhados) e as seções 20.4, 23.3 e 31.1 foram reescritas; diferenças nessas seções foram classificadas como variante editorial.
4. Um trecho das fontes não pôde ser interpretado automaticamente: Catecismo Maior 34, "Heb. 8-10, 11:13".

## Critérios

- **Conferida:** todos os versículos da referência constam nas provas do mesmo trecho em pelo menos uma das fontes.
- **Confirmada (corrigida):** a referência não consta em nenhuma das fontes; as duas fontes trazem, no mesmo trecho, uma prova que difere apenas em **capítulo** (um dígito) ou em **livro com abreviação confundível** (1Ts/2Ts, 1Tm/2Tm, 1Co/2Co, At/Mt, Mt/Ml, Êx/Ez, Jo/Jó/1Jo, Ef/Et); essa prova ainda não está citada no trecho; é a única correção possível; e a correção foi revisada pelo sentido do texto. Só o componente errado é alterado; a ordem e o agrupamento das provas são preservados.
- **Não aplicadas, mesmo com as duas fontes concordando:** diferenças só no **versículo** (podem ser erro comum às fontes, como "Ezra 10:25") e trocas de livro com abreviações não confundíveis (ex.: Zc 6:9 → Mt 6:9). Ficam como pendência, com a sugestão registrada.
- **Variante editorial:** coincidência parcial de intervalo; versículos de texto idêntico (ex.: Mc 9:48 e 9:44); seções revisadas na edição americana; erros comprovados das fontes.
- O texto das perguntas, respostas e parágrafos não foi alterado.

## 1. Correções determinadas pelo responsável

| Documento | Trecho | Original | Corrigida | Classificação | Justificativa |
|---|---|---|---|---|---|
| Catecismo Maior | Pergunta 7 | At 5:2 | At 7:2 | confirmada | Correção confirmada na revisão do responsável (o Deus da glória). Consta em: fonte A e B. |
| Catecismo Maior | Pergunta 7 | Sl 90:2-145 | Sl 90:2 | confirmada | Correção confirmada na revisão do responsável. Consta em: fonte A e B. |
| Catecismo Maior | Pergunta 7 | Ml 2:6 | Ml 3:6 | confirmada | Correção confirmada na revisão do responsável (imutabilidade de Deus). Consta em: fonte A e B. |
| Catecismo Maior | Pergunta 32 | 1Sm 4:3-6 | (mantida) | pendente de revisão | Mantido por decisão do responsável. Atenção: a citação está na pergunta 32, não na 113; ver justificativa da auditoria. Não consta nas fontes inglesas consultadas. |
| Catecismo Maior | Pergunta 32 | Jo 326:6 | Jo 6:27 | confirmada | Correção confirmada na revisão do responsável (João 6:27 na primeira nota, com Gn 3:15 e Is 42:6). Consta em: fonte A e B. |
| Catecismo Maior | Pergunta 176 | Mc 28:19 | Mt 28:19 | confirmada | Correção confirmada na revisão do responsável; a troca anterior para Mt 26:29 foi desfeita. Consta em: fonte A e B. |
| Catecismo Maior | Pergunta 185 | Ef 3:216 | Ef 6:18 | confirmada | Correção confirmada na revisão do responsável (perseverança na oração). Consta em: fonte A e B. |
| Confissão de Fé | Capítulo 3, §8 | Rm. 5:33, 9:20, 11:5-6, 10, 23 | Rm. 11:33; 9:20; 11:5-6, 20; 8:33 | confirmada | Correção confirmada na revisão do responsável; demais provas do parágrafo preservadas. Consta em: fonte A e B. |
| Confissão de Fé | Capítulo 4, §1 | Rm. 1:20, 9:36 | Rm. 1:20 | pendente de revisão | Rm 9:36 não existe. Restaurar como Rm 11:36 apenas se a edição brasileira adotada trouxer essa prova; a edição de 1647 traz só Rm 1:20. Consta em: fonte A e B. |
| Confissão de Fé | Capítulo 25, §2 | Mt 13:3 Cl 1:13 | Mt 13:47; Cl 1:13 | variante editorial | Mt 13:47 confirmado. Cl 1:13 não consta na edição inglesa consultada; mantido como estava até conferência na edição brasileira. Não consta nas fontes inglesas consultadas. |

**Atenção — "1Sm 4:3-6":** a premissa de que essa citação pertence à pergunta 113 não se confirma no projeto.

- A pergunta **113** de fato cita **1 Sm 4:3-5** nas duas fontes, mas essa prova **não existe** na pergunta 113 do projeto (está listada em `omissoes.csv`; nada foi acrescentado).
- O "1Sm 4:3-6" do projeto está na **pergunta 32**, na 2ª posição, entre "Gn 3:15" e "Jo 6:27". A primeira nota da pergunta 32 nas duas fontes é exatamente **Gn 3:15; Is 42:6; Jo 6:27**. A posição coincide com Is 42:6, e o mesmo erro de conversão "Is" → "1Sm" aparece em dezenas de outras citações do Catecismo Maior.

Mantive a referência, como pedido, e a classifiquei como **pendente de revisão**. Recomendo conferir a pergunta 32 na edição brasileira: tudo indica que a leitura correta é **Is 42:6**.

## 2. Erros corrigidos nesta auditoria (64)

| Documento | Trecho | Original | Corrigida | Erro de | Fontes (nota) |
|---|---|---|---|---|---|
| Catecismo Maior | Pergunta 3 | 1Tm 3:16 | 2Tm 3:16 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 5 | 1Tm 1:13 | 2Tm 1:13 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 9 | At 3:16-17 | Mt 3:16-17 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 16 | 1Ts 1:7 | 2Ts 1:7 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 6; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 16 | 1Pe 2:4 | 2Pe 2:4 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 8; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 28 | 1Ts 2:11 | 2Ts 2:11 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 3; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 29 | 1Ts 1:9 | 2Ts 1:9 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 32 | Ez 34:27 | Ez 36:27 | capítulo | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 7; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 35 | 1Co 3:6 | 2Co 3:6 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 4; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 40 | At 1:21 | Mt 1:21 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 40 | At 1:23 | Mt 1:23 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 41 | At 1:21 | Mt 1:21 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 45 | 1Ts 1:8 | 2Ts 1:8 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 12; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 46 | 1Co 8:9 | 2Co 8:9 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 49 | At 27:4 | Mt 27:4 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 57 | 1Co 1:20 | 2Co 1:20 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 2; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 60 | 1Ts 1:8-9 | 2Ts 1:8-9 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 2; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 67 | 1Tm 1:8-9 | 2Tm 1:8-9 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 67 | 1Ts 2:13-14 | 2Ts 2:13-14 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 3; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 71 | At 20:28 | Mt 20:28 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 2; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 74 | Jo 3:1 | 1Jo 3:1 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 75 | 1Ts 2:13 | 2Ts 2:13 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 77 | 1Co 7:1 | 2Co 7:1 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 9; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 79 | 1Sm 23:5 | 2Sm 23:5 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 2; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 80 | Jo 2:3 | 1Jo 2:3 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 82 | 1Co 3:18 | 2Co 3:18 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 83 | 1Co 1:22 | 2Co 1:22 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 2; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 95 | Rm 3:7 | Rm 7:7 | capítulo | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 3; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 104 | Mt 3:16 | Ml 3:16 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 3; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 104 | Mt 1:6 | Ml 1:6 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 7; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 105 | Is 43:25 | Is 42:25 | capítulo | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 23; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 108 | At 28:20 | Mt 28:20 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 109 | Is 55:3-5 | Is 65:3-5 | capítulo | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 19; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 112 | Mt 1:14 | Ml 1:14 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 2; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 112 | Mt 3:16 | Ml 3:16 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 10; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 113 | 1Sm 16:5 | 2Sm 16:5 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 12; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 113 | 2Rs 21:9 | 1Rs 21:9 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 28; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 119 | Êx 22:26 | Ez 22:26 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 121 | Êx 20:12 | Ez 20:12 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 3; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 127 | Rm 16:6 | Rm 13:6 | capítulo | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 10; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 129 | Jo 1:5 | Jó 1:5 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 2; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 129 | Ef 6:3 | Et 6:3 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 8; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 130 | Êx 34:2 | Ez 34:2 | livro | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 144 | 1Pe 1:8 | 1Pe 4:8 | capítulo | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 14; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 166 | Cl 1:11 | Cl 2:11 | capítulo | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 2; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Catecismo Maior | Pergunta 185 | 1Tm 1:8 | 1Tm 2:8 | capítulo | A — Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json, nota 12; B — Catecismo Maior, provas tradicionais, thewestminsterstandard.org |
| Confissão de Fé | Capítulo 2, §1 | Jo. 6:24 | Jo 4:24 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 6; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota f |
| Confissão de Fé | Capítulo 2, §1 | Sl. 92:2 | Sl 90:2 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 10; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota j |
| Confissão de Fé | Capítulo 2, §1 | Ex. 36:6-7 | Êx 34:6-7 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 20; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota t |
| Confissão de Fé | Capítulo 8, §6 | Hb 3:8 | Hb 13:8 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota a |
| Confissão de Fé | Capítulo 10, §1 | Rm 5:2 | Rm 8:2 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 3; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota c |
| Confissão de Fé | Capítulo 11, §3 | 2Tm 2:5-6 | 1Tm 2:5-6 | livro | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota a |
| Confissão de Fé | Capítulo 14, §1 | Rm 6:11 | Rm 4:11 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 4; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota d |
| Confissão de Fé | Capítulo 14, §2 | Jo 6:42 | Jo 4:42 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota a |
| Confissão de Fé | Capítulo 14, §2 | 1Tm 6:8 | 1Tm 4:8 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 4; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota d |
| Confissão de Fé | Capítulo 18, §1 | Jo. 5:41 | Jo 8:41 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota a |
| Confissão de Fé | Capítulo 18, §1 | Mt. 8:22-23 | Mt 7:22-23 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 2; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota b |
| Confissão de Fé | Capítulo 19, §7 | Hb. 5:10 | Hb 8:10 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 2; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota b |
| Confissão de Fé | Capítulo 20, §1 | Gl 6:6 | Gl 4:6 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 7; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota g |
| Confissão de Fé | Capítulo 20, §2 | Mt. 28:8-10 | Mt 23:8-10 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 2; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota b |
| Confissão de Fé | Capítulo 21, §3 | Jo 5:14 | 1Jo 5:14 | livro | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 5; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota e |
| Confissão de Fé | Capítulo 21, §6 | Jo 5:21 | Jo 4:21 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota a |
| Confissão de Fé | Capítulo 22, §7 | I Co. 2:9 | 1Co 7:9 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 2; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota b |
| Confissão de Fé | Capítulo 27, §1 | Rm. 6:11 | Rm 4:11 | capítulo | A — Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json, nota 1; B — Confissão de Fé, notas tradicionais, thewestminsterstandard.org, nota a |

Classificação de todas: **confirmada**. Justificativa completa de cada uma em `referencias.csv`.

## 3. Verificação das alterações anteriores (regressão)

Comparando com o último commit, 184 referências foram alteradas ao longo desta sessão. Todas abrem texto na Bíblia Livre. Situação nas fontes: A e B: 160; nenhuma: 19; B: 3; A: 1; sem edição de referência: 1.

Esta auditoria **corrigiu dois erros meus** da sessão anterior: Catecismo Maior 105 ("Is 43:25" → **Is 42:25**) e 109 ("Is 55:3-5" → **Is 65:3-5**).

Alterações anteriores que **não constam em nenhuma fonte** (a referência original era inválida e foi lida pela forma mais provável; revisar na edição brasileira):

| Documento | Trecho | Antes | Depois | Classificação |
|---|---|---|---|---|
| Catecismo Maior | Pergunta 6 | 1Sm 46:9-10 | Is 46:9-10 | pendente de revisão |
| Catecismo Maior | Pergunta 12 | 1Sm 45:6-7 | Is 45:6-7 | pendente de revisão |
| Catecismo Maior | Pergunta 48 | 1Sm 53:2-3 | Is 53:2-3 | pendente de revisão |
| Catecismo Maior | Pergunta 81 | 1Sm 54:7-11 | Is 54:7-11 | pendente de revisão |
| Catecismo Maior | Pergunta 152 | 1Pe 1:1618 | 1Pe 1:16-18 | pendente de revisão |
| Confissão de Fé | Capítulo 3, §5 | Ef 1:19:e 2:8-9 | Ef 1:19; 2:8-9 | pendente de revisão |
| Confissão de Fé | Capítulo 8, §1 | 1Tm 2:56 | 1Tm 2:5-6 | pendente de revisão |
| Confissão de Fé | Capítulo 8, §4 | Jo 4:34:Fp 2-8 \| Lc22:24 \| 2Pe 3:22 \| Rm 14:10:At 1:11, Jo5:28-29 | Jo 4:34; Fp 2:8 | pendente de revisão |
| Confissão de Fé | Capítulo 8, §4 | Jo 4:34:Fp 2-8 \| Lc22:24 \| 2Pe 3:22 \| Rm 14:10:At 1:11, Jo5:28-29 | 1Pe 3:22 | pendente de revisão |
| Confissão de Fé | Capítulo 8, §4 | Jo 4:34:Fp 2-8 \| Lc22:24 \| 2Pe 3:22 \| Rm 14:10:At 1:11, Jo5:28-29 | Rm 14:10; At 1:11; Jo 5:28-29 | pendente de revisão |
| Confissão de Fé | Capítulo 8, §7 | Jo 10:17-l8 | Jo 10:17-18 | pendente de revisão |
| Confissão de Fé | Capítulo 10, §3 | Ezq. 16-20-21 \| Lc 18:1516 | Ezq. 16:20-21 | pendente de revisão |
| Confissão de Fé | Capítulo 10, §4 | Mt l3:14-15 \| 2Jo 10:l 1 | Mt 13:14-15 | pendente de revisão |
| Confissão de Fé | Capítulo 19, §6 | Rm 6:12,-14 | Rm 6:12-14 | pendente de revisão |
| Confissão de Fé | Capítulo 23, §3 | Jo. 15:36 | Jo. 18:36 | pendente de revisão |
| Confissão de Fé | Capítulo 25, §2 | Mt 13:3 Cl 1:13 | Mt 13:47; Cl 1:13 | pendente de revisão |
| Confissão de Fé | Capítulo 26, §1 | Rm 6:56, e8:17 | Rm 6:5-6; 8:17 | pendente de revisão |
| Confissão de Fé | Capítulo 28, §2 | At 10-47, 8:36-38 | At 10:47; 8:36-38 | pendente de revisão |
| Confissão de Fé | Capítulo 32, §1 | Rm. 5:23 \| Lc. 16:25-24 | Rm. 8:23 | pendente de revisão |

## 4. Pendências

### 4.1 Prováveis erros apontados pelas duas fontes — não aplicados (61)

| Documento | Trecho | Atual | Sugestão das fontes | Tipo |
|---|---|---|---|---|
| Catecismo Maior | Pergunta 10 | Jo 1:15 | Jo 1:18 | versículo |
| Catecismo Maior | Pergunta 17 | Ec 12:9 | Ec 12:7 | versículo |
| Catecismo Maior | Pergunta 25 | Rm 5:5 | Rm 5:6 | versículo |
| Catecismo Maior | Pergunta 25 | Gn 6:1 | Gn 6:5 | versículo |
| Catecismo Maior | Pergunta 26 | Sl 51:15 | Sl 51:5 | versículo |
| Catecismo Maior | Pergunta 32 | Jo 3:36 | Jo 3:16 | versículo |
| Catecismo Maior | Pergunta 32 | Jo 3:1 | Jo 3:16 | versículo |
| Catecismo Maior | Pergunta 32 | Tg 2:12 | Tg 2:22 | versículo |
| Catecismo Maior | Pergunta 36 | Jo 1:10 | Jo 1:14 | versículo |
| Catecismo Maior | Pergunta 39 | Hb 2:4 | Hb 2:14 | versículo |
| Catecismo Maior | Pergunta 42 | Jo 3:24 | Jo 3:34 | versículo |
| Catecismo Maior | Pergunta 45 | Jo 15:14 | At 15:14 | livro |
| Catecismo Maior | Pergunta 55 | Hb 9:1 | Hb 9:12 | versículo |
| Catecismo Maior | Pergunta 66 | Ef 2:5 | Ef 2:6-8 | versículo |
| Catecismo Maior | Pergunta 76 | Ez 36:1 | Ez 36:31 | versículo |
| Catecismo Maior | Pergunta 83 | Mc 9:48 | Mc 9:44 | versículo |
| Catecismo Maior | Pergunta 85 | Ap 14:1 | Ap 14:13 | versículo |
| Catecismo Maior | Pergunta 86 | Ef 4:20 | Ef 4:10 | versículo |
| Catecismo Maior | Pergunta 93 | 1Ts 5:28 | 1Ts 5:23 | versículo |
| Catecismo Maior | Pergunta 93 | Rm 10:15 | Rm 10:5 | versículo |
| Catecismo Maior | Pergunta 96 | Gl 1:20 | Rm 1:20 | livro |
| Catecismo Maior | Pergunta 99 | Êx 20:1 | Êx 20:10 | versículo |
| Catecismo Maior | Pergunta 105 | 1Ts 1:4 | 1Ts 1:9 | versículo |
| Catecismo Maior | Pergunta 109 | 1Pe 1:8 | 1Pe 1:18 | versículo |
| Catecismo Maior | Pergunta 113 | Dt 23:16 | Dt 23:18 | versículo |
| Catecismo Maior | Pergunta 130 | Mc 6:4 | Mc 6:24 | versículo |
| Catecismo Maior | Pergunta 130 | Jo 5:4 | Jo 5:44 | versículo |
| Catecismo Maior | Pergunta 135 | Rm 12:18 | Rm 12:17 | versículo |
| Catecismo Maior | Pergunta 135 | Hb 12:5 | Hb 12:9 | versículo |
| Catecismo Maior | Pergunta 138 | 1Co 7:5 | 1Co 7:35-36 | versículo |
| Catecismo Maior | Pergunta 139 | 1Co 7:2 | 1Co 7:7-9 | versículo |
| Catecismo Maior | Pergunta 139 | 2Pe 2:17 | 2Pe 2:14 | versículo |
| Catecismo Maior | Pergunta 139 | 2Pe 2:18 | 2Pe 2:14 | versículo |
| Catecismo Maior | Pergunta 145 | 1Rs 21:8 | 1Rs 21:9-14 | versículo |
| Catecismo Maior | Pergunta 145 | Dn 6:4 | 1Tm 6:4 | livro |
| Catecismo Maior | Pergunta 151 | 2Pe 2:2 | Hb 2:2 | livro |
| Catecismo Maior | Pergunta 151 | Zc 2:8 | Sf 2:8 | livro |
| Catecismo Maior | Pergunta 151 | Nm 15:20 | Nm 15:30 | versículo |
| Catecismo Maior | Pergunta 151 | Is 3:9 | Is 3:5 | versículo |
| Catecismo Maior | Pergunta 151 | Mq 2:2 | Hb 2:2 | livro |
| Catecismo Maior | Pergunta 151 | Rm 1:20 | Rm 1:26-27 | versículo |
| Catecismo Maior | Pergunta 151 | Rm 1:21 | Rm 1:26-27 | versículo |
| Catecismo Maior | Pergunta 151 | Rm 1:31 | Rm 1:32 | versículo |
| Catecismo Maior | Pergunta 159 | 1Co 14:9 | 1Co 14:19 | versículo |
| Catecismo Maior | Pergunta 160 | Hb 4:12 | Hb 4:2 | versículo |
| Catecismo Maior | Pergunta 165 | Rm 6:3 | Rm 6:5 | versículo |
| Catecismo Maior | Pergunta 166 | Gl 3:17 | Gl 3:14 | versículo |
| Catecismo Maior | Pergunta 166 | Gl 3:18 | Gl 3:14 | versículo |
| Catecismo Maior | Pergunta 166 | Gl 3:29 | Gl 3:9 | versículo |
| Catecismo Maior | Pergunta 174 | Sl 63:1 | Sl 63:4-5 | versículo |
| Catecismo Maior | Pergunta 176 | Cl 2:11 | Cl 2:12 | versículo |
| Catecismo Maior | Pergunta 189 | Zc 6:9 | Mt 6:9 | livro |
| Catecismo Maior | Pergunta 194 | Os 14:1 | Os 14:2 | versículo |
| Confissão de Fé | Capítulo 3, §1 | Mt. 17:2 | Mt 17:12 | versículo |
| Confissão de Fé | Capítulo 5, §1 | Sl. 145:14-16 | Sl 145:17 | versículo |
| Confissão de Fé | Capítulo 5, §1 | Gn. 45:5 | Gn 45:7 | versículo |
| Confissão de Fé | Capítulo 5, §2 | At 2:13 | At 2:23 | versículo |
| Confissão de Fé | Capítulo 7, §3 | Gl 3:14 | Gl 3:11 | versículo |
| Confissão de Fé | Capítulo 7, §5 | Jo 8:36 | Jo 8:56 | versículo |
| Confissão de Fé | Capítulo 8, §3 | Sl 45:5 | Sl 45:7 | versículo |
| Confissão de Fé | Capítulo 22, §2 | Esdras 10:5 | Ed 10:25 | versículo |

### 4.2 Possíveis erros apontados por apenas uma fonte (26)

| Documento | Trecho | Atual | Sugestão |
|---|---|---|---|
| Catecismo Maior | Pergunta 4 | At 28:28 | At 23:28 (fonte A); At 18:28 (fonte B) |
| Catecismo Maior | Pergunta 17 | Gn 1:7 | Gn 1:27 (fonte A e B); Gn 2:7 (fonte A e B) |
| Catecismo Maior | Pergunta 17 | Gn 1:2 | Gn 1:27 (fonte A e B); Gn 1:28 (fonte A e B) |
| Catecismo Maior | Pergunta 30 | Gl 3:1 | Gl 3:10 (fonte A e B); Gl 3:12 (fonte A e B); Gl 3:21 (fonte A e B) |
| Catecismo Maior | Pergunta 81 | Ed 1:10 | Is 1:10 (fonte B) |
| Catecismo Maior | Pergunta 93 | At 24:1 | At 24:16 (fonte B) |
| Catecismo Maior | Pergunta 139 | Ef 5:5 | Ef 5:3-4 (fonte A e B); Ef 5:4 (fonte A e B) |
| Catecismo Maior | Pergunta 151 | Jr 5:13 | Jr 5:3 (fonte B) |
| Catecismo Maior | Pergunta 151 | Jr 9:3 | Jr 3:3 (fonte A e B); Jr 5:3 (fonte B) |
| Catecismo Maior | Pergunta 151 | Jr 7:11 | Jr 7:14-15 (fonte A) |
| Catecismo Maior | Pergunta 156 | 1Co 14:18 | 1Co 14:11-12 (fonte A e B); 1Co 14:15-16 (fonte A e B) |
| Catecismo Maior | Pergunta 156 | 1Co 14:19 | 1Co 14:9 (fonte A e B); 1Co 14:11-12 (fonte A e B); 1Co 14:15-16 (fonte A e B) |
| Catecismo Maior | Pergunta 174 | 1Co 10:17 | 1Co 11:17 (fonte A e B); 1Co 10:11 (fonte A e B); 1Co 10:14 (fonte A e B) |
| Breve Catecismo | Pergunta 8 | Is 14:26-27 | Is 14:24 (fonte B) |
| Breve Catecismo | Pergunta 24 | Jo 14:26 | Jo 15:26 (fonte B) |
| Breve Catecismo | Pergunta 26 | 1Co 15:26-27 | 1Co 15:25 (fonte A) |
| Breve Catecismo | Pergunta 27 | Mt 27:43 | Mt 27:46 (fonte A) |
| Breve Catecismo | Pergunta 31 | 1Ts 2:13 | 2Ts 2:13 (fonte A) |
| Breve Catecismo | Pergunta 61 | Jr 17:21 | Jr 17:24-26 (fonte A) |
| Breve Catecismo | Pergunta 70 | Ex 24:14 | Êx 20:14 (fonte A) |
| Breve Catecismo | Pergunta 74 | Pv 22:1-14 | Dt 22:1-14 (fonte —) |
| Breve Catecismo | Pergunta 97 | 1Co 11:27 | 1Co 11:28-29 (fonte A) |
| Breve Catecismo | Pergunta 103 | Mt 24:39 | Mt 26:39 (fonte A) |
| Confissão de Fé | Capítulo 1, §1 | 2Co. 1:21 | 1Co 1:21 (fonte A) |
| Confissão de Fé | Capítulo 1, §1 | 2:13-14 | 1Co 2:13-14 (fonte A) |
| Confissão de Fé | Capítulo 23, §4 | 2Pe 2:17 | 1Pe 2:17 (fonte A e B); 2Pe 2:1 (fonte A e B); 2Pe 2:10-11 (fonte A e B) |

### 4.3 Referências que não constam nas edições de referência (742)

Lista completa em `referencias.csv` (filtre por "pendente de revisão"). Por documento: Catecismo Maior: 462; Breve Catecismo: 146; Confissão de Fé: 134. A maioria corresponde às provas próprias da edição brasileira; devem ser conferidas na edição impressa adotada.

## 5. Variantes editoriais (139)

Lista completa em `referencias.csv`. Destaques: Confissão 8.1 "1Tm 2:5" (as fontes trazem "2 Tim 2:5", erro comum às duas); Catecismo Maior 83 "Mc 9:48" (texto idêntico ao de Mc 9:44, citado pelas fontes); seções 20.4, 23.3 e 31.1 da Confissão (texto revisado).

## Arquivos

- `referencias.csv` — uma linha por ocorrência (3784): documento, trecho, posição, referência original, referência corrigida, classificação, fonte e justificativa.
- `regressao.csv` — referências alteradas desde o último commit e sua situação nas fontes.
- `omissoes.csv` — provas presentes nas duas fontes e não citadas no projeto (informativo; nada foi acrescentado).

## Como reproduzir

```
node scripts/audit-references.mjs <pasta-das-fontes> <pasta-de-saída>          # só relatório
node scripts/audit-references.mjs <pasta-das-fontes> <pasta-de-saída> --apply  # aplica as confirmadas
npm run test:references                                                        # testes de regressão
```

As fontes em HTML/JSON são baixadas automaticamente; o texto do PDF da OPC precisa ser extraído e salvo como `opc_shorter_catechism.txt` (instruções no topo do script).
