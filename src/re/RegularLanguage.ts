/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';
import { MSG_NOT_IMPLEMENTED, MSG_STRING_EXPECTED } from '../Messages';
import Alt from './Alt';
import Cat from './Cat';
import Char from './Char';
import Empty from './Empty';
import Nil from './Nil';
import Star from './Star';
import OneOf from './OneOf';
import Opt from './Opt';
import Range from './Range';
import Plus from './Plus';
import Seq from './Seq';
import Token from './Token';
import Any from './Any';

const contracts = new Contracts(true),
     {invariant, override} = contracts,
     assert: Contracts['assert'] = contracts.assert;

/**
 * A Regular Language is a Language that can be described non-recursively
 * by the following constructs:  ∅ | ε | c | L1 ∪ L2 | L1 ◦ L2 | L*
 *
 * @see https://en.wikipedia.org/wiki/Regular_language#Equivalent_formalisms
 */
@invariant
export default class RegularLanguage {
    constructor(
        /**
         * The height of the expression tree. This is used for simplification.
         * @see this.simplify()
         */
        readonly height: number
    ) {}

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
     * Determines if the current RegularLanguage is structurally equal the provided one
     *
     * @param {RegularLanguage} other  - The Language to compare with
     * @returns {boolean} - The result of the test
     */
    equals(other: RegularLanguage): boolean { return other === this; }

    /**
     * Determine if the current expression is an instance of Alt
     * @returns {boolean} - The result
     */
    isAlt(): this is Alt { return false; }

    /**
     * Determine if the current expressions is an instance of Any
     * @returns {boolean} - The result
     */
    isAny(): this is Any { return false; }

    /**
     * Determine if the current expression is an instance of Char | Empty | Nil
     *
     * @returns {boolean} - The result of the test
     */
    isAtomic(): boolean { return false; }

    /**
     * Determine if the current expression is an instance of Cat
     * @returns {boolean} - The result
     */
    isCat(): this is Cat { return false; }

    /**
     * Determine if the current expression is an instance of Char
     * @returns {boolean} - The result
     */
    isChar(): this is Char { return false; }

    /**
     * Determine if the current expression is an instance of Empty
     * @returns {boolean} - The result
     */
    isEmpty(): this is Empty { return false; }

    /**
     * Determine if the current expression is an instance of Nil
     * @returns {boolean} - The result
     */
    isNil(): this is Nil{ return false;}

    /**
     * Determine if the current expression is an instance of Star
     * @returns {boolean} - The result
     */
    isStar(): this is Star { return false; }

    /**
     * Determine if the current expression is an instance of OneOf
     * @returns {boolean} - The result
     */
    isOneOf(): this is OneOf { return false; }

    /**
     * Determine if the current expression is an instance of Opt
     * @returns {boolean} - The result
     */
    isOpt(): this is Opt { return false; }

    /**
     * Determine if the current expression is an instance of Plus
     * @returns {boolean} - The result
     */
    isPlus(): this is Plus { return false; }

    /**
     * Determine if the current expression is an instance of Range
     * @returns {boolean} - The result
     */
    isRange(): this is Range { return false; }

    /**
     * Determine if the current expression is an instance of Seq
     * @returns {boolean} - The result
     */
    isSeq(): this is Seq { return false; }

    /**
     * Determine if the current expression is an instance of Token
     * @returns {boolean} - The result
     */
    isToken(): this is Token { return false; }

    /**
     * Determines if the current language contains Empty
     *
     * @returns {boolean} - The result of the test
     */
    containsEmpty(): boolean { return false; }

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
            this.containsEmpty() :
            this.deriv(text[0]).matches(text.substr(1));
    }

    /**
     * Returns Nil or Empty depending on whether Empty
     * exists in the current expression.
     *
     * δ(L) = ∅ if ε notIn L
     * δ(L) = ε if ε in L
     */
    nilOrEmpty(): RegularLanguage { throw new TypeError(MSG_NOT_IMPLEMENTED); }

    /**
     * Converts the current RegularLanguage to simplest form where possible
     * Where 'simplify' is defined as minimizing the height of the expression tree.
     * Additionally, this method will refactor the expression so that other
     * methods will be more likely to short-circuit.
     *
     * @returns {RegularLanguage} - The simplified language
     */
    simplify(): RegularLanguage { return this; }
}