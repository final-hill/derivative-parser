/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Parser } from "../Parsers";
import Grammar from "../Grammar";

describe('PropositionalLogicGrammar', () => {
    const p = new Parser();
    class PropositionalLogicGrammar extends Grammar {
        Sentence(): Parser {
            return p.alt(
                this.Atomic(),
                this.Complex()
            );
        }
        Atomic(): Parser {
            return p.range('P','Z');
        }
        Complex(): Parser {
            return p.alt(
                p.cat('(',this.Sentence(),')'),
                p.cat(this.Sentence(),this.Connective(),this.Sentence()),
                p.cat('~',this.Sentence())
            );
        }
        Connective(): Parser {
            return p.alt(
                '∧', '∨', '→', '⟺'
            );
        }
        // TODO: Whitespace
    }

    const g = new PropositionalLogicGrammar();

    test('Recursive definition', () => {
        expect(g.Sentence()).toBeDefined();
    });
});