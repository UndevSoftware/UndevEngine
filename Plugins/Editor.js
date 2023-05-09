/**
 * Текстовый редактор для сайта.
 * 
 * @public
 * @author Максим Рулетов (ruletkasuperstar)
 * @license GPLv3
 */

/**
 * Главный класс для редактора.
 * 
 * @public
 * @author Максим Рулетов (ruletkasuperstar)
 * @param {Element} element
 * @returns {Editor}
 */
function Editor(
    /* Родительский элемент, к которому будет пристроен редактор */
    element
) {
    /**
     * Родительский элемент.
     * 
     * @type {Element}
     */
    this.element;

    if (!element || !element instanceof Element) {
        if (document.querySelector('#root') == null) {
            const ROOT = document.createElement('div');
                ROOT.id = "root";

            document.body.append(ROOT);
        }

        this.element = document.querySelector(ROOT);
    }
    else {
        if (document.body.contains(element) == null) {
            document.body.append(element);
        }

        this.element = element;
    }

    /**
     * Полная колекция возможностей редактора.
     * 
     * @readonly
     * @type {Array}
     */
    this.actions = Object.freeze([
        {
            name: 'bold',
            icon: 'fa-bold',
            title: {
                en: 'Bold',
                ru: 'Жирный'
            }
        },
        {
            name: 'italic',
            icon: 'fa-italic',
            title: {
                en: 'Italic',
                ru: 'Курсивный'
            }
        },
        {
            name: 'underline',
            icon: 'fa-underline',
            title: {
                en: 'Underlined',
                ru: 'Подчёркнутый'
            }
        },
        {
            name: 'strikethrough',
            icon: 'fa-strikethrough',
            title: {
                en: 'Strikethrough',
                ru: 'Зачёркнутый'
            }
        }
    ]);

    /**
     * Содержимое контента
     * 
     * @public
     * @type {Element}
     */
    this.editorViewport;

    const self = this;

    /**
     * Создание кнопки с инструментом
     * @param {{}} action 
     * @returns {Element}
     */
    this.CreateActionButton = function(action) {
        const span = document.createElement('span');

        span.classList.add('fa', 'editor-standard-theme-color', 'editor-standard-theme-button-hover', action.icon);
        span.title = action.title;
        span.dataset.action = action.name;

        span.addEventListener('click', this.HandleAction);

        return span;
    }

    /**
     * Обработка нажатия на инструмент
     * @param {Event} event 
     */
    this.HandleAction = function(event) {
        const target = event.currentTarget;
        const action = target.dataset.action;

        self.editorViewport.focus();

        switch (action) {
            default:
                document.execCommand(action, false);
                break;
        }
    }

    /**
     * Генерация интерфейса редактора.
     * 
     * @public
     * @param {Element} inElement
     * @returns {Editor}
     */
    this.GenerateUI = function(inElement) {
        /**
         * Главный блок редактора. Обрамляет все его части
         */
        let EditorMainBlock = document.createElement('div');
            EditorMainBlock.classList.add('editor-block');

        /**
         * Viewport редактора
         */
        let EditorViewport = document.createElement('div');
            EditorViewport.classList.add('editor-viewport', 'editor-standard-theme');
            EditorViewport.contentEditable = true;

        this.editorViewport = EditorViewport;

        /**
         * Панель инструментов
         */
        let EditorToolbar = document.createElement('div');
        EditorToolbar.classList.add('editor-tools', 'editor-standard-theme');

        /**
         * Кнопки инструментов
         */
        for (const action of this.actions) {
            const toolButton = this.CreateActionButton(action);

            EditorToolbar.append(toolButton);
        }

        EditorMainBlock.append(EditorToolbar);

        EditorMainBlock.append(EditorViewport);

        if (inElement && inElement instanceof Element) {
            if (!element.contains(inElement)) {
                element.append(inElement);
            }

            inElement.append(EditorMainBlock);
        }
        else {
            this.element.append(EditorMainBlock);
        }
    }

    return this;
};