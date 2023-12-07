import React from 'react'
import axios from 'axios';

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        todos: [], // Assuming your API returns an array of todos
        // Add other state properties if needed
        message: '',// Initialize an empty string for the message
        error: '',
        todoNameInput:  '',
        showCompleted: true
    };
}

componentDidMount() {
    axios.get(URL)
        .then(res => {
            // Assuming the response contains an array of todos
            this.setState({
               todos: res.data.data,
               message: res.data.message
               });
        })
        .catch(err => {
          console.error(err.message);
          // Optionally set some state to show an error message
        });
}


             onTodoInputChange = (e) => {
               const { value } = e.target;
               this.setState({...this.state, todoNameInput: value})
              }



              onTodoSubmit = e => {
                e.preventDefault(); // Prevent the default form submission behavior
            
                const newTodo = {
                    // Omit the 'id' if your backend generates it
                    name: this.state.todoNameInput,
                    completed: false
                };
            
                axios.post(URL, newTodo)
                    .then(response => {
                        // Assuming the response includes the new todo with a generated ID
                        this.setState(prevState => ({
                            todos: [...prevState.todos, response.data],
                            todoNameInput: '' // Reset input after adding
                        }));
                    })
                    .catch(error => {
                        // Handle error
                        this.setState({ error: 'Error adding todo: ' + error.message });
                    });
            }

      // componentDidUpdate(prevProps, prevState) {
      //   if (this.state.todos !== prevState.todos) {
      //       axios.post('http://localhost:9000/api/updateTodos', this.state.todos.todoNameInput)
      //           .then(response => {
      //               // Handle successful update
      //               console.log('Todos updated successfully:', response.data);
      //               // Optionally, set state to indicate success, e.g., this.setState({ updateSuccess: true });
      //           })
      //           .catch(error => {
      //               // Handle error
      //               //set a state to show an error message, or perform other error handling actions
      //               console.error('Error updating todos:', error);
      //               this.setState({ updateError: true });
      //           });
      //   }
      // }
              toggleCompletion = id => {
                this.setState(prevState => ({
                    todos: prevState.todos.map(todo => {
                        if (todo.id === id) {
                            return { ...todo, completed: !todo.completed };
                        }
                        return todo;
                    })
                }), () => {
                    // After state is updated, make an API call to update the backend
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
         // Filter todos based on showCompleted state
        const visibleTodos = this.state.showCompleted 
        ? this.state.todos 
        : this.state.todos.filter(todo => !todo.completed);

    return (
              <div>
                <div id="error">{this.state.error}</div>
  
                <div id="todos">

                        <h1>{this.state.message}</h1>
                </div>
                 
                {visibleTodos.map(todo => (
                <div key={todo.id} onClick={() => this.toggleCompletion(todo.id)}>
                  {todo.name} - {todo.completed ? 'Completed' : 'Not Completed'}
                  </div>     
            ))}

                <form id="todoForm" onSubmit={this.onTodoSubmit}>
              <input value={this.state.todoNameInput} onChange={this.onTodoInputChange}  type="text" placeholder='Type Todo'></input>
              <input type="submit"></input>


                </form>

                <button onClick={this.toggleShowCompleted}>
                {this.state.showCompleted ? "Hide" : "Show"} Completed   </button>
              </div>


    )
  }
}
