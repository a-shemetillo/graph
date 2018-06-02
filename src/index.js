import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { jsPlumb } from 'jsplumb';
import { Graph } from 'data-net';
import GraphApi from './api/graph';
import Node from './node';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: {},
      jsPlumbInstance: jsPlumb.getInstance(),
      connection: {
        left: '',
        right: ''
      }
    };
  }

  handleDoubleClick = event => {
    event.persist();
    const nodeData = {
      x: event.clientX,
      y: event.clientY,
      width: 125,
      height: 60,
      text: 'Text'
    };
    const graph = this.state.graph;
    graph.node(nodeData);
    this.setState({ graph });
  };

  async componentDidMount() {
    const graphData = await GraphApi.getGraph();
    this.setState({ graph: Graph.create(graphData) });
  }

  handleStartConnection = nodeId => {
    this.setState(prevState => {
      return {
        connection: { ...prevState.connection, left: nodeId }
      };
    });
  };

  handleFinishConnection = nodeId => {
    if (this.state.connection.left) {
      this.setState(prevState => {
        return {
          connection: { ...prevState.connection, right: nodeId }
        };
      }, this.createConnection);
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
    // console.log(prevState.connection);
    // // only update if you create connection between nodes
    // if (prevState.connection.right !== this.state.connection.right) {
    //   this.createConnection();
    // }
  }

  createConnection = () => {
    const graph = this.state.graph;
    graph.edge(
      graph.nodes[this.state.connection.left],
      graph.nodes[this.state.connection.right]
    );
    this.setState({ graph });

    this.state.jsPlumbInstance.connect({
      source: this.state.connection.left.toString(),
      target: this.state.connection.right.toString(),
      paintStyle: { strokeWidth: 8, stroke: 'rgb(189,11,11)' },
      anchors: ['Bottom', 'Top'],
      endpoint: 'Rectangle'
    });
  };

  render() {
    return (
      <div className="container" onDoubleClick={this.handleDoubleClick}>
        {this.state.graph.nodes &&
          this.state.graph.nodes.length > 0 &&
          this.state.graph.nodes.map((element, index) => {
            return (
              <Node
                key={index}
                id={index}
                data={element.data}
                onStartConnection={this.handleStartConnection}
                onFinishConnection={this.handleFinishConnection}
                onChangeNodeData={this.handleChangeNodeData}
              />
            );
          })}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<App />, document.getElementById('root'));
