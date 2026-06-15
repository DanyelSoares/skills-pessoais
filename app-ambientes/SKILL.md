---
name: app-ambientes
description: Skill para o projeto de aplicação de simulação de ambientes e arquitetura — onde o usuário envia foto + medidas + preferências e a IA gera simulações visuais do espaço reformado. Use ao trabalhar neste projeto ou derivados.
---

## Visão do projeto

Aplicação onde o usuário:
1. Envia foto do ambiente atual
2. Descreve o que tem em mente (estilo, materiais, cores)
3. Informa medidas e detalhes do espaço
4. Recebe simulações visuais do ambiente reformado
5. Escolhe entre as opções oferecidas
6. Aplica filtros progressivos para refinar o resultado

---

## Arquitetura recomendada

```
Frontend (Next.js)
├── Upload de imagem + formulário de briefing
├── Exibição de simulações em grid
├── Seleção e filtros progressivos
└── Exportação / compartilhamento

Backend (Python/FastAPI ou Node.js)
├── Processamento de imagem (dimensionamento, análise)
├── Integração com APIs de geração de imagem
├── Persistência de projetos (PostgreSQL)
└── Google Drive (salvar projetos e simulações)

Armazenamento
├── Google Drive (fotos originais, simulações aprovadas)
├── S3 ou Supabase Storage (temporários durante processamento)
└── PostgreSQL (metadados, histórico, preferências)
```

---

## Stack de IA para geração de imagens

### Opção 1 — API do Claude (visão + geração de descrição)

Claude analisa a imagem e gera um prompt detalhado para um gerador de imagem:

```python
import anthropic
import base64

def analisar_ambiente(imagem_path: str, descricao_usuario: str, medidas: dict) -> str:
    client = anthropic.Anthropic()
    
    with open(imagem_path, 'rb') as f:
        imagem_b64 = base64.standard_b64encode(f.read()).decode('utf-8')
    
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": imagem_b64,
                    }
                },
                {
                    "type": "text",
                    "text": f"""Analise este ambiente e gere um prompt detalhado para uma IA 
                    de geração de imagens criar uma simulação de reforma.
                    
                    O que o usuário quer: {descricao_usuario}
                    Medidas do ambiente: largura={medidas['largura']}m, 
                                        comprimento={medidas['comprimento']}m, 
                                        pé-direito={medidas.get('pe_direito', 2.7)}m
                    
                    Descreva: estilo desejado, materiais, cores, móveis, iluminação.
                    O prompt deve preservar a perspectiva e ângulo da foto original.
                    Formato: prompt técnico em inglês para Stable Diffusion/DALL-E."""
                }
            ]
        }]
    )
    
    return response.content[0].text
```

### Opção 2 — Stable Diffusion (img2img)

Ideal para preservar a estrutura do ambiente original:

```python
import replicate

def gerar_simulacao(imagem_url: str, prompt: str, forca_estilo: float = 0.6):
    """
    forca_estilo: 0.0 = preserva tudo original, 1.0 = muda tudo
    Para reformas: 0.4-0.7 é o sweet spot
    """
    output = replicate.run(
        "stability-ai/stable-diffusion-img2img:...",
        input={
            "image": imagem_url,
            "prompt": prompt,
            "negative_prompt": "blurry, distorted, low quality, unrealistic",
            "num_inference_steps": 30,
            "strength": forca_estilo,
            "guidance_scale": 7.5,
        }
    )
    return list(output)  # lista de URLs das imagens geradas

# Gerar múltiplas variações
async def gerar_variações(imagem_url: str, prompt: str, quantidade: int = 3):
    simulacoes = []
    for i in range(quantidade):
        # Variar o seed para diferentes resultados
        resultado = gerar_simulacao(imagem_url, prompt, forca_estilo=0.5 + i*0.05)
        simulacoes.extend(resultado)
    return simulacoes
```

### Opção 3 — DALL-E 3 com inpainting

Para reformas específicas de partes do ambiente:

```python
from openai import OpenAI

client = OpenAI()

def redecorar_parede(imagem_path: str, mascara_path: str, prompt: str):
    """
    mascara: área branca = será alterada, área preta = preservada
    """
    with open(imagem_path, 'rb') as img, open(mascara_path, 'rb') as mask:
        response = client.images.edit(
            model="dall-e-2",  # DALL-E 2 suporta inpainting, DALL-E 3 não ainda
            image=img,
            mask=mask,
            prompt=prompt,
            n=3,
            size="1024x1024"
        )
    
    return [item.url for item in response.data]
```

---

## Formulário de briefing — campos essenciais

