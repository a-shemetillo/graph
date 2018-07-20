import { Graph } from 'data-net';

const apiUrl =
  process.env.REACT_APP_API_URL ||
  'https://shielded-cove-66557.herokuapp.com' ||
  'http://localhost';
console.log('api url:', apiUrl);

export default class GraphApi {
  static async getGraph() {
    // return makeDummyGraph();
    console.log('opening');
    const url = `${apiUrl}/graph`;
    const response = await fetch(url);
    const json = await response.json();
    const graph = Graph.create(json.graph);
    console.log('opened', graph.nodes.length);
    return graph;
  }

  static async saveGraph(graph) {
    const url = `${apiUrl}/graph`;
    console.log('saving');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ graph })
    });
    console.log('saved', response);
  }
}

function makeDummyGraph() {
  const graph = Graph.create();
  const n1 = graph.node({
    x: 200,
    y: 200,
    width: 200,
    height: 80,
    text: 'abc'
  });
  const n2 = graph.node({
    x: 500,
    y: 600,
    width: 200,
    height: 80,
    text: '123'
  });
  graph.edge(n1, n2);
  return graph;
}
