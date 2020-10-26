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
 * L1,L2,...,Ln
 */
export default class Seq extends Language {
    readonly languages: Language[];

    constructor(...languages: Language[]) {
        super();
        this.languages = languages.slice();
        assert(languages.length > 0, 'Languages can not be empty');
    }

    @override
    get height(): number { return 1 + Math.max(...this.languages.map(lang => lang.height)); }

    @override
    containsEmpty(): boolean { return this.languages.some(lang => lang.containsEmpty()); }

    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);
        const lifted = this.languages.length == 1 ? this.languages[0] :
            l.Cat(this.languages[0], l.Seq(...this.languages.slice(1)));

        return lifted.deriv(c).simplify();
    }

    @override
    isSeq(): this is Seq { return true; }

    @override
    nilOrEmpty(): Language { return l.Seq(...this.languages.map(lang => lang.nilOrEmpty())); }

    @override
    toString(): string { return `(${this.languages.join(')(')})`; }
}