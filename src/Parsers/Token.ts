/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Parser, height, containsEmpty, deriv, toString, nilOrEmpty, isToken } from './';
import { Contract, Contracted, extend, invariant, override } from '@final-hill/decorator-contracts';
import { parserContract } from './Parser';

const tokenContract = new Contract<Token>({
    [extend]: parserContract,
    [invariant](self) {
        return self.value.length > 0;
    }
});

/**
 * @inheritdoc
 * "Foo"
 */
@Contracted(tokenContract)
export default class Token extends Parser {
    #value: string;

    constructor(value: string) {
        super();
        this.#value = value;
    }

    @override get [height](): number { return 0; }

    get value(): string { return this.#value; }

    @override [containsEmpty](): boolean { return false; }
    @override [deriv](c: string): Parser {
        const d = this.value.length == 1 ? this.char(this.value)[deriv](c) :
            this.char(this.value[0])[deriv](c).then(this.token(this.value.substring(1)));

        return d;
    }
    @override [isToken](): this is Token { return true; }
    @override [nilOrEmpty](): Parser { return this.nil(); }
    @override [toString](): string { return JSON.stringify(this.value); }
}

export { Token };