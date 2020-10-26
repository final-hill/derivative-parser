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

const contracts = new Contracts(true),
    {override} = contracts,
    assert: Contracts['assert'] = contracts.assert;

/**
 * Represents the Kleene star of the given language
 * L*
 */
export default class Star extends Language {
    constructor(readonly language: Language) { super(); }

    @override
    get height(): number { return 1 + this.language.height; }

    @override
    containsEmpty(): boolean { return true; }

    // Dc(L*) = Dc(L) ◦ L*
    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return l.Cat(this.language.deriv(c), this).simplify();
    }

    @override
    equals(other: Language): boolean {
        return other.isStar() && this.language.equals(other.language);
    }

    @override
    isAtomic(): boolean { return false; }

    @override
    isStar(): this is Star { return true; }

    /**
     * δ(L*) = ε
     * @override
     */
    @override
    nilOrEmpty(): Language { return l.Empty(); }

    // L** → L*
    // ∅* → Ɛ
    // Ɛ* → Ɛ
    @override
    simplify(): Language {
        const lang = this.language.simplify();

        if (lang.isStar()) { return l.Star(lang.language); }
        if (lang.isNil()) { return l.Empty(); }
        // FIXME: TypeScript 3.4.5 inference bug?
        if ((lang as Language).isEmpty()) { return l.Empty(); }

        return l.Star(lang);
    }

    @override
    toString(): string {
        return this.language.isAtomic() ? `${this.language}*` : `(${this.language})*`;
    }
}