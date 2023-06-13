/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser, IParser, containsEmpty, deriv, simplify, height,
    nilOrEmpty, isEmpty, isNil, toString, isAtomic, equals, isCat, INil, IEmpty} from './';
import {override} from '@final-hill/decorator-contracts';

/**
 * @inheritdoc
 * Represents the concatenation of two parsers
 * P1 ◦ P2
 */
interface ICat extends IParser {
    readonly first: IParser;
    readonly second: IParser;
    /**
     * @inheritdoc
     * δ(P1◦P2) = δ(P1)◦δ(P2)
     */
    [containsEmpty](): boolean;
    /**
     * @inheritdoc
     * Dc(P1◦P2) = (Dc(P1)◦P2) ∪ (δ(P1)◦Dc(P2))
     */
    [deriv](c: string): IParser;
    /**
     * @inheritdoc
     * PƐ → ƐP → P
     * ∅P → P∅ → ∅
     * Unused: (PQ)R → P(QR)
     * Unused: P(Q ∪ R) → PQ ∪ PR  (Is this actually simpler? Maybe the other direction?)
     * Unused: (Q ∪ R)P → QP ∪ RP  (Is this actually simpler? Maybe the other direction?)
     */
    [simplify](): IParser;
}

class Cat extends Parser implements ICat {
    constructor(readonly first: IParser, readonly second: IParser){ super(); }

    @override get [height](): number {
        return 1 + Math.max(this.first[height], this.second[height]);
    }
    @override [containsEmpty](): boolean {
        return this.first[containsEmpty]() && this.second[containsEmpty]();
    }
    @override [deriv](c: string): IParser {
        const [f,s] = [this.first,this.second];

        return f[deriv](c).then(s).or(f[nilOrEmpty]().then(s[deriv](c)));
    }
    @override [equals](other: IParser): boolean {
        return other[isCat]() &&
            this.first[equals]((other as ICat).first) &&
            this.second[equals]((other as ICat).second);
    }
    @override [isCat](): this is ICat { return true; }

    @override [nilOrEmpty](): INil | IEmpty {
        return this.first[nilOrEmpty]().then(this.second[nilOrEmpty]());
    }
    @override simplify(): IParser {
        const fst = this.first[simplify](),
              snd = this.second[simplify]();

        return fst[isEmpty]() ? snd :
               snd[isEmpty]() ? fst :
               // TODO: TypeScript inference bug <https://github.com/microsoft/TypeScript/issues/36887>
               (fst as IParser)[isNil]() ? fst :
               (snd as IParser)[isNil]() ? snd :
               this;
    }
    @override [toString](): string {
        const fst = this.first[isAtomic]() ? `${this.first}` : `(${this.first})`,
              snd = this.second[isAtomic]() ? `${this.second}` : `(${this.second})`;

        return `${fst}${snd}`;
    }
}

export default Cat;
export {ICat};