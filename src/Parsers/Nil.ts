/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, equals, height, isAtomic, isNil, nilOrEmpty, Parser, toString } from './';
import { override } from '@final-hill/decorator-contracts';

/**
 * @inheritdoc
 * The Nil Parser ∅. Matches nothing.
 * ∅ = {}
 */
export default class Nil extends Parser {
    @override get [height](): number { return 0; }
    /**
     * @override
     * @inheritdoc
     * Dc(∅) = ∅
     */
    // @ts-ignore: Unused variable
    @override [deriv](c: string): Parser { return this; }
    @override [equals](other: Parser): boolean { return other[isNil](); }
    @override [isAtomic](): boolean { return true; }
    @override [isNil](): this is Nil { return true; }
    /**
     * @override
     * @inheritdoc
     * δ(∅) = ∅
     */
    @override [nilOrEmpty](): Nil { return this; }
    @override [toString](): string { return '∅'; }
}

export { Nil };