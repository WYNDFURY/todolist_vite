import axios from 'axios';

export default class {
    static setApiURL(data) {
        this.apiURL = data;
    }

    static async findAll() {
        try {
          const response = await axios.get(this.apiURL + '/todo');
          // Traitement de la réponse
        //   console.log(response.data);
          return response.data;
        } catch (error) {
          // Gestion des erreurs
          console.error(error);
        }
    }

    static async addOne(data) {
      const response = await axios.post(this.apiURL + '/todo', data);
      return response.data;
    }

    static async updateOne(data) {
      const response = await axios.put(this.apiURL + '/todo/' + data.id, data);
      return response.data;
    }

    static async destroyOne(id) {
      const response = await axios.delete(this.apiURL + '/todo/' + id);
      return response.data;
    }
}