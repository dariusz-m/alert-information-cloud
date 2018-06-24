
/**
 * Filter given items by given string in given key values.
 *
 * @param {Array}  items       : Items to filter.
 * @param {Array}  keys        : Keys of values to check.
 * @param {String} filterString: Filter string.
 *
 * @returns {Array}
 */
export const filterItemsByKey = function(items, keys, filterString) {
    return items.filter(function(item) {
        return keys.some(key => item[key].toString().toLowerCase().startsWith(filterString.toLowerCase()));
    });
};
