/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Parser } from '../Parsers';
import Grammar from '../Grammar';

describe('BalancedParensGrammar', () => {
    class BalancedParensGrammar extends Grammar {
        S(): Parser {
            return this.cat(this.S(),'(',this.S(),')').or('');
        }
    }

    const b = new BalancedParensGrammar();

    test('Recursive definition', () => {
        expect(b.S()).toBeDefined();
    });
/*
    test('balanced', () => {
        expect(b.matches('')).toBe(true);
        expect(b.matches('()')).toBe(true);
        expect(b.matches('(())')).toBe(true);
        expect(b.matches('()()()')).toBe(true);
    });

    test('unbalanced', () => {
        expect(b.matches('(')).toBe(false);
        expect(b.matches(')')).toBe(false);
        expect(b.matches('(((()))')).toBe(false);
    });
    */
});