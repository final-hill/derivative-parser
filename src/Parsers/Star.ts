/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {
    containsEmpty, deriv, equals, height, isAtomic, isEmpty, isNil,
    isStar, nilOrEmpty, Parser, simplify, toString
} from './';
import { override } from '@final-hill/decorator-contracts';

/**
 * Represents the Kleene star of the given language
 * L*
 */
export default class Star extends Parser {
    #parser: Parser;

    constructor(parser: Parser) {
        super();
        this.#parser = parser;
    }

    @override get [height](): number { return 1 + this.parser[height]; }

    get parser(): Parser { return this.#parser; }

    @override [containsEmpty](): boolean { return true; }
    /**
     * @override
     * @inheritdoc
     * Dc(L*) = Dc(L) ◦ L*
     */
    @override [deriv](c: string): Parser { return this.parser[deriv](c).then(this); }
    @override [equals](other: Parser): boolean {
        return other[isStar]() && this.parser[equals]((other as Star).parser);
    }
    @override [isStar](): this is Star { return true; }
    /**
     * @override
     * @inheritdoc
     * δ(L*) = ε
     */
    @override [nilOrEmpty](): Parser { return this.empty(); }
    /**
     * @override
     * @inheritdoc
     * Ɛ* → Ɛ
     * ∅* → Ɛ
     * L** → L*
     */
    @override [simplify](): Parser {
        const p = this.parser;
        if (p[isStar]()) { return p; }
        if (p[isNil]()) { return this.empty(); }
        // FIXME: cast required due to TypeScript 3.4.5 inference bug?
        if ((p as Parser)[isEmpty]()) { return this.empty(); }

        return this;
    }
    @override [toString](): string {
        return this.parser[isAtomic]() ? `${this.parser[toString]()}*` : `(${this.parser[toString]()})*`;
    }
}

export { Star };