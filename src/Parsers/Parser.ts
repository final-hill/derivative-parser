/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Alt, Any, ANY, Cat, Char, Empty, EMPTY, Nil, NIL, Star, Range, Token, Not, Rep } from './';

export const containsEmpty = Symbol('containsEmpty'),
    deriv = Symbol('deriv'),
    equals = Symbol('equals'),
    height = Symbol('height'),
    isAlt = Symbol('isAlt'),
    isAny = Symbol('isAny'),
    isAtomic = Symbol('isAtomic'),
    isCat = Symbol('isCat'),
    isChar = Symbol('isChar'),
    isEmpty = Symbol('isEmpty'),
    isNil = Symbol('isNil'),
    isNot = Symbol('isNot'),
    isRep = Symbol('isRep'),
    isStar = Symbol('isStar'),
    isRange = Symbol('isRange'),
    isToken = Symbol('isToken'),
    matches = Symbol('matches'),
    nilOrEmpty = Symbol('nilOrEmpty'),
    simplify = Symbol('simplify'),
    toString = Symbol('toString');

export class Parser {
    /**
     * The height of the expression tree. This is used for simplification.
     * @see this.simplify()
     * @returns {number} The height
     */
    [height](): number { return 0; }

    /**
     * The parser for a single character. A wildcard.
     * '.'
     *
     * @see Any
     * @returns {Any} The Any parser
     */
    any(): Any { return ANY; }

    /**
     * Represents the Empty parser which parses the empty string
     * ε = {""}
     * @returns {Empty} The Empty parser
     */
    empty(): Empty { return EMPTY; }

    /**
     * Represents the Nil Parser. Parses a language with no members.
     * ∅ = {}
     * @returns {Nil} The Nil parser
     */
    nil(): Nil { return NIL; }

    /**
     * Computes the derivative of a regular language with respect to a character c.
     * The derivative is a new language where all strings that start with the character
     * are retained. The prefix character is then removed.
     *
     * @param {string} c A character
     * @throws Throw an error if the provided string is not length == 1
     * @returns {Parser} The derivative of the parser
     */
    // @ts-ignore: unused variable
    [deriv](c: AsciiChar): Parser {
        return this.nil();
    }

    /**
     * Determines if the provided text matches the current expression
     *
     * @param {string} text The text to test
     * @returns {boolean} The result of the test
     * @throws If text is not a string
     */
    [matches](text: string): boolean {
        return text.length == 0 ?
            this[containsEmpty]() :
            this[deriv](text[0] as AsciiChar)[matches](text.substring(1));
    }

    /**
     * Represents the union of two parsers
     * P1 ∪ P2
     *
     * @see Alt
     * @param {Parser} parser The alternative parser
     * @returns {Alt} The Alt Parser
     */
    or(parser: Parser | string): Alt {
        const q = parser instanceof Parser ? parser :
            parser.length == 0 ? this.empty() :
                parser.length == 1 ? this.char(parser as AsciiChar) :
                    this.token(parser);

        return new Alt(this, q);
    }

    /**
     * Returns a new parser which is the combination of multiple parsers
     * P1 | P2 | ... | Pn
     *
     * @param {(Parser | string)[]} parsers The alternative parsers
     * @returns {Alt | Empty} The Alt or Empty parser
     */
    alt(...parsers: (Parser | string)[]): Alt | Empty {
        return parsers.length == 0 ? this.empty() :
            parsers.map(p =>
                p instanceof Parser ? p :
                    p.length == 0 ? this.empty() :
                        p.length == 1 ? this.char(p as AsciiChar) :
                            this.token(p)
            ).reduce((sum, next) => new Alt(sum, next));
    }

    /**
     * The concatenation of multiple parsers
     * P1◦P2◦...◦Pn
     * @param {(Parser | string)[]} parsers The parsers to concatenate
     * @see Cat
     * @returns {Parser} The concatenation of the provided parsers
     */
    cat(...parsers: (Parser | string)[]): Parser {
        return parsers.length == 0 ? this.empty() :
            parsers.map(p =>
                p instanceof Parser ? p :
                    p.length == 0 ? this.empty() :
                        p.length == 1 ? this.char(p as AsciiChar) :
                            this.token(p)
            ).reduce((sum, next) => new Cat(sum, next));
    }

    /**
     * Represents the parser of a single character
     * c = {...,'a','b',...}
     *
     * @see Char
     * @param {AsciiChar} value - A character
     * @throws Throws an error if the provided string is not length == 1
     * @returns {Char} - The Char Parser
     */
    char(value: AsciiChar): Char {
        return new Char(value);
    }

    /**
     * Determines if the current language contains Empty
     *
     * @returns {boolean} The result of the test
     */
    [containsEmpty](): boolean { return false; }

    /**
     * Determines if the current Parser is equal the provided one
     *
     * @param {Parser} other The parser to compare with
     * @returns {boolean} The result of the test
     */
    [equals](other: Parser): boolean {
        return other === this;
    }

