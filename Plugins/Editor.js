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
         * Панель инструментов
         */
        let EditorActive = document.createElement('div');
            EditorActive.classList.add('editor-tools', 'editor-standard-theme');

        /**
         * Разделение панели инструментов на 2 части
         */
        let EditorLeft = document.createElement('div');
            EditorLeft.classList.add('editor-tools__left');
        let EditorRight = document.createElement('div');
            EditorRight.classList.add('editor-tools__right');

        /**
         * Кнопки инструментов
         */
        let EditorBoldButton = document.createElement('span')
            EditorBoldButton.classList.add('fa', 'fa-bold', 'editor-standard-theme-color', 'editor-standard-theme-button-hover');
            EditorBoldButton.id = "bold";
            EditorBoldButton.setAttribute('data-type', 'bold');
        let EditorItalicButton = document.createElement('span')
            EditorItalicButton.classList.add('fa', 'fa-italic', 'editor-standard-theme-color', 'editor-standard-theme-button-hover');
            EditorItalicButton.id = "italic";
            EditorItalicButton.setAttribute('data-type', 'italic');
        let EditorUnderlineButton = document.createElement('span')
            EditorUnderlineButton.classList.add('fa', 'fa-underline', 'editor-standard-theme-color', 'editor-standard-theme-button-hover');
            EditorUnderlineButton.id = "underline";
            EditorUnderlineButton.setAttribute('data-type', 'underline');
        let EditorStrikedButton = document.createElement('span')
            EditorStrikedButton.classList.add('fa', 'fa-strikethrough', 'editor-standard-theme-color', 'editor-standard-theme-button-hover');
            EditorStrikedButton.id = "strikethrough";
            EditorStrikedButton.setAttribute('data-type', 'strikethrough');

        EditorLeft.append(EditorBoldButton, EditorItalicButton, EditorUnderlineButton, EditorStrikedButton);

        EditorActive.append(EditorLeft, EditorRight);

        EditorMainBlock.append(EditorActive);

        /**
         * Viewport редактора
         */
        let EditorViewport = document.createElement('div');
            EditorViewport.classList.add('editor-viewport', 'editor-standard-theme');
            EditorViewport.contentEditable = true;

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