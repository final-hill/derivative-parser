/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, equals, height, isAtomic, isChar, nilOrEmpty, Parser, toString } from './';
import { override, invariant, Contract, Contracted, extend } from '@final-hill/decorator-contracts';
import { parserContract } from './Parser';

const charContract = new Contract<Char>({
    [extend]: parserContract,
    [invariant](self) { return self.value.length == 1; }
});

/**
 * @inheritdoc
 * Represents the parser of a single character
 * c = {...,'a','b',...}
 * @throws Throws an error if the provided string is not length == 1
 * @example new Char('a')
 */
@Contracted(charContract)
export default class Char extends Parser {
    #value: string;
    constructor(value: string) { super(); this.#value = value; }
    @override get [height](): number { return 0; }
    /**
     * The character value of the parser. Has a length of 1
     */
    get value(): string { return this.#value; }
    /**
     * @override
     * @inheritdoc
     * Dc(c) = ε
     * Dc(c') = ∅
     */
    @override [deriv](c: string): Parser { return c === this.value ? this.empty() : this.nil(); }
    @override [equals](other: Parser): boolean { return other[isChar]() && this.value === (other as Char).value; }
    @override [isAtomic](): boolean { return true; }
    @override [isChar](): this is Char { return true; }
    /**
     * @override
     * @inheritdoc
     * δ(c) = ∅
     */
    @override [nilOrEmpty](): Parser { return this.nil(); }
    @override [toString](): string { return `'${this.value}'`; }
}

export { Char };