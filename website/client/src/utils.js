import moment from 'moment';

export const parseDate = date => {
    return moment(date).format('MMMM Do YYYY');
}

export const convertToSQLDate = date => {
    return moment(date).format('YYYY-MM-DD');
}

export const isBefore = (firstDate, secondDate) => {
    return moment(firstDate).isBefore(secondDate);
}