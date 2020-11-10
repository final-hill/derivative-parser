/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';
import {memo} from '@final-hill/class-tools';
import {Alt, Cat, Char, Empty, Nil, Star, Range, Token, Any, Not, Rep} from './';

const contracts = new Contracts(true),
     {demands, invariant, override} = contracts;

@invariant
export default class Parser {
    /**
     * The height of the expression tree. This is used for simplification.
     * @see this.simplify()
     */
    get height(): number { return 0; }

    /**
     * The parser for a single character. A wildcard.
     * '.'
     *
     * @see Any
     * @returns {Any} Any
     */
    @memo
    any(): Any {
        return new Any();
    }

    /**
     * Computes the derivative of a regular language with respect to a character c.
     * The derivative is a new language where all strings that start with the character
     * are retained. The prefix character is then removed.
     *
     * @param {string} c - A character
     * @throws Throw an error if the provided string is not length == 1
     * @returns {Parser} -
     */
    @demands((c: string) => typeof c == 'string' && c.length == 1)
    // @ts-ignore: unused variable
    deriv(c: string): Parser { return this.nil(); }

    /**
     * Represents the Empty parser which parses the empty string
     * ε = {""}
     * @returns {Empty} Empty
     */
    @memo
    empty(): Empty { return new Empty(); }

    /**
     * Determines if the provided text matches the current expression
     *
     * @param {string} text - The text to test
     * @returns {boolean} - The result of the test
     * @throws - If text is not a string
     */
    @demands(text => typeof text == 'string')
    matches(text: string): boolean {
        return text.length == 0 ?
            this.containsEmpty() :
            this.deriv(text[0]).matches(text.substr(1));
    }

    /**
     * Represents the Nil Parser. Parses a language with no members.
     * ∅ = {}
     * @returns {Nil} -
     */
    @memo
    nil(): Nil { return new Nil(); }

    /**
     * Represents the union of two parsers
     * P1 ∪ P2
     *
     * @see Alt
     * @param {Parser} parser -
     * @returns {Alt} -
     */
    @demands(p => typeof p == 'string' || p instanceof Parser)
    or(parser: Parser | string): Alt {
        const q = parser instanceof Parser ? parser :
                  parser.length == 0 ? this.empty() :
                  parser.length == 1 ? this.char(parser) :
                  this.token(parser);

        return new Alt(this,q);
    }

    /**
     * Returns a string representation of the expression
     *
     * @returns {string} - The string representation
     */
    @override
    toString(): string { return '∅'; }

    /**
     * Returns a new parser which is the combination of multiple parsers
     * P1 | P2 | ... | Pn
     *
     * @param {(Parser | string)[]} parsers -
     * @returns {Parser} -
     */
    alt(...parsers: (Parser | string)[]): Parser {
        return parsers.length == 0 ? this.empty() :
        parsers.map(p =>
            p instanceof Parser ? p :
            p.length == 0 ? this.empty() :
            p.length == 1 ? this.char(p) :
            this.token(p)
        ).reduce((sum,next) => new Alt(sum, next));
    }

    /**
     * The concatenation of multiple parsers
     * P1◦P2◦...◦Pn
     * @param {(Parser | string)[]} parsers - The parsers to concatenate
     * @see Cat
     * @returns {Parser} - The concatenation of the provided parsers
     */
    cat(...parsers: (Parser | string)[]): Parser {
        return parsers.length == 0 ? this.empty() :
        parsers.map(p =>
            p instanceof Parser ? p :
            p.length == 0 ? this.empty() :
            p.length == 1 ? this.char(p) :
            this.token(p)
        ).reduce((sum,next) => new Cat(sum,next));
    }

    /**
     * Represents the parser of a single character
     * c = {...,'a','b',...}
     *
     * @see Char
     * @param {string} value - A character
     * @throws Throws an error if the provided string is not length == 1
     * @returns {Char} -
     */
    char(value: string): Char { return new Char(value); }

    /**
     * Determines if the current language contains Empty
     *
     * @returns {boolean} - The result of the test
     */
    containsEmpty(): boolean { return false; }

    /**
     * Determines if the current Parser is equal the provided one
     *
     * @param {Parser} other  - The parser to compare with
     * @returns {boolean} - The result of the test
     */
    equals(other: Parser): boolean {
        return other instanceof Parser && other.toString() === '∅' && !other.isNil();
    }

