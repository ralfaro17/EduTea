import axios from 'axios';

const base_url = 'http://localhost:8000/api/users/';

export const createUser = async (data) => {
    return axios.post(base_url, data)
}

export const activateUser = async (data) => {
    return axios.post(`${base_url}activation/`, data)
}

export const resendActivationEmail = async (data) => {
    return axios.post(`${base_url}resend_activation/`, data)
}

export const getUser = async (accessToken) => {
    return axios.get(`${base_url}me/`, { headers: { "Authorization": `Bearer ${accessToken}` }})
}

export const putUser = async (accessToken, data) => {
    return axios.put(`${base_url}me/`, data, { headers: { "Authorization": `Bearer ${accessToken}` }})
}

export const patchUser = async (accessToken, data) => {
    return axios.patch(`${base_url}me/`, data, { headers: { "Authorization": `Bearer ${accessToken}` }})
}

export const deleteUser = async (accessToken, data) => {
    return axios.delete(`${base_url}me/`, data, { headers: { "Authorization": `Bearer ${accessToken}` }})
}

export const resetEmail = async (email) => {
    return axios.post(`${base_url}reset_email/`, email)
} 

export const resetEmailConfirmation = (data) => {
    return axios.post(`${base_url}reset_email_confirm/`, data)
}

export const resetPassword = async (email) => {
    return axios.post(`${base_url}reset_password/`, email)
}

export const resetPasswordConfirmation = async (data) => {
    return axios.post(`${base_url}reset_password_confirm/`, data)
}