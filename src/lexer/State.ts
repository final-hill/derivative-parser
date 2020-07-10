/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { RegularLanguage } from '../re';
import Rule from './Rule';
import { Action } from './Action';
import Contracts from '@final-hill/decorator-contracts';

const assert: Contracts['assert'] = new Contracts(true).assert;

class State {
    #rules: Rule[] = [];

    /**
     *
     * @param {RegularLanguage} regex - The pattern used to test the input
     * @param {Action} action - The action to use when the pattern matches
     */
    rule(regex: RegularLanguage, action: Action): void {
        this.#rules.push(new Rule(regex,action));
    }

    /**
     *
     * @param {string} input
     */
    lex(input: string) {
        const [longestMatchedRule, longestMatch, longestMatchLength] = this.#rules.reduce((result, nextRule) => {
            const m = nextRule.match(input);
        }, [null,null,-1]);

        assert(longestMatchedRule != undefined, `No match for input: ${input}`);

        return longestMatchedRule.action(longestMatch, input.substring(longestMatchLength));
    }
}

export default State;