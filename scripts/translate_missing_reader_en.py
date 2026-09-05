from __future__ import annotations

import argparse
import json
import re
import time
import unicodedata
from pathlib import Path

import translators as ts
from bs4 import BeautifulSoup
from bs4.element import NavigableString
from deep_translator import GoogleTranslator, MyMemoryTranslator


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "data" / "reader"
DST = ROOT / "src" / "data" / "reader-en"

TRANSLATOR = GoogleTranslator(source="fr", target="en")
MEMORY_TRANSLATOR = MyMemoryTranslator(source="fr-FR", target="en-US")
CACHE: dict[str, str] = {}

MANUAL = {
    "Le conseil d'Emilie": "Emilie's tip",
    "Le conseil d’Émilie": "Emilie's tip",
    "Plan d'action": "Action plan",
    "Ressources & lexique": "Resources & glossary",
    "Introduction": "Introduction",
}


def clean_translation(value: str) -> str:
    value = value.replace("—", "-").replace("–", "-").replace("‑", "-").replace("�", "")
    value = value.replace("Émilie", "Emilie").replace("Emília", "Emilie")
    value = value.replace("éMilie", "Emilie").replace("Emilie", "Emilie")
    value = value.replace("Quebec", "Quebec").replace("Québec", "Quebec")
    value = value.replace("RAP", "HBP").replace("CELIAPP", "FHSA")
    value = value.replace("Home Buyers' Plan", "HBP").replace("first home savings account", "FHSA")
    value = value.replace("Bienvenue tax", "Welcome Tax")
    value = value.replace("real estate broker", "real estate broker")
    value = value.replace("brokerage broker", "broker")
    return value


def translate_text(value: str) -> str:
    if not value or not value.strip():
        return value
    stripped = value.strip()
    if stripped in MANUAL:
        translated = MANUAL[stripped]
    else:
        translated = translate_with_fallback(stripped)
    translated = clean_translation(translated)
    if value[:1].isspace():
        translated = value[: len(value) - len(value.lstrip())] + translated
    if value[-1:].isspace():
        translated = translated + value[len(value.rstrip()) :]
    return translated


def ascii_soften(value: str) -> str:
    value = value.replace("’", "'").replace("«", '"').replace("»", '"').replace("—", "-")
    return "".join(ch for ch in unicodedata.normalize("NFKD", value) if not unicodedata.combining(ch))


def translate_with_fallback(value: str) -> str:
    if value in CACHE:
        return CACHE[value]
    attempts = [value, ascii_soften(value)]
    for engine in ("google", "sogou"):
        try:
            translated = ts.translate_text(
                value,
                from_language="fr",
                to_language="en",
                translator=engine,
                timeout=10,
            )
            if translated:
                translated = clean_translation(str(translated))
                CACHE[value] = translated
                return translated
        except Exception:
            pass
    if "__SEG_" not in value and len(value) < 1000:
        for attempt in attempts:
            try:
                translated = TRANSLATOR.translate(attempt)
                if translated:
                    translated = clean_translation(translated)
                    CACHE[value] = translated
                    return translated
            except Exception:
                pass

    if len(value) < 480:
        for attempt in attempts:
            try:
                translated = MEMORY_TRANSLATOR.translate(attempt)
                if translated:
                    translated = clean_translation(translated)
                    CACHE[value] = translated
                    return translated
            except Exception:
                pass

    pieces = re.split(r"(?<=[.!?;:])\s+", value)
    translated_pieces = []
    for piece in pieces:
        if not piece.strip():
            continue
        for attempt in (piece, ascii_soften(piece)):
            try:
                if len(attempt) < 1000:
                    translated = TRANSLATOR.translate(attempt)
                    if translated:
                        translated_pieces.append(translated)
                        break
            except Exception:
                pass
        else:
            try:
                translated_pieces.append(MEMORY_TRANSLATOR.translate(piece))
            except Exception:
                # Last-resort safeguard: keep the text rather than crashing the
                # whole batch; QA will catch remaining French if any.
                translated_pieces.append(piece)
    translated = clean_translation(" ".join(translated_pieces))
    CACHE[value] = translated
    return translated


