/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, equals, isRange, nilOrEmpty, Parser, toString } from '..';

export const from = Symbol('from');
export const to = Symbol('to');

/**
 * @inheritdoc
 * [a-b]
 */
export class Range extends Parser {
    private _from;
    private _to;

    constructor(from: AsciiChar, to: AsciiChar) {
        super();
        if (to < from)
            throw new Error('expected \'from\' <= \'to\'');

        this._from = from;
        this._to = to;
    }

    [from](): string { return this._from; }
    [to](): string { return this._to; }

    [deriv](c: AsciiChar): Parser {
        const d = this._from == this._to ? this.char(this._from) :
            this._from <= c && c <= this._to ? this.char(c) :
                this.nil();

        return d[deriv](c);
    }

    [equals](other: Parser): boolean {
        return other[isRange]() && (other as Range)[from]() === this._from &&
            (other as Range)[to]() === this._to;
    }

    [isRange](): this is Range { return true; }
    [nilOrEmpty](): Parser { return this.nil(); }
    [toString](): string { return `[${this._from}-${this._to}]`; }
}