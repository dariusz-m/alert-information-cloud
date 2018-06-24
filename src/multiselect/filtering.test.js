import { filterItemsByKey } from './filtering';


it('Elements are filtered by key if key value begins with given string.', () => {
    const banana = {name: 'Banana', quantity: 1};
    const apple = {name: 'Apple', quantity: 3};
    const watermelon = {name: 'Watermelon', quantity: 2};
    const bananarama = {name: 'Bananarama band', quantity: 1};

    const filteredByName = filterItemsByKey([watermelon, banana, apple, bananarama], ['name'], 'Ban');

    expect(filteredByName).toEqual([banana, bananarama]);
});

it('If filter string is contained in key value but doesnt start with it, than it must be filtered.', () => {
    const banana = {name: 'Banana'};
    const apple = {name: 'Apple'};

    const filteredByName = filterItemsByKey([banana, apple], ['name'], 'nana');

    expect(filteredByName).toEqual([]);
});


it('Elements can be filtered by more than one key.', () => {
    const banana = {name: 'Banana', company: 'Chiquita', quantity: 1};
    const apple = {name: 'Apple', company: 'Somersby', quantity: 3};
    const watermelon = {name: 'Watermelon', company: 'Aqualand', quantity: 2};

    const filteredByName = filterItemsByKey([watermelon, banana, apple], ['name', 'company'], 'A');

    expect(filteredByName).toEqual([watermelon, apple]);
});


it('Elements are filtered if filter string is lower case and key value is upper case.', () => {
    const banana = {name: 'BANANA', quantity: 1};
    const apple = {name: 'APPLE', quantity: 3};
    const watermelon = {name: 'WATERMELON', quantity: 2};

    const filteredByName = filterItemsByKey([watermelon, banana, apple], ['name'], 'ban');

    expect(filteredByName).toEqual([banana]);
});


it('Elements are filtered if filter string is upper case and key value is lower case.', () => {
    const banana = {name: 'banana', quantity: 1};
    const apple = {name: 'apple', quantity: 3};
    const watermelon = {name: 'watermelon', quantity: 2};

    const filteredByName = filterItemsByKey([watermelon, banana, apple], ['name'], 'WATER');

    expect(filteredByName).toEqual([watermelon]);
});


it('All elements are filtered by key if all key value does not begin with given string.', () => {
    const banana = {name: 'Banana', quantity: 1};
    const apple = {name: 'Apple', quantity: 3};
    const watermelon = {name: 'Watermelon', quantity: 2};

    const filteredByName = filterItemsByKey([watermelon, banana, apple], ['name'], 'Peach');

    expect(filteredByName).toEqual([]);
});


it('Non strings values can be filtered', () => {
    const banana = {name: 'Banana', quantity: 1};
    const apple = {name: 'Apple', quantity: 3};
    const watermelon = {name: 'Watermelon', quantity: 2};

    const filteredByName = filterItemsByKey([watermelon, banana, apple], ['quantity'], '3');

    expect(filteredByName).toEqual([apple]);
});
