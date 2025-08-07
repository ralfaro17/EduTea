import axios from "axios";

const base_url = "http://localhost:8000/api/messages/";

export const getMessages = async (accessToken, data) => {
  return axios.get(base_url, { headers: { Authorization: `Bearer ${accessToken}` }, params: data });
}

export const postMessage = async (accessToken, data) => {

  return axios.post(base_url, data, { headers: { Authorization: `Bearer ${accessToken}` } });
}

export const getMessage = async (accessToken, id) => {
  return axios.get(`${base_url}${id}/`, { headers: { Authorization: `Bearer ${accessToken}` } });
}

export const putMessage = async (accessToken, id, data) => {
  return axios.put(`${base_url}${id}/`, data, { headers: { Authorization: `Bearer ${accessToken}` } });
}

export const patchMessage = async (accessToken, id, data) => {
  return axios.patch(`${base_url}${id}/`, data, { headers: { Authorization: `Bearer ${accessToken}` } });
}

export const deleteMessage = async (accessToken, id) => {
  return axios.delete(`${base_url}${id}/`, { headers: { Authorization: `Bearer ${accessToken}` } });
}