let removed_tasks = [];
let completed_tasks = [];
let in_progress_tasks = [];
let index = 0;
const cur_day = document.querySelector('.current-date');
cur_day.innerHTML = new Date().getDate();

console.log('s');

const REMOVED = 'removed';
const IN_PROGRESS = 'in_progress';
const COMPLETED = 'completed';

var acc = document.querySelector(".accordion");
acc.addEventListener("click", function() {
	this.classList.toggle("active");
	if(this.classList.contains('active')){
		this.children[0].classList.remove('arrow-down');
		this.children[0].classList.add('arrow-up');
	}
	else{
		this.children[0].classList.remove('arrow-up');
		this.children[0].classList.add('arrow-down');
	}
	var panel = document.querySelector('.panel');
	if (panel.style.maxHeight) {
		panel.style.maxHeight = null;
		tasks_list.style.maxHeight = '351px';
	} else {
		panel.style.maxHeight = panel.scrollHeight + "px";
		tasks_list.style.maxHeight = '311px';
	}
});

let tasks_list = document.querySelector("#tasks-list");

const add_task_btn = document.querySelector(".add-list-item");

add_task_btn.addEventListener('click', () => {
	types = document.getElementsByClassName("type-item");
	if(!types[1].classList.contains('active')){
		types[0].classList.remove('active');
		types[1].classList.remove('active');
		types[2].classList.remove('active');
		types[1].classList.add('active');
	}

	const task_content = document.querySelector("#new-task-input");
	const task = task_content.value
	
	const task_el = document.createElement("div");
	task_el.id = index;
	index = index + 1;
	task_el.classList.add("task");

	const task_content_el = document.createElement("div");
	task_content_el.classList.add("content");

	const task_input_el = document.createElement("input");
	task_input_el.type="text";
	task_input_el.value=task;
	task_input_el.setAttribute("readonly", "readonly")

	const task_checkbox_el = document.createElement("div");
	task_checkbox_el.classList.add("round")

	const task_checkbox_input_el = document.createElement("input");
	task_checkbox_input_el.type="checkbox";
	task_checkbox_input_el.id="checkbox";

	const task_checkbox_label_el = document.createElement("label");
	task_checkbox_label_el.setAttribute("for", "checkbox");

	task_checkbox_el.appendChild(task_checkbox_input_el);
	task_checkbox_label_el.addEventListener('click', (e) => {
		const parentEl = e.currentTarget.closest('.task');
		switch (getActiveListName()) {
			case COMPLETED:
				tasks_list.removeChild(parentEl);
				moveToUpcoming(parentEl, completed_tasks);
				break;
			case IN_PROGRESS:
				tasks_list.removeChild(parentEl);
				moveToCompleted(parentEl, in_progress_tasks);
				break;
		}
	});

	task_checkbox_el.appendChild(task_checkbox_label_el);

	task_content_el.appendChild(task_checkbox_el);
	task_content_el.appendChild(task_input_el);

	const task_delete_el = document.createElement("div");
	task_delete_el.classList.add("del-task");
	const task_delete_input_el = document.createElement("input");
	task_delete_input_el.type="image";
	task_delete_input_el.src="x-circle.svg"
	task_delete_el.addEventListener('click', (e) => {
		const parentEl = e.currentTarget.closest('.task');
		tasks_list.removeChild(parentEl);
		switch (getActiveListName()) {
			case COMPLETED:
				moveToUpcoming(parentEl, completed_tasks);
				break;
			case REMOVED:
				deleteFromList(parentEl, removed_tasks);
				break;
			case IN_PROGRESS:
				moveToRemoved(parentEl, in_progress_tasks);
				break;
		}
	});
	task_delete_el.appendChild(task_delete_input_el);
	task_content_el.appendChild(task_delete_el);

	const task_recover_el = document.createElement("div");
	task_recover_el.classList.add("recover-task");
	task_recover_el.style.visibility = 'hidden';
	const task_recover_input_el = document.createElement("input");
	task_recover_input_el.type="image";
	task_recover_input_el.src="activity.svg"
	task_recover_el.appendChild(task_recover_input_el);

	task_content_el.appendChild(task_recover_el);

	task_recover_el.addEventListener('click', (e) => {
		const parentEl = e.currentTarget.closest('.task');
		tasks_list.removeChild(parentEl);
		moveToUpcoming(parentEl, removed_tasks);
	});

	task_el.appendChild(task_content_el);
	in_progress_tasks.push(task_el);
	removeAllChildElements(tasks_list);
	addAllChildElements(tasks_list, in_progress_tasks);
});


