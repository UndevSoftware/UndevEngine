/* Подключение фреймворка */
const { Framework } = require('../framework/Framework.js');
/* Подключение файловой системы */
const fs = require('fs');

/* Создание фреймворка */
const FRWK = new Framework('dev');
/* Инициализация сервера */
const SRVR = new FRWK.Server('192.168.1.102', 3000);

/* Установление ключа SSL сертификата */
SRVR.Set('key', fs.readFileSync('./demo/certs/selfsigned.key'));
/* Установление SSL сертификата */
SRVR.Set('cert', fs.readFileSync('./demo/certs/selfsigned.crt'));

/* Создание сервеа */
SRVR.Instantiate();

/* Обработка GET-маршрута */
SRVR.Get('/', (request, response) => {
    response.render('/demo/UI/main.ehtml', {
        test: 'tested'
    });

    response.end();
});

/* Запуск сервера */
SRVR.Listen();