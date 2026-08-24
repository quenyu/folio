# Дизайн-система портфолио Артёма Исаева

Источник истины: один компактный terminal-document, а не marketing landing page.

## Геометрия

- Homepage использует единственную колонку width: min(700px, calc(100vw - 32px)).
- Desktop: ровно 700px и центрирование; mobile: фактические поля 16px.
- Prompt, ASCII, intro, все секции, контакты и footer имеют одну левую границу.
- Selected work начинается около 630px от верхней границы desktop viewport.
- Только fixed status bar занимает всю ширину viewport.

## Типографика

- Единственное семейство: реально загруженный JetBrains Mono с кириллицей.
- Body: 15.5px, line-height 1.75, weight 400, normal tracking.
- Prompt: 13.1px / 22.96px; microcopy: 11.8px / 20.7px.
- Weight 600 используется для названий и ссылок, 700 — только для коротких label.
- Иерархия строится цветом, индексами, весом и интервалами, не крупными marketing headline.

## Цвет

| Токен | Значение |
| --- | --- |
| --bg | #040406 |
| --ink | #E7E4DC |
| --dim | #807E8A |
| --faint | #3A3A44 |
| --line | rgba(231, 228, 220, 0.12) |
| --ac | #E18585 по умолчанию |

Доступные темы в исходном порядке: blue #8AAEE8, yellow #E6C44C, coral #E18585, green #8FD79E, violet #B585F2, silver #D2D6E0. Начальный offset выбирает coral; каждый переход ASCII меняет единый глобальный акцент.

## ASCII

- Базовая маска ARTEM / ISAEV строится из прямоугольных bitmap-матриц 5×7.
- Все 15 строк имеют одинаковую длину; core glyph никогда не удаляется.
- Рендер — общая CSS grid 87×15 с block glyphs JetBrains Mono, без transform и случайных сдвигов.
- Четыре варианта различаются block/dither treatment; click, Enter и Space проходят 12-шаговый общий цикл art/theme.
- Desktop artwork: 700×240px; mobile масштабируется пропорционально.

Три разделителя используются ровно по одному разу и сохраняют whitespace: robot перед work, rabbit перед about, cat перед contact.

## Компоненты

- Work: индексная таблица; номер, название, metadata, один абзац и текстовая CTA.
- Services/process: компактные numbered rows.
- About: один абзац без вымышленного портрета.
- Contact: только подтверждённые Telegram, GitHub и location.
- Status: 37–38px fixed bar, section + progress + percent + time.

## Атмосфера и motion

- Низкоконтрастные scanlines и grain находятся в фоне страницы и не перекрывают контент.
- Смена темы — не дольше 180ms.
- Один block cursor; при prefers-reduced-motion мигание и smooth scroll отключены.

## Запрещено

Top navigation homepage, wide 1400px shell, hero frame, two-column hero, giant slogan, cards, pills, homepage thumbnails, пропорциональные шрифты, glow, glass, CRT distortion, demo/concept badges и неподтверждённые контакты или результаты.
