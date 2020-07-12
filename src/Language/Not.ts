/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Language from './Language';
import Contracts from '@final-hill/decorator-contracts';
import l from '.';
import { MSG_CHAR_EXPECTED } from '../Messages';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: Contracts['assert'] = contracts.assert;

/**
 * The complement language.
 * Matches anything that is not the provided language
 */
class Not extends Language {
    constructor(readonly language: Language) {
        super(1 + language.height);
    }

    @override
    containsEmpty(): boolean {
        return !this.language.containsEmpty();
    }

    // Dc(¬L) = ¬Dc(L)
    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return l.Not(this.language.deriv(c)).simplify();
    }

    @override
    equals(other: Language): boolean {
        return other.isNot() && this.language.equals(other.language);
    }

    @override
    isNot(): boolean { return true; }

    // δ(¬L) = ε if δ(L) = ∅
    // δ(¬L) = ∅ if δ(L) = ε
    @override
    nilOrEmpty(): Language {
        const nilOrEmpty = this.language.nilOrEmpty();

        return nilOrEmpty.isNil() ? l.EMPTY : l.NIL;
    }

    // ¬¬L → L
    @override
    simplify(): Language {
        const lang = this.language.simplify();

        return lang.isNot() ? lang.language : l.Not(lang);
    }

    @override
    toString(): string {
        return `¬${this.language.isAtomic() ? this.language.toString() : `(${this.language})`}`;
    }
}

export default Not;