/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {IParser, Parser} from './';
import {override} from '@final-hill/decorator-contracts';

/**
 * Represents the Kleene star of the given language
 * L*
 */
interface IStar extends IParser {
    readonly parser: IParser;
    /**
     * @inheritdoc
     * Dc(L*) = Dc(L) ◦ L*
     */
    deriv(c: string): IParser;
    /**
     * @inheritdoc
     * δ(L*) = ε
     */
    nilOrEmpty(): IParser;
    /**
     * @inheritdoc
     * Ɛ* → Ɛ
     * ∅* → Ɛ
     * L** → L*
     */
    simplify(): IParser;
}

class Star extends Parser implements IStar {
    constructor(readonly parser: IParser) { super(); }

    @override get height(): number { return 1 + this.parser.height; }
    @override containsEmpty(): boolean { return true; }
    @override deriv(c: string): IParser { return this.parser.deriv(c).then(this); }
    @override equals(other: IParser): boolean {
        return other.isStar() && this.parser.equals(other.parser);
    }
    @override isStar(): this is Star { return true; }
    @override nilOrEmpty(): IParser { return this.empty(); }
    @override simplify(): IParser {
        const p = this.parser;
        if (p.isStar()) { return p; }
        if (p.isNil()) { return this.empty(); }
        // FIXME: cast required due to TypeScript 3.4.5 inference bug?
        if ((p as IParser).isEmpty()) { return this.empty(); }

        return this;
    }
    @override toString(): string {
        return this.parser.isAtomic() ? `${this.parser}*` : `(${this.parser})*`;
    }
}

export default Star;
export {IStar};