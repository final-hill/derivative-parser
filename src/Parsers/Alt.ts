/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';
import {Parser} from './';

const contracts = new Contracts(true),
    {override} = contracts;

/**
 * Represents the union of two parsers
 * P1 ∪ P2
 */
export default class Alt extends Parser {
    constructor(
        readonly left: Parser,
        readonly right: Parser
    ) { super(); }

    @override
    get height(): number {
        return 1 + Math.max(this.left.height, this.right.height);
    }

    /**
     * δ(L1 | L2) = δ(L1) | δ(L2)
     * @override
     */
    @override
    containsEmpty(): boolean {
        return this.left.containsEmpty() || this.right.containsEmpty();
    }

    // Dc(L1 ∪ L2) = Dc(L1) ∪ Dc(L2)
    @override
    deriv(c: string): Parser {
        return this.left.deriv(c).or(this.right.deriv(c));
    }

    @override
    equals(other: Parser): boolean {
        return other.isAlt() && this.left.equals(other.left) && this.right.equals(other.right);
    }

    @override
    isAlt(): this is Alt { return true; }

    @override
    nilOrEmpty(): Parser {
        return this.left.nilOrEmpty().or(this.right.nilOrEmpty());
    }

    // L ∪ L → L
    // M ∪ L → L ∪ M
    // ∅ ∪ L → L
    // L ∪ ∅ → L
    // (L ∪ M) ∪ N → L ∪ (M ∪ N)
    @override
    simplify(): Parser {
        let left = this.left.simplify(),
            right = this.right.simplify();

        if(left.isAlt()) {
            [left,right] = [left.left, new Alt(left.right, right)];
        }

        if(left.height > right.height) {
            [left, right] = [right, left];
        }

        if(left.equals(right)) {
             return left;
        } else if(left.isNil()){
            return right;
        } else if(right.isNil()){
            return left;
        }

        return new Alt(left, right);
    }

    @override
    toString(): string {
        const leftString = this.left.isAtomic() ? `${this.left}` : `(${this.left})`,
              rightString = this.right.isAtomic() ? `${this.right}` : `(${this.right})`;

        return `${leftString}|${rightString}`;
    }
}