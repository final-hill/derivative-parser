/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Alt, Any, Cat, Char, Empty, Nil, Not, Parser, Range, Rep, Star, Token } from '.';
import {override} from '@final-hill/decorator-contracts';

class Thunk extends Parser {
    protected target: Record<PropertyKey, unknown>;
    protected fn: (...args: any[]) => Parser;
    protected args: any;
    protected innerParser: Parser | undefined;

    constructor(
        target: Record<PropertyKey, unknown>,
        fn: (...args: any[]) => Parser,
        ...args: any[]
    ){
        super();
        this.target = target;
        this.fn = fn;
        this.args = args;
    }

    get parser(): Parser {
        if(this.innerParser != undefined) {
            return this.innerParser;
        } else {
            return (this.innerParser = this.fn.apply(this.target,this.args));
        }
    }

    @override
    get height(): number {
        return this.parser.height;
    }

    @override
    containsEmpty(): boolean { return this.parser.containsEmpty(); }

    @override
    deriv(c: string): Parser { return this.parser.deriv(c); }

    @override
    equals(other: Parser): boolean { return this.parser.equals(other); }

    @override
    isAlt(): this is Alt { return this.parser.isAlt(); }

    @override
    isAny(): this is Any { return this.parser.isAny(); }

    @override
    isAtomic(): boolean { return this.parser.isAtomic(); }

    @override
    isCat(): this is Cat { return this.parser.isCat(); }

    @override
    isChar(): this is Char { return this.parser.isChar(); }

    @override
    isEmpty(): this is Empty { return this.parser.isEmpty(); }

    @override
    isNil(): this is Nil { return this.parser.isNil(); }

    @override
    isNot(): this is Not { return this.parser.isNot(); }

    @override
    isRep(): this is Rep { return this.parser.isRep(); }

    @override
    isStar(): this is Star { return this.parser.isStar(); }

    @override
    isRange(): this is Range { return this.parser.isRange(); }

    @override
    isToken(): this is Token { return this.parser.isToken();}

    @override
    matches(text: string): boolean { return this.parser.matches(text); }

    @override
    nilOrEmpty(): Parser { return this.parser.nilOrEmpty(); }

    @override
    simplify(): Parser { return this.parser.simplify(); }

    @override
    toString(): string { return this.parser.toString(); }
}

export default Thunk;
