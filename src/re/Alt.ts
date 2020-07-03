/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import RegularLanguage from './RegularLanguage';
import Contracts from '@final-hill/decorator-contracts';
import {MSG_CHAR_EXPECTED} from '../Messages';
import re from '.';
import Plus from './Plus';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * Represents the union of two languages
 * L1 ∪ L2 = {foo} ∪ {bar} = {foo, bar}
 */
export default class Alt extends RegularLanguage {
    constructor(
        readonly left: RegularLanguage,
        readonly right: RegularLanguage
    ) { super(1 + Math.max(left.height, right.height)); }

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
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return re.Alt(this.left.deriv(c), this.right.deriv(c));
    }

    @override
    equals(other: RegularLanguage): boolean {
        return other.isAlt() && this.left.equals(other.left) && this.right.equals(other.right);
    }

    @override
    isAlt(): this is Alt { return true; }

    @override
    nilOrEmpty(): RegularLanguage {
        return re.Alt(this.left.nilOrEmpty(), this.right.nilOrEmpty());
    }

    // L ∪ L → L
    // M ∪ L → L ∪ M
    // ∅ ∪ L → L
    // L ∪ ∅ → L
    // (L ∪ M) ∪ N → L ∪ (M ∪ N)
    // L+ ∪ Ɛ → L*
    @override
    simplify(): RegularLanguage {
        let l = this.left.simplify(),
            r = this.right.simplify();

        if(l.height > r.height) {
            [l, r] = [r, l];
        }

        if(l.isAlt()) {
            [l,r] = [l.left, re.Alt(l.right, r)];
        }

        if(l.equals(r)) {
             return l;
        } else if(l.isNil()){
            return r;
        } else if(r.isNil()){
            return l;
        } else if((l as RegularLanguage).isPlus() && (r as RegularLanguage).isEmpty()) {
            return re.Star((l as Plus).language);
        }

        return re.Alt(l, r);
    }

    @override
    toString(): string {
        const leftString = this.left.isAtomic() ? `${this.left}` : `(${this.left})`,
            rightString = this.right.isAtomic() ? `${this.right}` : `(${this.right})`;

        return `${leftString}|${rightString}`;
    }
}