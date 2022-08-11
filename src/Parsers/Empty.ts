/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {containsEmpty, deriv, equals, height, IParser, isAtomic, isEmpty, nilOrEmpty, Parser, toString} from './';
import {override} from '@final-hill/decorator-contracts';

/**
 * @inheritdoc
 * Represents the Empty parser which matches the empty string
 * ε = {""}
 */
interface IEmpty extends IParser {
    /**
     * @inheritdoc
     * Dc(ε) = ∅
     */
    [deriv](c: string): IParser;
    /**
     * @inheritdoc
     * δ(ε) = ε
     * @override
     */
    [nilOrEmpty](): IEmpty;
}

class Empty extends Parser implements IEmpty {
    @override get [height](): number { return 0; }
    @override [containsEmpty](): boolean { return true; }
    // @ts-ignore: unused variable
    @override [deriv](c: string): IParser { return this.nil(); }
    @override [equals](other: IParser): boolean { return other[isEmpty](); }
    @override [isAtomic](): boolean { return true; }
    @override [isEmpty](): this is IEmpty { return true; }
    @override [nilOrEmpty](): IEmpty { return this; }
    @override [toString](): string { return 'ε'; }
}

export default Empty;
export {IEmpty};