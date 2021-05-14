import { useSelector } from 'react-redux';

export const useBookSelector = () => {
    return useSelector(state => state?.books) || [];
}

export const useUserSelector = () => {
    return useSelector(state => state?.user) || {}
}

export const useHomeContentSelector = () => {
    return useSelector(state => state?.homeContent) || { mode: 'none'};
}

export const useTrackedBooksSelector = () => {
    return useSelector(state => state?.user?.trackedBooks) || {};
}

export const useBookProgressSelector = bookID => {
    return useSelector(state => state?.user?.trackedBooks?.[bookID]) || false;
}

export const useReviewsSelector = () => {
    return useSelector(state => state?.user?.reviews) || {};
}

export const useBookReviewSelector = bookID => {
    return useSelector(state => state?.user?.reviews?.[bookID]) || false;
}