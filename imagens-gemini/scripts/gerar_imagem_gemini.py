"""Gera ou edita imagens com o Google Gemini (Nano Banana) usando só a biblioteca padrão.

Chave: variável de ambiente GEMINI_API_KEY ou GOOGLE_API_KEY (crie em aistudio.google.com/apikey).

Uso:
    python gerar_imagem_gemini.py --listar-modelos
    python gerar_imagem_gemini.py "prompt" --saida anuncio.png [--proporcao 1:1] [--tamanho 1K]
                                  [--modelo ID] [--referencia foto.png ...] [--variacoes 3]
"""
import argparse
import base64
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.request

API = "https://generativelanguage.googleapis.com/v1beta"
PREFERIDOS = ["gemini-3.1-flash-image", "gemini-nano-banana-2.1", "gemini-3-pro-image",
              "gemini-3.1-flash-lite-image", "gemini-2.5-flash-image"]
PROPORCOES = ["1:1", "1:4", "1:8", "2:3", "3:2", "3:4", "4:1", "4:3", "4:5", "5:4", "8:1",
              "9:16", "16:9", "21:9"]


def chave():
    k = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not k:
        sys.exit("Chave não encontrada: defina GEMINI_API_KEY (ou GOOGLE_API_KEY). "
                 "Crie em https://aistudio.google.com/apikey")
    return k


def req(metodo, caminho, corpo=None):
    r = urllib.request.Request(f"{API}/{caminho}", method=metodo,
                               data=json.dumps(corpo).encode() if corpo else None,
                               headers={"x-goog-api-key": chave(), "content-type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=180) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        msg = e.read().decode("utf-8", "replace")
        try:
            msg = json.loads(msg)["error"]["message"]
        except Exception:
            pass
        sys.exit(f"Erro {e.code} do Gemini: {msg}")


def modelos_imagem():
    out, token = [], ""
    while True:
        j = req("GET", "models?pageSize=1000" + (f"&pageToken={token}" if token else ""))
        for m in j.get("models", []):
            nome = m["name"].split("/", 1)[-1]
            if "image" in nome and "generateContent" in m.get("supportedGenerationMethods", []):
                out.append((nome, m.get("displayName", "")))
        token = j.get("nextPageToken")
        if not token:
            return out


def escolher_modelo(pedido):
    disponiveis = [n for n, _ in modelos_imagem()]
    if pedido:
        if pedido not in disponiveis:
            sys.exit(f"Modelo '{pedido}' indisponível para esta chave. Disponíveis: {', '.join(disponiveis) or 'nenhum'}")
        return pedido
    for p in PREFERIDOS:
        if p in disponiveis:
            return p
    if disponiveis:
        return disponiveis[0]
    sys.exit("Nenhum modelo de imagem disponível para esta chave (verifique se o faturamento está ativo no projeto).")


def gerar(prompt, modelo, proporcao, tamanho, referencias):
    partes = [{"text": prompt}]
    for ref in referencias:
        mime = mimetypes.guess_type(ref)[0] or "image/png"
        with open(ref, "rb") as f:
            partes.append({"inlineData": {"mimeType": mime, "data": base64.b64encode(f.read()).decode()}})
    cfg = {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": proporcao}}
    if tamanho:
        cfg["imageConfig"]["imageSize"] = tamanho
    j = req("POST", f"models/{modelo}:generateContent",
            {"contents": [{"role": "user", "parts": partes}], "generationConfig": cfg})
    for c in j.get("candidates", []):
        for p in c.get("content", {}).get("parts", []):
            dado = p.get("inlineData") or p.get("inline_data")
            if dado and dado.get("data"):
                return base64.b64decode(dado["data"]), dado.get("mimeType", "image/png")
    motivo = (j.get("promptFeedback") or {}).get("blockReason") or \
        (j.get("candidates") or [{}])[0].get("finishReason", "sem imagem na resposta")
    sys.exit(f"O Gemini não devolveu imagem ({motivo}). Ajuste o prompt e tente de novo.")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("prompt", nargs="?")
    ap.add_argument("--saida", default="imagem.png")
    ap.add_argument("--proporcao", default="1:1", choices=PROPORCOES)
    ap.add_argument("--tamanho", choices=["512", "1K", "2K", "4K"])
    ap.add_argument("--modelo")
    ap.add_argument("--referencia", action="append", default=[], help="imagem de referência (pode repetir)")
    ap.add_argument("--variacoes", type=int, default=1)
    ap.add_argument("--listar-modelos", action="store_true")
    a = ap.parse_args()

    if a.listar_modelos:
        for nome, disp in modelos_imagem():
            print(f"{nome}\t{disp}")
        return
    if not a.prompt:
        ap.error("informe o prompt")
    modelo = escolher_modelo(a.modelo)
    base, ext0 = os.path.splitext(a.saida)
    for i in range(1, a.variacoes + 1):
        img, mime = gerar(a.prompt, modelo, a.proporcao, a.tamanho, a.referencia)
        ext = mimetypes.guess_extension(mime) or ext0 or ".png"
        if ext == ".jpe":
            ext = ".jpg"
        destino = f"{base}{'-' + str(i) if a.variacoes > 1 else ''}{ext}"
        os.makedirs(os.path.dirname(os.path.abspath(destino)), exist_ok=True)
        with open(destino, "wb") as f:
            f.write(img)
        print(f"OK: {destino} ({len(img) // 1024} KB, modelo {modelo}, {a.proporcao})")


if __name__ == "__main__":
    main()
