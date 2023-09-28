import Todo from '../todo/Todo.js'
import DB from '../../DB.js';
import getTemplate from "./template.js";

export default class {
    constructor (data) {
        DB.setApiURL(data.apiURL);
        this.elt = document.querySelector(data.elt);
        this.todos = [];
        this.new_todo = null;
        this.loadTodos();
        this.activeTodo = 0;
    }
    async loadTodos() {
        const todos = await DB.findAll();
        this.todos = todos.map(todo => new Todo(todo));  
        this.render();        
    }

    activateElements() {
        this.new_todo = this.elt.querySelector(".new-todo");
        this.new_todo.onkeyup = (e) => {
            if(e.code === "Enter"){
                this.addTodo();
            }
        }
    }

   async addTodo(){
        const add_todo = await DB.addOne({
            id: "",
            content: this.new_todo.value,
            completed: false
        });
        const new_todo  = new Todo(add_todo);
        new_todo.render();
    }

    toggleCompleted(){
        document.addEventListener('change', (e) => {
            if(e.target.matches(".toggle")){
                e.target.closest('li').classList.toggle("completed");
                const id = e.target.closest('li').dataset.id;
            };
            this.renderActiveCount();
        })
    }



    renderActiveCount() { 
            this.activeTodo = this.todos.filter(todo => todo.completed === false);
            document.querySelector(".todo-count").innerHTML = this.activeTodo.length;

    }

    render(){
        this.elt.innerHTML = getTemplate(this);
        this.toggleCompleted();
        this.renderActiveCount();
        this.activateElements();
    }
}
  

