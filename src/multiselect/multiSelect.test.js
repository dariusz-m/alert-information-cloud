import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import renderer from "react-test-renderer";

import MultiSelect from './multiSelect';

const options = [
    {id: 1, text: "1"},
    {id: 5, text: "Text 5"},
    {text: 'Title', children: [{id: 2, text: "Text 2"}, {id: 3, text: "3"}]},
    {text: 'Title 2', children: [{id: 7, text: "7"}, {id: 8, text: "8"}]}
];

it('Component renders properly.', () => {
    const component = renderer.create(
        <MultiSelect options={options} selectedOptionsIds={[1, 7]} updateSelectedOptions={()=>{}}/>
    );
    expect(component.toJSON()).toMatchSnapshot();
});


it('Options have been properly divided for excluded and included options', () => {
    // Given
    const expectedExcludedOptions = [
        {id: 1, text: "1"},
        {id: 5, text: "Text 5"},
        {text: 'Title', children: []},
        {text: 'Title 2', children: [{id: 8, text: "8"}]}
    ];
    const expectedIncludedOptions = [
        {text: 'Title', children: [{id: 2, text: "Text 2"}, {id: 3, text: "3"}]},
        {text: 'Title 2', children: [{id: 7, text: "7"}]}
    ];
    const component = ReactTestUtils.renderIntoDocument(
        <MultiSelect options={options} selectedOptionsIds={[2, 3, 7]} updateSelectedOptions={()=>{}}/>
    );

    // When
    const {excludedOptions, includedOptions} = component._prepareExcludedAndIncludedOptions();

    // Then
    expect(excludedOptions).toEqual(expectedExcludedOptions);
    expect(includedOptions).toEqual(expectedIncludedOptions);
});
