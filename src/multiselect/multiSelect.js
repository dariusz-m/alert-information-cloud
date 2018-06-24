import './multiSelect.less';

import React from 'react';
import PropTypes from 'prop-types';

import SelectOptionsList, {CHILDREN_KEY} from './selectOptionsList';

const EXCLUDED_HEADER = "AVAILABLE USERS";
const INCLUDED_HEADER = "SEND TO";

/**
 * MultiSelect form.
 */
export default class MultiSelect extends React.Component {
    /**
     * Constructor.
     *
     * @param {Object} props: Component configuration.
     */
    constructor(props) {
        super(props);
        this._includeOptions = this._includeOptions.bind(this);
        this._excludeOptions = this._excludeOptions.bind(this);
    }

    /**
     * Include new options.
     *
     * @param {Array} newIncludedOptions: New included options
     * */
    _includeOptions(newIncludedOptions) {
        const newSelectedOptions = [...this.props.selectedOptionsIds, ...newIncludedOptions];
        this.props.updateSelectedOptions(newSelectedOptions);

    }

    /**
     * Exclude options.
     *
     * @param {Array} newExcludedOptions: New excluded options
     * */
    _excludeOptions(newExcludedOptions) {
        const newSelectedOptions = this.props.selectedOptionsIds.filter((option) => {
            return !newExcludedOptions.includes(option);
        });
        this.props.updateSelectedOptions(newSelectedOptions);
    }

    /**
     * Render component.
     *
     * @returns {XML}
     */
    render() {
        const {excludedOptions, includedOptions} = this._prepareExcludedAndIncludedOptions();
        return (
            <div className="multi-select">
                <div className="options">
                    <SelectOptionsList
                        options={excludedOptions}
                        header={EXCLUDED_HEADER}
                        onSelectOptions={this._includeOptions}
                        selectAllLabel={"Send to all"}/>
                </div>
                <div className="selected-options">
                    <SelectOptionsList
                        options={includedOptions}
                        header={INCLUDED_HEADER}
                        onSelectOptions={this._excludeOptions}
                        selectAllLabel={"Clear list"}/>
                </div>
            </div>
        );
    }


    /**
     * Prepare excluded and included options.
     *
     * @returns {Object}
     * */
    _prepareExcludedAndIncludedOptions() {
        let excludedOptions = [];
        let includedOptions = [];
        this.props.options.forEach((option) => {
            if(option.hasOwnProperty(CHILDREN_KEY)) {
                let excludedChildren = [];
                const includedChildren = option[CHILDREN_KEY].filter((childOption) => {
                    if (this.props.selectedOptionsIds.includes(childOption.id)) {
                        return true;
                    }
                    excludedChildren = [...excludedChildren, childOption];
                });
                includedOptions = [...includedOptions, {...option, [CHILDREN_KEY]: includedChildren}];
                excludedOptions = [...excludedOptions, {...option, [CHILDREN_KEY]: excludedChildren}];
                return;
            }
            if (this.props.selectedOptionsIds.includes(option.id)) {
                includedOptions = [...includedOptions, option];
                return;
            }
            excludedOptions = [...excludedOptions, option];
        });

        return {excludedOptions, includedOptions};
    }

}


/**
 * Prop types.
 */
MultiSelect.propTypes = {
    /**
     * Options
     * */
    options: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            text: PropTypes.string.isRequired
        }),
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            children: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.number.isRequired,
                text: PropTypes.string.isRequired
            }))
        })
    ])),
    /**
     * Selected options ids.
     */
    selectedOptionsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    /**
     * Update selected options callback, ex:fun([1]), fun([1, 2])
     */
    updateSelectedOptions: PropTypes.func.isRequired
};
