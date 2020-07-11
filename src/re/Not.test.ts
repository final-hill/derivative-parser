/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import re from '.';

describe('Not', () => {
    test('Not.deriv(c)', () => {
        expect(re.Not(re.Char('a')).deriv('a').toString()).toEqual(re.Not(re.EMPTY).toString());
        expect(re.Not(re.Char('a')).deriv('b').toString()).toEqual(re.Not(re.NIL).toString());
    });

    test('Not.equals()', () => {
        const notA = re.Not(re.Char('a')),
              notA2 = re.Not(re.Char('a')),
              notB = re.Not(re.Char('b'));

        expect(notA.equals(notA)).toEqual(true);
        expect(notA.equals(notA2)).toEqual(true);
        expect(notA.equals(notB)).toEqual(false);
        expect(notA.equals(re.Char('a'))).toEqual(false);
    });

    test('Not.matches(c)', () => {
        const l = re.Not(re.Char('a'));

        expect(l.matches('a')).toBe(false);
        expect(l.matches('b')).toBe(true);
    });

    test('Not.toString()', () => {
        expect(re.Not(re.Char('a')).toString()).toBe('¬\'a\'');
        expect(re.Not(re.Alt(re.Char('a'),re.Char('b'))).toString()).toBe('¬(\'a\'|\'b\')');
    });
});