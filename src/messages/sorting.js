export const ASCENDING = 1;
export const DESCENDING = 2;

export const sortItemsByKey = function(elements, key, order) {
    const sorted = Object.assign([], elements).sort((a, b) => {
        if (a[key] === b[key]) { return 0; }
        return a[key] > b[key] ? 1 : -1;
    });
    if (order === DESCENDING) {
        sorted.reverse();
    }
    return sorted;
};
