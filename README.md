# Luminária de Leitura

App (PWA) para iPhone: uma **luz âmbar** na tela inteira para ler livros físicos no escuro sem atrapalhar o sono. Abre no Safari e fica na Tela de Início, em tela cheia e funcionando sem internet.

Mesma base do app-pace-esteira (React + Vite + TypeScript, GitHub Pages). Sem login nem banco: tudo fica no próprio celular.

## O que o app faz

- **24 níveis de intensidade**, como o controle de brilho do Kindle (níveis relativos, sem valor absoluto). Cada nível dá uma cor diferente e o teto é um âmbar escuro, bem abaixo da tela cheia. Vibração leve a cada passo.
- **9 tons, todos sem azul** (do âmbar mais vermelho ao mais amarelo). Não existe tom branco nem com azul.
- **Apagar sozinha** em 15, 30 ou 60 min: a luz fica cheia por 60% do tempo, diminui devagar e apaga. Um toque na tela acende de novo.
- **Tela sempre acesa** (Screen Wake Lock) enquanto o app está aberto.
- Um toque na tela mostra ou esconde os controles, que ficam no mesmo tom, bem fracos.
- Guarda a última configuração.

Contas em `src/lib/luz.ts`, com testes em `luz.test.ts`.

## Rodar localmente

```bash
npm install
npm run dev     # app em http://localhost:5173
npm test        # testes
```

Ícone e telas de abertura: `python3 scripts/gerar-icones.py` (precisa do Pillow).

## Colocar no ar (uma vez)

1. **Settings → General → Danger Zone → Change visibility → Public** (o GitHub Pages grátis exige repositório público).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Faça o merge na `main` ou rode **Actions → Publicar app → Run workflow**.

O app fica em <https://neivapedro.github.io/app-luminaria-leitura/>. No iPhone, abra no **Safari**, toque em **Compartilhar → Adicionar à Tela de Início** e abra pelo ícone.

Para a tela não apagar sozinha: Ajustes do iPhone → Tela e Brilho → Bloqueio Automático → Nunca.
