/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {override} from '@final-hill/decorator-contracts';
import {Parser, IParser, simplify, deriv, containsEmpty, height, equals, isAlt, nilOrEmpty, isAtomic, isNil, toString} from './';

/**
 * @inheritdoc
 * Represents the union of two parsers
 * P1 ∪ P2
 */
interface IAlt extends IParser {
    readonly left: IParser;
    readonly right: IParser;
    /**
     * @inheritdoc
     * δ(L1 | L2) = δ(L1) | δ(L2)
     */
    [containsEmpty](): boolean;
    /**
     * @inheritdoc
     * Dc(L1 ∪ L2) = Dc(L1) ∪ Dc(L2)
     */
    [deriv](c: string): IParser;
    /**
     * @inheritdoc
     * L ∪ L → L
     * M ∪ L → L ∪ M
     * ∅ ∪ L → L
     * L ∪ ∅ → L
     * (L ∪ M) ∪ N → L ∪ (M ∪ N)
     */
    [simplify](): IParser;
}

class Alt extends Parser implements IAlt {
    constructor(readonly left: IParser, readonly right: IParser) { super(); }

    @override get [height](): number {
        return 1 + Math.max(this.left[height], this.right[height]);
    }
    @override [containsEmpty](): boolean {
        return this.left[containsEmpty]() || this.right[containsEmpty]();
    }
    @override [deriv](c: string): IParser {
        return this.left[deriv](c).or(this.right[deriv](c));
    }
    @override [equals](other: IParser): boolean {
        return other[isAlt]() &&
            this.left[equals]((other as IAlt).left) &&
            this.right[equals]((other as IAlt).right);
    }
    @override [isAlt](): this is IAlt { return true; }
    @override [nilOrEmpty](): IParser {
        return this.left[nilOrEmpty]().or(this.right[nilOrEmpty]());
    }
    @override simplify(): IParser {
        let left = this.left[simplify](),
            right = this.right[simplify]();

        if(left[isAlt]()) {
            [left,right] = [(left as IAlt).left, new Alt((left as IAlt).right, right)];
        }

        if(left[height] > right[height]) {
            [left, right] = [right, left];
        }

        if(left[equals](right)) {
             return left;
        } else if(left[isNil]()){
            return right;
        } else if(right[isNil]()){
            return left;
        }

        return new Alt(left, right);
    }
    @override [toString](): string {
        const leftString = this.left[isAtomic]() ? `${this.left}` : `(${this.left})`,
              rightString = this.right[isAtomic]() ? `${this.right}` : `(${this.right})`;

        return `${leftString}|${rightString}`;
    }
}

export default Alt;
export {IAlt};