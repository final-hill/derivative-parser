/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, equals, height, isAtomic, isNil, nilOrEmpty, Parser, toString } from '..';

/**
 * @inheritdoc
 * The Nil Parser ∅. Matches nothing.
 * ∅ = {}
 */
export class Nil extends Parser {
    [height](): number { return 0; }
    /**
     * @override
     * @inheritdoc
     * Dc(∅) = ∅
     */
    // @ts-ignore: Unused variable
    [deriv](c: AsciiChar): Parser { return this; }
    [equals](other: Parser): boolean { return other[isNil](); }
    [isAtomic](): boolean { return true; }
    [isNil](): this is Nil { return true; }
    /**
     * @override
     * @inheritdoc
     * δ(∅) = ∅
     */
    [nilOrEmpty](): Nil { return this; }
    [toString](): string { return '∅'; }
}

export const NIL = new Nil();