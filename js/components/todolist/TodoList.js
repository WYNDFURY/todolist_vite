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
        this.loadTodos();
    }

    activateElements() {
        this.new_todo = this.elt.querySelector(".new-todo");
        this.new_todo.onkeyup = (e) => {
            if(e.code === "Enter"){
                this.addTodo();
            }
        };
        document.addEventListener('change', (e) => {
            if(e.target.matches(".toggle")){
                // this.loadTodos();
            }})
    }

    toggleCompleted(){
        document.addEventListener('change', (e) => {
            if(e.target.matches(".toggle")){
                e.target.closest('li').classList.toggle("completed");
                let id = e.target.closest('li').dataset.id;
                let toggle_completed = this.todos.filter((todo) => todo.id == id)[0];
                // console.log(this.todos.filter((todo) => todo.id == id)[0]);
                toggle_completed.completed = !toggle_completed.completed;
                this.updateTodo(toggle_completed);
            }; 
            this.renderActiveCount();
        })
    }
D
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
            await DB.updateOne({
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
    }

    render(){
        this.elt.innerHTML = getTemplate(this);
        this.activateElements();
        this.toggleCompleted();
        this.renderActiveCount();
    }
}
  

