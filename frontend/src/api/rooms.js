import axios from 'axios';

const base_url = 'http://localhost:8000/api/rooms/';

export const getRooms = async (accessToken) => {
    return axios.get(base_url, { headers: { "Authorization": `Bearer ${accessToken}` } })
}

export const postRoom = async (accessToken, data) => {
    return axios.post(base_url, data, { headers: { "Authorization": `Bearer ${accessToken}` } })
}

export const getRoom = async (accessToken, id) => {
    return axios.get(`${base_url}${id}/`, { headers: { "Authorization": `Bearer ${accessToken}` } })
}

export const putRoom = async (accessToken, id, data) => {
    return axios.put(`${base_url}${id}/`, data, { headers: { "Authorization": `Bearer ${accessToken}` } })
}

export const patchRoom = async (accessToken, id, data) => {
    return axios.patch(`${base_url}${id}/`, data, { headers: { "Authorization": `Bearer ${accessToken}` } })
}

export const deleteRoom = async (accessToken, id) => {
    return axios.delete(`${base_url}${id}/`, { headers: { "Authorization": `Bearer ${accessToken}` } })
}