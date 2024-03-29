/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, height, matches, Parser, toString } from '..';

describe('Nil', () => {
    const p = new Parser();

    test('Nil[height]()', () => {
        expect(p.nil()[height]()).toBe(0);
    });

    test('Nil.deriv(c)', () => {
        expect(p.nil()[deriv]('a')).toEqual(p.nil());
    });
    test('Nil.matches(c)', () => {
        expect(p.nil()[matches]('')).toBe(false);
        expect(p.nil()[matches]('a')).toBe(false);
    });
    test('Nil[toString]()', () => {
        expect(p.nil()[toString]()).toBe('∅');
    });
});