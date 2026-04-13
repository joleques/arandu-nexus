#!/usr/bin/env python3
"""
Gerador de imagens via API oficial do Google Gemini (Google AI Studio).

Saida padrao:
- output/imagem/{titulo}-{YYYY-MM-DD}/

Suporta:
- Prompt unico (--prompt)
- Lote de prompts via JSON (--prompts-json)
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import json
import mimetypes
import os
import re
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Tuple


DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com"
DEFAULT_API_VERSION = "v1beta"
DEFAULT_MODEL = "gemini-3.1-flash-image-preview"  # Nano Banana 2
DEFAULT_TIMEOUT = 180
DEFAULT_DOTENV_EXAMPLE = Path(__file__).resolve().parent / ".env.example"


def slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    ascii_only = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_only.lower()).strip("-")
    return slug or "sem-titulo"


def load_dotenv_file(dotenv_path: Path) -> None:
    if not dotenv_path.exists():
        return
    for raw_line in dotenv_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def ensure_dotenv_exists(dotenv_path: Path, dotenv_example_path: Path) -> bool:
    if dotenv_path.exists():
        return False
    dotenv_path.parent.mkdir(parents=True, exist_ok=True)
    if dotenv_example_path.exists():
        dotenv_path.write_text(
            dotenv_example_path.read_text(encoding="utf-8"), encoding="utf-8"
        )
    else:
        dotenv_path.write_text("GEMINI_API_KEY=coloque_sua_chave_aqui\n", encoding="utf-8")
    return True


def resolve_api_key() -> str:
    for env_key in (
        "GEMINI_API_KEY",
        "GOOGLE_API_KEY",
        "NANO_BANANA_API_KEY",
        "OPENAI_API_KEY",
        "API_KEY",
    ):
        val = os.getenv(env_key)
        if val:
            return val
    raise RuntimeError(
        "API key ausente.\n"
        "Como obter (Google AI Studio):\n"
        "1) Acesse https://aistudio.google.com/apikey\n"
        "2) Faça login com sua conta Google.\n"
        "3) Clique em 'Create API key'.\n"
        "4) Salve no .env: GEMINI_API_KEY=sua_chave\n"
        "5) Execute novamente o comando.\n"
        "Alternativas aceitas: GOOGLE_API_KEY, NANO_BANANA_API_KEY, OPENAI_API_KEY ou API_KEY."
    )


def build_output_dir(output_root: Path, titulo: str) -> Path:
    date_str = dt.datetime.now().strftime("%Y-%m-%d")
    base_name = f"{slugify(titulo)}-{date_str}"
    seq = 1
    while True:
        candidate = output_root / f"{base_name}-{seq}"
        try:
            candidate.mkdir(parents=True, exist_ok=False)
            return candidate
        except FileExistsError:
            pass
        seq += 1


def load_prompts(prompt: str | None, prompts_json: Path | None) -> List[Dict[str, Any]]:
    if bool(prompt) == bool(prompts_json):
        raise ValueError("Use exatamente uma opcao: --prompt ou --prompts-json.")
    if prompt:
        return [{"name": "imagem-principal", "prompt": prompt}]

    assert prompts_json is not None
    payload = json.loads(prompts_json.read_text(encoding="utf-8"))
    if not isinstance(payload, list) or not payload:
        raise ValueError("--prompts-json deve conter um array JSON nao vazio.")

    parsed: List[Dict[str, Any]] = []
    for idx, item in enumerate(payload, start=1):
        if not isinstance(item, dict):
            raise ValueError(f"Item {idx} de --prompts-json deve ser objeto JSON.")
        text = item.get("prompt")
        if not isinstance(text, str) or not text.strip():
            raise ValueError(f"Item {idx} sem campo 'prompt' valido.")
        name = item.get("name") or f"slide-{idx:02d}"
        parsed.append(
            {
                "name": str(name),
                "prompt": text.strip(),
                "n": int(item.get("n", 1)),
            }
        )
    return parsed


def post_json(
    url: str, headers: Dict[str, str], body: Dict[str, Any], timeout: int
) -> Dict[str, Any]:
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        details = err.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Erro HTTP {err.code} em {url}: {details}") from err
    except urllib.error.URLError as err:
        raise RuntimeError(f"Falha de conexao em {url}: {err}") from err


def get_json(url: str, headers: Dict[str, str], timeout: int) -> Dict[str, Any]:
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        details = err.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Erro HTTP {err.code} em {url}: {details}") from err
    except urllib.error.URLError as err:
        raise RuntimeError(f"Falha de conexao em {url}: {err}") from err


def parse_gemini_images(response: Dict[str, Any]) -> Tuple[List[Tuple[bytes, str]], List[str]]:
    images: List[Tuple[bytes, str]] = []
    texts: List[str] = []
    candidates = response.get("candidates")
    if not isinstance(candidates, list):
        raise RuntimeError("Resposta sem 'candidates' valida.")

    for cand in candidates:
        if not isinstance(cand, dict):
            continue
        content = cand.get("content")
        if not isinstance(content, dict):
            continue
        parts = content.get("parts")
        if not isinstance(parts, list):
            continue
        for part in parts:
            if not isinstance(part, dict):
                continue
            txt = part.get("text")
            if isinstance(txt, str) and txt.strip():
                texts.append(txt.strip())
            inline = part.get("inlineData")
            if isinstance(inline, dict) and inline.get("data"):
                mime = str(inline.get("mimeType", "image/png"))
                binary = base64.b64decode(str(inline["data"]))
                images.append((binary, mime))

    if not images:
        raise RuntimeError(
            f"Nenhuma imagem encontrada na resposta Gemini: {json.dumps(response, ensure_ascii=False)[:1200]}"
        )
    return images, texts


def build_generate_url(base_url: str, api_version: str, model: str) -> str:
    return f"{base_url.rstrip('/')}/{api_version}/models/{model}:generateContent"


def build_models_url(base_url: str, api_version: str) -> str:
    return f"{base_url.rstrip('/')}/{api_version}/models"


def run_preflight(
    api_key: str,
    base_url: str,
    api_version: str,
    model: str,
    timeout: int,
    output_root: Path,
    check_remote: bool = True,
) -> Tuple[bool, List[str]]:
    notes: List[str] = []
    headers = {
        "x-goog-api-key": api_key,
        "Content-Type": "application/json",
    }

    try:
        output_root.mkdir(parents=True, exist_ok=True)
        notes.append(f"[ok] Escrita em pasta de saida validada: {output_root}")
    except Exception as exc:
        notes.append(f"[erro] Falha ao preparar pasta de saida ({output_root}): {exc}")
        return False, notes

    if check_remote:
        models_url = build_models_url(base_url, api_version)
        try:
            models_payload = get_json(models_url, headers=headers, timeout=timeout)
        except Exception as exc:
            notes.append(f"[erro] Falha ao consultar modelos Gemini: {exc}")
            return False, notes

        models = models_payload.get("models")
        if not isinstance(models, list):
            notes.append(
                f"[erro] Resposta inesperada em /models: {json.dumps(models_payload, ensure_ascii=False)[:400]}"
            )
            return False, notes

        model_full = f"models/{model}"
        model_found = any(
            isinstance(m, dict)
            and (m.get("name") == model_full or str(m.get("name", "")).endswith(f"/{model}"))
            for m in models
        )
        if model_found:
            notes.append(f"[ok] Modelo encontrado na API oficial: {model}")
        else:
            notes.append(
                f"[erro] Modelo '{model}' nao encontrado em /models. Verifique o nome/modelo disponivel."
            )
            return False, notes
        notes.append("[ok] API oficial Google Gemini acessivel e chave valida.")
    else:
        notes.append("[info] Dry-run: validacao remota da API pulada.")
    return True, notes


def mime_to_extension(mime: str) -> str:
    ext = mimetypes.guess_extension(mime.split(";")[0].strip())
    if not ext:
        return ".png"
    if ext == ".jpe":
        return ".jpg"
    return ext


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Gera imagens via API oficial Google Gemini (Nano Banana)."
    )
    parser.add_argument("--titulo", help="Titulo da pasta de saida.")
    parser.add_argument("--prompt", help="Prompt unico para geracao.")
    parser.add_argument("--prompts-json", type=Path, help="Arquivo JSON com prompts.")
    parser.add_argument("--modelo", default=os.getenv("GEMINI_MODEL", DEFAULT_MODEL))
    parser.add_argument("--base-url", default=os.getenv("GEMINI_BASE_URL", DEFAULT_BASE_URL))
    parser.add_argument(
        "--api-version", default=os.getenv("GEMINI_API_VERSION", DEFAULT_API_VERSION)
    )
    parser.add_argument(
        "--aspect-ratio",
        default=os.getenv("GEMINI_ASPECT_RATIO"),
        help="Opcional. Ex.: 1:1, 9:16, 16:9.",
    )
    parser.add_argument(
        "--image-size",
        default=os.getenv("GEMINI_IMAGE_SIZE"),
        help="Opcional para modelos Gemini 3 image preview. Ex.: 2K.",
    )
    parser.add_argument("--quantidade", type=int, default=1)
    parser.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT)
    parser.add_argument("--output-root", type=Path, default=Path("output/imagem"))
    parser.add_argument("--dotenv", type=Path, default=Path(".env"))
    parser.add_argument(
        "--dotenv-example",
        type=Path,
        default=DEFAULT_DOTENV_EXAMPLE,
        help="Arquivo base para criar .env automaticamente quando ausente.",
    )
    parser.add_argument(
        "--extra-body-json",
        type=Path,
        help="JSON opcional para merge no payload oficial do generateContent.",
    )
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--preflight-only", action="store_true")
    args = parser.parse_args()

    dotenv_created = ensure_dotenv_exists(args.dotenv, args.dotenv_example)
    if dotenv_created:
        print(
            f"[info] Arquivo {args.dotenv} nao existia e foi criado a partir de {args.dotenv_example}."
        )
    load_dotenv_file(args.dotenv)

    try:
        api_key = resolve_api_key()
    except Exception as exc:
        print(f"[erro] {exc}", file=sys.stderr)
        return 2

    ok, notes = run_preflight(
        api_key=api_key,
        base_url=args.base_url,
        api_version=args.api_version,
        model=args.modelo,
        timeout=args.timeout,
        output_root=args.output_root,
        check_remote=not args.dry_run,
    )
    for note in notes:
        print(note)
    if not ok:
        return 1
    if args.preflight_only:
        print("[ok] Preflight concluido. Setup tecnico aprovado.")
        return 0

    if not args.titulo:
        print("[erro] --titulo e obrigatorio quando nao estiver em --preflight-only.", file=sys.stderr)
        return 2

    try:
        prompts = load_prompts(args.prompt, args.prompts_json)
    except Exception as exc:
        print(f"[erro] {exc}", file=sys.stderr)
        return 2

    extra_body: Dict[str, Any] = {}
    if args.extra_body_json:
        try:
            loaded = json.loads(args.extra_body_json.read_text(encoding="utf-8"))
            if not isinstance(loaded, dict):
                raise ValueError("--extra-body-json precisa ser um objeto JSON.")
            extra_body = loaded
        except Exception as exc:
            print(f"[erro] Falha em --extra-body-json: {exc}", file=sys.stderr)
            return 2

    output_dir = build_output_dir(args.output_root, args.titulo)
    artifacts_dir = output_dir / "artefatos"
    result_dir = output_dir / "resultado"
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    result_dir.mkdir(parents=True, exist_ok=True)
    api_url = build_generate_url(args.base_url, args.api_version, args.modelo)
    headers = {
        "x-goog-api-key": api_key,
        "Content-Type": "application/json",
    }

    manifest: Dict[str, Any] = {
        "titulo": args.titulo,
        "output_dir": str(output_dir),
        "artifacts_dir": str(artifacts_dir),
        "result_dir": str(result_dir),
        "created_at": dt.datetime.now().isoformat(),
        "provider": "google-gemini-official",
        "model": args.modelo,
        "base_url": args.base_url,
        "api_version": args.api_version,
        "requests": [],
        "files": [],
        "dry_run": args.dry_run,
    }

    if args.dry_run:
        (artifacts_dir / "manifest.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"[ok] Dry-run concluido. Pasta criada em: {output_dir}")
        return 0

    text_outputs: List[str] = []
    for item in prompts:
        repetitions = int(item.get("n", args.quantidade))
        if repetitions < 1:
            repetitions = 1

        for rep in range(1, repetitions + 1):
            generation_config: Dict[str, Any] = {"responseModalities": ["Image"]}
            image_config: Dict[str, Any] = {}
            if args.aspect_ratio:
                image_config["aspectRatio"] = args.aspect_ratio
            if args.image_size:
                image_config["imageSize"] = args.image_size
            if image_config:
                generation_config["imageConfig"] = image_config

            body: Dict[str, Any] = {
                "contents": [{"parts": [{"text": item["prompt"]}]}],
                "generationConfig": generation_config,
            }
            body.update(extra_body)
            manifest["requests"].append(
                {"name": item["name"], "repetition": rep, "payload": body}
            )

            try:
                response = post_json(api_url, headers=headers, body=body, timeout=args.timeout)
                images, texts = parse_gemini_images(response)
                text_outputs.extend(texts)
            except Exception as exc:
                print(f"[erro] Falha para '{item['name']}' (tentativa {rep}): {exc}", file=sys.stderr)
                (artifacts_dir / "manifest.json").write_text(
                    json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
                )
                return 1

            for idx, (binary, mime) in enumerate(images, start=1):
                stem = slugify(item["name"])
                if repetitions > 1 or len(images) > 1:
                    stem = f"{stem}-r{rep:02d}-i{idx:02d}"
                ext = mime_to_extension(mime)
                out_path = result_dir / f"{stem}{ext}"
                out_path.write_bytes(binary)
                manifest["files"].append(str(out_path))
                print(f"[ok] Imagem salva: {out_path}")

    (artifacts_dir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    if text_outputs:
        (artifacts_dir / "texto-retornado.md").write_text(
            "\n\n".join(text_outputs), encoding="utf-8"
        )

    prompt_dump: List[str] = []
    for req in manifest["requests"]:
        prompt_dump.append(f"## {req['name']} (repetition {req['repetition']})\n")
        prompt_dump.append(req["payload"]["contents"][0]["parts"][0]["text"])
        prompt_dump.append("\n")
    (artifacts_dir / "prompts-usados.md").write_text(
        "\n".join(prompt_dump), encoding="utf-8"
    )

    print(f"[ok] Execucao concluida. Saida em: {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
