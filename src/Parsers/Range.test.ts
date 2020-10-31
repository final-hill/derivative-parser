/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from "./";

describe('Range', () => {
    const p = new Parser(),
          digit = p.range('1','9');

    test('Range.deriv(c)', () => {
        expect(p.range('1','1').deriv('1')).toEqual(p.empty());
        expect(p.range('1','1').deriv('x')).toEqual(p.nil());
        expect(digit.deriv('x')).toEqual(p.nil());
        expect(digit.deriv('8')).toEqual(p.empty());
    });

    test('Range.isRange', () => {
        expect(digit.isRange()).toBe(true);
    });

    test('Range.matches(c)', () => {
        expect(digit.matches('2')).toBe(true);
        expect(digit.matches('x')).toBe(false);
    });

    test('Range.toString()', () => {
        expect(digit.toString()).toBe('[1-9]');
    });
});