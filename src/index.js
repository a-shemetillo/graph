import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import interact from 'interactjs';
import { jsPlumb } from 'jsplumb';
import { Graph } from 'data-net';
import GraphApi from './api/graph';
// import update from 'immutability-helper';


// class SvgRectangle extends React.Component {
//
//   handleDrag(event) {
//     console.log('react SyntheticEvent ==> ', event);
//     console.log('nativeEvent ==> ', event.nativeEvent); //<- gets native JS event
//   }
//
//   render() {
//     return (
//       <rect x={this.props.x} y={this.props.y} draggable="true" onDragStart={this.handleDrag} width="70" height="70" stroke="black" fill="transparent" strokeWidth="5"/>
//         // <g transform="translate(40,40)">
//         // <text contentEditable="true">foo</text>
//         // </g>
//     );
//   }
// }


// class Draggable extends React.Component {
//
//   handleDrag(event) {
//     console.log('react SyntheticEvent ==> ', event);
//     console.log('nativeEvent ==> ', event.nativeEvent); //<- gets native JS event
//   }
//
//   handleDrop(event) {
//     console.log('react drop', event);
//   }
//
//   render() {
//
//     interact('.rainbow-pixel-canvas')
//     return (
//       <div draggable="true" onDragStart={this.handleDrag} onDrop = {this.handleDrop} style={{width: 70, height: 60}}>wqwq</div>
//     );
//   }
// }

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditText: false
    }
  }

  dragMoveListener (event) {
    const target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      // x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      // y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
      x = parseFloat(target.style.left) + event.dx,
      y = parseFloat(target.style.top) + event.dy;

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    // translate the element
    // target.style.webkitTransform =
    //   target.style.transform =
    //     'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    // target.setAttribute('data-x', x);
    // target.setAttribute('data-y', y);
  }

  onDrop = (event) => {
    console.log(111);
    // const target = event.target;
    // console.log(this.state);
    // const elements = update(this.state.elements, {[target.id]: {x: {$set: target.dx}, y: {$set: target.dy}}});
    // this.setState({elements}, () => {
    //   console.log(this.state.elements); // further value
    // });
    // this.setState((prevState) => {
    //   return {elements: update(prevState.elements, {[target.id]: {x: {$set: target.dx}, y: {$set: target.dy}}})};
    // });
  };

  componentDidMount() {
    interact('.nodeElement')
      .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // call this function on every dragmove event
        onmove: this.dragMoveListener,
        onend: this.onDrop
      })
    //   .resizable({
    //     // resize from all edges and corners
    //     edges: { left: true, right: true, bottom: true, top: true },
    //
    //     // keep the edges inside the parent
    //     restrictEdges: {
    //       outer: 'parent',
    //       endOnly: true,
    //     },
    //
    //     // minimum size
    //     restrictSize: {
    //       min: { width: 100, height: 50 },
    //     },
    //
    //     inertia: true,
    //   })
    //   .on('resizemove', function (event) {
    //     var target = event.target,
    //       x = (parseFloat(target.getAttribute('data-x')) || 0),
    //       y = (parseFloat(target.getAttribute('data-y')) || 0);
    //
    //     // update the element's style
    //     target.style.width  = event.rect.width + 'px';
    //     target.style.height = event.rect.height + 'px';
    //
    //     // translate when resizing from top or left edges
    //     x += event.deltaRect.left;
    //     y += event.deltaRect.top;
    //
    //     target.style.webkitTransform = target.style.transform =
    //       'translate(' + x + 'px,' + y + 'px)';
    //
    //     target.setAttribute('data-x', x);
    //     target.setAttribute('data-y', y);
    //     target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
    //   });
  }

  handleDrop = (event) => {
    const target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

  };

  startConnection = (event) => {
    event.preventDefault();
    this.props.onStartConnection(event.target.id);
  };

  finishConnection =  (event) => {
    if(event.button === 2) {
      this.props.onFinishConnection(event.target.id);
    }
  };

  handleChange = (event) => {
    console.log(event.target.value);
    // this.setState({value: event.target.value});
  };

  toggleEditText = () => {
    this.setState((prevState) => {
      return {isEditText: !prevState.isEditText};
    });
  };

  render() {
    const {x, y, width, height, text} = this.props.data;
    return (
      <div className="nodeElement" id={this.props.id} style={{width: width, height: height, top: y,left: x}}
           onContextMenu = {this.startConnection} onMouseUp= {this.finishConnection} >
          { this.state.isEditText ?
            <input type="text" value={text} onBlur={this.toggleEditText} onChange={this.handleChange} autoFocus/> :
            <p onClick = {this.toggleEditText}>{text}</p>
          }
      </div>
    );
  }
}



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: {},
      elements: [],
      jsPlumbInstance: jsPlumb.getInstance(),
      connection: {
        left: '',
        right: ''
      }
    }
  }

  handleDoubleClick = (event) => {
    event.persist();
    const nodeData = {x: event.clientX, y: event.clientY, width: 125, height: 60, text: 'Text'};
    const graph = this.state.graph;
    graph.node(nodeData);
    this.setState({graph});
    // return {elements: [...prevState.elements, {x: event.clientX, y: event.clientY, width: 125, height: 60, text: 'Text'}]};
  };

  async componentDidMount() {
    const graphData = await GraphApi.getGraph();
    this.setState({graph: Graph.create(graphData)})
  }

  handleStartConnection = (nodeId) => {
    this.setState((prevState) => {
      return {
        connection: {...prevState.connection, left: nodeId}
      }
    });
  };

  handleFinishConnection = (nodeId) => {
    if(this.state.connection.left) {
      this.setState((prevState) => {
        return {
          connection: {...prevState.connection, right: nodeId}
        }
      }, this.createConnection);
    }
  };

  // componentDidUpdate(prevProps, prevState) {
  //   console.log(prevState.connection);
  //   // only update if you create connection between nodes
  //   if (prevState.connection.right !== this.state.connection.right) {
  //     this.createConnection();
  //   }
  // }

  createConnection = () => {
    const graph = this.state.graph;
    graph.edge(graph.nodes[this.state.connection.left], graph.nodes[this.state.connection.right]);
    this.setState({graph});

    this.state.jsPlumbInstance.connect({
        source: this.state.connection.left.toString(),
        target: this.state.connection.right.toString(),
        paintStyle:{strokeWidth:8, stroke:'rgb(189,11,11)'},
        anchors:["Bottom", "Top"],
        endpoint:"Rectangle"
      });
  };


  render() {
    return (
      <div className="container" onDoubleClick={this.handleDoubleClick}>
        {this.state.graph.nodes && this.state.graph.nodes.length > 0 && this.state.graph.nodes.map((element, index) => {
          return  <Node key = {index} id = {index} data={element.data} onStartConnection={this.handleStartConnection}
                        onFinishConnection={this.handleFinishConnection}/>
          })
        }
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
