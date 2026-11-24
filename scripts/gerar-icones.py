# Gera o ícone (luz âmbar com a página de um livro) e as telas de abertura do iPhone:
#   python3 scripts/gerar-icones.py
# O iPhone arredonda os cantos do ícone sozinho.
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

raiz = Path(__file__).resolve().parent.parent
publico = raiz / 'public'
FUNDO = (10, 6, 3)
AMBAR = (255, 138, 18)


def luz(tam):
    """Círculo de luz âmbar com halo, em fundo transparente."""
    s = tam * 4
    c = s / 2
    arte = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    halo = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    r = s * 0.30
    ImageDraw.Draw(halo).ellipse([c - r, c - r, c + r, c + r], fill=AMBAR + (255,))
    halo = halo.filter(ImageFilter.GaussianBlur(s * 0.10))
    arte = Image.alpha_composite(arte, halo)
    r = s * 0.24
    ImageDraw.Draw(arte).ellipse([c - r, c - r, c + r, c + r], fill=(255, 168, 56, 255))
    r = s * 0.17
    ImageDraw.Draw(arte).ellipse([c - r, c - r, c + r, c + r], fill=(255, 196, 110, 255))
    return arte.resize((tam, tam), Image.LANCZOS)


def icone(tam, escala=1.0):
    img = Image.new('RGBA', (tam, tam), FUNDO + (255,))
    a = luz(round(tam * escala))
    img.alpha_composite(a, ((tam - a.width) // 2, (tam - a.height) // 2))
    return img.convert('RGB')


base = icone(1024)
for nome, tam in [('icone-512.png', 512), ('icone-192.png', 192), ('apple-touch-icon.png', 180)]:
    base.resize((tam, tam), Image.LANCZOS).save(publico / nome, optimize=True)
icone(512, 0.8).save(publico / 'icone-maskable-512.png', optimize=True)

# Telas de abertura (mesmos tamanhos do index.html)
TAMANHOS = [
    (1320, 2868), (1290, 2796), (1260, 2736), (1206, 2622), (1179, 2556), (1284, 2778),
    (1170, 2532), (1125, 2436), (1242, 2688), (828, 1792), (1242, 2208), (750, 1334),
]
(publico / 'abertura').mkdir(exist_ok=True)
arte = luz(1024)
for larg, alt in TAMANHOS:
    img = Image.new('RGBA', (larg, alt), FUNDO + (255,))
    lado = round(larg * 0.5)
    a = arte.resize((lado, lado), Image.LANCZOS)
    img.alpha_composite(a, ((larg - lado) // 2, (alt - lado) // 2))
    img.convert('RGB').save(publico / 'abertura' / f'abertura-{larg}x{alt}.png', optimize=True)

print('ícones e aberturas gerados')
