import React from 'react'
import axios from 'axios';
import TodoList from './TodoList'; // Ensure this import is correct based on your file structure

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            message: '',
            error: '',
            todoNameInput: '',
            showCompleted: true
        };
    }

    fetchAllTodos = () => {
        axios.get(URL)
        .then(res => {
          //  console.log("Todos fetched:", res.data); // Log the response
            this.setState({...this.state, 
                todos: res.data.data
                //message: res.data.message
            // }, () => {
            //     console.log("Updated state:", this.state.todos); // Log the updated state
            });
        })
        .catch(err => {
            console.error(err.message);
            this.setState({ error: 'Error fetching todos: ' + err.message });
        });
    }

    componentDidMount() {
        this.fetchAllTodos();
    }

    onTodoInputChange = (e) => {
        const { value } = e.target;
        this.setState({ todoNameInput: value });
    }

    onTodoSubmit = e => {
        e.preventDefault();
        const newTodo = {
            name: this.state.todoNameInput,
            completed: false
        };

        axios.post(URL, newTodo)
            .then(response => {
                this.setState(prevState => ({
                    todos: [...prevState.todos, response.data],
                    todoNameInput: ''
                }));
            })
            .catch(error => {
                this.setState({ error: 'Error adding todo: ' + error.message });
            });
    }

    toggleCompletion = id => {
        this.setState(prevState => ({
            todos: prevState.todos.map(todo => {
                if (todo.id === id) {
                    return { ...todo, completed: !todo.completed };
                }
                return todo;
            })
        }), () => {
            const todo = this.state.todos.find(todo => todo.id === id);
            axios.patch(`${URL}/${id}`, { completed: todo.completed })
                .then(res => {
                    console.log('Completion toggled', res.data);
                })
                .catch(err => {
                    console.error('Error toggling completion:', err);
                });
        });
    }

    toggleShowCompleted = () => {
        this.setState(prevState => ({
            showCompleted: !prevState.showCompleted
        }));
    }

    render() {
        const visibleTodos = this.state.showCompleted 
            ? this.state.todos 
            : this.state.todos.filter(todo => !todo.completed);

        return (
            <div>
                <div id="error">{this.state.error}</div>
                <div id="todos">
                    <h1>{this.state.message}</h1>
                    {
                        this.state.todos.map(td => {
                            return <div key={td.id}>{td.name}</div>
                        })
                    }
                </div>
                <TodoList todos={visibleTodos} toggleCompletion={this.toggleCompletion} />
                <form id="todoForm" onSubmit={this.onTodoSubmit}>
                    <input value={this.state.todoNameInput} onChange={this.onTodoInputChange} type="text" placeholder='Type Todo'></input>
                    <input type="submit"></input>
                </form>
                <button onClick={this.toggleShowCompleted}>
                    {this.state.showCompleted ? "Hide" : "Show"} Completed
                </button>
            </div>
        )
    }
}
