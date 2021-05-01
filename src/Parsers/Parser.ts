/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Contract, Contracted, override} from '@final-hill/decorator-contracts';
import {memo} from '@final-hill/class-tools';
import {IAlt, Alt, IAny, Any, ICat, Cat, IChar, Char,
    IEmpty, Empty, INil, Nil, IStar, Star,  IRange, Range,
    IToken, Token, INot, Not, IRep, Rep} from './';

interface IParser {
    /**
     * The height of the expression tree. This is used for simplification.
     * @see this.simplify()
     */
    readonly height: number;

    /**
     * The parser for a single character. A wildcard.
     * '.'
     *
     * @see IAny
     * @returns {IAny} The Any parser
     */
    any(): IAny;

    /**
     * Represents the Empty parser which parses the empty string
     * ε = {""}
     * @returns {IEmpty} The Empty parser
     */
     empty(): IEmpty;

    /**
     * Represents the Nil Parser. Parses a language with no members.
     * ∅ = {}
     * @returns {INil} The Nil parser
     */
    nil(): INil;

    /**
     * Returns a string representation of the expression
     *
     * @override
     * @returns {string} The string representation
     */
    toString(): string;

    /**
     * Computes the derivative of a regular language with respect to a character c.
     * The derivative is a new language where all strings that start with the character
     * are retained. The prefix character is then removed.
     *
     * @param {string} c A character
     * @throws Throw an error if the provided string is not length == 1
     * @returns {IParser} The derivative of the parser
     */
    deriv(c: string): IParser;

    /**
     * Determines if the provided text matches the current expression
     *
     * @param {string} text The text to test
     * @returns {boolean} The result of the test
     * @throws If text is not a string
     */
    matches(text: string): boolean;

    /**
     * Represents the union of two parsers
     * P1 ∪ P2
     *
     * @see IAlt
     * @param {IParser} parser
     * @returns {IAlt} The Alt Parser
     */
    or(parser: IParser | string): IAlt;

    /**
     * Returns a new parser which is the combination of multiple parsers
     * P1 | P2 | ... | Pn
     *
     * @param {(IParser | string)[]} parsers
     * @returns {IParser} The Alt parser
     */
    alt(...parsers: (IParser | string)[]): IParser;

    /**
     * The concatenation of multiple parsers
     * P1◦P2◦...◦Pn
     * @param {(IParser | string)[]} parsers The parsers to concatenate
     * @see ICat
     * @returns {IParser} The concatenation of the provided parsers
     */
    cat(...parsers: (IParser | string)[]): IParser;

    /**
     * Represents the parser of a single character
     * c = {...,'a','b',...}
     *
     * @see IChar
     * @param {string} value - A character
     * @throws Throws an error if the provided string is not length == 1
     * @returns {IChar} - The Char Parser
     */
    char(value: string): IChar;

    /**
     * Determines if the current language contains Empty
     *
     * @returns {boolean} The result of the test
     */
    containsEmpty(): boolean;

    /**
     * Determines if the current Parser is equal the provided one
     *
     * @param {IParser} other The parser to compare with
     * @returns {boolean} The result of the test
     */
    equals(other: IParser): boolean;

    /**
     * Determine if the current expression is an instance of the Alt parser
     * @returns {boolean} The result
     */
    isAlt(): this is IAlt;

    /**
     * Determine if the current expressions is an instance of the Any parser
     * @returns {boolean} The result
     */
    isAny(): this is IAny;

    /**
     * Determine if the current expression is an instance of Char | Empty | Nil
     * @returns {boolean} The result of the test
     */
    isAtomic(): boolean;

    /**
     * Determine if the current expression is an instance of the Cat parser
     * @returns {boolean} The result
     */
    isCat(): this is ICat;

    /**
     * Determine if the current expression is an instance of the Char parser
     * @returns {boolean} The result
     */
    isChar(): this is IChar;

    /**
     * Determine if the current expression is an instance of the Empty parser
     * @returns {boolean} The result
     */
    isEmpty(): this is IEmpty;

    /**
     * Determine if the current expression is an instance of the Nil parser
     * @returns {boolean} The result
     */
    isNil(): this is INil;

    /**
     * Determines if the current expression is an instance of the Not parser
     * @returns {boolean} The result
     */
    isNot(): this is INot;

    /**
     * Determines if the current expression is an instance of the Rep parser
     * @returns {boolean} The result
     */
    isRep(): this is IRep;

    /**
     * Determine if the current expression is an instance of the Star parser
     * @returns {boolean} The result
     */
    isStar(): this is IStar;

    /**
     * Determine if the current expression is an instance of the Range parser
     * @returns {boolean} The result
     */
    isRange(): this is IRange;

    /**
     * Determine if the current expression is an instance of the Token parser
     * @returns {boolean} The result
     */
    isToken(): this is IToken;

    /**
     * Returns Nil or Empty depending on whether Empty
     * exists in the current expression.
     *
     * δ(L) = ∅ if ε notIn L
     * δ(L) = ε if ε in L
     *
     * @returns {IParser} The Nil or Empty parser
     */
    nilOrEmpty(): IParser;

    /**
     * The complement parser.
     * Parses anything that is not the current parser
     *
     * @returns {INot} The Not Parser
     */
    not(): INot;

