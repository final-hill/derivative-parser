/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { containsEmpty, deriv, equals, height, isAtomic, isEmpty, nilOrEmpty, Parser, toString } from '..';

/**
 * @inheritdoc
 * Represents the Empty parser which matches the empty string
 * ε = {""}
 */
export class Empty extends Parser {
    [height](): number { return 0; }
    [containsEmpty](): boolean { return true; }

    /**
     * @override
     * @inheritdoc
     * Dc(ε) = ∅
     */
    // @ts-ignore: unused variable
    [deriv](c: AsciiChar): Parser { return this.nil(); }
    [equals](other: Parser): boolean { return other[isEmpty](); }
    [isAtomic](): boolean { return true; }
    [isEmpty](): this is Empty { return true; }

    /**
     * @override
     * @inheritdoc
     * δ(ε) = ε
     */
    [nilOrEmpty](): Empty { return this; }
    [toString](): string { return 'ε'; }
}

export const EMPTY = new Empty();