/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {
    containsEmpty, deriv, equals, height, isAtomic, isEmpty, isNil,
    isStar, nilOrEmpty, Parser, simplify, toString
} from '..';

export const parser = Symbol('parser');

/**
 * Represents the Kleene star of the given language
 * L*
 */
export class Star extends Parser {
    #parser;

    constructor(parser: Parser) {
        super();
        this.#parser = parser;
    }

    [height](): number { return 1 + this.#parser[height](); }

    [parser](): Parser { return this.#parser; }

    [containsEmpty](): boolean { return true; }

    /**
     * @override
     * @inheritdoc
     * Dc(L*) = Dc(L) ◦ L*
     */
    [deriv](c: AsciiChar): Parser { return this.#parser[deriv](c).then(this); }
    [equals](other: Parser): boolean {
        return other[isStar]() && this.#parser[equals]((other as Star)[parser]());
    }
    [isStar](): this is Star { return true; }

    /**
     * @override
     * @inheritdoc
     * δ(L*) = ε
     */
    [nilOrEmpty](): Parser { return this.empty(); }

    /**
     * @override
     * @inheritdoc
     * Ɛ* → Ɛ
     * ∅* → Ɛ
     * L** → L*
     */
    [simplify](): Parser {
        const p = this.#parser;
        if (p[isStar]()) return p;
        if (p[isNil]()) return this.empty();
        if (p[isEmpty]()) return this.empty();

        return this;
    }

    [toString](): string {
        return this.#parser[isAtomic]() ? `${this.#parser[toString]()}*` : `(${this.#parser[toString]()})*`;
    }
}