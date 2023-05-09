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
            title: 'Жирный'
        },
        {
            name: 'italic',
            icon: 'fa-italic',
            title: 'Курсивный'
        },
        {
            name: 'underline',
            icon: 'fa-underline',
            title: 'Подчёркнутый'
        },
        {
            name: 'strikethrough',
            icon: 'fa-strikethrough',
            title: 'Зачёркнутый'
        }
    ]);

    /**
     * Содержимое контента
     * 
     * @public
     * @type {Element}
     */
    this.editorViewport = document.createElement('div');

    /**
     * Панель с инструментами
     * 
     * @public
     * @type {Element}
     */
    this.editorToolBar = document.createElement('div');

    /**
     * Контейнер для редактора.
     * 
     * @public
     * @type {Element}
     */
    this.editorWrapper = document.createElement('div');

    const self = this;

    /**
     * Создание кнопки с инструментом
     * 
     * @param {{}} action 
     * @returns {Element}
     */
    this.CreateActionButton = function(action) {
        const button = document.createElement("button");
        const i = document.createElement("i");

        button.classList.add("action");
        button.title = action.title;
        button.dataset.action = action.name;

        if (action.style) button.dataset.style = action.style;
        if (action.tag) button.dataset.style = action.tag;

        button.addEventListener("click", this.HandleAction);

        i.classList.add("fa", action.icon);
        button.append(i);

        return button;
    }

    /**
     * Обработка нажатия на инструмент
     * @param {Event} e 
     */
    this.HandleAction = function(e) {
        const target = e.currentTarget;
        const action = target.dataset.action;

        self.editorViewport.focus();

        switch (action) {
            case "insertImageByUrl":
                const imageUrl = prompt("Insert the image URL");

                if (imageUrl) {
                    document.execCommand("insertImage", false, imageUrl);
                }

                break;
            case "insertImageByFile":
                const fileUploadInput = document.querySelector("#image-upload-input");

                fileUploadInput.click();

                fileUploadInput.onchange = () => {
                    const [file] = fileUploadInput.files;

                    if (file)
                        document.execCommand("insertImage", false, URL.createObjectURL(file));
                };

                break;
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
        this.editorWrapper.classList.add('editor-wrapper');

        /**
         * Viewport редактора
         */
        this.editorViewport.classList.add('editor-viewport', 'editor-standard-theme');
        this.editorViewport.contentEditable = true;

        /**
         * Панель инструментов
         */
        this.editorToolBar.classList.add('editor-tools', 'editor-standard-theme');

        /**
         * Кнопки инструментов
         */
        for (const action of this.actions) {
            const actionButton = this.CreateActionButton(action);
        
            if (action.submenu) {
                const submenu = document.createElement("div");
        
                submenu.classList.add("submenu");
        
                for (const subaction of action.submenu) {
                    const subActionButton = this.CreateActionButton(subaction);
                    submenu.append(subActionButton);
                }
        
                actionButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    submenu.classList.toggle("visible");
                });
        
                actionButton.classList.add("has-submenu");
                actionButton.append(submenu);
            }
        
            this.editorToolBar.append(actionButton);
        }

        this.editorWrapper.append(this.editorToolBar, this.editorViewport);

        if (inElement && inElement instanceof Element) {
            if (!element.contains(inElement)) {
                element.append(inElement);
            }

            inElement.append(this.editorWrapper);
        }
        else {
            this.element.append(this.editorWrapper);
        }
    }

    return this;
};