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
    version: '0.0.0-alpha',
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
         * Изменение значений
         * 
         * @public
         * @param {string} key 
         * @param {*} value 
         * @returns {Server}
         */
        this.Set = function(key, value) {
            let member = this[key];

            if (member == undefined) {
                if (self.environmentStatus == 'dev') {
                    console.warn('Попытка изменить ключ ' + key + ' на ' + value + ' остановлена, так как ключ не найден');
                }

                return;
            }

            this[key] = value;

            return this;
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