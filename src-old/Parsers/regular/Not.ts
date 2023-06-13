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
    private _parser;

    constructor(parser: Parser) {
        super();
        this._parser = parser;
    }

    [height](): number { return 1 + this._parser[height](); }

    [parser](): Parser { return this._parser; }

    [containsEmpty](): boolean { return !this._parser[containsEmpty](); }

    /**
     * @override
     * @inheritdoc
     * Dc(¬P) = ¬Dc(P)
     */
    [deriv](c: AsciiChar): Parser { return this._parser[deriv](c).not(); }
    [equals](other: Parser): boolean {
        return other[isNot]() && this._parser[equals]((other as Not)[parser]());
    }
    [isNot](): boolean { return true; }

    /**
     * @override
     * @inheritdoc
     * δ(¬P) = ε if δ(P) = ∅
     * δ(¬P) = ∅ if δ(P) = ε
     */
    [nilOrEmpty](): Nil | Empty {
        const ne = this._parser[nilOrEmpty]();

        return ne[isNil]() ? this.empty() : this.nil();
    }

    /**
     * @override
     * @inheritdoc
     * ¬¬P → P
     */
    [simplify](): Parser {
        const lang = this._parser[simplify]();

        return lang[isNot]() ? (lang as Not)[parser]() : lang.not();
    }
    [toString](): string {
        return `¬${this._parser[isAtomic]() ? this._parser[toString]() : `(${this._parser[toString]()})`}`;
    }
}