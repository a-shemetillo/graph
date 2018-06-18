const apiUrl = 'meow';

export default class GraphApi {

  /**
   * Return graph
   * @returns {object}
   */
  static async getGraph() {
    const url = `${apiUrl}/graph`;
    const response = await fetch(url);
    const results = await response.json();
    return results;
  }

  static async saveGraph(data) {
    const url = `${apiUrl}/graph`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
  }
}