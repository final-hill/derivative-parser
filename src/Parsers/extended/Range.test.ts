/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, equals, isRange, matches, nilOrEmpty, Parser, toString } from '..';
import { from, to } from './Range';

describe('Range', () => {
    const p = new Parser(),
        digit = p.range('1', '9'),
        d = p.range('d', 'd');

    test('Range[ctor]', () => {
        expect(digit).toEqual(p.range('1', '9'));
        expect(d).toEqual(p.range('d', 'd'));
    });

    test('Bad Range[ctor]', () => {
        expect(() => p.range('9', '1')).toThrow();
        expect(() => p.range('d', 'a')).toThrow();
    });

    test('Range[from]', () => {
        expect(digit[from]()).toBe('1');
        expect(d[from]()).toBe('d');
    });

    test('Range[to]', () => {
        expect(digit[to]()).toBe('9');
        expect(d[to]()).toBe('d');
    });

    test('Range[equals]', () => {
        expect(digit[equals](p.range('1', '9'))).toBe(true);
        expect(digit[equals](p.range('1', '8'))).toBe(false);
    });

    test('Range[deriv](c)', () => {
        expect(p.range('1', '1')[deriv]('1')).toEqual(p.empty());
        expect(p.range('1', '1')[deriv]('x')).toEqual(p.nil());
        expect(digit[deriv]('x')).toEqual(p.nil());
        expect(digit[deriv]('8')).toEqual(p.empty());
    });

    test('Range[isRange]', () => {
        expect(digit[isRange]()).toBe(true);
    });

    test('Range[matches](c)', () => {
        expect(digit[matches]('2')).toBe(true);
        expect(digit[matches]('x')).toBe(false);
    });

    test('Range[nilOrEmpty]', () => {
        expect(digit[nilOrEmpty]()).toEqual(p.nil());
    });

    test('Range[toString]()', () => {
        expect(digit[toString]()).toBe('[1-9]');
        expect(d[toString]()).toBe('[d-d]');
    });
});