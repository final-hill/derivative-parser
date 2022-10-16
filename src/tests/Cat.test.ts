/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, equals, height, isCat, matches, nilOrEmpty, Parser, simplify, toString } from '../Parsers';

describe('Cat', () => {
    const p = new Parser();

    test('Cat[deriv](c)', () => {
        const p1 = p.cat('a', ''),
            p2 = p.char('b');
        expect(
            p1.then(p2)[deriv]('a')
        ).toEqual(
            p1[deriv]('a').then(p2)
                .or(
                    p1[nilOrEmpty]().then(p2[deriv]('a'))
                )
        );
    });

    test('Cat[equals]', () => {
        expect(p.cat('a', 'b')[equals](p.cat('a', 'b'))).toBe(true);
        expect(p.cat('a', 'b')[equals](p.cat('b', 'a'))).toBe(false);
    });

    test('Cat[height]', () => {
        expect(p.cat('a', 'b')[height]).toBe(1);
        expect(p.cat('a', p.cat('b', 'c'))[height]).toBe(2);
    });

    test('Cat[isCat]', () => {
        expect(p.cat('a', 'b')[isCat]()).toBe(true);
    });

    test('Cat[matches](c)', () => {
        const p1 = p.cat('a', 'b');
        expect(p1[matches]('')).toBe(false);
        expect(p1[matches]('a')).toBe(false);
        expect(p1[matches]('b')).toBe(false);
        expect(p1[matches]('ab')).toBe(true);
        expect(p1[matches]('ba')).toBe(false);
    });

    test('Cat[simplify]', () => {
        expect(p.cat('', 'a')[simplify]()).toEqual(p.char('a'));
        expect(p.cat('b', '')[simplify]()).toEqual(p.char('b'));
        expect(p.cat(p.nil(), 'a')[simplify]()).toEqual(p.nil());
        expect(p.cat('b', p.nil())[simplify]()).toEqual(p.nil());
    });

    test('Cat[toString]()', () => {
        expect(
            p.cat('', p.nil())[toString]()
        ).toBe('ε∅');
        expect(
            p.cat('', p.nil().then(''))[toString]()
        ).toBe('ε(∅ε)');
        expect(
            p.cat(p.nil(), '', '')[toString]()
        ).toBe('(∅ε)ε');
    });
});