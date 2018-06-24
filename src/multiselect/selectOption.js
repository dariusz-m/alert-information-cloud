import React from 'react';
import PropTypes from 'prop-types';

/**
 * Select option.
 */
export default class SelectOption extends React.Component {
    /**
     * Constructor.
     *
     * @param {Object} props: Component configuration.
     */
    constructor(props) {
        super(props);
        this._onClickOption = this._onClickOption.bind(this);
    }

    /**
     * On click option.
     * */
    _onClickOption() {
        if(this.props.isGroupLabel) {
            const childrenIds = this.props.option.children.map((item) => {
                return item.id;
            });
            this.props.onClick(childrenIds);
            return;
        }
        this.props.onClick([this.props.option.id]);
    }


    /**
     * Render component.
     *
     * @returns {XML}
     */
    render() {
        return (
            <li className={this.props.className} onClick={this._onClickOption}>
                {this.props.option.text}
            </li>
        );
    }

}


/**
 * Default props.
 */
SelectOption.defaultProps = {
    className: '',
    isGroupLabel: false
};


/**
 * Prop types.
 */
SelectOption.propTypes = {
    /**
     * Is group label.
     * */
    isGroupLabel: PropTypes.bool,
    /**
     * Class name.
     * */
    className: PropTypes.string,
    /**
     * Option
     * */
    option: PropTypes.oneOfType([
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
    ]),
    /**
     * On click callback, ex:fun([1]), fun([1, 2])
     * */
    onClick: PropTypes.func
};
