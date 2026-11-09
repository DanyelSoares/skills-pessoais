"""Gera um CSV para importar no Google Ads Editor a partir de um plano JSON.

Uso:
    python gerar_csv_editor.py plano.json saida.csv
    python gerar_csv_editor.py plano.json saida.csv --so-validar

Só usa a biblioteca padrão do Python. Todas as campanhas saem PAUSADAS.
Formato do plano: veja ../exemplos/plano-exemplo.json
"""
import csv
import json
import re
import sys

LIM = {"titulo": 30, "descricao": 90, "caminho": 15, "palavra": 80}
TIPOS_PALAVRA = {"ampla": "Broad", "frase": "Phrase", "exata": "Exact"}
LANCES = {
    "cpc_manual": "Manual CPC",
    "maximizar_cliques": "Maximize clicks",
    "maximizar_conversoes": "Maximize conversions",
    "cpa_desejado": "Target CPA",
}
COLUNAS = [
    "Campaign", "Campaign Type", "Campaign Status", "Budget", "Bid Strategy Type",
    "Target CPA", "Networks", "Languages", "Location",
    "Ad Group", "Max CPC", "Ad Group Status",
    "Keyword", "Criterion Type",
    *[f"Headline {i}" for i in range(1, 16)],
    *[f"Headline {i} position" for i in range(1, 16)],
    *[f"Description {i}" for i in range(1, 5)],
    "Path 1", "Path 2", "Final URL", "Ad Type", "Status",
    "Callout text",
]


def _num(v):
    return f"{float(v):.2f}"


def validar(plano):
    erros, avisos = [], []
    for c in plano.get("campanhas", []):
        nc = c.get("nome", "?")
        if not c.get("nome"):
            erros.append("Campanha sem nome")
        if float(c.get("orcamento_diario", 0)) <= 0:
            erros.append(f"[{nc}] orcamento_diario deve ser > 0")
        if c.get("lance", "maximizar_cliques") not in LANCES:
            erros.append(f"[{nc}] lance inválido: {c.get('lance')} (use {', '.join(LANCES)})")
        if c.get("lance") == "cpa_desejado" and not c.get("cpa_desejado"):
            erros.append(f"[{nc}] lance cpa_desejado exige o campo cpa_desejado")
        for t in c.get("chamadas", []):
            if len(t) > 25:
                erros.append(f"[{nc}] chamada com {len(t)} caracteres (máx. 25): {t}")
        if not c.get("grupos"):
            erros.append(f"[{nc}] precisa de pelo menos 1 grupo de anúncios")
        for g in c.get("grupos", []):
            ng = f"{nc} > {g.get('nome', '?')}"
            if not g.get("palavras"):
                erros.append(f"[{ng}] sem palavras-chave")
            for p in g.get("palavras", []) + g.get("negativas", []):
                texto = p["texto"] if isinstance(p, dict) else p
                tipo = p.get("tipo", "frase") if isinstance(p, dict) else "frase"
                if len(texto) > LIM["palavra"] or len(texto.split()) > 10:
                    erros.append(f"[{ng}] palavra-chave longa demais (máx. 80 caracteres/10 palavras): {texto}")
                if tipo not in TIPOS_PALAVRA:
                    erros.append(f"[{ng}] tipo de correspondência inválido '{tipo}' (use ampla, frase, exata)")
                if re.search(r"[!@%,*]", texto):
                    erros.append(f"[{ng}] caractere não permitido em palavra-chave: {texto}")
            if not g.get("anuncios"):
                erros.append(f"[{ng}] sem anúncio responsivo")
            for i, a in enumerate(g.get("anuncios", []), 1):
                na = f"{ng} > anúncio {i}"
                tit, desc = a.get("titulos", []), a.get("descricoes", [])
                if not 3 <= len(tit) <= 15:
                    erros.append(f"[{na}] precisa de 3 a 15 títulos (tem {len(tit)})")
                elif len(tit) < 10:
                    avisos.append(f"[{na}] só {len(tit)} títulos; o Google recomenda 10 a 15")
                if not 2 <= len(desc) <= 4:
                    erros.append(f"[{na}] precisa de 2 a 4 descrições (tem {len(desc)})")
                for t in tit:
                    txt = t["texto"] if isinstance(t, dict) else t
                    if len(txt) > LIM["titulo"]:
                        erros.append(f"[{na}] título com {len(txt)} caracteres (máx. 30): {txt}")
                for d in desc:
                    if len(d) > LIM["descricao"]:
                        erros.append(f"[{na}] descrição com {len(d)} caracteres (máx. 90): {d}")
                if len({(t['texto'] if isinstance(t, dict) else t).lower() for t in tit}) < len(tit):
                    erros.append(f"[{na}] títulos repetidos")
                for k in ("caminho1", "caminho2"):
                    if len(a.get(k, "")) > LIM["caminho"]:
                        erros.append(f"[{na}] {k} com mais de 15 caracteres")
                if not str(a.get("url_final", "")).startswith(("http://", "https://")):
                    erros.append(f"[{na}] url_final ausente ou sem http(s)://")
    if not plano.get("campanhas"):
        erros.append("Plano sem campanhas")
    return erros, avisos


