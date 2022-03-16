let removed_tasks = [];
let completed_tasks = [];
let in_progress_tasks = [];

const cur_day = document.querySelector('.current-date');
cur_day.innerHTML = new Date().getDate();

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
	} else {
		panel.style.maxHeight = panel.scrollHeight + "px";
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
	task_el.classList.add("task");
	cur_type = document.location.hash.slice(1);

	const task_content_el = document.createElement("div");
	task_content_el.classList.add("content");

	const task_input_el = document.createElement("input");
	// task_input_el.classList.add("text");
	task_input_el.type="text";
	task_input_el.value=task;
	task_input_el.setAttribute("readonly", "readonly")

	const task_checkbox_el = document.createElement("div");
	task_checkbox_el.classList.add("round")

	const task_checkbox_input_el = document.createElement("input");
	task_checkbox_input_el.type="checkbox";
	task_checkbox_input_el.id="checkbox";

	task_checkbox_input_el.addEventListener('click', () => {
		task_checkbox_input_el.checked = 'true';
		task_checkbox_input_el.disabled = 'true';
		task_input_el.classList.add("text");
		tasks_list.removeChild(task_el);
		in_progress_tasks.splice(in_progress_tasks.indexOf(task_el), 1);
		task_el.firstChild.removeChild(task_delete_el);
		completed_tasks.push(task_el);
	});

	const task_checkbox_label_el = document.createElement("label");
	task_checkbox_label_el.setAttribute("for", "checkbox");

	task_checkbox_el.appendChild(task_checkbox_input_el);
	task_checkbox_el.appendChild(task_checkbox_label_el);

	task_content_el.appendChild(task_checkbox_el);
	task_content_el.appendChild(task_input_el);

	const task_delete_el = document.createElement("div");
	task_delete_el.classList.add("del-task");
	const task_delete_input_el = document.createElement("input");
	task_delete_input_el.type="image";
	task_delete_input_el.src="x-circle.svg"
	task_delete_el.addEventListener('click', () => {
		tasks_list.removeChild(task_el);
		in_progress_tasks.splice(in_progress_tasks.indexOf(task_el), 1);
		task_el.firstChild.removeChild(task_delete_el);
		task_checkbox_el.children[1].style.visibility="hidden";
		removed_tasks.push(task_el);
	});
	task_delete_el.appendChild(task_delete_input_el);
	task_content_el.appendChild(task_delete_el);

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
	title_el = document.querySelector('.tasks-list-title');
	title_el.innerHTML = title_text;
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
					// changeTaskListTitle('Completed')
					addAllChildElements(tasks_list, completed_tasks);
					break;

				case "In Progress":
					// changeTaskListTitle('In Progress');
					addAllChildElements(tasks_list, in_progress_tasks);
					break;

				case "Removed":
					//changeTaskListTitle('Removed');
					addAllChildElements(tasks_list, removed_tasks);
					break;
			}
		}
	});
}