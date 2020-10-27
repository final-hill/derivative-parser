/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */
import {Parser} from './';
import Contracts from '@final-hill/decorator-contracts';

const contracts = new Contracts(true),
    {override} = contracts;

/**
 * The Plus parser. Matches the current pattern one or more times
 * P+
 */
export default class Plus extends Parser {
    constructor(
        readonly parser: Parser
    ) { super(); }

    @override
    get height(): number {
        return 1 + this.parser.height;
    }

    @override
    isPlus(): this is Plus{ return true; }

    @override
    containsEmpty(): boolean { return this.parser.containsEmpty(); }

    // Dc(P+) == Dc(P◦P*)
    @override
    deriv(c: string): Parser {
        const p = this.parser;

        return p.then(p.star()).deriv(c).simplify();
    }

    @override
    nilOrEmpty(): Parser {
        const p = this.parser;

        return p.then(p.star()).nilOrEmpty();
    }

    // TODO: simplify()
    // TODO: L+ → LL* → L*L   (Is this actually simpler? Maybe the reverse in order to containsEmpty faster?)
    // TODO: L++ → L+

    @override
    toString(): string { return this.parser.isAtomic() ? `${this.parser}+` : `(${this.parser})+`; }
}