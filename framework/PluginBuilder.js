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

    this.Build = function() {

    }

    return this;
}