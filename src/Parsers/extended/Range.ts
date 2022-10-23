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
    #from; #to;

    constructor(from: AsciiChar, to: AsciiChar) {
        super();
        if (to < from)
            throw new Error('expected \'from\' <= \'to\'');

        this.#from = from;
        this.#to = to;
    }

    [from](): string { return this.#from; }
    [to](): string { return this.#to; }

    [deriv](c: AsciiChar): Parser {
        const d = this.#from == this.#to ? this.char(this.#from) :
            this.#from <= c && c <= this.#to ? this.char(c) :
                this.nil();

        return d[deriv](c);
    }

    [equals](other: Parser): boolean {
        return other[isRange]() && (other as Range)[from]() === this.#from &&
            (other as Range)[to]() === this.#to;
    }

    [isRange](): this is Range { return true; }
    [nilOrEmpty](): Parser { return this.nil(); }
    [toString](): string { return `[${this.#from}-${this.#to}]`; }
}