/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {IParser, Parser} from './';
import {override} from '@final-hill/decorator-contracts';

/**
 * @inheritdoc
 * The Nil Parser ∅. Matches nothing.
 * ∅ = {}
 */
interface INil extends IParser {
    /**
     * @inheritdoc
     * Dc(∅) = ∅
     */
    deriv(c: string): Parser;
    /**
     * @inheritdoc
     * δ(∅) = ∅
     */
    nilOrEmpty(): INil;
}

class Nil extends Parser implements INil {
    @override get height(): number { return 0; }
    // @ts-ignore: Unused variable
    @override deriv(c: string): IParser { return this; }
    @override equals(other: IParser): boolean { return other.isNil(); }
    @override isAtomic(): boolean { return true; }
    @override isNil(): this is INil { return true; }
    @override nilOrEmpty(): INil { return this; }
    @override toString(): string { return '∅'; }
}

export default Nil;
export {INil};