def linhas(plano):
    for c in plano["campanhas"]:
        nc = c["nome"]
        lance = c.get("lance", "maximizar_cliques")
        redes = "Google search" + (";Search Partners" if c.get("parceiros_pesquisa", False) else "")
        yield {
            "Campaign": nc, "Campaign Type": "Search", "Campaign Status": "Paused",
            "Budget": _num(c["orcamento_diario"]), "Bid Strategy Type": LANCES[lance],
            "Target CPA": _num(c["cpa_desejado"]) if lance == "cpa_desejado" else "",
            "Networks": redes, "Languages": ";".join(c.get("idiomas", ["pt"])),
        }
        for loc in c.get("locais", ["Brazil"]):
            yield {"Campaign": nc, "Location": loc}
        for neg in c.get("negativas_campanha", []):
            texto = neg["texto"] if isinstance(neg, dict) else neg
            tipo = neg.get("tipo", "frase") if isinstance(neg, dict) else "frase"
            yield {"Campaign": nc, "Keyword": texto,
                   "Criterion Type": f"Campaign Negative {TIPOS_PALAVRA[tipo]}"}
        for t in c.get("chamadas", []):
            yield {"Campaign": nc, "Callout text": t}
        for g in c["grupos"]:
            ng = g["nome"]
            yield {"Campaign": nc, "Ad Group": ng, "Ad Group Status": "Enabled",
                   # CPC máximo do grupo só vale com lance manual.
                   "Max CPC": _num(g["cpc_max"]) if g.get("cpc_max") and lance == "cpc_manual" else ""}
            for p in g["palavras"]:
                texto = p["texto"] if isinstance(p, dict) else p
                tipo = p.get("tipo", "frase") if isinstance(p, dict) else "frase"
                yield {"Campaign": nc, "Ad Group": ng, "Keyword": texto,
                       "Criterion Type": TIPOS_PALAVRA[tipo]}
            for p in g.get("negativas", []):
                texto = p["texto"] if isinstance(p, dict) else p
                tipo = p.get("tipo", "frase") if isinstance(p, dict) else "frase"
                yield {"Campaign": nc, "Ad Group": ng, "Keyword": texto,
                       "Criterion Type": f"Negative {TIPOS_PALAVRA[tipo]}"}
            for a in g["anuncios"]:
                row = {"Campaign": nc, "Ad Group": ng, "Ad Type": "Responsive search ad",
                       "Status": "Enabled", "Final URL": a["url_final"],
                       "Path 1": a.get("caminho1", ""), "Path 2": a.get("caminho2", "")}
                for i, t in enumerate(a["titulos"], 1):
                    if isinstance(t, dict):
                        row[f"Headline {i}"] = t["texto"]
                        if t.get("fixar"):
                            row[f"Headline {i} position"] = str(t["fixar"])
                    else:
                        row[f"Headline {i}"] = t
                for i, d in enumerate(a["descricoes"], 1):
                    row[f"Description {i}"] = d
                yield row


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    plano = json.load(open(sys.argv[1], encoding="utf-8"))
    erros, avisos = validar(plano)
    for a in avisos:
        print("AVISO:", a)
    if erros:
        print(f"{len(erros)} erro(s) — corrija o plano antes de gerar:")
        print("\n".join(" - " + e for e in erros))
        sys.exit(1)
    if "--so-validar" in sys.argv:
        print("OK: plano válido.")
        return
    rows = list(linhas(plano))
    usadas = [c for c in COLUNAS if any(r.get(c) for r in rows)]
    # UTF-16 com tabulação é o formato nativo do Google Ads Editor e preserva acentos.
    with open(sys.argv[2], "w", encoding="utf-16", newline="") as f:
        w = csv.DictWriter(f, fieldnames=usadas, delimiter="\t", extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)
    n_camp = len(plano["campanhas"])
    print(f"OK: {sys.argv[2]} gerado com {len(rows)} linhas ({n_camp} campanha(s), todas PAUSADAS).")


if __name__ == "__main__":
    main()