    /**
     * Determine if the current expression is an instance of the Alt parser
     * @returns {boolean} - The result
     */
    isAlt(): this is Alt { return false; }

    /**
     * Determine if the current expressions is an instance of the Any parser
     * @returns {boolean} - The result
     */
    isAny(): this is Any { return false; }

    /**
     * Determine if the current expression is an instance of Char | Empty | Nil
     * @returns {boolean} - The result of the test
     */
    isAtomic(): boolean { return false; }

    /**
     * Determine if the current expression is an instance of the Cat parser
     * @returns {boolean} - The result
     */
    isCat(): this is Cat { return false; }

    /**
     * Determine if the current expression is an instance of the Char parser
     * @returns {boolean} - The result
     */
    isChar(): this is Char { return false; }

    /**
     * Determine if the current expression is an instance of the Empty parser
     * @returns {boolean} - The result
     */
    isEmpty(): this is Empty { return false; }

    /**
     * Determine if the current expression is an instance of the Nil parser
     * @returns {boolean} - The result
     */
    isNil(): this is Nil { return false; }

    /**
     * Determines if the current expression is an instance of the Not parser
     * @returns {boolean} - The result
     */
    isNot(): this is Not { return false; }

    /**
     * Determines if the current expression is an instance of the Rep parser
     * @returns {boolean} - The result
     */
    isRep(): this is Rep { return false; }

    /**
     * Determine if the current expression is an instance of the Star parser
     * @returns {boolean} - The result
     */
    isStar(): this is Star { return false; }

    /**
     * Determine if the current expression is an instance of the Range parser
     * @returns {boolean} - The result
     */
    isRange(): this is Range { return false; }

    /**
     * Determine if the current expression is an instance of the Token parser
     * @returns {boolean} - The result
     */
    isToken(): this is Token { return false; }

    /**
     * Returns Nil or Empty depending on whether Empty
     * exists in the current expression.
     *
     * δ(L) = ∅ if ε notIn L
     * δ(L) = ε if ε in L
     *
     * @returns {Parser} -
     */
    nilOrEmpty(): Parser { return this.nil(); }

    /**
     * The complement parser.
     * Parses anything that is not the current parser
     *
     * @returns {Not} -
     */
    not(): Not { return new Not(this); }

    /**
     * The Opt parser.
     * P?
     * Equivalent to P | ε
     * @returns {Alt} -
     */
    opt(): Alt {
        return this.or(this.empty());
    }

    /**
     * The Plus parser. Matches the current pattern one or more times
     * P+
     * Equivalent to P◦P*
     * @returns {Cat} -
     */
    plus(): Cat {
        return this.then(this.star());
    }

    /**
     * [a-b]
     * @param {string} from -
     * @param {string} to -
     * @returns {Parser} -
     */
    range(from: string, to: string): Parser {
        return from < to ? new Range(from, to) :
            new Range(to, from);
    }

    /**
     *
     * @param {number} [n] - The number of repetitions
     * @throws {AssertionError} - Throws if n < 0 or n is not an integer
     * @returns {Parser} -
     */
    rep(n: number): Parser {
        return new Rep(this,n);
    }

    /**
     * Converts the current Parser to simplest form possible
     * Where 'simplify' is defined as minimizing the height of the expression tree.
     * Additionally, this method will refactor the expression so that other
     * methods will be more likely to short-circuit.
     *
     * @returns {Parser} - The simplified parser
     */
    simplify(): Parser { return this; }

    /**
     * Represents the Kleene star of the current parser
     * P*
     * @see Star
     * @returns {Star} -
     */
    star(): Star { return new Star(this); }

    /**
     * Returns the concatenation of the current parser with
     * one or more additional parsers
     * P1◦P2◦...◦Pn
     *
     * @see Cat
     * @param {Parser} ...parsers -
     * @returns {Cat} -
     */
    then(...parsers: (Parser | string)[]): Cat {
        if(parsers.length == 0) {
            return new Cat(this, this.nil());
        } else {
            const q = parsers.map(p =>
                p instanceof Parser ? p :
                p.length == 0 ? this.empty() :
                p.length == 1 ? this.char(p) :
                this.token(p));

            return new Cat(this, q.reduce((sum,next) => new Cat(sum, next)));
        }
    }

    /**
     * "Foo"
     * @param {string} value - The string representing the token
     * @returns {Parser} - The Token parser
     */
    token(value: string): Parser {
        return new Token(value);
    }
}