import React from 'react'

export default class Node extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditText: false,
    }
  }

  handleMouseDown = event => {
    if (event.button === 2) {
      this.props.onStartConnection(this.props.node)
    } else {
      this.props.onStartDrag({
        offsetX: event.clientX - this.props.node.data.x,
        offsetY: event.clientY - this.props.node.data.y,
        node: this.props.node,
      })
    }
  };

  handleMouseUp = event => {
    if (event.button === 2) {
      this.props.onFinishConnection(this.props.node)
    }
  };

  handleDoubleClick = () => {
    console.log('edit')
    this.props.onStartEdit(this.props.node)
  };

  render() {
    const data = this.props.node.data
    return (
      <g>
        <rect
          className="nodeElement"
          x={data.x - data.width / 2}
          y={data.y - data.height / 2}
          height={data.height}
          width={data.width}
          fill="#ffb"
          stroke="black"
          strokeWidth="2px"
          rx={10}
          onContextMenu={e => e.preventDefault()}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onDoubleClick={this.handleDoubleClick}
        />
        <text x={data.x} y={data.y}>
          {data.text}
        </text>
      </g>
    )
  }
}
