const { IncomingMessage, ServerResponse } = require('http');
const
    https = require('https'),
    fs = require('fs');

/**
 * Полная информация о движке UndevEngine. В объекте есть версия, информация о
 * распространителе и о разработчиках.
 * 
 * @author Максим Рулетов (ruletkasuperstar)
 * @readonly
 * @type {{}}
 */
const Meta = {
    /**
     * Версия текущего релиза. Первая цифра - количество крупных обновлений,
     * вторая - мелких, третья - общее количество исправленных ошибок.
     * 
     * alpha, beta, release - состояние релиза.
     * 
     * alpha - имеет некоторый функционал, который может быть нестабилен.
     * Такой тип функционала помечен как U, его использование не желательно.
     * 
     * beta - нестабильный функционал уже стабилен и активно тестируется. Его
     * использование уже возможно. Помечены буквой B.
     * 
     * release - все функции стабильны и протестированы. Помечены буквой R.
     * 
     * @readonly
     * @type {string}
     */
    version: '2.18.89-alpha',
    /**
     * Официальным и единственных распространителем UndevEngine и всех его
     * компонентов является UndevSoftware. Любые модификации фреймворка не
     * являются ответственностью оригинального распространителя.
     * 
     * @readonly
     * @type {string}
     */
    distributor: 'UndevSoftware',
    /**
     * Полный состав разработчиков проекта. Вы конечно можете сюда себя добавить,
     * но тогда это будет ваша модификация.
     * 
     * @readonly
     * @type {Object[]}
     */
    developers: [
        { name: 'Максим Рулетов', email: 'ruletka.modb@gmail.com', status: 'Lead Developer' }
    ]
};

/**
 * Изменять конфигурацию проекта, при его выполнении запрещено!
 */
Object.freeze(Meta);

/**
 * Основной класс UndevEngine.
 * 
 * Подробнее о настройках окружения можно узнать в GitHub-репозитории (в разделе wiki).
 * 
 * @public
 * @author Максим Рулетов (ruletkasuperstar)
 * @param {'dev'|'prod'} environmentStatus 
 * @returns {Framework}
 */
