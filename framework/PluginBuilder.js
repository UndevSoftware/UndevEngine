/**
 * PluginBuilder предоставляет функции для создания и
 * сборки плагинов
 * 
 * @author Максим Рулетов {ruletkasuperstar}
 * @license GPLv3
 */

/**
 * Класс PluginBuilder'а.
 * 
 * @public
 * @author Максим Рулетов {ruletkasuperstar}
 * @param {string} pluginName
 * @param {string} pluginVersion
 * @returns {PluginManager}
 */
function PluginManager(pluginName, pluginVersion) {
    /**
     * Название плагина.
     * 
     * @public
     * @type {string}
     */
    this.pluginName;
    /**
     * Версия плагина.
     * 
     * @public
     * @type {string}
     */
    this.pluginVersion;

    if (pluginName && typeof pluginName === 'string') {
        this.pluginName = pluginName;
    }
    else {
        /* Значение по умолчанию */
        this.pluginName = 'Untitled';
    }

    if (pluginVersion && typeof pluginVersion === 'string') {
        this.pluginVersion = pluginVersion;
    }
    else {
        /* Значение по умолчанию */
        this.pluginVersion = '0.0.0';
    }

    /**
     * Стили (будут собраны в один файл)
     */
    this.Styles = [];

    /**
     * Данные плагина (будут скомпанованы в объект)
     */
    this.Data = [];

    /**
     * Генерируемый код (будет скомпанован в объект)
     */
    this.Templates = [];

    /**
     * Темы (будут скомпанованы в объект)
     */
    this.Themes = [];

    /**
     * Изменение значения.
     * 
     * @param {string} paramName 
     * @param {*} paramNewValue 
     * @returns {PluginManager}
     */
    this.Set = function(paramName, paramNewValue) {
        if (paramName || typeof paramName !== 'string') {
            return console.error('Не удалось произвести изменения. Аргумент paramName отсутствует или задан неверно!');
        }

        this[paramName] = paramNewValue;
    }

    /**
     * Создание стилей.
     * 
     * @public
     * @param {string} selector 
     * @param {{}} styles 
     * @returns {PluginManager}
     */
    this.Style = function(selector, styles) {
        if (!selector || typeof selector !== 'string') {
            return console.error('Невозможно создать стили для пустого или некорректно заданого селектора!');
        }

        if (!styles || typeof styles !== 'object' || Array.isArray(styles)) {
            return console.error('Объект со стилями не задан или задан не корректно!');
        }

        let existsSelector = this.Styles.find(style => style.selector === selector);

        if (!existsSelector) {
            this.Styles.push({
                selector,
                styles
            });
        }
        else {
            existsSelector.styles = styles;
        }

        return this;
    }

    /**
     * Сборка плагина
     * 
     * @public
     * @returns {PluginManager}
     */
    this.Build = function() {
        const fs = require('fs');

        /**
         * Сборка CSS-стилей
         */
        if (this.Styles.length > 0) {
            let cssOutput = '';

            for (let style of this.Styles) {
                cssOutput += style.selector;

                let currentBlockStyle = '';

                for (let styleBlock of Object.entries(style.styles)) {
                    currentBlockStyle += styleBlock[0] + ':' + styleBlock[1] + ';';
                }

                cssOutput += '{' + currentBlockStyle + '}\n';
            }

            if (!fs.existsSync('./' + this.pluginName)) {
                fs.mkdir('./' + this.pluginName, () => {});
            }

            fs.writeFileSync('./' + this.pluginName + '/' + this.pluginName + '.css', cssOutput);
        }

        const outputPlugin = {
            Data: this.Data,
            Templates: this.Templates,
            Themes: this.Themes,
            Styles: this.Styles
        }

        fs.writeFileSync('./' + this.pluginName + '/' + this.pluginName + '.js', "const " + this.pluginName + " = " + JSON.stringify(outputPlugin, null, '\t') + '\n\nexports.' + this.pluginName + ' = ' + this.pluginName + ';');

        return this;
    }

    return this;
}

exports.PluginManager = PluginManager;