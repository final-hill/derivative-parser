/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {
    Parser, Nil, Empty, containsEmpty, deriv, simplify, height,
    nilOrEmpty, isEmpty, isNil, toString, isAtomic, equals, isCat
} from '..';

export const first = Symbol('first');
export const second = Symbol('second');

/**
 * @inheritdoc
 * Represents the concatenation of two parsers
 * P1 ◦ P2
 */
export class Cat extends Parser {
    private _first;
    private _second;

    constructor(first: Parser, second: Parser) {
        super();
        this._first = first;
        this._second = second;
    }

    [first]() { return this._first; }
    [second]() { return this._second; }

    [height](): number {
        return 1 + Math.max(this._first[height](), this._second[height]());
    }

    /**
     * @override
     * @inheritdoc
     * δ(P1◦P2) = δ(P1)◦δ(P2)
     */
    [containsEmpty](): boolean {
        return this._first[containsEmpty]() && this._second[containsEmpty]();
    }

    /**
     * @override
     * @inheritdoc
     * Dc(P1◦P2) = (Dc(P1)◦P2) ∪ (δ(P1)◦Dc(P2))
     */
    [deriv](c: AsciiChar): Parser {
        const [f, s] = [this._first, this._second];

        return f[deriv](c).then(s).or(f[nilOrEmpty]().then(s[deriv](c)));
    }

    [equals](other: Parser): boolean {
        return other[isCat]() &&
            this._first[equals]((other as Cat)[first]()) &&
            this._second[equals]((other as Cat)[second]());
    }

    [isCat](): this is Cat { return true; }

    [nilOrEmpty](): Nil | Empty {
        return this._first[nilOrEmpty]().then(this._second[nilOrEmpty]());
    }

    /**
     * @override
     * @inheritdoc
     * PƐ → ƐP → P
     * ∅P → P∅ → ∅
     * Unused: (PQ)R → P(QR)
     * Unused: P(Q ∪ R) → PQ ∪ PR  (Is this actually simpler? Maybe the other direction?)
     * Unused: (Q ∪ R)P → QP ∪ RP  (Is this actually simpler? Maybe the other direction?)
     */
    [simplify](): Parser {
        const fst = this._first[simplify](),
            snd = this._second[simplify]();

        return fst[isEmpty]() ? snd :
            snd[isEmpty]() ? fst :
                (fst)[isNil]() ? fst :
                    (snd)[isNil]() ? snd :
                        this;
    }

    [toString](): string {
        const fst = this._first[isAtomic]() ? this._first[toString]() : `(${this._first[toString]()})`,
            snd = this._second[isAtomic]() ? this._second[toString]() : `(${this._second[toString]()})`;

        return `${fst}${snd}`;
    }
}