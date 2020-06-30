/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Language from './Language';
import Contracts from '@final-hill/decorator-contracts';
import {MSG_CHAR_EXPECTED} from '../Messages';
import lang from '.';
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
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return lang.Alt(this.left.deriv(c), this.right.deriv(c));
    }

    @override
    equals(other: Language): boolean {
        return other.isAlt() && this.left.equals(other.left) && this.right.equals(other.right);
    }

    @override
    isAlt(): this is Alt { return true; }

    @override
    nilOrEmpty(): Language {
        return lang.Alt(this.left.nilOrEmpty(), this.right.nilOrEmpty());
    }

    // L ∪ L → L
    // M ∪ L → L ∪ M
    // ∅ ∪ L → L
    // L ∪ ∅ → L
    // (L ∪ M) ∪ N → L ∪ (M ∪ N)
    // L+ ∪ Ɛ → L*
    @override
    simplify(): Language {
        let l = this.left.simplify(),
            r = this.right.simplify();

        if(l.height > r.height) {
            [l, r] = [r, l];
        }

        if(l.isAlt()) {
            [l,r] = [l.left, lang.Alt(l.right, r)];
        }

        if(l.equals(r)) {
             return l;
        } else if(l.isNil()){
            return r;
        } else if(r.isNil()){
            return l;
        } else if((l as Language).isPlus() && (r as Language).isEmpty()) {
            return lang.Star((l as Plus).language);
        }

        return lang.Alt(l, r);
    }

    @override
    toString(): string {
        const leftString = this.left.isAtomic() ? `${this.left}` : `(${this.left})`,
            rightString = this.right.isAtomic() ? `${this.right}` : `(${this.right})`;

        return `${leftString}|${rightString}`;
    }
}