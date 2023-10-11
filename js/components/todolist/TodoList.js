import Todo from '../todo/Todo.js'
import DB from '../../DB.js';
import getTemplate from "./template.js";

export default class TodoList  {
    constructor (data) {
        DB.setApiURL(data.apiURL);
        this.elt = document.querySelector(data.elt);
        this.todos = [];
        this.all_todos = [];
        this.new_todo = null;
        this.activeTodo = null;
        this.init();
    }

//      INITIALISE L'APP

    async init() {
        await this.loadTodos();
        this.activateElements();
        this.filtersTodo();
        this.render();
    }

    async loadTodos() {
        const todos = await DB.findAll();
        this.todos = todos.map(todo => new Todo(todo));  
        this.render();      
    }

    render(){
        this.elt.innerHTML = getTemplate(this);
        this.renderActiveCount();
    }



//      ACTIVATE LISTENERS

    activateElements() {
        document.addEventListener('keypress', (e) => {
            this.new_todo = this.elt.querySelector(".new-todo");
            if(e.target.classList.value === "new-todo" & e.code === "Enter"){  
                this.addTodo(e);
            }
        }); 
        document.addEventListener('change', (e) => {
            if(e.target.matches(".toggle")){
                this.toggleCompleted(e);
            }; 
        })
        document.addEventListener('dblclick', (e) => {
            if(e.target.matches("label")){
                this.editOneTodo(e);
            }
        })
        document.addEventListener('click', (e) => {
            if(e.target.matches(".destroy")){
                this.destroyOne(e);
            }
        })
    }

//      ADD FUNCTION

    async addTodo(){
        const add_todo = await DB.addOne({
            content: this.new_todo.value,
            completed: false
        });
        const new_todo  = new Todo(add_todo);
        this.todos.push(new_todo);


        const todoListContainer = this.elt.querySelector('.todo-list');
        todoListContainer.insertAdjacentHTML('beforeend', new_todo.render());

        this.new_todo.value = "";
        this.renderActiveCount();
    }


//      EDIT FUNCTIONS

    editOneTodo(e){
        if(document.querySelector("input.edit")){
            let initialLabel =  document.querySelector("input.edit").value;
            document.querySelector(".editing").parentElement.innerHTML = `<div class="view"><input class="toggle" type="checkbox" ${ false ? 'checked': '' }/>
            <label>${initialLabel}</label>
            <button class='destroy'"></button></div>`; 
        }
        else {
            const id = e.target.closest('li').dataset.id;
            let labelValue = e.target.closest("label").innerText;
            const initialLabel = e.target.closest("label").innerText;
            e.target.closest("li").innerHTML = `<div class="editing">
            <input class="toggle" type="checkbox" ${ false ? 'checked': 'style="display: none;"'}/>
            <input class="edit" type="text" value="${labelValue}">
            </input>
            <button class='destroy' style="display:none;"></button>
            </div>`;
            const triggerFocus = document.querySelector('input.edit');
            triggerFocus.focus();
            triggerFocus.selectionStart = triggerFocus.value.length;
    

            document.querySelector(".edit").addEventListener('keyup', (e)=> {
                switch (e.code) {
                    case "Enter":
                    labelValue = document.querySelector(".edit").value;
                    document.querySelector("div.editing").parentElement.innerHTML = `<div class="view"><input class="toggle" type="checkbox" ${ false ? 'checked': '' }/>
                    <label>${labelValue}</label>
                    <button class='destroy'"></button>
                    </div>`;
                    this.todos.filter(todo => todo.id === id)[0].content = labelValue;
                    this.editTodo(this.todos.filter(todo => todo.id === id)[0]);
                    break;

                    case "Escape" : 
                    document.querySelector("div.editing").parentElement.innerHTML = `<div class="view"><input class="toggle" type="checkbox" ${ false ? 'checked': '' }/>
                    <label>${initialLabel}</label>
                    <button class='destroy'"></button>
                    </div>`;
                    break;
                    }
            }) 
        }
    }

    async editTodo(data){
        await DB.updateOne({
            id: data.id,
            content: data.content,
            completed : data.completed
        })
        this.render();
    }

//      DESTROY

    destroyOne(e) {
        const id = e.target.closest("li").dataset.id;
        e.target.closest("li").remove();
        this.todos.filter(todo => todo.id === id).splice(0,0);
        this.destroyTodo(id);
    }

    async destroyTodo(id){
        await DB.destroyOne(id);
        this.renderActiveCount();
    }


//      MISC FUNCTIONS


    //      -   TOGGLE FUNCTIONS


    toggleCompleted(e){
        e.target.closest('li').classList.toggle("completed");
        let id = e.target.closest('li').dataset.id;
        let toggle_completed = this.todos.filter((todo) => todo.id == id)[0];
        toggle_completed.completed = !toggle_completed.completed;
        this.updateTodo(toggle_completed); 
    }    
    
    async updateTodo(data){
        await DB.updateOne({
        id: data.id,
        completed : data.completed,
    })
    this.renderActiveCount();
    }    

    renderActiveCount() { 
        this.activeTodo = document.querySelectorAll('.todo-list li:not(.completed)');
        document.querySelector(".todo-count").innerHTML = this.activeTodo.length;
    }

    //      -   FILTER FUNCTIONS

    filtersTodo() {
        document.addEventListener('click', (e) => {
            const allTodos = this.elt.querySelectorAll('.todo-list li');
            
            switch (true) {
                case e.target.matches(".all"):
                    this.showAllTodos(allTodos);
                    break;
                case e.target.matches(".selected"):
                    this.showIncompleteTodos(allTodos);
                    break;
                case e.target.matches(".completed"):
                    this.showCompletedTodos(allTodos);
                    break;
            }
        });
        
    }
    showAllTodos(todos) {
        todos.forEach(todo => {
            todo.style.display = 'block';
        });
    }

    showIncompleteTodos(todos) {
        todos.forEach(todo => {
            const completed = todo.classList.contains('completed');
            todo.style.display = completed ? 'none' : 'block';
        });
    }

    showCompletedTodos(todos) {
        todos.forEach(todo => {
            const completed = todo.classList.contains('completed');
            todo.style.display = completed ? 'block' : 'none';
        });
    }

}