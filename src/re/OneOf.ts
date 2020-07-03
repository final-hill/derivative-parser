/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */
import RegularLanguage from './RegularLanguage';
import Contracts from '@final-hill/decorator-contracts';
import { MSG_CHAR_EXPECTED } from '../Messages';
import factory from '.';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * L1 | L2 | ... | Ln
 */
export default class OneOf extends RegularLanguage {
    readonly languages: RegularLanguage[];

    constructor(...languages: RegularLanguage[]) {
        super(1 + Math.max(...languages.map(lang => lang.height)));
        assert(languages.length > 0, 'Languages can not be empty');
        this.languages = languages.slice();
    }

    @override
    containsEmpty(): boolean { return this.languages.some(lang => lang.containsEmpty()); }

    @override
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);
        const lifted = this.languages.length == 1 ? this.languages[0] :
            factory.Alt(this.languages[0], factory.OneOf(...this.languages.slice(1)));

        return lifted.deriv(c);
    }

    @override
    isOneOf(): this is OneOf { return true; }

    // TODO: test. Should this be reduced to Alt?
    @override
    nilOrEmpty(): RegularLanguage { return factory.OneOf(...this.languages.map(lang => lang.nilOrEmpty())); }

    @override
    toString(): string { return `(${this.languages.join(') | (')})`; }
}