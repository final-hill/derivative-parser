/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';
import {assert, override} from '@final-hill/decorator-contracts';
import {MSG_CHAR_EXPECTED} from '../Messages';

/**
 * Represents the parser of a single character
 * c = {...,'a','b',...}
 * @throws Throws an error if the provided string is not length == 1
 */
export default class Char extends Parser {
    constructor(readonly value: string){
        super();
        assert(typeof value == 'string' && value.length == 1, MSG_CHAR_EXPECTED);
    }

    @override
    get height(): number { return 0; }

    // Dc(c) = ε
    // Dc(c') = ∅
    @override
    deriv(c: string): Parser {
        return c === this.value ? this.empty() : this.nil();
    }

    @override
    equals(other: Parser): boolean {
        return other.isChar() && this.value === other.value;
    }

    @override
    isAtomic(): boolean { return true; }

    @override
    isChar(): this is Char { return true; }

    /**
     * δ(c) = ∅
     * @override
     */
    @override
    nilOrEmpty(): Parser { return this.nil(); }

    @override
    toString(): string { return `'${this.value}'`; }
}