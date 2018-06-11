import { Graph } from 'data-net';

export default class GraphApi {
  /**
   * Return graph
   * @returns {object}
   */
  static async getGraph() {
    // const url = `${apiUrl}/getGraph`;
    // const response = await fetch(url);
    // const results = await response.json();
    // return results;

    return makeDummyGraph();
  }
}

function makeDummyGraph() {
  const graph = Graph.create();
  const n1 = graph.node({ x: 200, y: 200, width: 200, height: 80 });
  const n2 = graph.node({ x: 500, y: 600, width: 200, height: 80 });
  graph.edge(n1, n2);
  return graph;
}
