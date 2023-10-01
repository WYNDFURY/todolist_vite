import Todo from '../todo/Todo.js'
import DB from '../../DB.js';
import getTemplate from "./template.js";

export default class TodoList  {
    constructor (data) {
        DB.setApiURL(data.apiURL);
        this.elt = document.querySelector(data.elt);
        this.todos = [];
        this.new_todo = null;
        this.activeTodo = null;
        this.toggle_todo = null;
        this.toggle_completed = null;
        this.loadTodos();
    }

    activateElements() {
        this.new_todo = this.elt.querySelector(".new-todo");
        this.new_todo.onkeyup = (e) => {
            if(e.code === "Enter"){
                this.addTodo();
            }
        } 
    }

    toggleCompleted(){
        document.addEventListener('change', (e) => {
            if(e.target.matches(".toggle")){
                e.target.closest('li').classList.toggle("completed");
                let id = e.target.closest('li').dataset.id;
                this.todos[id-1].completed = !this.todos[id-1].completed;
                console.log(this.todos[id-1].completed);
                this.updateTodo(this.todos[id-1]);
            }; 
            this.renderActiveCount();
        })
    }

    renderActiveCount() { 
        this.activeTodo = this.todos.filter((todo) => !todo.completed);
        document.querySelector(".todo-count").innerHTML = this.activeTodo.length;
    }

    async loadTodos() {
        const todos = await DB.findAll();
        this.todos = todos.map(todo => new Todo(todo));  
        this.render();        
    }

    async updateTodo(data){
        const update_todo = await DB.updateOne({
            id: data.id,
            completed : data.completed,
        })
    }

   async addTodo(){
        const add_todo = await DB.addOne({
            content: this.new_todo.value,
            completed: false
        });
        const new_todo  = new Todo(add_todo);
        new_todo.render();
        this.todos.push(new_todo);
        this.new_todo.value = "";
        this.renderActiveCount();
        this.loadTodos();
    }

    render(){
        this.elt.innerHTML = getTemplate(this);
        this.activateElements();
        this.toggleCompleted();
        this.renderActiveCount();
    }
}
  

