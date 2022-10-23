/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, equals, height, isRep, matches, nilOrEmpty, Parser, toString } from '..';

describe('Rep', () => {
    const p = new Parser(),
        c = p.char('a');

    test('Rep[deriv](c)', () => {
        expect(c.rep(1)[deriv]('a')).toEqual(p.empty());
        expect(c.rep(0)[deriv]('a')).toEqual(p.nil());
    });

    test('Rep[equals]', () => {
        const q = c.rep(2),
            r = c.rep(3);
        expect(q[equals](q)).toBe(true);
        expect(q[equals](c.rep(2))).toBe(true);
        expect(q[equals](r)).toBe(false);
    });

    test('Rep[height]()', () => {
        expect(c.rep(2)[height]()).toBe(1);
        expect(p.alt('a', 'b').rep(5)[height]()).toBe(2);
    });

    test('Rep[isRep]', () => {
        expect(c.rep(0)[isRep]()).toBe(true);
        expect(c.rep(1)[isRep]()).toBe(true);
    });

    test('Rep[matches](c)', () => {
        expect(c.rep(0)[matches]('')).toBe(true);
        expect(c.rep(2)[matches]('aa')).toBe(true);
        expect(c.rep(2)[matches]('a')).toBe(false);
        expect(c.rep(2)[matches]('aaa')).toBe(false);
    });

    test('Rep[nilOrEmpty]()', () => {
        expect(c.rep(2)[nilOrEmpty]()).toEqual(p.nil());
        expect(p.empty().rep(2)[nilOrEmpty]()).toEqual(p.empty());
        expect(p.nil().rep(0)[nilOrEmpty]()).toEqual(p.nil());
    });

    test('Rep[toString]()', () => {
        expect(c.rep(2)[toString]()).toBe('\'a\'{2}');
        expect(c.rep(0)[toString]()).toBe('\'a\'{0}');
    });
});