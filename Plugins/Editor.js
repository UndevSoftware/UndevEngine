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
        },
        {
            name: 'createLink',
            icon: 'fa-link',
            title: 'Добавить ссылку'
        },
        {
            name: 'createHeader',
            icon: 'fa-heading',
            title: 'Заголовок'
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

    /**
     * Модальное окно для вставки ссылок.
     * 
     * @public
     * @type {Element}
     */
    this.editorModalWindow = document.createElement('div');

    const self = this;

    /**
     * Создание кнопки с инструментом
     * 
     * @param {{}} action 
     * @returns {Element}
     */
    this.CreateActionButton = function(action) {
        const button = document.createElement("button"),
              i = document.createElement("i"),
              name = document.createElement('span');

        button.classList.add("tool-button", "action");
        button.dataset.action = action.name;

        name.classList.add("button-name");
        name.textContent = action.title;

        if (action.style) button.dataset.style = action.style;
        if (action.tag) button.dataset.style = action.tag;

        if (action.name !== 'createLink') {
            button.addEventListener("click", this.HandleAction);
        }
        else {
            button.addEventListener('click', () => {
                document.querySelector('.editor-modalwin').style.display = "flex";
            })
        }

        i.classList.add("fa", action.icon, "right-line");
        button.append(i);
        button.append(name);

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
            case "createHeader":
                const heading = document.createElement('h1');
                heading.textContent = "Ваш заголовок";
                heading.contentEditable = true;

                document.querySelector('.editor-viewport').append(heading);

                break;
            // case "insertImageByFile":
            //     const fileUploadInput = document.querySelector("#image-upload-input");

            //     fileUploadInput.click();

            //     fileUploadInput.onchange = () => {
            //         const [file] = fileUploadInput.files;

            //         if (file)
            //             document.execCommand("insertImage", false, URL.createObjectURL(file));
            //     };

            //     break;
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

        this.editorModalWindow.classList.add('editor-modalwin');
        this.editorModalWindow.innerHTML = '<div class="editor-modal editor-standard-theme"><h2>Вставьте ссылку:</h2><input type="text" placeholder="Название" id="name"><input type="text" placeholder="Ссылка" id="link"><div id="link__submit">Вставить</div></div>';

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

        document.body.append(this.editorModalWindow);
        this.editorWrapper.append(this.editorToolBar, this.editorViewport);

        document.querySelector('#link__submit').addEventListener('click', () => {
            const name = document.querySelector('#name').value;
            const url = document.querySelector('#link').value;

            if (name.length > 0) {
                if (url.length > 0 && /((https|http)\:\/\/(.*?)\.(.*?))/.test(url)) {
                    document.querySelector('.editor-viewport').innerHTML += '<a href="' + url  +'">' + name + '</a>';
                }
            }

            document.querySelector('.editor-modalwin').style.display = "none";
        });

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