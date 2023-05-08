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
        let EditorMainBlock = document.createElement('div');
            EditorMainBlock.classList.add('editor-block');

        let EditorActive = document.createElement('div');
            EditorActive.classList.add('editor-tools', 'editor-standard-theme');

        let EditorLeft = document.createElement('div');
            EditorLeft.classList.add('editor-tools__left');
        let EditorRight = document.createElement('div');
            EditorRight.classList.add('editor-tools__right');

        let EditorBoldButton = document.createElement('span')
            EditorBoldButton.classList.add('fa', 'fa-bold', 'editor-standard-theme-color');
        let EditorItalicButton = document.createElement('span')
            EditorItalicButton.classList.add('fa', 'fa-italic', 'editor-standard-theme-color');
        let EditorUnderlineButton = document.createElement('span')
            EditorUnderlineButton.classList.add('fa', 'fa-underline', 'editor-standard-theme-color');
        let EditorStrikedButton = document.createElement('span')
            EditorStrikedButton.classList.add('fa', 'fa-strikethrough', 'editor-standard-theme-color');

        EditorLeft.append(EditorBoldButton, EditorItalicButton, EditorUnderlineButton, EditorStrikedButton);

        EditorActive.append(EditorLeft, EditorRight);

        EditorMainBlock.append(EditorActive);

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