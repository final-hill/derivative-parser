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
    #first; #second;

    constructor(first: Parser, second: Parser) {
        super();
        this.#first = first;
        this.#second = second;
    }

    [first]() { return this.#first; }
    [second]() { return this.#second; }

    [height](): number {
        return 1 + Math.max(this.#first[height](), this.#second[height]());
    }

    /**
     * @override
     * @inheritdoc
     * δ(P1◦P2) = δ(P1)◦δ(P2)
     */
    [containsEmpty](): boolean {
        return this.#first[containsEmpty]() && this.#second[containsEmpty]();
    }

    /**
     * @override
     * @inheritdoc
     * Dc(P1◦P2) = (Dc(P1)◦P2) ∪ (δ(P1)◦Dc(P2))
     */
    [deriv](c: AsciiChar): Parser {
        const [f, s] = [this.#first, this.#second];

        return f[deriv](c).then(s).or(f[nilOrEmpty]().then(s[deriv](c)));
    }

    [equals](other: Parser): boolean {
        return other[isCat]() &&
            this.#first[equals]((other as Cat)[first]()) &&
            this.#second[equals]((other as Cat)[second]());
    }

    [isCat](): this is Cat { return true; }

    [nilOrEmpty](): Nil | Empty {
        return this.#first[nilOrEmpty]().then(this.#second[nilOrEmpty]());
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
        const fst = this.#first[simplify](),
            snd = this.#second[simplify]();

        return fst[isEmpty]() ? snd :
            snd[isEmpty]() ? fst :
                (fst)[isNil]() ? fst :
                    (snd)[isNil]() ? snd :
                        this;
    }

    [toString](): string {
        const fst = this.#first[isAtomic]() ? this.#first[toString]() : `(${this.#first[toString]()})`,
            snd = this.#second[isAtomic]() ? this.#second[toString]() : `(${this.#second[toString]()})`;

        return `${fst}${snd}`;
    }
}