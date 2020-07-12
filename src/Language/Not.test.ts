/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import l from '.';

describe('Not', () => {
    test('Not.deriv(c)', () => {
        expect(l.Not(l.Char('a')).deriv('a').toString()).toEqual(l.Not(l.EMPTY).toString());
        expect(l.Not(l.Char('a')).deriv('b').toString()).toEqual(l.Not(l.NIL).toString());
    });

    test('Not.equals()', () => {
        const notA = l.Not(l.Char('a')),
              notA2 = l.Not(l.Char('a')),
              notB = l.Not(l.Char('b'));

        expect(notA.equals(notA)).toEqual(true);
        expect(notA.equals(notA2)).toEqual(true);
        expect(notA.equals(notB)).toEqual(false);
        expect(notA.equals(l.Char('a'))).toEqual(false);
    });

    test('Not.matches(c)', () => {
        const lang = l.Not(l.Char('a'));

        expect(lang.matches('a')).toBe(false);
        expect(lang.matches('b')).toBe(true);
    });

    test('Not.toString()', () => {
        expect(l.Not(l.Char('a')).toString()).toBe('¬\'a\'');
        expect(l.Not(l.Alt(l.Char('a'),l.Char('b'))).toString()).toBe('¬(\'a\'|\'b\')');
    });
});