import axios from 'axios';

const base_url = 'http://localhost:8000/api/jwt/';

export const createJWT = async (data) => {
    return axios.post(`${base_url}create/`, data)
}

export const refreshJWT = async (refreshToken) => {
    return axios.post(`${base_url}refresh/`, {refresh: refreshToken})
}

export const verifyJWT = async (accessToken) => {
    return axios.post(`${base_url}verify/`, {token: accessToken})
}