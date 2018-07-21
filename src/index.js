import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GraphApi from './api/graph.api';
import Node from './node';
import Edge from './edge';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {};
  }

  handleDoubleClick = event => {
    event.persist();
    if (event.target !== this.containerRef.current) return;
    const nodeData = {
      x: event.clientX,
      y: event.clientY,
      width: 125,
      height: 60,
      text: 'Text'
    };
    const graph = this.state.graph;
    graph.node(nodeData);
    this.setState({});
  };

  handleMouseMove = event => {
    event.persist();
    if (this.state.dragging) {
      this.setState(prevState => {
        const node = this.state.dragging.node;
        node.data.x = event.clientX - prevState.dragging.offsetX;
        node.data.y = event.clientY - prevState.dragging.offsetY;
        return {};
      });
    }
    if (this.state.connection) {
      this.setState({
        connection: {
          ...this.state.connection,
          x: event.clientX,
          y: event.clientY
        }
      });
    }
  };

  async componentDidMount() {
    const graph = await GraphApi.getGraph();
    window.g = graph;
    this.setState({ graph });
  }

  handleStartConnection = node => {
    console.log('from', node.id);
    this.setState({
      connection: { from: node, x: node.data.x, y: node.data.y }
    });
  };

  handleFinishConnection = node => {
    if (this.state.connection && this.state.connection.from !== node) {
      console.log('to', node.id);
      this.setState(prevState => {
        this.state.graph.edge(this.state.connection.from, node);
        return { connection: null };
      });
    }
  };

  handleChangeNodeData = (id, dataToChange) => {
    this.setState(prevState => {
      const nodes = prevState.graph.nodes;
      nodes[id].data = { ...nodes[id].data, ...dataToChange };
      return {
        graph: prevState.graph
      };
    });
  };

  componentDidUpdate(prevProps, prevState) {
    console.log('update');
  }

  handleStartDrag = dragStartData => {
    this.setState({ dragging: dragStartData });
  };

  handleMouseUp = () => {
    (this.state.dragging || this.state.connection || this.state.editing) &&
      this.setState({ dragging: null, connection: null, editing: null });
  };

  handleKeyDown = event => {
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if (event.ctrlKey && charCode === 's') {
      event.preventDefault();
      console.log('Ctrl + S pressed');
      GraphApi.saveGraph(this.state.graph);
    }
  };

  handleStartEditNode = node => {
    this.setState({ editing: { node } });
  };

  handleEditNode = event => {
    event.persist();
    this.setState(prevState => {
      prevState.editing.node.data.text = event.target.value;
      return {};
    });
  };

  render() {
    return (
      <div>
        <svg
          ref={this.containerRef}
          className="container"
          onDoubleClick={this.handleDoubleClick}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onKeyDown={this.handleKeyDown}
          tabIndex="0"
        >
          {this.state.graph &&
            this.state.graph.edges &&
            this.state.graph.edges.map(edge => {
              return <Edge key={edge.id} edge={edge} />;
            })}
          {this.state.graph &&
            this.state.graph.edges &&
            this.state.graph.nodes.map(node => {
              return (
                <Node
                  key={node.id}
                  node={node}
                  onStartConnection={this.handleStartConnection}
                  onFinishConnection={this.handleFinishConnection}
                  onChangeNodeData={this.handleChangeNodeData}
                  onStartDrag={this.handleStartDrag}
                  onStartEdit={this.handleStartEditNode}
                />
              );
            })}
          {this.state.connection && (
            <line
              className="edgeElement"
              x1={this.state.connection.from.data.x}
              y1={this.state.connection.from.data.y}
              x2={this.state.connection.x + 20}
              y2={this.state.connection.y + 20}
              fill="#ffb"
              stroke="black"
              strokeWidth="3px"
            />
          )}
        </svg>
        {this.state.editing && (
          <input
            type="text"
            value={this.state.editing.node.data.text}
            style={{
              position: 'absolute',
              left: this.state.editing.node.data.x,
              top: this.state.editing.node.data.y
            }}
            onChange={this.handleEditNode}
          />
        )}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<App />, document.getElementById('root'));