    /**
     * The Opt parser.
     * P?
     * Equivalent to P | ε
     * @returns {IAlt} The Alt parser
     */
    opt(): IAlt;

    /**
     * The Plus parser. Matches the current pattern one or more times
     * P+
     * Equivalent to P◦P*
     * @returns {ICat} The Cat parser
     */
    plus(): ICat;

    /**
     * [a-b]
     * @param {string} from The starting character
     * @param {string} to The ending character
     * @throws {AssertionError} Throws if 'from' is not less than or equal to 'to'
     * @returns {IRange} The Range parser
     */
    range(from: string, to: string): IRange;

    /**
     *
     * @param {number} [n] The number of repetitions
     * @throws {AssertionError} Throws if n < 0 or n is not an integer
     * @returns {IRep} The Rep parser
     */
    rep(n: number): IRep;

    /**
     * Converts the current Parser to simplest form possible
     * Where 'simplify' is defined as minimizing the height of the expression tree.
     * Additionally, this method will refactor the expression so that other
     * methods will be more likely to short-circuit.
     *
     * @returns {IParser} The simplified parser
     */
    simplify(): IParser;

    /**
     * Represents the Kleene star of the current parser
     * P*
     * @see IStar
     * @returns {IStar} The Star Parser
     */
    star(): IStar;

    /**
     * Returns the concatenation of the current parser with
     * one or more additional parsers
     * P1◦P2◦...◦Pn
     *
     * @see ICat
     * @param {...(IParser | string)[]} parsers The sequence of parsers
     * @returns {ICat} The Cat parser
    */
    then(...parsers: (IParser | string)[]): ICat;

    /**
     * "Foo"
     * @param {string} value The string representing the token
     * @returns {IParser} The Token parser
     */
    token(value: string): IParser;
}

const parserContract = new Contract<IParser>({
    deriv: {
        demands(_, c){ return c.length == 1; }
    }
});

@Contracted(parserContract)
class Parser implements IParser {
    get height(): number { return 0; }
    @memo any(): IAny { return new Any(); }
    @memo empty(): IEmpty { return new Empty(); }
    @memo nil(): INil { return new Nil(); }
    @override toString(): string { return '∅'; }
    // @ts-ignore: unused variable
    deriv(c: string): IParser { return this.nil(); }
    matches(text: string): boolean {
        return text.length == 0 ?
            this.containsEmpty() :
            this.deriv(text[0]).matches(text.substr(1));
    }
    or(parser: IParser | string): IAlt {
        const q = parser instanceof Parser ? parser :
                  (parser as string).length == 0 ? this.empty() :
                  (parser as string).length == 1 ? this.char(parser as string) :
                  this.token(parser as string);

        return new Alt(this,q);
    }
    alt(...parsers: (IParser | string)[]): IParser {
        return parsers.length == 0 ? this.empty() :
        parsers.map(p =>
            p instanceof Parser ? p :
            (p as string).length == 0 ? this.empty() :
            (p as string).length == 1 ? this.char(p as string) :
            this.token(p as string)
        ).reduce((sum,next) => new Alt(sum, next));
    }
    cat(...parsers: (IParser | string)[]): IParser {
        return parsers.length == 0 ? this.empty() :
        parsers.map(p =>
            p instanceof Parser ? p :
            (p as string).length == 0 ? this.empty() :
            (p as string).length == 1 ? this.char(p as string) :
            this.token(p as string)
        ).reduce((sum,next) => new Cat(sum,next));
    }
    char(value: string): IChar { return new Char(value); }
    containsEmpty(): boolean { return false; }
    // TODO: switch to abstract?
    equals(other: IParser): boolean {
        return other.toString() === '∅' && !other.isNil();
    }
    isAlt(): this is IAlt { return false; }
    isAny(): this is IAny { return false; }
    isAtomic(): boolean { return false; }
    isCat(): this is ICat { return false; }
    isChar(): this is IChar { return false; }
    isEmpty(): this is IEmpty { return false; }
    isNil(): this is INil { return false; }
    isNot(): this is INot { return false; }
    isRep(): this is IRep { return false; }
    isStar(): this is IStar { return false; }
    isRange(): this is IRange { return false; }
    isToken(): this is IToken { return false; }
    nilOrEmpty(): INil | IEmpty { return this.nil(); }
    not(): INot { return new Not(this); }
    opt(): IAlt { return this.or(this.empty()); }
    plus(): ICat { return this.then(this.star()); }
    range(from: string, to: string): IRange { return new Range(from, to); }
    rep(n: number): IRep { return new Rep(this,n); }
    simplify(): IParser { return this; }
    star(): IStar { return new Star(this); }
    then(...parsers: (IParser | string)[]): ICat {
        if(parsers.length == 0) {
            return new Cat(this, this.nil());
        } else {
            const q = parsers.map(p =>
                p instanceof Parser ? p :
                (p as string).length == 0 ? this.empty() :
                (p as string).length == 1 ? this.char(p as string) :
                this.token(p as string)
            );

            return new Cat(this, q.reduce((sum,next) => new Cat(sum, next)));
        }
    }
    token(value: string): IParser { return new Token(value); }
}

export {IParser};
export default Parser;