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
 * L1 | L2 | ... | Ln
 */
export default class OneOf extends Language {
    readonly languages: Language[];

    constructor(...languages: Language[]) {
        super(1 + Math.max(...languages.map(lang => lang.height)));
        assert(languages.length > 0, 'Languages can not be empty');
        this.languages = languages.slice();
    }

    @override
    containsEmpty(): boolean { return this.languages.some(lang => lang.containsEmpty()); }

    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);
        const lifted = this.languages.length == 1 ? this.languages[0] :
            l.Alt(this.languages[0], l.OneOf(...this.languages.slice(1)));

        return lifted.deriv(c).simplify();
    }

    @override
    isOneOf(): this is OneOf { return true; }

    // TODO: test. Should this be reduced to Alt?
    @override
    nilOrEmpty(): Language { return l.OneOf(...this.languages.map(lang => lang.nilOrEmpty())); }

    @override
    toString(): string {
        return `(${
            this.languages.map(
                l => l.isAtomic() ? l.toString() : `(${l.toString()})`
            ).join(' | ')
        })`;
    }
}