def translate_long_text(value: str) -> str:
    if len(value) <= 3800:
        return translate_with_fallback(value)
    parts = []
    rest = value
    while len(rest) > 3800:
        cut = max(rest.rfind(". ", 0, 3600), rest.rfind("; ", 0, 3600), rest.rfind(": ", 0, 3600))
        if cut < 500:
            cut = 3600
        else:
            cut += 1
        parts.append(rest[:cut].strip())
        rest = rest[cut:].strip()
    if rest:
        parts.append(rest)
    return " ".join(translate_with_fallback(part) for part in parts)


def translate_segment_group(values: list[str]) -> list[str]:
    results: list[str] = []
    group: list[tuple[int, str]] = []
    length = 0

    def flush() -> None:
        nonlocal group, length
        if not group:
            return
        combined = "\n".join(f"__SEG_{idx}__ {text}" for idx, text in group)
        translated = translate_long_text(combined)
        found = {
            int(idx): text.strip()
            for idx, text in re.findall(r"__SEG_(\d+)__\s*(.*?)(?=\s*__SEG_\d+__|$)", translated, flags=re.S)
        }
        if len(found) == len(group):
            for idx, original in group:
                results.append(clean_translation(found.get(idx, original)))
        else:
            for _, original in group:
                results.append(translate_long_text(original))
        group = []
        length = 0

    for idx, text in enumerate(values):
        entry_len = len(text) + 18
        if group and length + entry_len > 3600:
            flush()
        group.append((idx, text))
        length += entry_len
    flush()
    return results


def translate_html(html: str) -> str:
    if not html.strip():
        return html
    soup = BeautifulSoup(html, "html.parser")
    nodes: list[NavigableString] = []
    originals: list[str] = []
    wrappers: list[tuple[str, str]] = []
    for node in list(soup.find_all(string=True)):
        if not isinstance(node, NavigableString):
            continue
        original = str(node)
        if not original.strip():
            continue
        prefix = original[: len(original) - len(original.lstrip())]
        suffix = original[len(original.rstrip()) :]
        nodes.append(node)
        originals.append(original.strip())
        wrappers.append((prefix, suffix))
    translated_nodes = translate_segment_group(originals)
    for node, translated, (prefix, suffix) in zip(nodes, translated_nodes, wrappers):
        node.replace_with(prefix + translated + suffix)
    out = str(soup)
    out = re.sub(r"<html><body>|</body></html>", "", out)
    return clean_translation(out)


def translate_file(src_path: Path, dst_path: Path) -> None:
    data = json.loads(src_path.read_text(encoding="utf-8"))
    out = {
        "number": data["number"],
        "title": translate_text(data.get("title", "")),
        "chapters": [],
        "qcm": [],
    }
    for chapter in data.get("chapters", []):
        out["chapters"].append(
            {
                "title": translate_text(chapter.get("title", "")),
                "objective": translate_text(chapter.get("objective", "")),
                "html": translate_html(chapter.get("html", "")),
            }
        )
    for item in data.get("qcm", []):
        out["qcm"].append(
            {
                "q": translate_text(item.get("q", "")),
                "options": [translate_text(option) for option in item.get("options", [])],
                "answer": item.get("answer", 0),
                "explanation": translate_text(item.get("explanation", "")),
            }
        )
    dst_path.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", action="store_true", help="Overwrite every English reader JSON from the French source.")
    parser.add_argument("--nums", nargs="*", type=int, help="Specific guide numbers to translate.")
    args = parser.parse_args()
    DST.mkdir(parents=True, exist_ok=True)
    wanted = [n for n in range(1, 51) if n not in (48, 49)]
    if args.nums:
        targets = args.nums
    elif args.all:
        targets = wanted
    else:
        targets = [n for n in wanted if not (DST / f"{n}.json").exists()]
    for n in targets:
        print(f"Translating {n}...", flush=True)
        translate_file(SRC / f"{n}.json", DST / f"{n}.json")
    print(f"Completed {len(targets)} English reader files.", flush=True)


if __name__ == "__main__":
    main()
