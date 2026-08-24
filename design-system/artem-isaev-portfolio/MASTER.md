# Дизайн-система портфолио Артёма Исаева

Источник истины: компактный terminal-document, а не marketing landing page.

## Геометрия

- Единственная колонка homepage: `width: min(700px, calc(100vw - 32px))`.
- Desktop: ровно 700px и центрирование; mobile: 16px фактических полей.
- Prompt, ASCII, intro, все секции, контакты и footer имеют одну левую границу.
- Верхняя композиция заканчивается у 630px; только status bar занимает всю ширину viewport.

## Типографика

- Единственное семейство: JetBrains Mono с кириллицей.
- Desktop body: 15.5px / 27.125px / 400.
- Prompt: 13.1px / 22.96px; microcopy: 11.8px / 20.7px.
- Иерархия строится цветом, индексами, весом и интервалами, не display-заголовками.

## Цвет

| Токен | Значение |
| --- | --- |
| `--bg` | `#040406` |
| `--ink` | `#E7E4DC` |
| `--dim` | `#807E8A` |
| `--faint` | `#3A3A44` |
| `--line` | `rgba(231, 228, 220, 0.12)` |
| `--ac` | `#E18585` по умолчанию |

ASCII-переключатель меняет единый глобальный акцент: coral, blue, yellow или green. Accent применяется к prompt, artwork, label, ссылкам, выделениям, индексам, разделителям и status progress.

## Компоненты

- ASCII: 4 оригинальные bitmap/dither-варианта, 700×236px на desktop, без рамки.
- Work: индексная таблица; номер, название, metadata, один абзац и текстовая CTA.
- Services/process: компактные numbered rows.
- About: один абзац без вымышленного портрета.
- Contact: текстовая таблица только с подтверждёнными Telegram, GitHub и location.
- Status: 37–38px fixed bar, section + progress + percent + time.

## Атмосфера и motion

- Тонкие scanlines и почти незаметное зерно; никакого glow, glass, CRT distortion или browser chrome.
- Смена темы не дольше 180ms.
- Один block cursor; при `prefers-reduced-motion` мигание и smooth scroll отключены.

## Запрещено

Top navigation, wide 1400px homepage, hero frame, two-column hero, giant slogan, cards, pills, thumbnails на homepage, пропорциональные шрифты, декоративные gradients, demo/concept badges и неподтверждённые контакты или результаты.
