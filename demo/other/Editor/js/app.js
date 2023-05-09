const toolbar = document.querySelector("#toolbar");
const content = document.querySelector("#content");
const actions = Object.freeze([
	{
		id: "bold",
		icon: "fa-bold",
		title: "Bold"
	},
	{
		id: "italic",
		icon: "fa-italic",
		title: "Italic"
	},
	{
		id: "underline",
		icon: "fa-underlined",
		title: "Underline"
	},
	{
		id: "strikeThrough",
		icon: "fa-strikethrough",
		title: "Strike through"
	},
	{
		id: "removeFormat",
		icon: "fa-clear",
		title: "Clear format"
	},
	{
		id: "alignment",
		icon: "fa-subject",
		title: "Set content alignment",
		submenu: [
			{
				id: "justifyLeft",
				icon: "fa-format_align_left",
				style: "textAlign:left",
				title: "Align left"
			},
			{
				id: "justifyCenter",
				icon: "fa-format_align_center",
				style: "textAlign:center",
				title: "Align center"
			},
			{
				id: "justifyRight",
				icon: "fa-format_align_right",
				style: "textAlign:right",
				title: "Align right"
			}
		]
	},
	{
		id: "outdent",
		icon: "fa-format_indent_decrease",
		title: "Outdent"
	},
	{
		id: "indent",
		icon: "fa-format_indent_increase",
		title: "Indent"
	},
	{
		id: "insertOrderedList",
		icon: "fa-format_list_numbered",
		title: "Add numbered list",
		tag: "ol"
	},
	{
		id: "insertUnorderedList",
		icon: "fa-format_list_bulleted",
		title: "Add unordered list",
		tag: "ul"
	},
	{
		id: "insertHorizontalRule",
		icon: "fa-horizontal_rule",
		title: "Add horizontal rule"
	},
	{
		id: "insertImage",
		icon: "fa-insert_photo",
		title: "Add image",
		submenu: [
			{
				id: "insertImageByUrl",
				icon: "fa-insert_link",
				title: "Add image by URL"
			},
			{
				id: "insertImageByFile",
				icon: "fa-file_upload",
				title: "Upload new image"
			}
		]
	},
	{
		id: "createLink",
		icon: "fa-link",
		title: "Add link"
	},
	{
		id: "unlink",
		icon: "fa-link_off",
		title: "Remove link"
	},
	{
		id: "undo",
		icon: "fa-undo",
		title: "Undo"
	},
	{
		id: "redo",
		icon: "fa-redo",
		title: "Redo"
	}
]);

/**
 * Add toolbar buttons
 */
function setActionButton(action) {
	const button = document.createElement("button");
	const i = document.createElement("i");

	// 	Base props
	button.classList.add("action");
	button.title = action.title;
	button.dataset.action = action.id;

	if (action.style) button.dataset.style = action.style;
	if (action.tag) button.dataset.style = action.tag;

	// 	Action
	button.addEventListener("click", executeAction);

	// 	Icon
	i.classList.add("fa", action.icon);
	button.append(i);

	return button;
}

/**
 * Executes actions on the editable content wrapper
 * @param e - The mouse event
 * @see {@link https://developer.mozilla.org/es/docs/Web/API/Document/execCommand}
 * @see {@link https://developer.mozilla.org/es/docs/Web/HTML/Global_attributes/contenteditable}
 */
function executeAction(e) {
	const target = e.currentTarget;
	const action = target.dataset.action;

	content.focus();

	switch (action) {
		case "createLink":
			const anchorUrl = prompt("Insert the anchor URL");

			if (anchorUrl) document.execCommand(action, false, anchorUrl);

			break;
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

for (const action of actions) {
	const actionButton = setActionButton(action);

	if (action.submenu) {
		const submenu = document.createElement("div");
		let submenuVisible = false;

		submenu.classList.add("submenu");

		for (const subaction of action.submenu) {
			const subActionButton = setActionButton(subaction);
			submenu.append(subActionButton);
		}

		actionButton.addEventListener("click", (e) => {
			e.preventDefault();
			submenu.classList.toggle("visible");
		});

		actionButton.classList.add("has-submenu");
		actionButton.append(submenu);
	}

	toolbar.append(actionButton);
}