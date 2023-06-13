/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {containsEmpty, deriv, equals, height, IEmpty, INil, IParser, isAtomic, isNil, isNot, nilOrEmpty, Parser, simplify, toString} from './';
import {override} from '@final-hill/decorator-contracts';

/**
 * The complement parser.
 * Matches anything that is not the provided parser
 */
interface INot extends IParser {
    readonly parser: IParser;
    /**
     * @inheritdoc
     * Dc(¬P) = ¬Dc(P)
     */
    [deriv](c: string): IParser;
    /**
     * @inheritdoc
     * δ(¬P) = ε if δ(P) = ∅
     * δ(¬P) = ∅ if δ(P) = ε
     */
    [nilOrEmpty](): IParser;
    /**
     * @inheritdoc
     * ¬¬P → P
     */
    [simplify](): IParser;
}

class Not extends Parser implements INot {
    constructor(readonly parser: IParser) { super(); }
    @override get [height](): number { return 1 + this.parser[height]; }
    @override [containsEmpty](): boolean { return !this.parser[containsEmpty](); }
    @override [deriv](c: string): IParser { return this.parser[deriv](c).not(); }
    @override [equals](other: IParser): boolean {
        return other[isNot]() && this.parser[equals]((other as INot).parser);
    }
    @override [isNot](): boolean { return true; }
    @override [nilOrEmpty](): INil | IEmpty {
        const ne = this.parser[nilOrEmpty]();

        return ne[isNil]() ? this.empty() : this.nil();
    }
    @override [simplify](): IParser {
        const lang = this.parser[simplify]();

        return lang[isNot]() ? (lang as INot).parser : lang.not();
    }
    @override toString(): string {
        return `¬${this.parser[isAtomic]() ? this.parser[toString]() : `(${this.parser})`}`;
    }
}

export default Not;
export {INot};