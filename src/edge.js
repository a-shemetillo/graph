import React from 'react'

export default class Edge extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditText: false,
    }
  }

  render() {
    return (
      <line
        className="edgeElement"
        x1={this.props.edge.from.data.x}
        y1={this.props.edge.from.data.y}
        x2={this.props.edge.to.data.x}
        y2={this.props.edge.to.data.y}
        fill="#ffb"
        stroke="black"
        strokeWidth="2px"
      />
    )
  }
}
