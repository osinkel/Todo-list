let removed_tasks = [];
let completed_tasks = [];
let in_progress_tasks = [];
let index = 0;
const cur_day = document.querySelector('.current-date');
cur_day.innerHTML = new Date().getDate();
const base_url = 'https://to-do-list-gr.herokuapp.com';
const REMOVED = 'removed';
const IN_PROGRESS = 'in_progress';
const COMPLETED = 'completed';
let id_user = localStorage.getItem('id_user');

if(!id_user){
	id_user = `f${(+new Date).toString(16)}`;
	localStorage.setItem('id_user', id_user);
}

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
get_tasks_from_db();
const add_task_btn = document.querySelector(".add-list-item");
add_task_btn.addEventListener('click', create_task);


function get_tasks_from_db(){
	getAllAction(REMOVED);
	getAllAction(IN_PROGRESS);
	getAllAction(COMPLETED);
}


function initialize_tasks(status, tasks_arr){
	for(var i = 0; i<tasks_arr.length; i++){
		load_task(tasks_arr[i].id, tasks_arr[i].text, status);
	}
}

function load_task(id, task_text, status, is_new=false){

	let task_el = document.createElement("div");
	task_el.id = id;
	task_el.classList.add("task");
	const task_content_el = document.createElement("div");
	task_content_el.classList.add("content");

	const task_input_el = document.createElement("input");
	task_input_el.type="text";
	task_input_el.value=task_text;
	task_input_el.setAttribute("readonly", "readonly")

	const task_checkbox_el = document.createElement("div");
	task_checkbox_el.classList.add("round")

	const task_checkbox_input_el = document.createElement("input");
	task_checkbox_input_el.type="checkbox";
	task_checkbox_input_el.id="checkbox";

	const task_checkbox_label_el = document.createElement("label");
	task_checkbox_label_el.setAttribute("for", "checkbox");
	switch(status){
		case REMOVED:
			task_checkbox_label_el.style.visibility = 'hidden';
			break;
		case COMPLETED:
			task_checkbox_input_el.checked = true;
			task_checkbox_input_el.disabled = true;
			task_input_el.classList.add('text');
			break;

	}
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
				deleteAction(parentEl.id, id_user)
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
	switch(status){
		case REMOVED:
			task_recover_el.style.visibility = 'visible';
			break;
		case COMPLETED:
			task_delete_el.style.visibility = 'hidden';
	}

	task_content_el.appendChild(task_recover_el);

	task_recover_el.addEventListener('click', (e) => {
		const parentEl = e.currentTarget.closest('.task');
		tasks_list.removeChild(parentEl);
		moveToUpcoming(parentEl, removed_tasks);
	});
	task_el.appendChild(task_content_el);
	switch(status){
		case REMOVED:
			addToList(task_el, removed_tasks);
			break;
		case IN_PROGRESS:
			if(is_new){
				createAction(task_text, task_el);
			}
			addToList(task_el, in_progress_tasks);
			removeAllChildElements(tasks_list)
			addAllChildElements(tasks_list, in_progress_tasks);
			break;
		case COMPLETED:
			addToList(task_el, completed_tasks);
			break;
	}
}

function create_task(){
	const task_content = document.querySelector("#new-task-input");
	const task_text = task_content.value
	let types = document.querySelectorAll(".type-item");
	if(!types[1].classList.contains('active')){
		types[0].classList.remove('active');
		types[1].classList.remove('active');
		types[2].classList.remove('active');
		types[1].classList.add('active');
	}
	task_el = load_task(index, task_text, IN_PROGRESS, true);
	index++;
}


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
	updateAction(element.id, COMPLETED);
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
	updateAction(element.id, IN_PROGRESS);
}

function moveToRemoved(element, list_from) {
	const checkboxLabelEl = element.querySelector('label');
	checkboxLabelEl.style.visibility = 'hidden';
	const recoverButton = element.querySelector('.recover-task');
	recoverButton.style.visibility = 'visible';
	moveElement(element, list_from, removed_tasks);
	updateAction(element.id, REMOVED);
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
					addAllChildElements(tasks_list, completed_tasks);
					break;

				case "In Progress":
					changeTaskListTitle("Upcoming To-do's");
					addAllChildElements(tasks_list, in_progress_tasks);
					break;

				case "Removed":
					changeTaskListTitle("Removed To-do's");
					addAllChildElements(tasks_list, removed_tasks);
					break;
			}
		}
	});
}

function createAction(task_text, task_el){
	$.ajax({
		url: base_url+'/task?text='+task_text+'&userId='+id_user,
		method: 'POST',
		success: function(response){
			task_el.id = response.id;
		}
	});
}

function updateAction(id, status){
	$.ajax({
		url: base_url+'/task?taskId='+id+'&status='+status+'&userId='+id_user,
		method: 'PUT',
		success: function(response){

		}
	})
}

function getAllAction(list_name){
	$.ajax({
		url: base_url+'/list?name='+list_name+'&userId='+id_user,
		method: 'GET',
		success: function(response){
			initialize_tasks(list_name, response);
		}
	});
}

function deleteAction(id, id_user){
	$.ajax({
		url: base_url+'?userId='+id_user+'&taskId='+id,
		method: 'DELETE',
	});

}