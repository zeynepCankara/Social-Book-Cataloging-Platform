import axios from 'axios';

export async function login(payload) {
    return axios.post('http://localhost:3001/login', payload).then(res => res);
}

export async function signup(payload) {
    return axios.post('http://localhost:3001/signup', payload).then(res => res);
}

export async function getAllBooks() {
    return axios.get('http://localhost:3001/getAllBooks').then(res => res);
}