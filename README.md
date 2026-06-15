# Skills Pessoais — Danyel Soares

Coleção de skills customizadas para o Claude Code, organizadas por categoria.

## Como instalar

Clone o repositório e copie as skills para sua pasta `.claude/skills`:

```bash
git clone https://github.com/DanyelSoares/skills-pessoais.git
cp -r skills-pessoais/*/  ~/.claude/skills/
```

No Windows (PowerShell):

```powershell
git clone https://github.com/DanyelSoares/skills-pessoais.git
Copy-Item -Recurse "skills-pessoais\*" "$env:USERPROFILE\.claude\skills\" -Force
```

---

## Skills disponíveis (35)

### Design & Frontend
| Skill | Descrição |
|-------|-----------|
| `animacoes-web` | Animações profissionais — scroll-triggered, hover, GSAP |
| `componentes-ui` | Componentes UI de alta qualidade (heroes, cards, modals…) |
| `design-anti-slop` | Audita e corrige design genérico de IA |
| `frontend-design-oficial` | Interfaces frontend distintivas, qualidade de produção |
| `identidade-visual` | Criação de identidade visual |
| `recursos-frontend` | Recursos e referências para frontend |
| `site-premium` | Sites premium completos |
| `landing-page` | Landing pages de alta conversão |
| `saas-dashboard` | Dashboards SaaS profissionais |

### Desenvolvimento
| Skill | Descrição |
|-------|-----------|
| `app-ambientes` | Simulação de ambientes e arquitetura via IA |
| `app-mobile` | Apps mobile com React Native ou PWA |
| `debugar` | Sessão estruturada de debug |
| `documentar` | Documentação técnica — README, docstrings, runbook |
| `env-secrets-manager` | Gerencia .env, detecta vazamento de credenciais |
| `mercadopago` | Integração com MercadoPago |
| `webapp-testing` | Testes de aplicações web |
| `iniciar-projeto` | Inicializa novos projetos com estrutura organizada |

### Conteúdo & Marketing
| Skill | Descrição |
|-------|-----------|
| `conteudo-email` | Emails de marketing, newsletters, automações |
| `conteudo-social` | Carrosséis, posts, scripts para redes sociais |
| `seo-basico` | SEO básico para sites e páginas |
| `trafego-pago-meta` | Campanhas de tráfego pago no Meta Ads |

### Produtividade & Workflow
| Skill | Descrição |
|-------|-----------|
| `changelog-generator` | Gera changelog legível a partir de commits |
| `commitar` | Commita com mensagens padronizadas |
| `deploy-web` | Deploy de aplicações web |
| `pr-review-expert` | Revisão expert de Pull Requests |
| `revisar-diff` | Revisão de diffs de código |
| `workflow-visualizer` | Visualização de workflows e fluxos |
| `obsidian-pkm` | Integração com Obsidian para gestão de conhecimento |

### Integrações
| Skill | Descrição |
|-------|-----------|
| `google-calendar` | Integra Google Calendar em aplicações |
| `google-drive` | Integra Google Drive em aplicações |

### Claude Code & Skills
| Skill | Descrição |
|-------|-----------|
| `claude-design` | Prototipagem visual com Claude Design |
| `skill-creator` | Criação de novas skills |
| `meu-perfil` | Perfil e preferências pessoais |
| `doe-framework` | Framework DOE |
| `doe-executar` | Execução do framework DOE |

---

## Uso

Após instalar, use no Claude Code com `/nome-da-skill`. Exemplo:

```
/landing-page
/debugar
/componentes-ui
```

---

*Última atualização: Junho 2026*
