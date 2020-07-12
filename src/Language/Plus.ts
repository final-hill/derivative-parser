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
    assert: typeof contracts.assert = contracts.assert;

/**
 * L+
 */
export default class Plus extends Language {
    constructor(readonly language: Language) { super(1 + language.height); }

    @override
    isPlus(): this is Plus{ return true; }

    @override
    containsEmpty(): boolean { return this.language.containsEmpty(); }

    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return l.Cat(this.language, l.Star(this.language)).deriv(c).simplify();
    }

    @override
    nilOrEmpty(): Language { return l.Cat(this.language, l.Star(this.language)).nilOrEmpty(); }

    // TODO: simplify()
    // TODO: L+ → LL* → L*L   (Is this actually simpler? Maybe the reverse in order to containsEmpty faster?)
    // TODO: L++ → L+

    @override
    toString(): string { return this.language.isAtomic() ? `${this.language}+` : `(${this.language})+`; }
}