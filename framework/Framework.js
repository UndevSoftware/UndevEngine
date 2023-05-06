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
    version: '0.0.1-alpha',
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
         * Изменение значений
         * 
         * @public
         * @param {string} key 
         * @param {*} value 
         * @returns {Server}
         */
        this.Set = function(key, value) {
            let member = this[key];

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
            if (!this.key || !this.host) {
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
            /**
             * IP-адресс, с которого был сделан запрос.
             * 
             * @readonly
             * @type {string}
             */
            request.ip = request.socket.remoteAddress;

            /**
             * Получение маршрута.
             * 
             * @public
             * @type {object}
             */
            let route = this.routes.find((item) => {
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