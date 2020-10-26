/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */
import Language from './Language';
import Contracts from '@final-hill/decorator-contracts';
import {MSG_CHAR_EXPECTED, MSG_NON_EMPTY} from '../Messages';
import l from '.';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: Contracts['assert'] = contracts.assert;

/*
 * "Foo"
 */
export default class Token extends Language {
    constructor(readonly value: string) {
        super();
        assert(typeof value == 'string' && value.length > 0, MSG_NON_EMPTY);
    }

    @override
    get height(): number { return 0; }

    @override
    containsEmpty(): boolean { return false; }

    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);
        const transform = this.value.length == 1 ? l.Char(this.value) :
            l.Cat(l.Char(this.value[0]), l.Token(this.value.substring(1)));

        return transform.deriv(c).simplify();
    }

    @override
    isToken(): this is Token { return true; }

    @override
    nilOrEmpty(): Language { return l.Nil(); }

    @override
    toString(): string { return JSON.stringify(this.value); }
}