/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {
    containsEmpty, deriv, equals, height, Empty, Nil, isAtomic, isNil, isNot,
    nilOrEmpty, Parser, simplify, toString
} from '..';

export const parser = Symbol('parser');

/**
 * The complement parser.
 * Matches anything that is not the provided parser
 */
export class Not extends Parser {
    #parser;

    constructor(parser: Parser) {
        super();
        this.#parser = parser;
    }

    [height](): number { return 1 + this.#parser[height](); }

    [parser](): Parser { return this.#parser; }

    [containsEmpty](): boolean { return !this.#parser[containsEmpty](); }

    /**
     * @override
     * @inheritdoc
     * Dc(¬P) = ¬Dc(P)
     */
    [deriv](c: AsciiChar): Parser { return this.#parser[deriv](c).not(); }
    [equals](other: Parser): boolean {
        return other[isNot]() && this.#parser[equals]((other as Not)[parser]());
    }
    [isNot](): boolean { return true; }

    /**
     * @override
     * @inheritdoc
     * δ(¬P) = ε if δ(P) = ∅
     * δ(¬P) = ∅ if δ(P) = ε
     */
    [nilOrEmpty](): Nil | Empty {
        const ne = this.#parser[nilOrEmpty]();

        return ne[isNil]() ? this.empty() : this.nil();
    }

    /**
     * @override
     * @inheritdoc
     * ¬¬P → P
     */
    [simplify](): Parser {
        const lang = this.#parser[simplify]();

        return lang[isNot]() ? (lang as Not)[parser]() : lang.not();
    }
    [toString](): string {
        return `¬${this.#parser[isAtomic]() ? this.#parser[toString]() : `(${this.#parser[toString]()})`}`;
    }
}