import React from 'react';

export default class TodoList extends React.Component {
    render() {
        const { todos, toggleCompletion } = this.props;

        return (
            <div id="todos">
                <h2>Todos:</h2>
                {todos.map(todo => (
                    <div key={todo.id} onClick={() => toggleCompletion(todo.id)}>
                        {todo.name} - {todo.completed ? 'Completed' : 'Not Completed'}
                    </div>
                ))}
            </div>
        );
    }
}




    // <div id="todos">{this.onTodoSubmit}
    // <h2> Todos</h2>
    //      {this.props.todos.reduce((acc, td) =>  {
    //              if(this.props.toggleShowCompleted || !td.toggleShowCompleted) return   acc.concat(
    //               <div onClick={this.props.toggleCompletion(td.id)} key={td.id}>{td.name} {td.completed?  ' ✔' : ' '}</div>
    //              ) 
    //              return acc
    //      }), []}
    // </div>
    
   
 
