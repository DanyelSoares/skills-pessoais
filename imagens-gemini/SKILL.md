---
name: imagens-gemini
description: "Gera e edita imagens com o Google Gemini (Nano Banana): criativos de anúncio para Meta e Google Ads, posts, banners, fotos de produto e variações a partir de uma imagem de referência. Use quando precisar criar imagens de verdade (arquivo PNG/JPG), não só o briefing."
---

# Imagens com Gemini (Nano Banana)

Script: `scripts/gerar_imagem_gemini.py` (só biblioteca padrão do Python).
Chave: variável de ambiente `GEMINI_API_KEY` ou `GOOGLE_API_KEY`. Se faltar, oriente o usuário a criar
em <https://aistudio.google.com/apikey> e gravar no Windows com
`[Environment]::SetEnvironmentVariable('GEMINI_API_KEY','CHAVE','User')` (depois reiniciar o Claude Code).
Nunca peça para colar a chave no chat.

## Fluxo

1. **Entenda o uso**: onde a imagem vai rodar (feed, stories, Google Display), produto, público,
   mensagem, cores da marca. Pergunte só o que faltar.
2. **Escolha a proporção** pelo posicionamento:

   | Uso | Proporção |
   |---|---|
   | Feed Instagram/Facebook | `4:5` ou `1:1` |
   | Stories / Reels / TikTok | `9:16` |
   | Google Display / YouTube / banner de site | `16:9` ou `21:9` |
   | Carrossel | `1:1` |

3. **Escreva o prompt em inglês** (o modelo segue melhor), descrevendo: assunto, ação, cenário,
   composição/enquadramento, iluminação, estilo, cores e o que evitar. Para texto dentro da
   imagem, escreva o texto exato entre aspas e mantenha curto (até ~6 palavras).
4. **Gere** (padrão 2–3 variações para teste A/B):
   ```
   python scripts/gerar_imagem_gemini.py "PROMPT" --saida criativos/feed.png --proporcao 4:5 --variacoes 3
   ```
   Com foto do produto como referência: `--referencia produto.png` (pode repetir).
   Alta resolução: `--tamanho 2K` ou `4K` (custa mais).
5. **Mostre os arquivos** ao usuário e ajuste o prompt conforme o feedback.

Ver modelos liberados para a chave: `python scripts/gerar_imagem_gemini.py --listar-modelos`.

## Regras

- Não use rosto/nome de pessoas reais, marcas de terceiros ou logotipos sem autorização.
- Não crie "antes e depois", promessas de saúde ou resultados financeiros (as políticas da Meta e
  do Google reprovam).
- Imagens geradas recebem marca d'água invisível SynthID do Google; isso é normal.
- Se der erro de faturamento/cota, explique que a geração de imagem pode exigir faturamento ativo
  no projeto do Google AI Studio.
