/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';
import {override} from '@final-hill/decorator-contracts';

/**
 * Represents the Empty parser which matches the empty string
 * ε = {""}
 */
export default class Empty extends Parser {
    @override
    get height(): number { return 0; }

    @override
    containsEmpty(): boolean { return true; }

    // Dc(ε) = ∅
    @override
    // @ts-ignore: unused variable
    deriv(c: string): Parser {
        return this.nil();
    }

    @override
    equals(other: Parser): boolean {
        return other.isEmpty();
    }

    @override
    isAtomic(): boolean { return true; }

    @override
    isEmpty(): this is Empty { return true; }

    /**
     * δ(ε) = ε
     * @override
     */
    @override
    nilOrEmpty(): Empty { return this; }

    @override
    toString(): string { return 'ε'; }
}