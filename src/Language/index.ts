/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Language from './Language';
import Alt from './Alt';
import Char from './Char';
import Empty from './Empty';
import Nil from './Nil';
import Star from './Star';
import Cat from './Cat';
import OneOf from './OneOf';
import Opt from './Opt';
import Plus from './Plus';
import Range from './Range';
import Seq from './Seq';
import Token from './Token';
import Any from './Any';
import Not from './Not';

class LanguageFactory {
    /** a-z | A-Z */
    readonly ALPHA = this.Alt(this.Range('a', 'z'), this.Range('A', 'Z'));
    /** a-z | A-Z | 0-9 */
    readonly ALPHA_NUM = this.OneOf(this.Range('a', 'z'), this.Range('A', 'Z'), this.Range('0', '9'));
    /** A-Z */
    readonly ALPHA_UPPER = this.Range('A', 'Z');
    /** a-z */
    readonly ALPHA_LOWER = this.Range('a', 'z');
    /** Carriage Return */
    readonly CR = this.Char('\r');
    /** Carriage Return followed by Line Feed */
    readonly CRLF = this.Token('\r\n');
    /** The digits 0-9 */
    readonly DIGIT = this.Range('0', '9');
    /**
     * Represents the Empty language ε consisting of a single empty string
     * ε = {""}
     */
    readonly EMPTY = new Empty();
    /** Form Feed */
    readonly FF = this.Char('\f');
    /** Line Feed */
    readonly LF = this.Char('\n');
    /** The Nil Language ∅. A language with no members. */
    readonly NIL = new Nil();
    /** The NUL character */
    readonly NUL = this.Char('\0');
    /** Space */
    readonly SP = this.Char(' ');
    /** Tab */
    readonly TAB = this.Char('\t');
    /** Vertical Tab */
    readonly VT = this.Char('\v');
    /** Linear whitespace: CRLF? ( SP | HT )+ */
    readonly LWS = this.Seq(this.Opt(this.CRLF), this.Plus(this.Alt(this.SP, this.TAB)));

    /**
     * Represents the union of two languages
     * L1 ∪ L2 = {foo} ∪ {bar} = {foo, bar}
     *
     * @see Alt
     * @param {Language} left -
     * @param {Language} right -
     * @returns {Alt} Alt
     */
    Alt(left: Language, right: Language): Alt { return new Alt(left, right); }

    /**
     * Represents any single character. A wildcard.
     * '.'
     *
     * @see Any
     * @returns {Any} Any
     */
    Any(): Any {
        // TODO: not using a constant here due to the lack of an equality definition
        return new Any();
    }

    /**
     * Represents the concatenation of two languages
     * L1 ◦ L2
     *
     * @see Cat
     * @param {Language} first -
     * @param {Language} second -
     * @returns {Cat} Cat
     */
    Cat(first: Language, second: Language): Cat { return new Cat(first, second); }

    /**
     * Represents the language of a single character
     * c = {...,'a','b',...}
     *
     * @see Char
     * @param {string} value - A character
     * @throws Throws an error if the provided string is not length == 1
     * @returns {Char} Char
     */
    Char(value: string): Char { return new Char(value); }

    /**
     * Represents the Empty language ε consisting of a single empty string
     * ε = {""}
     * @returns {Empty} Empty
     */
    Empty(): Empty { return this.EMPTY; }

    /**
     * Represents the Nil Language ∅. A language with no members.
     * ∅ = {}
     * @returns {Nil} Nil
     */
    Nil(): Nil { return this.NIL; }

    /**
     * The complement language.
     * Matches anything that is not the provided language
     *
     * @param {Language} language - The language to not match
     * @returns {Not} Not
     */
    Not(language: Language): Not { return new Not(language); }

    /**
     * Language extension.
     * L1 | L2 | ... | Ln
     * @returns {OneOf} -
     */
    OneOf(...languages: (Language | string)[]): OneOf {
        return new OneOf(...languages.map(lang =>
            lang instanceof Language ? lang :
            lang.length == 0 ? this.Empty() :
            lang.length == 1 ? this.Char(lang) :
            this.Token(lang)
        ));
    }

    /**
     * The Opt language.
     * L?
     * Language extension.
     * @param {Language} language - The optional language
     * @returns {Opt} -
     */
    Opt(language: Language): Language {
        return new Opt(language);
    }

    /**
     * Language extension. The Plus language
     * L+
     * @param {Language} language - The language
     * @returns {Plus} -
     */
    Plus(language: Language): Language {
        return new Plus(language);
    }

    /**
     * [a-b]
     * @param {string} from -
     * @param {string} to -
     * @returns {Language} -
     */
    Range(from: string, to: string): Language {
        return from === to ? this.Char(from) :
            from < to ? new Range(from, to) :
            new Range(to, from);
    }

    /**
     * L1,L2,...,Ln
     * @param {(Language | string)[]} languages -
     * @returns {Language} -
     */
    Seq(...languages: (Language | string)[]): Language {
        return new Seq(...languages.map(lang =>
            lang instanceof Language ? lang :
            lang.length == 0 ? this.Empty() :
            lang.length == 1 ? this.Char(lang) :
            this.Token(lang)
        ));
    }

    /**
     * Represents the Kleene star of the given language
     * L*
     * @see Star
     * @param {Language} language -
     * @returns {Star} Star
     */
    Star(language: Language): Star { return new Star(language); }

    /**
     * "Foo"
     * @param {string} value - The string representing the token
     * @returns {Language} - The Token language
     */
    Token(value: string): Language {
        return new Token(value);
    }
}

const l = new LanguageFactory();

export default l;
export { LanguageFactory, Language };