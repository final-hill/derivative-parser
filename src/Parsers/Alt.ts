/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { override } from '@final-hill/decorator-contracts';
import { Parser, simplify, deriv, containsEmpty, height, equals, isAlt, nilOrEmpty, isAtomic, isNil, toString } from './';

/**
 * @inheritdoc
 * Represents the union of two parsers
 * P1 ∪ P2
 */
export default class Alt extends Parser {
    constructor(readonly left: Parser, readonly right: Parser) { super(); }

    @override get [height](): number {
        return 1 + Math.max(this.left[height], this.right[height]);
    }
    /**
     * @override
     * @inheritdoc
     * δ(L1 | L2) = δ(L1) | δ(L2)
     */
    @override [containsEmpty](): boolean {
        return this.left[containsEmpty]() || this.right[containsEmpty]();
    }
    /**
     * @override
     * @inheritdoc
     * Dc(L1 ∪ L2) = Dc(L1) ∪ Dc(L2)
     */
    @override [deriv](c: string): Parser {
        return this.left[deriv](c).or(this.right[deriv](c));
    }
    @override [equals](other: Parser): boolean {
        return other[isAlt]() &&
            this.left[equals]((other as Alt).left) &&
            this.right[equals]((other as Alt).right);
    }
    @override [isAlt](): this is Alt { return true; }
    @override [nilOrEmpty](): Parser {
        return this.left[nilOrEmpty]().or(this.right[nilOrEmpty]());
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
    @override [simplify](): Parser {
        let left = this.left[simplify](),
            right = this.right[simplify]();

        if (left[isAlt]()) {
            [left, right] = [(left as Alt).left, new Alt((left as Alt).right, right)];
        }

        if (left[height] > right[height]) {
            [left, right] = [right, left];
        }

        if (left[equals](right)) {
            return left;
        } else if (left[isNil]()) {
            return right;
        } else if (right[isNil]()) {
            return left;
        }

        return new Alt(left, right);
    }
    @override [toString](): string {
        const leftString = this.left[isAtomic]() ? this.left[toString]() : `(${this.left[toString]()})`,
            rightString = this.right[isAtomic]() ? this.right[toString]() : `(${this.right[toString]()})`;

        return `${leftString}|${rightString}`;
    }
}

export { Alt };