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
    #parser: Parser;
    #n: number;

    constructor(parser: Parser, n: number) {
        super();
        if (!Number.isSafeInteger(n) || n < 0)
            throw new Error('Rep must be an integer >= 0');
        this.#n = n;
        this.#parser = parser;
    }

    [height](): number { return 1 + this.#parser[height](); }

    [parser](): Parser { return this.#parser; }

    [n](): number { return this.#n; }

    [containsEmpty](): boolean { return this.#n === 0 || this.#parser[containsEmpty](); }

    /**
     * @override
     * @inheritdoc
     * Dc(P{0}) = ε
     * Dc(P{1}) = Dc(P)
     * Dc(P{n}) = Dc(P)◦P{n-1}
     */
    [deriv](c: AsciiChar): Parser {
        return this.#n == 0 ? this.empty() :
            this.#n == 1 ? this.#parser[deriv](c) :
                this.#parser[deriv](c).then(this.#parser.rep(this.#n - 1));
    }

    [equals](other: Parser): boolean {
        return other[isRep]() &&
            (other as Rep)[n]() === this.#n &&
            (other as Rep)[parser]()[equals](this.#parser);
    }

    [isRep](): this is Rep { return true; }
    [nilOrEmpty](): Parser {
        return this[n]() === 0 ? this.empty() : this.#parser[nilOrEmpty]();
    }
    [toString](): string { return `${this.#parser[toString]()}{${this.#n}}`; }
}