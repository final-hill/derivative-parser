/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Language from './Language';
import Contracts from '@final-hill/decorator-contracts';
import l from '.';
import { MSG_CHAR_EXPECTED } from '../Messages';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * [a-b]
 */
export default class Range extends Language {
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
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        const d = this.from == this.to ? l.Char(this.from) :
            l.Alt(
                l.Char(this.from),
                l.Range(
                    String.fromCharCode(this.from.charCodeAt(0) + 1),
                    this.to
                )
            );

        return d.deriv(c).simplify();
    }

    @override
    isRange(): this is Range { return true; }

    @override
    nilOrEmpty(): Language { return l.Nil(); }

    @override
    toString(): string { return `[${this.from}-${this.to}]`; }
}