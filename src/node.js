import React from 'react';
import interact from 'interactjs';

export default class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditText: false
    };
  }

  dragMoveListener(event) {
    const target = event.target,
      x = parseFloat(target.style.left) + event.dx,
      y = parseFloat(target.style.top) + event.dy;
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
  }

  onDrop = event => {
    const { left, top } = event.target.style;
    this.props.onChangeNodeData(this.props.id, {
      x: parseFloat(left),
      y: parseFloat(top)
    });
  };

  componentDidMount() {
    interact('.nodeElement').draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent
      restrict: {
        restriction: 'parent',
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      // call this function on every dragmove event
      onmove: this.dragMoveListener,
      onend: this.onDrop
    });
  }

  startConnection = event => {
    if (event.button === 2) {
      this.props.onStartConnection(event.target.id);
    }
  };

  finishConnection = event => {
    if (event.button === 2) {
      this.props.onFinishConnection(event.target.id);
    }
  };

  handleTextChange = event => {
    this.props.onChangeNodeData(this.props.id, { text: this.textInput.value });
  };

  toggleEditText = () => {
    this.setState(prevState => {
      return { isEditText: !prevState.isEditText };
    });
  };


  render() {
    const { x, y, width, height, text } = this.props.data;

    return (
      <div
        className="nodeElement"
        id={this.props.id}
        style={{ width: width, height: height, top: y, left: x }}
        onContextMenu={e => e.preventDefault()}
        // onContextMenu={this.startConnection}
        onMouseDown={this.startConnection}
        onMouseUp={this.finishConnection}
      >
        {this.state.isEditText ? (
          <input
            type="text"
            // value={text}
            defaultValue={text}
            ref={ref => (this.textInput = ref)}
            onBlur={() => {
              this.handleTextChange();
              this.toggleEditText();
            }}
            // onChange={this.handleTextChange}
            autoFocus
          />
        ) : (
          <p onClick={this.toggleEditText}>{text}</p>
        )}
      </div>
    );
  }
}
