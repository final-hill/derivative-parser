/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { RegularLanguage } from '../re';
import Rule from './Rule';

class State {
    #rules: Rule[] = [];

    /**
     *
     * @param {RegularLanguage} regex - The pattern used to test the input
     * @param {Action} action - The action to use when the pattern matches
     */
    rule(regex: RegularLanguage, action: Action) {
        this.#rules.push(new Rule(regex,action));
    }

    /**
     *
     * @param {string} input
     */
    lex(input: string) {
        this.run(input);
    }

    /**
     *
     * @param {string} input
     */
    run(input: string) {
        this.#rules.forEach(rule => {
            const match = rule.match(input);
        });
    }
}

export default State;