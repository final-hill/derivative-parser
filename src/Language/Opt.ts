/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Language from './Language';
import Contracts from '@final-hill/decorator-contracts';
import { MSG_CHAR_EXPECTED } from '../Messages';
import l from '.';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * L?
 */
export default class Opt extends Language {
    constructor(
        readonly language: Language
    ) { super(); }

    @override
    get height(): number { return 1 + this.language.height; }

    @override
    containsEmpty(): boolean { return true; }

    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return l.Alt(this.language, l.Empty()).deriv(c).simplify();
    }

    @override
    isOpt(): this is Opt { return true; }

    @override
    nilOrEmpty(): Language { return l.Empty(); }

    @override
    toString(): string { return this.language.isAtomic() ? `${this.language}?` : `(${this.language})?`; }
}