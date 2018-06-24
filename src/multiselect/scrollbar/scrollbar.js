import './scrollbar.scss';

import * as Ps from 'perfect-scrollbar';

/**
 * Scrollbar.
 */
export default class Scrollbar {
    /**
     * Load scrollbar.
     *
     * @param {HTMLElement} element: HTML element which should have a scrollbar.
     */
    static load(element) {
        if (element) {
            Ps.initialize(element, {minScrollbarLength: "30", theme: 'multiselect'});
        }
    }

    /**
     * Reload scrollbar.
     *
     * @param {HTMLElement} element: HTML element which should have a scrollbar.
     */
    static reload(element) {
        if (element) {
            Ps.update(element);
        }
    }
}
