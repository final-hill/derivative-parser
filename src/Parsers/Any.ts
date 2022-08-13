/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, equals, height, isAny, isAtomic, Parser, toString } from './';
import { override } from '@final-hill/decorator-contracts';

/**
 * @inheritdoc
 * Represents any single character. A wildcard.
 * '.'
 */
export default class Any extends Parser {
    @override get [height](): number { return 0; }
    /**
     * @override
     * @inheritdoc
     * D(.) = ε
     */
    // @ts-ignore: unused variable
    @override [deriv](c: string): Parser { return this.empty(); }
    @override [equals](other: Parser): boolean { return other[isAny](); }
    @override [isAny](): this is Any { return true; }
    @override [isAtomic](): boolean { return true; }
    @override [toString](): string { return '.'; }
}

export { Any };