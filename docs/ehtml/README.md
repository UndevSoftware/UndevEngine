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
### Серверные переменные.

Что мы делаем на сервере:

```js
Framework.Get('/', (req, res) => {
  res.render('./main.ehtml', {
    test: 'tested'
  });
  
  return res.end();
});
```

Что мы пишем в `main.ehtml`:

```html
<body>
  <test>
</body>
```

Что увидем в браузере:

<img src="https://github.com/UndevSoftware/UndevEngine/blob/main/IMAGES/Variables%20Demo.png">

## Изменение серверных переменных.

Для создания переменной или изменения значения существующей пишем следующее:

```html
<body>
  <set name="myName" value="myValue">
  <myName>
</body>
```

К сожалению скрина не будет, попробуйте сами (я интриган)
