/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */
import RegularLanguage from './RegularLanguage';
import Contracts from '@final-hill/decorator-contracts';
import {MSG_CHAR_EXPECTED, MSG_NON_EMPTY} from '../Messages';
import factory from '.';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: Contracts['assert'] = contracts.assert;

/*
 * "Foo"
 */
export default class Token extends RegularLanguage {
    constructor(readonly value: string) {
        super(0);
        assert(typeof value == 'string' && value.length > 0, MSG_NON_EMPTY);
    }

    @override
    containsEmpty(): boolean { return false; }

    @override
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);
        const transform = this.value.length == 1 ? factory.Char(this.value) :
            factory.Cat(factory.Char(this.value[0]), factory.Token(this.value.substring(1)));

        return transform.deriv(c);
    }

    @override
    isToken(): this is Token { return true; }

    @override
    nilOrEmpty(): RegularLanguage { return factory.Nil(); }

    @override
    toString(): string { return JSON.stringify(this.value); }
}