function Framework(/* Настройка окружения. dev - для разработки, prod - для полноценного функционирования. */ environmentStatus) {
    /**
     * Общая настройка окружения.
     * 
     * @public
     * @type {'dev'|'prod'}
     */
    this.environmentStatus;

    /* Исключены какие либо значения кроме dev или prod */
    if (!environmentStatus || typeof environmentStatus !== 'string') {
        /* Для безопасности устанавливается автоматически prod */
        this.environmentStatus = 'prod';
    }
    else {
        if (!['dev', 'prod'].includes(environmentStatus.toLowerCase())) {
            this.environmentStatus = 'prod';
        }
        else {
            this.environmentStatus = environmentStatus.toLowerCase();
        }
    }

    if (this.environmentStatus === 'dev') {
        /**
         * Глобальный журнал для действий движка.
         */
        this.logs = [];

        /**
         * Добавление дейстий в журнал
         * 
         * @public
         * @param {string} title 
         * @param {string} message 
         * @returns {Framework}
         */
        this.Log = function(title, message) {
            if (!title || typeof title !== 'string') {
                return console.warn('Невозможно создать запись. Заголовок не указан или указан неверно!');
            }

            if (!message || typeof message !== 'string') {
                return console.warn('Невозможно создать запись. Сообщение не указан или указан неверно!');
            }

            this.logs.push({
                title,
                message,
                date: Date.now()
            });
        }
    }

    /**
     * Список интегрированых плагинов.
     * 
     * @public
     * @type {Array}
     */
    this.plugins = [];

    const self = this;

    /**
     * Компонент Серверной оболочки.
     * 
     * @public
     * @author Максим Рулетов (ruletkasuperstar)
     * @param {string} host 
     * @param {number} port
     * @returns {Server}
     */
    this.Server = function(host, port = 3000) {
        /**
         * Хост на котором будет запущен сервер
         * 
         * @public
         * @type {string}
         */
        this.host;
        /**
         * Порт на котором будет запущен сервер. Значение по умолчанию 3000
         * 
         * @public
         * @type {number}
         */
        this.port = port;

        if (!host) {
            this.host = 'localhost';
        }
        else {
            if (typeof host !== 'string') {
                this.host = 'localhost';
            }
            else {
                this.host = host;
            }
        }

        /**
         * Прототип сервера.
         * 
         * @public
         * @type {https.Server}
         */
        this.instance;

        /**
         * Ключ SSL сертификата.
         * 
         * @public
         * @type {Buffer}
         */
        this.key;
        /**
         * Сам SSL сертификат
         * 
         * @public
         * @type {Buffer}
         */
        this.cert;

        /**
         * Все маршруты.
         * 
         * @public
         * @type {Object[]}
         */
        this.routes = [];

        /**
         * Корневая директория проекта.
         * 
         * @public
         * @type {string}
         */
        this.staticPath = './';

        /**
         * Изменение значений
         * 
         * @public
         * @param {string} key 
         * @param {*} value 
         * @returns {Server}
         */
        this.Set = function(key, value) {
            this[key] = value;

            return this;
        }

        /**
         * Создание сервера.
         * 
         * @public
         * @returns {Server}
         */
        this.Instantiate = function() {
            if (!this.key || !this.cert) {
                return console.error('Не задан ключ сертификата или сам сертификат.');
            }

            let _self = this;

            /* Инициализация сервера */
            this.instance = https.createServer({
                key: _self.key,
                cert: _self.cert
            }, (request, response) => {
                let body = '';

                /* Если были найдены данные они будут записаны. */
                request.on('data', (chunk) => {
                    body += chunk.toString();
                });

                /* Начало обработки маршрута */
                request.on('end', () => {
                    if (body.length > 0) {
                        request.body = body;
                    }

                    _self.Proccess(request, response);
                });
            });

            return this;
        }

        this.Listen = function() {
            if (!this.instance instanceof https.Server) {
                if (self.environmentStatus == 'dev') {
                    console.error('Сервер не может быть запущен, так как его нет!\nИспользуйте .Instantiate()');
                }

                return;
            }

            this.instance.listen(this.port, this.host);

            return this;
        }

        /**
         * Добавление GET-маршрута
         * 
         * @param {string} path 
         * @param {Function} callback
         * @returns {Server}
         * @public
         */
        this.Get = function(path, callback) {
            if (!path || typeof path !== 'string') {
                if (self.environmentStatus == 'dev') {
                    console.warn('Get("' + path + '", callback) -> Ошибка! Путь не указан или его тип не соответствует string');
                }

                return;
            }

            if (!callback || typeof callback !== 'function') {
                if (self.environmentStatus == 'dev') {
                    console.warn('Get("' + path + '", callback) -> Ошибка! Функция обратного вызова не указана или её тип не соответствует function');
                }

                return;
            }

            if (this.routes.find(item => item.path == path)) {
                if (self.environmentStatus == 'dev') {
                    console.warn('Get("' + path + '", callback) -> Ошибка! Указаный путь уже обрабатывается');
                }

                return;
            }

            this.routes.push({
                method: 'GET',
                path,
                callback
            });
        }

        /**
         * Добавление POST-маршрута
         * 
         * @param {string} path 
         * @param {Function} callback
         * @returns {Server}
         * @public
         */
        this.Post = function(path, callback) {
            if (!path || typeof path !== 'string') {
                if (self.environmentStatus == 'dev') {
                    console.warn('Post("' + path + '", callback) -> Ошибка! Путь не указан или его тип не соответствует string');
                }

                return;
            }

            if (!callback || typeof callback !== 'function') {
                if (self.environmentStatus == 'dev') {
                    console.warn('Post("' + path + '", callback) -> Ошибка! Функция обратного вызова не указана или её тип не соответствует function');
                }

                return;
            }

            if (this.routes.find(item => item.path == path)) {
                if (self.environmentStatus == 'dev') {
                    console.warn('Post("' + path + '", callback) -> Ошибка! Указаный путь уже обрабатывается');
                }

                return;
            }

            this.routes.push({
                method: 'POST',
                path,
                callback
            });
        }

        /**
         * Обработка маршрутов.
         * 
         * @public
         * @param {IncomingMessage} request 
         * @param {ServerResponse} response 
         * @returns {Server}
         */
        this.Proccess = function(request, response) {
            const _self = this;

            /**
             * IP-адресс, с которого был сделан запрос.
             * 
             * @readonly
             * @type {string}
             */
            request.ip = request.socket.remoteAddress;

            /**
             * Отправка файлов с сервера.
             * 
             * @public
             * @param {string} fileName 
             * @returns {Server}
             */
            response.sendFile = function(fileName) {
                let extension = fileName.split('/')[fileName.split('/').length - 1].split('.');
                extension = extension[extension.length - 1];

                if (!fs.existsSync(_self.staticPath + (fileName[0] == "/" ? "" : "/") + fileName)) {
                    response.writeHead(404);
                }
                else {
                    if (['htm', 'html'].includes(extension)) {
                        response.setHeader('Content-Type', 'text/html');
                    }
                    else if (extension === 'xml') {
                        response.setHeader('Content-Type', 'text/xml');
                    }
                    else if (extension === 'txt') {
                        response.setHeader('Content-Type', 'text/plain');
                    }
                    else if (extension === 'json') {
                        response.setHeader('Content-Type', 'application/json');
                    }
                    else {
                        response.setHeader('Content-Type', 'text/plain');
                    }

                    response.writeHead(200);
                    response.write(fs.readFileSync(_self.staticPath + (fileName[0] == "/" ? "" : "/") + fileName).toString());
                }

                return _self;
            }

            /**
             * Функция для серверной отрисовки файлов.
             * 
             * Поддерживаются только ehtml файлы.
             * 
             * @public
             * @version unstable
             * @param {string} fileName 
             * @param {{}} variables
             * @returns {Server}
             */
            response.render = function(fileName, variables) {
                let extension = fileName.split('/')[fileName.split('/').length - 1].split('.');
                extension = extension[extension.length - 1];
                /**
                 * Использование плагинов при генерации вёрстки.
                 */
                let usePlugins = false;

                /**
                 * Удаление потенциально опасного кода
                 */
                for (let key of Object.keys(variables)) {
                    if (['set', 'use-plugins', 'include'].includes(key)) {
                        delete variables[key];
                    }
                }

                variables['usePlugins'] = usePlugins;

                if (extension !== 'ehtml') {
                    if (self.environmentStatus === 'dev') {
                        console.error('render(' + fileName + ') -> Расширение ' + extension + ' не поддерживается! Только ehtml');
                    }

                    return;
                }

                let readyToRender = '';

                let content = fs.readFileSync(_self.staticPath + (fileName[0] == "/" ? "" : "/") + fileName).toString();
                readyToRender += content;

                if (/(\<use\-plugins\>)/ig.test(readyToRender)) {
                    variables['usePlugins'] = true;
                    readyToRender = readyToRender.replace(/(\<use\-plugins\>)/ig, '');
                }

                if (/(\<set name\=\"(.*?)\" value\=\"(.*?)\"\>)/ig.test(readyToRender)) {
                    readyToRender = readyToRender.replace(/(\<set name\=\"(.*?)\" value\=\"(.*?)\"\>)/ig, (match) => {
                        match = match.replace(/(set|name|value|\"|\=|\>|\<)/ig, '');
                        match = match.trim();

                        let name = match.split(' ')[0];

                        match = match.split(' ');
                        match.splice(0, 1);
                        match = match.join(' ');

                        let value = match;

                        variables[name] = value;

                        return '';
                    });
                }

                if (/\<include(.*?)\>/ig.test(readyToRender)) {
                    readyToRender = readyToRender.replace(/\<include(.*?)\>/ig, (match) => {
                        match = match.replace(/(include|\>|\<|href|\"|\=)/ig, '');
                        match = match.trim();

                        let replacment = fs.readFileSync(_self.staticPath + (match[0] == '/' ? '' : '/') + match);

                        return replacment;
                    });
                }

                if (variables && typeof variables === 'object' && !Array.isArray(variables)) {
                    for (const variable of Object.entries(variables)) {
                        if (new RegExp('\<' + variable[0] + '\>', 'ig').test(readyToRender)) {
                            readyToRender = readyToRender.replace(new RegExp('\<' + variable[0] + '\>', 'ig'), variable[1]);
                        }
                    }
                }

                response.write(readyToRender);

                return this;
            }

            /* Обработка link, script, img и др. запросов */
            if (/(\.)/g.test(request.url)) {
                /* Получение расширения файла */
                let extension = request.url.split('/')[request.url.split('/').length - 1];

                if (extension.includes('?')) {
                    extension = extension.split('?')[0];
                }

                extension = extension.split('.');

                extension = extension[extension.length - 1];

                /**
                 * sec-fetch-user - заголовок https (ТОЛЬКО) запрсоов
                 * который опередляет того кто выполнил запрос.
                 * 
                 * ?1 - Бразуер
                 * ?0 - Пользователь
                 * 
                 * Данная система нужна для защиты файлов сервера от
                 * листинга. Будет выдана ошибка 405 (Access Denied)
                 */
                if (request.headers['sec-fetch-user'] !== '?1') {
                    /* Обработка CSS-файлов */
                    if (extension === 'css') {
                        response.setHeader('Content-Type', 'text/css');

                        response.write(fs.readFileSync(this.staticPath + request.url).toString());
                    }
                    /* Обработка JS-файлов */
                    else if (extension === 'js') {
                        response.setHeader('Content-Type', 'text/javascript');

                        response.write(fs.readFileSync(this.staticPath + request.url).toString());
                    }
                    /* Обработка медиа-файлов */
                    else if (['jpg', 'jpeg'].includes(extension)) {
                        response.setHeader('Content-Type', 'image/jpeg');

                        response.write(fs.readFileSync(this.staticPath + request.url));
                    }
                    else if (['png', 'webp'].includes(extension)) {
                        response.setHeader('Content-Type', 'image/' + extension);

                        response.write(fs.readFileSync(this.staticPath + request.url));
                    }
                    /* Обработка аудио-файлов */
                    else if (extension === 'mp3') {
                        response.setHeader('Content-Type', 'audio/mpeg');

                        response.write(fs.readFileSync(this.staticPath + request.url));
                    }
                    else if (extension === 'ogg') {
                        response.setHeader('Content-Type', 'audio/ogg');

                        response.write(fs.readFileSync(this.staticPath + request.url));
                    }
                    /* Обработка видео-файлов */
                    else if (extension === 'mp4') {
                        response.setHeader('Content-Type', 'video/mp4');

                        response.write(fs.readFileSync(this.staticPath + request.url));
                    }
                    /* Обработка текстовых файлов */
                    else if (extension === 'txt') {
                        response.setHeader('Content-Type', 'text/plain');

                        response.write(fs.readFileSync(this.staticPath + request.url).toString());
                    }
                    /* Обработка json файлов */
                    else if (extension === 'json') {
                        response.setHeader('Content-Type', 'application/json');

                        response.write(fs.readFileSync(this.staticPath + request.url).toString());
                    }
                    /* Шифты */
                    else if (extension.includes('ttf')) {
                        response.setHeader('Content-Type', 'application/x-font-ttf');

                        request.url = request.url.split('');
                        request.url.splice(request.url.indexOf('?'), 10);
                        request.url = request.url.join('');

                        response.write(fs.readFileSync(this.staticPath + request.url), 'binary');
                    }
                    else if (extension.includes('woff')) {
                        response.setHeader('Content-Type', 'application/x-font-woff');

                        request.url = request.url.split('');
                        request.url.splice(request.url.indexOf('?'), 10);
                        request.url = request.url.join('');

                        response.write(fs.readFileSync(this.staticPath + request.url), 'binary');
                    }
                    else {
                        response.writeHead(404);
                    }

                    return response.end();
                }
                else {
                    response.writeHead(405);

                    if (request.method === 'GET') {
                        response.write('<b>Access denied</b>');
                    }
                    else {
                        response.write(JSON.stringify({
                           ok: false,
                           status: 405,
                           message: 'Доступ запрещён!'
                        }));
                    }
         
                    return response.end();
                }
            }

            /**
             * Шаблоны в маршруте.
             * 
             * Пример использования.
             * 
             * ```js
             * Framework.Get('/users/[:id]', () => { ... });
             * ```
             * 
             * @public
             * @type {{}}
             */
            request.matches = {};

            /**
             * Получение маршрута.
             * 
             * @public
             * @type {object}
             */
            let route = this.routes.find((item) => {
                if (/(\[:(.*?)\])/ig.test(item.path)) {
                    let itemPathParsed = item.path.split('/');
                    let requestPathParsed = request.url.split('/');

                    itemPathParsed.forEach((component, index) => {
                        if (/(\[:(.*?)\])/ig.test(component)) {
                            let element = requestPathParsed[index];

                            requestPathParsed[index] = component;

                            let readyElement = component.replace(/(\[|\]|:)/ig, '');
                            readyElement = readyElement.trim();

                            request.matches[readyElement] = element;
                        }
                    });

                    request.url = requestPathParsed.join('/')
                }

                return item.path == request.url && item.method == request.method;
            });

            if (!route) {
                response.writeHead(404);

                if (request.method === 'GET') {
                    response.write('<b>Ошибка! Маршрут не найден!</b>');
                }
                else {
                    request.write(JSON.stringify({
                        ok: false,
                        code: 404,
                        message: 'Маршрут не найден'
                    }));
                }

                return response.end();
            }
            else {
                /**
                 * Добавление заголовка с типом контента
                 */
                if (request.method !== 'POST') {
                    response.setHeader('Content-Type', 'text/html');
                }
                else {
                    response.setHeader('Content-Type', 'application/json');
                }

                /**
                 * Вызов вашего метода
                 */
                route.callback(request, response);
            }
        }

        return this;
    }

    /**
     * Цепочка.
     * 
     * @public
     * @type {Framework}
     */
    return this;
}

exports.Meta = Meta;
exports.Framework = Framework;