/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';

describe('Alt', () => {
    const p = new Parser();

    test('Alt.height', () => {
        const a = p.alt('a','b'),
            b = p.alt('a',p.alt('b','c'));

        expect(a.height).toBe(1);
        expect(b.height).toBe(2);
    });

    test('Alt.deriv(c)', () => {
        expect(
            p.alt('a','b').deriv('a')
        ).toEqual(
            p.char('a').deriv('a').or(p.char('b').deriv('a'))
        );
    });

    test('Alt.equals', () => {
        expect(p.alt('a','b').equals(p.alt('a','b'))).toBe(true);
        expect(p.alt('a','b').equals(p.alt('b','a'))).toBe(false);
    });

    test('Alt.isAlt', () => {
        expect(p.alt('a','b').isAlt()).toBe(true);
    });

    test('Alt.matches(c)', () => {
        const p1 = p.alt('a','b');
        expect(p1.matches('')).toBe(false);
        expect(p1.matches('a')).toBe(true);
        expect(p1.matches('b')).toBe(true);
        expect(p1.matches('c')).toBe(false);
    });

    test('Alt.nilOrEmpty', () => {
        expect(p.alt('a','b').nilOrEmpty()).toEqual(p.nil().or(p.nil()));
        expect(p.alt(p.nil(),'').nilOrEmpty()).toEqual(p.nil().or(''));
    });

    test('Alt.simplify', () => {
        expect(p.alt('a','a').simplify()).toEqual(p.char('a'));
        expect(p.alt(p.nil(),'a').simplify()).toEqual(p.char('a'));
        expect(p.alt('a',p.nil()).simplify()).toEqual(p.char('a'));
        expect(p.alt(p.alt('a','b'),'c').simplify()).toEqual(p.alt('a',p.alt('b','c')));
        expect(p.alt(p.cat('a','b'),'c').simplify()).toEqual(p.alt('c',p.cat('a','b')));
    });

    test('Alt.toString()', () => {
        expect(
            p.alt('',p.nil()).toString()
        ).toBe('ε|∅');
        expect(
            p.alt('',p.alt(p.nil(),'')).toString()
        ).toBe('ε|(∅|ε)');
        expect(
            p.alt(p.nil(),'','').toString()
        ).toBe('(∅|ε)|ε');
    });
});