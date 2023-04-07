const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form');
const newListInput = document.querySelector('[data-new-list-input');
const deleteListBtn = document.querySelector('[data-delete-list-btn');
const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const listTaskCount = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks-container]');
const taskTemplate = document.querySelector('#task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompletedTasksBtn = document.querySelector('[data-clear-completed-btn]');



const LOCAL_STORAGE_LIST_KEY = 'tasks.list';
const LOCAL_STORAGE__SELECTED_LIST_ID_KEY = 'tasks.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE__SELECTED_LIST_ID_KEY);

listsContainer.addEventListener('click', e=> {
    if(e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
})

tasksContainer.addEventListener('click', e=> {
    if(e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        save();
        renderTaskCount(selectedList);
    }
})

newListForm.addEventListener('submit', e=> {
    e.preventDefault();
    const listName = newListInput.value;
    if(listName == null || listName == '') return;
    const list = createList(listName);

    newListInput.value = null;
    lists.push(list);
    saveAndRender();
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const taskName = newTaskInput.value;
    if(taskName == null || taskName == '') return;
    const newTask = createTask(taskName);

    newTaskInput.value = null;

    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(newTask);
    saveAndRender();
});

clearCompletedTasksBtn.addEventListener('click', e=> {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
})

deleteListBtn.addEventListener('click', e=> {
    lists = lists.filter(list => list.id != selectedListId);
    selectedListId = null;
    saveAndRender();
})


function createList(name) {
    return {id: Date.now().toString(), name, tasks: []}
}

function createTask(taskName) {
    return {id: Date.now().toString(), name: taskName, completed: false}
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY,JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE__SELECTED_LIST_ID_KEY, selectedListId);
} 

function saveAndRender() {
    save();
    render();
}

function render() {
    clearElement(listsContainer);
    renderLists();
    const selectedList = lists.find(list => list.id === selectedListId);
    if(selectedListId == null) {
        listDisplayContainer.style.display = 'none';
    } else {
        listDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
}

function renderLists() {
    lists.forEach( list => {
        const listElement = document.createElement('li');
        listElement.classList.add('list-name');
        listElement.dataset.listId = list.id;
        listElement.innerText = list.name;
        listsContainer.appendChild(listElement);

        if(list.id === selectedListId) {
            listElement.classList.add('active-list');
        }
    });

}

function renderTaskCount(selectedList) {
    const numIncompleteTasks = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = numIncompleteTasks === 1 ? 'task' : 'tasks';

    listTaskCount.innerText = `${numIncompleteTasks} ${taskString} remaining`;
}

function renderTasks(selectedList) {
 selectedList.tasks.forEach( task => {
    const taskElement = document.importNode(taskTemplate.content, true);
    
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;

    const label = taskElement.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);

    tasksContainer.appendChild(taskElement);
 });
}

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();