/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import l from '.';

describe('Nil', () => {
    test('Nil.deriv(c)', () => {
        expect(l.Nil().deriv('a')).toEqual(l.Nil());
    });
    test('Nil.matches(c)', () => {
        const lang = l.Nil();
        expect(lang.matches('')).toBe(false);
        expect(lang.matches('a')).toBe(false);
    });
    test('Nil.toString()', () => {
        expect(l.Nil().toString()).toBe('∅');
    });
});