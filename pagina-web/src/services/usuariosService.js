import axios from 'axios'

// URL del recurso usuarios en MockAPI
const BASE_URL = 'https://6a2eb743c9776ca6c0c4dfd5.mockapi.io/users'

export default {
  getAll()           { return axios.get(BASE_URL) },
  getById(id)        { return axios.get(`${BASE_URL}/${id}`) },
  create(usuario)    { return axios.post(BASE_URL, usuario) },
  update(id, usuario){ return axios.put(`${BASE_URL}/${id}`, usuario) },
  delete(id)         { return axios.delete(`${BASE_URL}/${id}`) }
}