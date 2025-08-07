import axios from "axios";

const base_url = "http://localhost:8000/api/students-rooms/";

export const getStudentsRooms = async (accessToken) => {
    return axios.get(base_url, { headers: { Authorization: `Bearer ${accessToken}` } });
}

export const postStudentsRoom = async (accessToken, data) => {
    return axios.post(base_url, data, { headers: { Authorization: `Bearer ${accessToken}` } });
}

export const getStudentsRoom = async (accessToken, id) => {
    return axios.get(`${base_url}${id}/`, { headers: { Authorization: `Bearer ${accessToken}` } });
}

export const putStudentsRoom = async (accessToken, id, data) => {
    return axios.put(`${base_url}${id}/`, data, { headers: { Authorization: `Bearer ${accessToken}` } });
}

export const patchStudentsRoom = async (accessToken, id, data) => {
    return axios.patch(`${base_url}${id}/`, data, { headers: { Authorization: `Bearer ${accessToken}` } });
}

export const deleteStudentsRoom = async (accessToken, id) => {
    return axios.delete(`${base_url}${id}/`, { headers: { Authorization: `Bearer ${accessToken}` } });
}