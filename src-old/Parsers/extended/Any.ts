/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, equals, height, isAny, isAtomic, Parser, toString } from '..';

/**
 * @inheritdoc
 * Represents any single character. A wildcard.
 * '.'
 */
export class Any extends Parser {
    [height](): number { return 0; }

    /**
     * @override
     * @inheritdoc
     * D(.) = ε
     */
    // @ts-ignore: unused variable
    [deriv](c: AsciiChar): Parser { return this.empty(); }
    [equals](other: Parser): boolean { return other[isAny](); }
    [isAny](): this is Any { return true; }
    [isAtomic](): boolean { return true; }
    [toString](): string { return '.'; }
}

export const ANY = new Any();