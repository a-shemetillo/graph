import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { jsPlumb } from 'jsplumb';
// import { Graph } from 'data-net';
// import GraphApi from './api/graph';
import Node from './node';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customGraph: {
        nodes: [],
        edges: []
      },
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
    this.setState((prevState) => {
      return { customGraph: {...prevState.customGraph, nodes: [...prevState.customGraph.nodes, nodeData]}}
      }
    )
  };

  async componentDidMount() {
    // const graphData = await GraphApi.getGraph();
    // this.setState({ graph: graphData});
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
    this.setState((prevState) => {
        return { customGraph: {...prevState.customGraph, nodes: [...prevState.customGraph.nodes.slice(0, id), { ...prevState.customGraph.nodes[id], ...dataToChange }, ...prevState.customGraph.nodes.slice(id + 1)]}}
      }
    );
  };

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.customGraph !== this.state.customGraph) {
      // const response = await GraphApi.saveGraph();
      console.log('update');
    }
  }

  createConnection = () => {
    this.setState((prevState) => {
        return { customGraph: {...prevState.customGraph, edges: [...prevState.customGraph.edges, {from: this.state.connection.left, to: this.state.connection.right}]}}
      }
    );
  };

  render() {

    if(this.state.customGraph.edges.length) {
      this.state.customGraph.edges.forEach((edge) => {
        this.state.jsPlumbInstance.connect({
          source: edge.from,
          target: edge.to,
          reattach:true,
          paintStyle: { strokeWidth: 8, stroke: 'rgb(189,11,11)' },
          anchors: ['Bottom', 'Top'],
          endpoint: 'Rectangle'
        });

        // this.state.jsPlumbInstance.addEndpoint(edge.from, { isSource:true });
      });

    }

    return (
      <div className="container" onDoubleClick={this.handleDoubleClick}>
        {this.state.customGraph.nodes &&
          this.state.customGraph.nodes.length > 0 &&
          this.state.customGraph.nodes.map((element, index) => {
            return (
              <Node
                key={index}
                id={index}
                data={element}
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