    /**
     * Determine if the current expression is an instance of an Alt parser
     * @returns {boolean} The result
     */
    [isAlt](): this is Alt { return false; }

    /**
     * Determine if the current expressions is an instance of the Any parser
     * @returns {boolean} The result
     */
    [isAny](): this is Any { return false; }

    /**
     * Determine if the current expression is an instance of Char | Empty | Nil
     * @returns {boolean} The result of the test
     */
    [isAtomic](): boolean { return false; }

    /**
     * Determine if the current expression is an instance of the Cat parser
     * @returns {boolean} The result
     */
    [isCat](): this is Cat { return false; }

    /**
     * Determine if the current expression is an instance of the Char parser
     * @returns {boolean} The result
     */
    [isChar](): this is Char { return false; }

    /**
     * Determine if the current expression is an instance of the Empty parser
     * @returns {boolean} The result
     */
    [isEmpty](): this is Empty { return false; }

    /**
     * Determine if the current expression is an instance of the Nil parser
     * @returns {boolean} The result
     */
    [isNil](): this is Nil { return false; }

    /**
     * Determines if the current expression is an instance of the Not parser
     * @returns {boolean} The result
     */
    [isNot](): this is Not { return false; }

    /**
     * Determines if the current expression is an instance of the Rep parser
     * @returns {boolean} The result
     */
    [isRep](): this is Rep { return false; }

    /**
     * Determine if the current expression is an instance of the Star parser
     * @returns {boolean} The result
     */
    [isStar](): this is Star { return false; }

    /**
     * Determine if the current expression is an instance of the Range parser
     * @returns {boolean} The result
     */
    [isRange](): this is Range { return false; }

    /**
     * Determine if the current expression is an instance of the Token parser
     * @returns {boolean} The result
     */
    [isToken](): this is Token { return false; }

    /**
     * Returns Nil or Empty depending on whether Empty
     * exists in the current expression.
     *
     * δ(L) = ∅ if ε notIn L
     * δ(L) = ε if ε in L
     *
     * @returns {Parser} The Nil or Empty parser
     */
    [nilOrEmpty](): Nil | Empty { return this.nil(); }

    /**
     * The complement parser.
     * Parses anything that is not the current parser
     *
     * @returns {Not} The Not Parser
     */
    not(): Not { return new Not(this); }

    /**
     * The Opt parser.
     * P?
     * Equivalent to P | ε
     * @returns {Alt} The Alt parser
     */
    opt(): Alt { return this.or(this.empty()); }

    /**
     * The Plus parser. Matches the current pattern one or more times
     * P+
     * Equivalent to P◦P*
     * @returns {Cat} The Cat parser
     */
    plus(): Cat { return this.then(this.star()); }

    /**
     * [a-b]
     * @param {AsciiChar} from The starting character
     * @param {AsciiChar} to The ending character
     * @throws {Error} Throws if 'from' is not less than or equal to 'to'
     * @returns {Range} The Range parser
     */
    range(from: AsciiChar, to: AsciiChar): Range { return new Range(from, to); }

    /**
     *
     * @param {number} [n] The number of repetitions
     * @throws {Error} Throws if n < 0 or n is not an integer
     * @returns {Rep} The Rep parser
     */
    rep(n: number): Rep { return new Rep(this, n); }

    /**
     * Converts the current Parser to simplest form possible
     * Where 'simplify' is defined as minimizing the height of the expression tree.
     * Additionally, this method will refactor the expression so that other
     * methods will be more likely to short-circuit.
     *
     * @returns {Parser} The simplified parser
     */
    [simplify](): Parser { return this; }

    /**
     * Represents the Kleene star of the current parser
     * P*
     * @see Star
     * @returns {Star} The Star Parser
     */
    star(): Star { return new Star(this); }

    /**
     * Returns the concatenation of the current parser with
     * one or more additional parsers
     * P1◦P2◦...◦Pn
     *
     * @see Cat
     * @param {...(Parser | string)[]} parsers The sequence of parsers
     * @returns {Cat} The Cat parser
    */
    then(...parsers: (Parser | string)[]): Cat {
        if (parsers.length == 0)
            return new Cat(this, this.nil());
        else {
            const q = parsers.map(p =>
                p instanceof Parser ? p :
                    p.length == 0 ? this.empty() :
                        p.length == 1 ? this.char(p as AsciiChar) :
                            this.token(p as string)
            );

            return new Cat(this, q.reduce((sum, next) => new Cat(sum, next)));
        }
    }

    /**
     * "Foo"
     * @param {string} value The string representing the token
     * @returns {Token} The Token parser
     */
    token(value: string): Token { return new Token(value); }

    /**
     * Returns a string representation of the expression
     *
     * @returns {string} The string representation
     */
    [toString](): string { return '∅'; }
}