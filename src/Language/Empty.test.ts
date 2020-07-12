/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import l from '.';

describe('Empty', () => {
    test('Empty.deriv(c)', () => {
        expect(l.Empty().deriv('a')).toEqual(l.Nil());
    });

    test('Empty.matches(c)', () => {
        const lang = l.Empty();
        expect(lang.matches('')).toBe(true);
        expect(lang.matches('a')).toBe(false);
    });

    test('Empty.toString()', () => {
        expect(l.Empty().toString()).toBe('ε');
    });
});