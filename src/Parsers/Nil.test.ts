/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {deriv, matches, Parser, toString} from './';

describe('Nil', () => {
    const p = new Parser();

    test('Nil.deriv(c)', () => {
        expect(p.nil()[deriv]('a')).toEqual(p.nil());
    });
    test('Nil.matches(c)', () => {
        expect(p.nil()[matches]('')).toBe(false);
        expect(p.nil()[matches]('a')).toBe(false);
    });
    test('Nil.toString()', () => {
        expect(p.nil()[toString]()).toBe('∅');
    });
});