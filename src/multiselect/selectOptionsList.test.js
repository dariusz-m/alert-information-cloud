/* global describe, beforeEach, jest */

import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import renderer from "react-test-renderer";

import ReactDOM from "react-dom";
import SelectOptionsList from "./selectOptionsList";


describe('SelectOptionsList component', () => {
    let onSelectOptions = jest.fn();
    const options = [
        {id: 1, text: "1"},
        {id: 5, text: "Text 5"},
        {text: 'Title', children: [{id: 2, text: "Text 2"}, {id: 3, text: "3"}]},
        {text: 'Title 2', children: [{id: 7, text: "7"}, {id: 8, text: "8"}]}
    ];

    beforeEach(() => {
        onSelectOptions = jest.fn();
    });

    it('Component renders properly.', () => {
        const component = renderer.create(<SelectOptionsList options={options}/>);
        expect(component.toJSON()).toMatchSnapshot();
    });

    it('Select component properly filtered options', () => {
        // Given
        const expectedOptions = [
            {id: 5, text: "Text 5"},
            {text: 'Title', children: [{id: 2, text: "Text 2"}]},
            {text: 'Title 2', children: []}
        ];
        const filterValue = "text";
        const component = ReactTestUtils.renderIntoDocument(
            <SelectOptionsList options={options}/>
        );

        // When
        changeInputFilterValue(component, filterValue);

        // Then
        const actuallyFilteredOptions = component._filteredOptions();
        expect(actuallyFilteredOptions).toEqual(expectedOptions);
    });

    it("Click on first option properly dispatched callback.", () => {
        // Given
        const optionId = 1;
        const component = ReactTestUtils.renderIntoDocument(
            <SelectOptionsList options={options} onSelectOptions={onSelectOptions}/>
        );

        // When
        clickOnFirstOption(component);

        // Then
        expect(onSelectOptions.mock.calls[0][0]).toEqual([optionId]);
    });

    it("Click on first options group properly dispatched callback.", () => {
        // Given
        const expectedOptions = [2, 3];
        const component = ReactTestUtils.renderIntoDocument(
            <SelectOptionsList options={options} onSelectOptions={onSelectOptions}/>
        );

        // When
        clickOnFirstOptionsGroup(component);

        // Then
        expect(onSelectOptions.mock.calls[0][0]).toEqual(expectedOptions);
    });

    it("Click on select all link and properly dispatched callback.", () => {
        // Given
        const expectedOptions = [5, 2];
        const selectAllLinkLabel = "Select all";
        const filterValue = "text";
        const component = ReactTestUtils.renderIntoDocument(
            <SelectOptionsList options={options} onSelectOptions={onSelectOptions} selectAllLabel={selectAllLinkLabel}/>
        );

        // When
        changeInputFilterValue(component, filterValue);
        clickOnSelectAllLink(component, selectAllLinkLabel);

        // Then
        expect(onSelectOptions.mock.calls[0][0]).toEqual(expectedOptions);
    });
});

const changeInputFilterValue = (component, filterValue) => {
    let componentNode = ReactDOM.findDOMNode(component);
    let inputField = componentNode.querySelector('input');
    inputField.value = filterValue;
    ReactTestUtils.Simulate.change(inputField);
};

const clickOnFirstOption = function(component) {
    let node = ReactDOM.findDOMNode(component);
    let optionNode = node.querySelectorAll(`li`)[0];
    ReactTestUtils.Simulate.click(optionNode);
};

const clickOnFirstOptionsGroup = function(component) {
    let node = ReactDOM.findDOMNode(component);
    let optionGroupNode = node.querySelectorAll(`.group-label`)[0];
    ReactTestUtils.Simulate.click(optionGroupNode);
};


const clickOnSelectAllLink = function(component, selectAllLinkLabel) {
    let node = ReactDOM.findDOMNode(component);
    let links = node.querySelectorAll(`a`);

    for (let link of links) {
        if (link.innerHTML === selectAllLinkLabel) {
            ReactTestUtils.Simulate.click(link);
        }
    }
};
