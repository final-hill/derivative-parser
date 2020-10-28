/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */
import {Parser} from './';
import Contracts from '@final-hill/decorator-contracts';
import {MSG_NON_EMPTY} from '../Messages';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: Contracts['assert'] = contracts.assert;

/*
 * "Foo"
 */
export default class Token extends Parser {
    constructor(readonly value: string) {
        super();
        assert(typeof value == 'string' && value.length > 0, MSG_NON_EMPTY);
    }

    @override
    get height(): number { return 0; }

    @override
    containsEmpty(): boolean { return false; }

    @override
    deriv(c: string): Parser {
        const transform = this.value.length == 1 ? this.char(this.value) :
            this.char(this.value[0]).then(this.token(this.value.substring(1)));

        return transform.deriv(c);
    }

    @override
    isToken(): this is Token { return true; }

    @override
    nilOrEmpty(): Parser { return this.nil(); }

    @override
    toString(): string { return JSON.stringify(this.value); }
}