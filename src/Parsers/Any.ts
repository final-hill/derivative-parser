/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {deriv, equals, height, IParser, isAny, isAtomic, Parser, toString} from './';
import {override} from '@final-hill/decorator-contracts';

/**
 * @inheritdoc
 *  * Represents any single character. A wildcard.
 * '.'
 */
interface IAny extends IParser {
    /**
     * @inheritdoc
     * D(.) = ε
     */
    [deriv](c: string): IParser;
}

class Any extends Parser implements IAny {
    @override get [height](): number { return 0; }
    // @ts-ignore: unused variable
    @override [deriv](c: string): IParser { return this.empty(); }
    @override [equals](other: IParser): boolean { return other[isAny](); }
    @override [isAny](): this is IAny { return true; }
    @override [isAtomic](): boolean { return true; }
    @override [toString](): string { return '.'; }
}

export {IAny};
export default Any;