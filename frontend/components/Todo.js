import React from 'react'

export default class Todo extends React.Component {
  render() {
    return (
      <div
        onClick={this.props.toggleCompleted(td.id)}
        key={td.id}>{td.completed ? ' Yes ' : ' '}</div>
    )
  }
}
