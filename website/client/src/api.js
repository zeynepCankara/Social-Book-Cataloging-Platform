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

export async function getTrackedBooks(username) {
    return axios.post('http://localhost:3001/getTrackedBooks', {username}).then(res => res);
}

export async function getFilteredBooks(filters) {
    return axios.post('http://localhost:3001/getFilteredBooks', filters).then(res => res);
}

export async function getReviews(username) {
    return axios.post('http://localhost:3001/getReviews', {username}).then(res => res);
}

export async function getEditions(bookId) {
    return axios.post('http://localhost:3001/getEditions', {bookId}).then(res => res);
}

export async function startTracking(payload) {
    return axios.post('http://localhost:3001/startTracking', payload).then(res => res);
}

export async function addReview(payload) {
    return axios.post('http://localhost:3001/addReview', payload).then(res => res);
}