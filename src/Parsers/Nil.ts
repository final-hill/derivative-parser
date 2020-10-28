/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';
import Contracts from '@final-hill/decorator-contracts';

const contracts = new Contracts(true),
    {override} = contracts;

/**
 * The Nil Parser ∅. Matches nothing.
 * ∅ = {}
 */
export default class Nil extends Parser {
    @override
    get height(): number { return 0; }

    // Dc(∅) = ∅
    @override
    // @ts-ignore: Unused variable
    deriv(c: string): Parser {
        return this;
    }

    @override
    equals(other: Parser): boolean { return other.isNil(); }

    @override
    isAtomic(): boolean { return true; }

    @override
    isNil(): this is Nil { return true; }

    // δ(∅) = ∅
    @override
    nilOrEmpty(): Nil { return this; }

    @override
    toString(): string { return '∅'; }
}