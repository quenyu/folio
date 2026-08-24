# Motion system

- Boot sequence: 980ms, один раз за sessionStorage; есть явная кнопка пропуска.
- Cursor blink: единственная циклическая анимация, 900ms step-end.
- Hover/focus: 180–220ms только для цвета, границы и небольшого padding-сдвига строки проекта.
- Scroll: status line обновляет раздел и прогресс через `requestAnimationFrame`.
- Терминальные переходы используют smooth scroll только в обычном режиме.

При `prefers-reduced-motion: reduce` boot sequence скрывается, smooth scroll отключается, переходы и анимации сводятся к 0.01ms. Важная информация никогда не появляется исключительно через движение.
