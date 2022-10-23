/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { matches } from '../Parsers';
import { BalancedParensGrammar } from './BalancedParensGrammar';

describe('BalancedParensGrammar', () => {
    const b = new BalancedParensGrammar();

    test('Recursive definition', () => {
        expect(b.S()).toBeDefined();
    });
    test('balanced', () => {
        expect(b[matches]('')).toBe(true);
        expect(b[matches]('()')).toBe(true);
        /*
        expect(b.matches('(())')).toBe(true);
        expect(b.matches('()()()')).toBe(true);
        */
    });

    /*
    test('unbalanced', () => {
        expect(b.matches('(')).toBe(false);
        expect(b.matches(')')).toBe(false);
        expect(b.matches('(((()))')).toBe(false);
    });
    */
});