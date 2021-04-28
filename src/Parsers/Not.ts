/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';
import {override} from '@final-hill/decorator-contracts';

/**
 * The complement parser.
 * Matches anything that is not the provided parser
 */
class Not extends Parser {
    constructor(
        readonly parser: Parser
    ) { super(); }

    @override
    get height(): number { return 1 + this.parser.height; }

    @override
    containsEmpty(): boolean { return !this.parser.containsEmpty(); }

    // Dc(¬P) = ¬Dc(P)
    @override
    deriv(c: string): Parser {
        return this.parser.deriv(c).not();
    }

    @override
    equals(other: Parser): boolean {
        return other.isNot() && this.parser.equals(other.parser);
    }

    @override
    isNot(): boolean { return true; }

    // δ(¬P) = ε if δ(P) = ∅
    // δ(¬P) = ∅ if δ(P) = ε
    @override
    nilOrEmpty(): Parser {
        const nilOrEmpty = this.parser.nilOrEmpty();

        return nilOrEmpty.isNil() ? this.empty() : this.nil();
    }

    // ¬¬P → P
    @override
    simplify(): Parser {
        const lang = this.parser.simplify();

        return lang.isNot() ? lang.parser : lang.not();
    }

    @override
    toString(): string {
        return `¬${this.parser.isAtomic() ? this.parser.toString() : `(${this.parser})`}`;
    }
}

export default Not;