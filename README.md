# Luminária de Leitura

App (PWA) para iPhone: uma **luz âmbar** na tela inteira para ler livros físicos no escuro sem atrapalhar o sono. Abre no Safari e fica na Tela de Início, em tela cheia e funcionando sem internet.

Mesma base do app-pace-esteira (React + Vite + TypeScript, GitHub Pages). Sem login nem banco: tudo fica no próprio celular.

## O que o app faz

- **Luz fixa e segura para o sono.** Tom fixo em 1800 K (âmbar sem nenhum azul; o Kindle Paperwhite vai até ~2700 K no mais quente, valor não confirmado pela Amazon). Não dá para escolher outra cor.
- **Intensidade limitada.** O slider vai de 1% a 100%, mas o 100% é só um âmbar escuro (cerca de 25% do máximo da tela). Começa em 30%.
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
