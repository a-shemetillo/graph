import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { jsPlumb } from 'jsplumb';
import GraphApi from './api/graph';
import Node from './node';
import Edge from './edge';

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
    const graph = await GraphApi.getGraph();
    window.g = graph;
    this.setState({ graph });
  }

  handleStartConnection = node => {
    console.log(node._id);
    this.setState(prevState => {
      return {
        connection: { from: node }
      };
    });
  };

  handleFinishConnection = node => {
    console.log(node._id);
    if (this.state.connection) {
      this.setState(prevState => {
        return {
          connection: { ...prevState.connection, to: node }
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
    graph.edge(this.state.connection.from, this.state.connection.to);
    this.setState({ graph, connection: null });
  };

  render() {
    return (
      <svg className="container" onDoubleClick={this.handleDoubleClick}>
        {this.state.graph.edges &&
          this.state.graph.edges.map(edge => {
            return <Edge key={edge._id} edge={edge} />;
          })}
        {this.state.graph.edges &&
          this.state.graph.nodes.map(node => {
            return (
              <Node
                key={node._id}
                node={node}
                onStartConnection={this.handleStartConnection}
                onFinishConnection={this.handleFinishConnection}
                onChangeNodeData={this.handleChangeNodeData}
              />
            );
          })}
      </svg>
    );
  }
}

// ========================================

ReactDOM.render(<App />, document.getElementById('root'));
