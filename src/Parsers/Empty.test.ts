/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, equals, height, isAlt, isEmpty, matches, Parser, toString } from '.';

describe('Empty', () => {
    const p = new Parser();

    test('Empty[deriv](c)', () => {
        expect(p.empty()[deriv]('a')).toEqual(p.nil());
    });

    test('Empty[equals]', () => {
        expect(p.empty()[equals](p.empty())).toBe(true);
        expect(p.empty()[equals](p.nil())).toBe(false);
    });

    test('Empty[height]', () => {
        expect(p.empty()[height]).toBe(0);
    });

    test('Empty[isEmpty]', () => {
        expect(p.empty()[isEmpty]()).toBe(true);
        expect(p.empty()[isAlt]()).toBe(false);
    });

    test('Empty[matches](c)', () => {
        expect(p.empty()[matches]('')).toBe(true);
        expect(p.empty()[matches]('a')).toBe(false);
    });

    test('Empty[toString]()', () => {
        expect(p.empty()[toString]()).toBe('ε');
    });
});