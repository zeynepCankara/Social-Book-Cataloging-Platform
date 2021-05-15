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

export const useMyBooksSelector = () => {
    return useSelector(state => state?.user?.mybooks) || [];
}

export const useReplySelector = (userID, bookID) => {
    return useSelector(state => state?.user?.replies?.filter(e => {
        return e.userId === userID && e.bookId === bookID;
    })[0])
}

export const useBooklistsSelector = () => {
    return useSelector(state => state?.user?.booklists) || [];
}

export const useCurrentListContentSelector = () => {
    return useSelector(state => state?.user?.currentListContent) || false;
}

export const useCurrentListSelector = () => {
    return useSelector(state => state?.user?.currentList) || false;
}