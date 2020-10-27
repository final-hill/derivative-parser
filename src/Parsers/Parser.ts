/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';
import { MSG_NOT_IMPLEMENTED, MSG_STRING_EXPECTED } from '../Messages';
import {Alt, Cat, Char, Empty, Nil, Star, OneOf, Opt, Range, Plus, Seq, Token, Any, Not} from './';

const contracts = new Contracts(true),
     {demands, invariant, override} = contracts,
     assert: Contracts['assert'] = contracts.assert;

@invariant
export default class Parser {
    /**
     * The height of the expression tree. This is used for simplification.
     * @see this.simplify()
     */
    get height(): number { return 0; }

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
     * Returns a string representation of the expression
     *
     * @returns {string} - The string representation
     */
    @override
    toString(): string { return '∅'; }

    /**
     * The union of two parsers
     * P1 ∪ P2
     * P1 | P2
     *
     * @param {Parser} left -
     * @param {Parser } right -
     * @returns {Alt} -
     */
    alt(left: Parser, right: Parser): Alt {
        return new Alt(left, right);
    }

    /**
     * The parser for a single character. A wildcard.
     * '.'
     *
     * @see Any
     * @returns {Any} Any
     */
    any(): Any {
        // TODO: not using a constant here due to the lack of an equality definition
        return new Any();
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
     * Represents the Empty parser which parses the empty string
     * ε = {""}
     * @returns {Empty} Empty
     */
    empty(): Empty { return new Empty(); }

    /**
     * Determines if the current RegularLanguage is structurally equal the provided one
     *
     * @param {Parser} other  - The Language to compare with
     * @returns {boolean} - The result of the test
     */
    equals(other: Parser): boolean { return other === this; }

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
    isNil(): this is Nil { return false;}

    /**
     * Determines if the current expression is an instance of Not
     * @returns {boolean} - The result
     */
    isNot(): this is Not { return false; }

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
     * Represents the Nil Parser. Parses a language with no members.
     * ∅ = {}
     * @returns {Nil} -
     */
    nil(): Nil { return new Nil(); }

    /**
     * Returns Nil or Empty depending on whether Empty
     * exists in the current expression.
     *
     * δ(L) = ∅ if ε notIn L
     * δ(L) = ε if ε in L
     */
    nilOrEmpty(): Parser { throw new TypeError(MSG_NOT_IMPLEMENTED); }

    /**
     * The complement parser.
     * Parses anything that is not the current parser
     *
     * @returns {Not} -
     */
    not(): Not { return new Not(this); }

    /**
     * L1 | L2 | ... | Ln
     * @returns {OneOf} -
     */
    oneOf(...parsers: (Parser | string)[]): OneOf {
        return new OneOf(...parsers.map(p =>
            p instanceof Parser ? p :
            p.length == 0 ? this.empty() :
            p.length == 1 ? this.char(p) :
            this.token(p)
        ));
    }

    /**
     * The Opt parser.
     * P?
     * @returns {Opt} -
     */
    opt(): Parser {
        return new Opt(this);
    }

    /**
     * Represents the union of two parsers
     * P1 ∪ P2
     *
     * @see Alt
     * @param {Parser} parser -
     * @returns {Alt} Alt
     */
    or(parser: Parser): Alt {
        // TODO: accept string
        return new Alt(this,parser);
    }

    /**
     * The Plus parser
     * P+
     * @returns {Plus} -
     */
    plus(): Parser {
        return new Plus(this);
    }

    /**
     * [a-b]
     * @param {string} from -
     * @param {string} to -
     * @returns {Parser} -
     */
    range(from: string, to: string): Parser {
        return from === to ? this.char(from) :
            from < to ? new Range(from, to) :
            new Range(to, from);
    }

    /**
     * P1,P2,...,Pn
     * @param {(Parser | string)[]} parsers -
     * @returns {Parser} -
     */
    seq(...parsers: (Parser | string)[]): Parser {
        return new Seq(...parsers.map(lang =>
            lang instanceof Parser ? lang :
            lang.length == 0 ? this.empty() :
            lang.length == 1 ? this.char(lang) :
            this.token(lang)
        ));
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
     * Represents the concatenation of two parsers
     * L1 ◦ L2
     *
     * @see Cat
     * @param {Parser} parser -
     * @returns {Cat} Cat
     */
    then(parser: Parser): Cat { return new Cat(this, parser); }

    /**
     * "Foo"
     * @param {string} value - The string representing the token
     * @returns {Parser} - The Token parser
     */
    token(value: string): Parser {
        return new Token(value);
    }
}