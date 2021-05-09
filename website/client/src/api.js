import axios from 'axios';

export function login(name, password) {
    return axios.post('http://localhost:3001/login', {
        name, 
        password
    }).then(res => res);
}