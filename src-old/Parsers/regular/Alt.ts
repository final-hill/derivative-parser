/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Parser, simplify, deriv, containsEmpty, height, equals, isAlt, nilOrEmpty, isAtomic, isNil, toString } from '..';

export const left = Symbol('left');
export const right = Symbol('right');

/**
 * @inheritdoc
 * Represents the union of two parsers
 * P1 ∪ P2
 */
export class Alt extends Parser {
    private _left;
    private _right;

    constructor(left: Parser, right: Parser) {
        super();
        this._left = left;
        this._right = right;
    }

    [left]() { return this._left; }

    [right]() { return this._right; }

    [height](): number {
        return 1 + Math.max(this._left[height](), this._right[height]());
    }

    /**
     * @override
     * @inheritdoc
     * δ(L1 | L2) = δ(L1) | δ(L2)
     */
    [containsEmpty](): boolean {
        return this._left[containsEmpty]() || this._right[containsEmpty]();
    }

    /**
     * @override
     * @inheritdoc
     * Dc(L1 ∪ L2) = Dc(L1) ∪ Dc(L2)
     */
    [deriv](c: AsciiChar): Parser {
        return this._left[deriv](c).or(this._right[deriv](c));
    }

    [equals](other: Parser): boolean {
        return other[isAlt]() &&
            this._left[equals]((other as Alt)[left]()) &&
            this._right[equals]((other as Alt)[right]());
    }

    [isAlt](): this is Alt { return true; }

    [nilOrEmpty](): Parser {
        return this._left[nilOrEmpty]().or(this._right[nilOrEmpty]());
    }

    /**
     * @override
     * @inheritdoc
     * L ∪ L → L
     * M ∪ L → L ∪ M
     * ∅ ∪ L → L
     * L ∪ ∅ → L
     * (L ∪ M) ∪ N → L ∪ (M ∪ N)
     */
    [simplify](): Parser {
        let l = this._left[simplify](),
            r = this._right[simplify]();

        if (l[isAlt]())
            [l, r] = [(l as Alt)[left](), new Alt((l as Alt)[right](), r)];


        if (l[height]() > r[height]())
            [l, r] = [r, l];

        if (l[equals](r))
            return l;
        else if (l[isNil]())
            return r;
        else if (r[isNil]())
            return l;

        return new Alt(l, r);
    }

    [toString](): string {
        const leftString = this._left[isAtomic]() ? this._left[toString]() : `(${this._left[toString]()})`,
            rightString = this._right[isAtomic]() ? this._right[toString]() : `(${this._right[toString]()})`;

        return `${leftString}|${rightString}`;
    }
}