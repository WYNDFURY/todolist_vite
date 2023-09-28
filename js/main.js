// import '../css/app.css'
import '../styles.scss';
import '../css/index.scss';
import TodoList from "./components/todolist/TodoList";


new TodoList({
    apiURL: "https://6508d7db56db83a34d9cb8ef.mockapi.io",
    elt: "#app"
});  