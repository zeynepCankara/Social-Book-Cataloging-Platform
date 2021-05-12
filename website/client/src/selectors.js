import { useSelector } from 'react-redux';

export const useBookSelector = () => {
    return useSelector(state => state.books) || [];
}

export const useUserSelector = () => {
    return useSelector(state => state.user) || {}
}

export const useHomeContentSelector = () => {
    return useSelector(state => state.homeContent) || { mode: 'none'};
}