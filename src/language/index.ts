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

class LanguageFactory {
    readonly ALPHA = this.Alt(this.Range('a', 'z'), this.Range('A', 'Z'));
    readonly ALPHA_NUM = this.OneOf(this.Range('a', 'z'), this.Range('A', 'Z'), this.Range('0', '9'));
    readonly ALPHA_UPPER = this.Range('A', 'Z');
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
     * @see Empty
     * @returns {Empty} Empty
     */
    Empty(): Empty { return this.EMPTY; }

    /**
     * Represents the Nil Language ∅. A language with no strings
     * ∅ = {}
     * @see Nil
     * @returns {Nil} Nil
     */
    Nil(): Nil { return this.NIL; }

    /**
     * L1 | L2 | ... | Ln
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
     * L?
     */
    Opt(language: Language): Language {
        return new Opt(language);
    }

    /**
     * L+
     */
    Plus(language: Language): Language {
        return new Plus(language);
    }

    /**
     * [a-b]
     */
    Range(from: string, to: string): Language {
        return from === to ? this.Char(from) :
            from < to ? new Range(from, to) :
            new Range(to, from);
    }

    /**
     * L1,L2,...,Ln
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
     * @param value
     */
    Token(value: string): Language {
        return new Token(value);
    }
}

const lang = new LanguageFactory();


export default lang;
export { LanguageFactory, Language };