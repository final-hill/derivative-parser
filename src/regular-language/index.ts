/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import RegularLanguage from './RegularLanguage';
import Alt from './Alt';
import Char from './Char';
import Empty from './Empty';
import Nil from './Nil';
import Star from './Star';
import Cat from './Cat';

const EMPTY = new Empty(),
      NIL = new Nil();

class RegularLanguageFactory {
    /**
     * Represents the union of two languages
     * L1 ∪ L2 = {foo} ∪ {bar} = {foo, bar}
     *
     * @see Alt
     * @param {RegularLanguage} left -
     * @param {RegularLanguage} right -
     * @returns {Alt} -
     */
    Alt(left: RegularLanguage, right: RegularLanguage): Alt { return new Alt(left, right); }

    /**
     * Represents the concatenation of two languages
     * L1 ◦ L2
     *
     * @see Cat
     * @param {RegularLanguage} first -
     * @param {RegularLanguage} second -
     * @returns {Cat} -
     */
    Cat(first: RegularLanguage, second: RegularLanguage): Cat { return new Cat(first, second); }

    /**
     * Represents the language of a single character
     * c = {...,'a','b',...}
     *
     * @see Char
     * @param {string} value - A character
     * @throws Throws an error if the provided string is not length == 1
     * @returns {Char} -
     */
    Char(value: string): Char { return new Char(value); }

    /**
     * Represents the Empty language ε consisting of a single empty string
     * ε = {""}
     * @see Empty
     * @returns {Empty} -
     */
    Empty(): Empty { return EMPTY; }

    /**
     * Represents the Nil Language ∅. A language with no strings
     * ∅ = {}
     * @see Nil
     * @returns {Nil} -
     */
    Nil(): Nil { return NIL; }

    /**
     * Represents the Kleene star of the given language
     * L*
     * @see Star
     * @param {RegularLanguage} language -
     * @returns {Star} -
     */
    Star(language: RegularLanguage): Star { return new Star(language); }
}

const re = new RegularLanguageFactory();

export default re;
export { RegularLanguageFactory, RegularLanguage };