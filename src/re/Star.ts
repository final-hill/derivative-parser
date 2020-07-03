/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import RegularLanguage from './RegularLanguage';
import Contracts from '@final-hill/decorator-contracts';
import {MSG_CHAR_EXPECTED} from '../Messages';
import factory from '.';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: Contracts['assert'] = contracts.assert;

/**
 * Represents the Kleene star of the given language
 * L*
 */
export default class Star extends RegularLanguage {
    constructor(readonly language: RegularLanguage) { super(1 + language.height); }

    @override
    containsEmpty(): boolean { return true; }

    // Dc(L*) = Dc(L) ◦ L*
    @override
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return factory.Cat(this.language.deriv(c), this);
    }

    @override
    equals(other: RegularLanguage): boolean {
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
    nilOrEmpty(): RegularLanguage { return factory.Empty(); }

    // L** → L*
    // ∅* → Ɛ
    // Ɛ* → Ɛ
    @override
    simplify(): RegularLanguage {
        const lang = this.language.simplify();

        if (lang.isStar()) { return factory.Star(lang.language); }
        if (lang.isNil()) { return factory.Empty(); }
        // FIXME: TypeScript 3.4.5 inference bug?
        if ((lang as RegularLanguage).isEmpty()) { return factory.Empty(); }

        return factory.Star(lang);
    }

    @override
    toString(): string {
        return this.language.isAtomic() ? `${this.language}*` : `(${this.language})*`;
    }
}