# ⭐ | Extended HTML

> Функция на данный момент нестабильна.

Расришенная версия HTML доступна только в методе `.render()` и добавляет следующий функционал:

- include других файлов (не только .ehtml)
- Внешние переменные (заданные на сервере)
- Шаблоны и кастомные элементы
- Плагины

### Тег include

Подключает сторонние файлы. Пример:

```html
<include href="./other.html">
```