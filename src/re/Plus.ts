/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */
import RegularLanguage from './RegularLanguage';
import Contracts from '@final-hill/decorator-contracts';
import factory from '.';
import { MSG_CHAR_EXPECTED } from '../Messages';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * L+
 */
export default class Plus extends RegularLanguage {
    constructor(readonly language: RegularLanguage) { super(1 + language.height); }

    @override
    isPlus(): this is Plus{ return true; }

    @override
    containsEmpty(): boolean { return this.language.containsEmpty(); }

    @override
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return factory.Cat(this.language, factory.Star(this.language)).deriv(c);
    }

    @override
    nilOrEmpty(): RegularLanguage { return factory.Cat(this.language, factory.Star(this.language)).nilOrEmpty(); }

    // TODO: simplify()
    // TODO: L+ → LL* → L*L   (Is this actually simpler? Maybe the reverse in order to containsEmpty faster?)
    // TODO: L++ → L+

    @override
    toString(): string { return this.language.isAtomic() ? `${this.language}+` : `(${this.language})+`; }
}