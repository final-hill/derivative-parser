/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Language from './Language';
import Contracts from '@final-hill/decorator-contracts';
import { MSG_CHAR_EXPECTED } from '../Messages';
import factory from './';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * L?
 */
export default class Opt extends Language {
    constructor(readonly language: Language) { super(1 + language.height); }

    @override
    containsEmpty(): boolean { return true; }

    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return factory.Alt(this.language, factory.Empty()).deriv(c);
    }

    @override
    isOpt(): this is Opt { return true; }

    @override
    nilOrEmpty(): Language { return factory.Empty(); }

    @override
    toString(): string { return this.language.isAtomic() ? `${this.language}?` : `(${this.language})?`; }
}