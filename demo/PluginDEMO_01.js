const { PluginManager } = require('../framework/PluginBuilder.js');

/* Инициализация плагина */
let myPlugin = new PluginManager('Test', '0.0.1');

/* Создание стилей */
myPlugin.Style('.test', {
    background: 'black'
});

myPlugin.Style('.test', {
    color: 'black',
    background: 'white'
});

myPlugin.Build();