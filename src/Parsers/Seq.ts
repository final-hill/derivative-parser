/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';
import Contracts from '@final-hill/decorator-contracts';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * L1,L2,...,Ln
 */
export default class Seq extends Parser {
    readonly languages: Parser[];

    constructor(...languages: Parser[]) {
        super();
        this.languages = languages.slice();
        assert(languages.length > 0, 'Languages can not be empty');
    }

    @override
    get height(): number { return 1 + Math.max(...this.languages.map(lang => lang.height)); }

    @override
    containsEmpty(): boolean { return this.languages.some(lang => lang.containsEmpty()); }

    @override
    deriv(c: string): Parser {
        const lifted = this.languages.length == 1 ? this.languages[0] :
            this.languages[0].then(this.seq(...this.languages.slice(1)));

        return lifted.deriv(c).simplify();
    }

    @override
    isSeq(): this is Seq { return true; }

    @override
    nilOrEmpty(): Parser { return this.seq(...this.languages.map(lang => lang.nilOrEmpty())); }

    @override
    toString(): string { return `(${this.languages.join(')(')})`; }
}