function removeAllChildElements(parent) {
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

function addAllChildElements(tasks_list, elements) {
	var i;
	for(i=0; i<elements.length; i++){
		tasks_list.appendChild(elements[i]);
	}
}

function changeTaskListTitle(title_text){
	title_el = document.querySelector('.task-list-title');
	title_el.innerHTML = title_text;
}

function moveToCompleted(element, list_from) {
	const checkboxEl = element.querySelector('#checkbox');
	checkboxEl.checked = true;
	checkboxEl.disabled = true;
	const textEl = element.querySelector('[type="text"]');
	textEl.classList.add('text');
	const delButtonEl = element.querySelector('.del-task');
	delButtonEl.style.visibility = 'hidden';
	moveElement(element, list_from, completed_tasks);
}

function moveToUpcoming(element, list_from) {
	if (list_from === completed_tasks) {
		const checkboxEl = element.querySelector('#checkbox');
		checkboxEl.checked = false;
		checkboxEl.disabled = false;
		const textEl = element.querySelector('[type="text"]');
		textEl.classList.remove('text');
		const delButtonEl = element.querySelector('.del-task');
		delButtonEl.style.visibility = 'visible';
	} else if (list_from === removed_tasks) {
		const checkboxLabelEl = element.querySelector('label');
		checkboxLabelEl.style.visibility = 'visible';
		const recoverButton = element.querySelector('.recover-task');
		recoverButton.style.visibility = 'hidden';
	}
	moveElement(element, list_from, in_progress_tasks);
}

function moveToRemoved(element, list_from) {
	const checkboxLabelEl = element.querySelector('label');
	checkboxLabelEl.style.visibility = 'hidden';
	const recoverButton = element.querySelector('.recover-task');
	recoverButton.style.visibility = 'visible';
	moveElement(element, list_from, removed_tasks);
}

function moveElement(element, list_from, list_to) {
	deleteFromList(element, list_from);
	addToList(element, list_to);
}

function deleteFromList(element, list_from) {
	list_from.splice(list_from.indexOf(element), 1);
}

function addToList(element, list_to){
	list_to.push(element);
}

function getActiveListName() {
	const activeListEl = document.querySelector('li.active');
	if (activeListEl.classList.contains(REMOVED)) return REMOVED;
	if (activeListEl.classList.contains(IN_PROGRESS)) return IN_PROGRESS;
	return COMPLETED;
}

window.location.hash="in_progress";

types = document.getElementsByClassName("type-item");
var i;
for (i = 0; i < types.length; i++) {
	types[i].addEventListener("click", function() {
		if(!this.classList.contains('active')){
			types[0].classList.remove('active')
			types[1].classList.remove('active')
			types[2].classList.remove('active')
			this.classList.add('active');
			removeAllChildElements(tasks_list);
			switch(this.children[0].innerHTML){
				case "Completed":
					changeTaskListTitle("Completed To-do's")
					addAllChildElements(tasks_list, completed_tasks, 'completed');
					break;

				case "In Progress":
					changeTaskListTitle("Upcoming To-do's");
					addAllChildElements(tasks_list, in_progress_tasks, 'upcoming');
					break;

				case "Removed":
					changeTaskListTitle("Removed To-do's");
					addAllChildElements(tasks_list, removed_tasks, 'removed');
					break;
			}
		}
	});
}