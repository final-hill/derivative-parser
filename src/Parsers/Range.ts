/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';
import {assert, override} from '@final-hill/decorator-contracts';
import { MSG_CHAR_EXPECTED } from '../Messages';

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
    deriv(c: string): Parser {
        const d = this.from == this.to ? this.char(this.from) :
                  this.from <= c && c <= this.to ? this.char(c) :
                  this.nil();

        return d.deriv(c);
    }

    @override
    isRange(): this is Range { return true; }

    @override
    nilOrEmpty(): Parser { return this.nil(); }

    @override
    toString(): string { return `[${this.from}-${this.to}]`; }
}