```typescript
interface BriefingAmbiente {
  // Foto
  fotoOriginal: File;
  
  // Medidas
  largura: number;        // metros
  comprimento: number;    // metros
  peDireito: number;      // metros (padrão 2.7)
  areaTotal?: number;     // calculado automaticamente
  
  // Estilo
  estiloDesejado: 
    | 'moderno' | 'contemporaneo' | 'minimalista' 
    | 'industrial' | 'rustico' | 'escandinavo' 
    | 'classico' | 'tropical' | 'japones';
  
  // Materiais preferidos
  piso?: 'porcelanato' | 'madeira' | 'cimento' | 'ceramica' | 'vinilico';
  parede?: 'tinta' | 'papel-de-parede' | 'revestimento' | 'tijolo-aparente';
  
  // Cores
  paletaDeCores?: string;      // "tons terrosos" ou "#a8724a, #f5e6d3"
  corPredominante?: string;    // hex ou nome
  
  // Funcionalidade
  usoDoAmbiente?: string;      // "home office" | "quarto casal" | "sala de estar"
  quemUsaOEspaco?: string;     // "casal sem filhos" | "família com crianças pequenas"
  
  // Orçamento aproximado
  orcamento?: 'baixo' | 'medio' | 'alto' | 'premium';
  
  // Observações livres
  descricaoLivre: string;      // o que o usuário tem em mente
  refenciasVisuais?: string[]; // URLs de imagens de referência
}
```

---

## Fluxo da aplicação

```
1. UPLOAD
   → Usuário envia foto
   → Sistema detecta tipo de ambiente automaticamente (sala, quarto, cozinha...)
   → Exibe formulário pré-preenchido com detecções

2. BRIEFING
   → Usuário preenche medidas, estilo, materiais, cores
   → Pode adicionar fotos de referência (Pinterest, Awwwards)
   → Preview do que será gerado

3. GERAÇÃO
   → Claude analisa imagem + briefing → gera 3 prompts diferentes
   → Cada prompt gera 2-3 simulações (total: 6-9 opções)
   → Loading com preview parcial (streaming se possível)

4. SELEÇÃO
   → Grid com todas as simulações
   → Usuário seleciona favorita(s)
   → Pode pedir variações: "mais clara", "com planta", "sem o sofá atual"

5. FILTROS PROGRESSIVOS
   → Sobre a simulação escolhida, aplicar refinamentos:
     - Mudar piso
     - Mudar cor das paredes
     - Adicionar/remover móvel específico
     - Ajustar iluminação
   → Cada filtro gera nova simulação preservando o que o usuário aprovou

6. EXPORTAÇÃO
   → Salvar no Google Drive (pasta do projeto)
   → PDF com antes/depois + lista de materiais sugeridos
   → Compartilhar link ou baixar
```

---

## Integração com Pinterest (referências visuais)

```python
# O usuário pode colar URLs do Pinterest como referência
# Para processar as imagens:

async def processar_referencia_pinterest(url: str) -> str:
    """
    Extrai a imagem de um pin do Pinterest e analisa com Claude
    """
    # Pinterest não tem API pública fácil
    # Alternativa: pedir para o usuário fazer download e fazer upload
    # Ou usar scraping (verificar termos de uso)
    
    # Melhor abordagem: campo de upload de múltiplas imagens de referência
    pass
```

**Recomendação:** Em vez de integração direta com Pinterest, ofereça um campo de upload de imagens de referência onde o usuário já baixou do Pinterest ou de qualquer outra fonte.

---

## Persistência de projetos

```sql
-- Schema básico
CREATE TABLE projetos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  nome VARCHAR(200),
  tipo_ambiente VARCHAR(50), -- sala, quarto, cozinha, etc
  foto_original_url TEXT,
  briefing JSONB,
  status VARCHAR(20) DEFAULT 'rascunho',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE simulacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id UUID REFERENCES projetos(id),
  prompt_usado TEXT,
  imagem_url TEXT,
  modelo_ia VARCHAR(50),
  aprovada BOOLEAN DEFAULT FALSE,
  filtros_aplicados JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE filtros_aplicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulacao_id UUID REFERENCES simulacoes(id),
  tipo VARCHAR(50), -- 'piso', 'parede', 'mobilia', etc
  descricao TEXT,
  simulacao_resultado_url TEXT
);
```

---

## Referências de inspiração para o design do app

- **Houzz** — `houzz.com` → app similar, referência de UX/fluxo
- **RoomGPT** — `roomgpt.io` → referência direta (geração com IA)
- **Interior AI** — `interiorai.com` → outro similar
- **Havenly** — `havenly.com` → decoração com profissionais

---

## Próximos passos para implementar

1. [ ] MVP: upload de foto + briefing simplificado + 1 simulação
2. [ ] Integração com Replicate (Stable Diffusion img2img)
3. [ ] Grid de simulações com seleção
4. [ ] Filtros progressivos (ao menos 3: cor de parede, piso, iluminação)
5. [ ] Persistência com PostgreSQL + Supabase
6. [ ] Google Drive para salvar projetos
7. [ ] PDF de exportação com antes/depois
8. [ ] Mercado Pago para modelo de créditos ou assinatura
