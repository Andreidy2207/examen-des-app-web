import axios from 'axios'

// URL del recurso productos en MockAPI
const BASE_URL = 'https://6a2ebb2cc9776ca6c0c4e3a9.mockapi.io/products'

export default {
  getAll()            { return axios.get(BASE_URL) },
  getById(id)         { return axios.get(`${BASE_URL}/${id}`) },
  create(producto)    { return axios.post(BASE_URL, producto) },
  update(id, producto){ return axios.put(`${BASE_URL}/${id}`, producto) },
  delete(id)          { return axios.delete(`${BASE_URL}/${id}`) }
}