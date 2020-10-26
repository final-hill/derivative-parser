/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Language from './Language';
import Contracts from '@final-hill/decorator-contracts';
import {MSG_CHAR_EXPECTED} from '../Messages';
import l from '.';
import Plus from './Plus';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * Represents the union of two languages
 * L1 ∪ L2 = {foo} ∪ {bar} = {foo, bar}
 */
export default class Alt extends Language {
    constructor(
        readonly left: Language,
        readonly right: Language
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
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return l.Alt(this.left.deriv(c), this.right.deriv(c)).simplify();
    }

    @override
    equals(other: Language): boolean {
        return other.isAlt() && this.left.equals(other.left) && this.right.equals(other.right);
    }

    @override
    isAlt(): this is Alt { return true; }

    @override
    nilOrEmpty(): Language {
        return l.Alt(this.left.nilOrEmpty(), this.right.nilOrEmpty());
    }

    // L ∪ L → L
    // M ∪ L → L ∪ M
    // ∅ ∪ L → L
    // L ∪ ∅ → L
    // (L ∪ M) ∪ N → L ∪ (M ∪ N)
    // L+ ∪ Ɛ → L*
    @override
    simplify(): Language {
        let left = this.left.simplify(),
            right = this.right.simplify();

        if(left.height > right.height) {
            [left, right] = [right, left];
        }

        if(left.isAlt()) {
            [left,right] = [left.left, l.Alt(left.right, right)];
        }

        if(left.equals(right)) {
             return left;
        } else if(left.isNil()){
            return right;
        } else if(right.isNil()){
            return left;
        } else if((left as Language).isPlus() && (right as Language).isEmpty()) {
            return l.Star((left as Plus).language);
        }

        return l.Alt(left, right);
    }

    @override
    toString(): string {
        const leftString = this.left.isAtomic() ? `${this.left}` : `(${this.left})`,
            rightString = this.right.isAtomic() ? `${this.right}` : `(${this.right})`;

        return `${leftString}|${rightString}`;
    }
}