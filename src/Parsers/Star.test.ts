/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {
    containsEmpty, deriv, equals, height, isStar, matches, nilOrEmpty, Parser,
    simplify, toString
} from './';

describe('Star', () => {
    const p = new Parser();

    test('Star[containsEmpty]', () => {
        expect(p.char('a').star()[containsEmpty]()).toBe(true);
    });

    test('Star[deriv](c)', () => {
        const p1 = p.char('a');
        expect(
            p1.star()[deriv]('a')
        ).toEqual(
            p1[deriv]('a').then(p1.star())
        );
    });

    test('Star[equals]', () => {
        expect(p.char('a').star()[equals](p.char('a').star())).toBe(true);
        expect(p.char('a').star()[equals](p.char('s'))).toBe(false);
    });

    test('Star[height]', () => {
        expect(p.char('a').star()[height]).toBe(1);
        expect(p.alt('a', p.alt('b', 'c')).star()[height]).toBe(3);
    });

    test('Star[isStar]', () => {
        expect(p.char('a').star()[isStar]()).toBe(true);
        expect(p.char('a')[isStar]()).toBe(false);
    });

    test('Star[matches](c)', () => {
        const p1 = p.char('a').star();
        expect(p1[matches]('')).toBe(true);
        expect(p1[matches]('a')).toBe(true);
        expect(p1[matches]('aaa')).toBe(true);
        expect(p1[matches]('b')).toBe(false);
    });

    test('Star[nilOrEmpty]', () => {
        expect(p.char('a').star()[nilOrEmpty]()).toEqual(p.empty());
    });

    test('Star[simplify]', () => {
        expect(p.nil().star()[simplify]()).toEqual(p.empty());
        expect(p.empty().star()[simplify]()).toEqual(p.empty());
        expect(p.char('a').star().star()[simplify]()).toEqual(p.char('a').star());
        expect(p.char('a').star()[simplify]()).toEqual(p.char('a').star());
    });

    test('Star[toString]()', () => {
        expect(p.char('c').star()[toString]()).toBe('\'c\'*');

        expect(
            p.nil().or(p.empty()).star()[toString]()
        ).toBe('(∅|ε)*');
    });
});