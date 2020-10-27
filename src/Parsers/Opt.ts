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
 * The Option parser P?
 * Equivalent to P | ε
 */
export default class Opt extends Parser {
    constructor(
        readonly parser: Parser
    ) { super(); }

    @override
    get height(): number { return 1 + this.parser.height; }

    @override
    containsEmpty(): boolean { return true; }

    @override
    deriv(c: string): Parser {
        return this.parser.or(this.empty()).deriv(c).simplify();
    }

    @override
    isOpt(): this is Opt { return true; }

    @override
    nilOrEmpty(): Parser { return this.empty(); }

    @override
    toString(): string { return this.parser.isAtomic() ? `${this.parser}?` : `(${this.parser})?`; }
}