import React from 'react';

export default class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditText: false
    };
  }

  startConnection = event => {
    if (event.button === 2) {
      this.props.onStartConnection(this.props.node);
    }
  };

  finishConnection = event => {
    if (event.button === 2) {
      this.props.onFinishConnection(this.props.node);
    }
  };

  render() {
    return (
      <rect
        className="nodeElement"
        x={this.props.node.data.x - this.props.node.data.width / 2}
        y={this.props.node.data.y - this.props.node.data.height / 2}
        height={this.props.node.data.height}
        width={this.props.node.data.width}
        fill="#ffb"
        stroke="black"
        strokeWidth="2px"
        rx={10}
        onContextMenu={e => e.preventDefault()}
        onMouseDown={this.startConnection}
        onMouseUp={this.finishConnection}
      />
    );
  }
}
