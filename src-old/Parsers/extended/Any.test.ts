/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, equals, height, isAny, isAtomic, matches, Parser, toString } from '..';

describe('Any tests', () => {
    const p = new Parser();

    test('Any[height]()', () => {
        expect(p.any()[height]()).toBe(0);
    });

    test('Any[deriv](c)', () => {
        expect(p.any()[deriv]('a')).toEqual(p.empty());
        expect(p.any()[deriv]('c')).toEqual(p.empty());
        expect(p.any()[deriv](' ')).toEqual(p.empty());
    });

    test('Any[equals]()', () => {
        expect(p.any()[equals](p.any())).toBe(true);
        expect(p.any()[equals](p.char('a'))).toBe(false);
    });

    test('Any[isAny]()', () => {
        expect(p.any()[isAny]()).toBe(true);
    });

    test('Any[isAtomic]', () => {
        expect(p.any()[isAtomic]()).toBe(true);
    });

    test('Any[matches](c)', () => {
        expect(p.any()[matches]('a')).toBe(true);
        expect(p.any()[matches]('c')).toBe(true);
        expect(p.any()[matches](' ')).toBe(true);
        expect(p.any()[matches]('ab')).toBe(false);
        expect(p.any()[matches]('')).toBe(false);
    });

    test('Any[toString]()', () => {
        expect(p.any()[toString]()).toBe('.');
    });
});