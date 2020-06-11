/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';
import { MSG_NOT_IMPLEMENTED, MSG_STRING_EXPECTED } from '../Messages';

const contracts = new Contracts(true),
     {invariant, override} = contracts,
     assert: typeof contracts.assert = contracts.assert;

/**
 * A Regular Language is a Language that can be described non-recursively
 * by the following constructs:  ∅ | ε | c | L1 ∪ L2 | L1 ◦ L2 | L*
 *
 * @see https://en.wikipedia.org/wiki/Regular_language#Equivalent_formalisms
 */
@invariant
class RegularLanguage {
    /**
     * Returns a string representation of the expression
     */
    @override
    toString(): string { throw new TypeError(MSG_NOT_IMPLEMENTED); }

    /**
     * Computes the derivative of a regular language with respect to a character c.
     * The derivative is a new language where all strings that start with the character
     * are retained. The prefix character is then removed.
     *
     * @param {string} c - A character
     * @throws Throw an error if the provided string is not length == 1
     */
    deriv(
        // @ts-ignore: unused
        c: string
    ): RegularLanguage { throw new TypeError(MSG_NOT_IMPLEMENTED); }

    /**
     * Determine if the current expression is an instance of Char | Empty | Nil
     *
     * @returns {boolean} - The result of the test
     */
    isAtomic(): boolean { return false; }

    /**
     * Determines if the current language is Empty
     *
     * @returns {boolean} - The result of the test
     */
    isEmpty(): boolean { return false; }

    /**
     * Determines if the provided text matches the current expression
     *
     * @param {string} text - The text to test
     * @returns {boolean} - The result of the test
     * @throws - If text is not a string
     */
    matches(text: string): boolean {
        assert(typeof text == 'string', MSG_STRING_EXPECTED);

        return text.length == 0 ?
            this.isEmpty() :
            this.deriv(text[0]).matches(text.substr(1));
    }

    /**
     * Returns Nil or Empty depending on whether Empty
     * exists in the current expression.
     * δ(L) = ∅ if ε notIn L
     * δ(L) = ε if ε in L
     */
    nilOrEmpty(): RegularLanguage { throw new TypeError(MSG_NOT_IMPLEMENTED); }


}

export default RegularLanguage;