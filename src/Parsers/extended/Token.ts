/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Parser, height, containsEmpty, deriv, toString, nilOrEmpty, isToken, equals } from '../';

export const value = Symbol('value');

/**
 * @inheritdoc
 * "Foo"
 */
export class Token extends Parser {
    private _value: string;

    constructor(value: string) {
        super();
        if (value.length == 0)
            throw new Error('A token must be a non-empty string');
        this._value = value;
    }

    [height](): number { return 0; }

    [value](): string { return this._value; }

    [containsEmpty](): boolean { return false; }
    [deriv](c: AsciiChar): Parser {
        const d = this._value.length == 1 ? this.char(this._value as AsciiChar)[deriv](c) :
            this.char(this._value[0] as AsciiChar)[deriv](c).then(this.token(this._value.substring(1)));

        return d;
    }
    [equals](other: Parser): boolean {
        return other[isToken]() && (other as Token)._value === this._value;
    }
    [isToken](): this is Token { return true; }
    [nilOrEmpty](): Parser { return this.nil(); }
    [toString](): string { return JSON.stringify(this._value); }
}