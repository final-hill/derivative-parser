/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { containsEmpty, deriv, equals, height, isRep, nilOrEmpty, Parser, toString } from '..';

export const n = Symbol('n');
export const parser = Symbol('parser');

/**
 * The Repetition parser.
 * Matches the provided parser n times
 * P{n}
 */
export class Rep extends Parser {
    private _parser: Parser;
    private _n: number;

    constructor(parser: Parser, n: number) {
        super();
        if (!Number.isSafeInteger(n) || n < 0)
            throw new Error('Rep must be an integer >= 0');
        this._n = n;
        this._parser = parser;
    }

    [height](): number { return 1 + this._parser[height](); }

    [parser](): Parser { return this._parser; }

    [n](): number { return this._n; }

    [containsEmpty](): boolean { return this._n === 0 || this._parser[containsEmpty](); }

    /**
     * @override
     * @inheritdoc
     * Dc(P{0}) = ε
     * Dc(P{1}) = Dc(P)
     * Dc(P{n}) = Dc(P)◦P{n-1}
     */
    [deriv](c: AsciiChar): Parser {
        return this._n == 0 ? this.empty() :
            this._n == 1 ? this._parser[deriv](c) :
                this._parser[deriv](c).then(this._parser.rep(this._n - 1));
    }

    [equals](other: Parser): boolean {
        return other[isRep]() &&
            (other as Rep)[n]() === this._n &&
            (other as Rep)[parser]()[equals](this._parser);
    }

    [isRep](): this is Rep { return true; }
    [nilOrEmpty](): Parser {
        return this[n]() === 0 ? this.empty() : this._parser[nilOrEmpty]();
    }
    [toString](): string { return `${this._parser[toString]()}{${this._n}}`; }
}