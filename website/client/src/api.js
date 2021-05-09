import axios from 'axios';

export function login(payload) {
    return axios.post('http://localhost:3001/login', payload).then(res => res);
}

export function signup(payload) {
    return axios.post('http://localhost:3001/signup', payload).then(res => res);
}