/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {
    deriv, equals, height, isAlt, isAny, isAtomic, isCat, isChar, isEmpty,
    isNil, isNot, isRange, isRep, isStar, isToken, nilOrEmpty, Parser,
    simplify, toString
} from '.';

describe('Parser', () => {
    const p = new Parser();

    test('Parser[deriv]', () => {
        expect(p[deriv]('a')).toEqual(p.nil());
    });

    test('Parser[height]()', () => {
        expect(p[height]()).toBe(0);
    });

    test('Parser[deriv]', () => {
        expect(p[deriv]('x')).toBe(p.nil());
    });

    test('Parser[equals]', () => {
        expect(p[equals](p)).toBe(true);
        expect(p[equals](p.nil())).toBe(false);
    });

    test('Parser[is*]', () => {
        expect(p[isAlt]()).toBe(false);
        expect(p[isAny]()).toBe(false);
        expect(p[isAtomic]()).toBe(false);
        expect(p[isCat]()).toBe(false);
        expect(p[isChar]()).toBe(false);
        expect(p[isEmpty]()).toBe(false);
        expect(p[isNil]()).toBe(false);
        expect(p[isNot]()).toBe(false);
        expect(p[isRange]()).toBe(false);
        expect(p[isRep]()).toBe(false);
        expect(p[isStar]()).toBe(false);
        expect(p[isToken]()).toBe(false);
    });

    test('Parser[nilOrEmpty]', () => {
        expect(p[nilOrEmpty]()).toEqual(p.nil());
    });

    test('Parser[simplify]', () => {
        expect(p[simplify]()).toEqual(p);
    });

    test('Parser[toString]', () => {
        expect(p[toString]()).toEqual(p.nil()[toString]());
    });

    test('Parser combinators', () => {
        expect(p.alt()[isEmpty]()).toBe(true);
        expect(p.alt('a')[isChar]()).toBe(true);
        expect(p.alt(p.char('a'))[isChar]()).toBe(true);
        expect(p.alt('a', 'b')[isAlt]()).toBe(true);
        expect(p.alt('a', '', 'abc', p.char('d'))[isAlt]()).toBe(true);
        expect(p.any()[isAny]()).toBe(true);
        expect(p.cat()[isEmpty]()).toBe(true);
        expect(p.cat('a', '', 'abc', p.char('d'))[isCat]()).toBe(true);
        expect(p.cat('a')[isChar]()).toBe(true);
        expect(p.cat('a', 'b')[isCat]()).toBe(true);
        expect(p.char('a')[isChar]()).toBe(true);
        expect(p.empty()[isEmpty]()).toBe(true);
        expect(p.nil()[isNil]()).toBe(true);
        expect(p.not()[isNot]()).toBe(true);
        expect(p.opt()[toString]()).toEqual('(∅)|ε');
        expect(p.or(p.char('a'))[isAlt]()).toBe(true);
        expect(p.or('a')[isAlt]()).toBe(true);
        expect(p.or('')[isAlt]()).toBe(true);
        expect(p.or('abc')[isAlt]()).toBe(true);
        expect(p.plus()[isCat]()).toBe(true);
        expect(p.range('a', 'a')[isRange]()).toBe(true);
        expect(p.rep(2)[isRep]()).toBe(true);
        expect(p.star()[isStar]()).toBe(true);
        expect(p.then()[isCat]()).toBe(true);
        expect(p.then()[isCat]()).toBe(true);
        expect(p.then('a')[isCat]()).toBe(true);
        expect(p.then(p.char('a'))[isCat]()).toBe(true);
        expect(p.then('a', 'b')[isCat]()).toBe(true);
        expect(p.then('a', '', 'abc', p.char('d'))[isCat]()).toBe(true);
        expect(p.token('abc')[isToken]()).toBe(true);
    });
});