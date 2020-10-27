/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';
import Contracts from '@final-hill/decorator-contracts';
import { MSG_CHAR_EXPECTED } from '../Messages';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * [a-b]
 */
export default class Range extends Parser {
    constructor(
        readonly from: string,
        readonly to: string
    ) {
        super();
        assert(typeof from == 'string' && from.length == 1, MSG_CHAR_EXPECTED);
        assert(typeof to == 'string' && to.length == 1, MSG_CHAR_EXPECTED);
        assert(from <= to, 'Assertion failed: Range.from <= Range.to');
    }

    @override
    get height(): number { return 0; }

    @override
    deriv(c: string): Parser {
        const d = this.from == this.to ? this.char(this.from) :
            this.char(this.from).or(
                this.range(String.fromCharCode(this.from.charCodeAt(0) + 1),
                this.to)
            );

        return d.deriv(c).simplify();
    }

    @override
    isRange(): this is Range { return true; }

    @override
    nilOrEmpty(): Parser { return this.nil(); }

    @override
    toString(): string { return `[${this.from}-${this.to}]`; }
}