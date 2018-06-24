import React from "react";
import PropTypes from 'prop-types';
import Scrollbar from "./scrollbar/scrollbar";
import SelectOption from './selectOption';
import {filterItemsByKey} from "./filtering";

export const CHILDREN_KEY = 'children';
const LABEL_TEXT_KEY = 'text';

/**
 * Select options list.
 */
export default class SelectOptionsList extends React.Component {
    /**
     * Constructor
     *
     * @param {Object} props: Component configuration.
     * */
    constructor(props) {
        super(props);
        this.state = {filterValue: ""};
        this._onFilterValueChange = this._onFilterValueChange.bind(this);
        this._onSelectAllVisibleOptions = this._onSelectAllVisibleOptions.bind(this);
    }

    /**
     * After component render callback.
     */
    componentDidMount() {
        this.props.scrollbar.load(this.refs.optionsListContainer);
    }

    /**
     * After component re-render callaback.
     */
    componentDidUpdate() {
        this.props.scrollbar.reload(this.refs.optionsListContainer);
    }

    /**
     * On select all visible options.
     *
     * @private
     */
    _onSelectAllVisibleOptions() {
        const filteredOptions = this._filteredOptions();
        let optionsIds = [];
        for (let option of filteredOptions) {
            if(option.hasOwnProperty('children')) {
                const childrenIds = option.children.map((item) => {return item.id;});
                optionsIds = optionsIds.concat(childrenIds);
            } else {
                optionsIds.push(option.id);
            }
        }
        this.props.onSelectOptions(optionsIds);
    }

    /**
     * Render component.
     *
     * @returns {XML}
     */
    render() {
        const filteredOptions = this._filteredOptions();
        const optionsCount = filteredOptions.reduce(
            (sum, option) => sum + (option.hasOwnProperty(CHILDREN_KEY) ? option.children.length : 1),
            0
        );
        return (
            <div>
                <header>{this.props.header}</header>
                <input className="filter-input" placeholder={"Search..."} onChange={this._onFilterValueChange}/>
                {
                    optionsCount > 0
                        ? (
                            <div className="select-all-visible">
                                <a onClick={this._onSelectAllVisibleOptions}>
                                    {this.props.selectAllLabel}
                                </a>
                            </div>
                        ) : ""
                }
                <ul ref="optionsListContainer" className="ms-list">
                    {filteredOptions.map((option) => {
                        if(option.hasOwnProperty(CHILDREN_KEY)) {
                            if(option.children.length === 0) {return;}
                            const groupLabel = (
                                <SelectOption
                                    className={"group-label"}
                                    key={option.id + option.text} option={option}
                                    onClick={this.props.onSelectOptions}
                                    isGroupLabel={true}/>
                            );
                            const children = option.children.map(childOption => {
                                return (
                                    <SelectOption
                                        key={childOption.id}
                                        option={childOption}
                                        onClick={this.props.onSelectOptions}/>
                                );
                            });
                            return [groupLabel].concat(children);
                        }
                        return <SelectOption key={option.id} option={option} onClick={this.props.onSelectOptions}/>;
                    })}
                </ul>
            </div>
        );
    }

    /**
     * Filter options.
     *
     * @returns {Array}
     * */
    _filteredOptions() {
        let filteredOptions = [];
        this.props.options.forEach((option) => {
            if(option.hasOwnProperty(CHILDREN_KEY)) {
                let filteredChildren = filterItemsByKey(option.children, [LABEL_TEXT_KEY], this.state.filterValue);
                filteredOptions = [...filteredOptions, {...option, [CHILDREN_KEY]: [...filteredChildren]}];
                return;
            }
            filteredOptions = [
                ...filteredOptions,
                ...filterItemsByKey([option], [LABEL_TEXT_KEY], this.state.filterValue)
            ];
        });
        return filteredOptions;
    }

    /**
     * When filter value change.
     *
     * @param {Event} changeEvent: Change event.
     *
     * @private
     */
    _onFilterValueChange(changeEvent) {
        const newFilterValue = changeEvent.target.value;
        this.setState({filterValue: newFilterValue});
    }
}

/**
 * Default configuration.
 *
 * @type {{scrollbar: Scrollbar}}
 */
SelectOptionsList.defaultProps = {
    scrollbar: Scrollbar
};

/**
 * Prop types.
 */
SelectOptionsList.propTypes = {
    /**
     * Header
     * */
    header: PropTypes.string,
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
     * On select options callback, ex:fun([1]), fun([1, 2])
     * */
    onSelectOptions: PropTypes.func,
    selectAllLabel: PropTypes.string,
    /**
     * Scrollbar.
     */
    scrollbar: PropTypes.func
};
