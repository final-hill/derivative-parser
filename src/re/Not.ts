/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import RegularLanguage from './RegularLanguage';
import Contracts from '@final-hill/decorator-contracts';
import re from './';
import { MSG_CHAR_EXPECTED } from '../Messages';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: Contracts['assert'] = contracts.assert;

/**
 * The complement language.
 * Matches anything that is not the provided language
 */
class Not extends RegularLanguage {
    constructor(readonly language: RegularLanguage) {
        super(1 + language.height);
    }

    @override
    containsEmpty(): boolean {
        return !this.language.containsEmpty();
    }

    // Dc(¬L) = ¬Dc(L)
    @override
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return re.Not(this.language.deriv(c));
    }

    @override
    equals(other: RegularLanguage): boolean {
        return other.isNot() && this.language.equals(other.language);
    }

    @override
    isNot(): boolean { return true; }

    // δ(¬L) = ε if δ(L) = ∅
    // δ(¬L) = ∅ if δ(L) = ε
    @override
    nilOrEmpty(): RegularLanguage {
        const nilOrEmpty = this.language.nilOrEmpty();

        return nilOrEmpty.isNil() ? re.EMPTY : re.NIL;
    }

    // ¬¬L → L
    @override
    simplify(): RegularLanguage {
        const l = this.language.simplify();

        return l.isNot() ? l.language : re.Not(l);
    }

    @override
    toString(): string {
        return `¬${this.language.isAtomic() ? this.language.toString() : `(${this.language})`}`;
    }
}

export default Not;