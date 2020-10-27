/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';

describe('Alt', () => {
    const p = new Parser();

    test('Alt.deriv(c)', () => {
        expect(
            p.char('a').or(p.char('b')).deriv('a')
        ).toEqual(
            p.char('a').deriv('a').or(p.char('b').deriv('a'))
        );
    });

    test('Alt.matches(c)', () => {
        const p1 = p.char('a').or(p.char('b'));
        expect(p1.matches('')).toBe(false);
        expect(p1.matches('a')).toBe(true);
        expect(p1.matches('b')).toBe(true);
        expect(p1.matches('c')).toBe(false);
    });

    test('Alt.toString()', () => {
        expect(
            p.empty().or(p.nil()).toString()
        ).toBe('ε|∅');
        expect(
            p.empty().or(p.nil().or(p.empty())).toString()
        ).toBe('ε|(∅|ε)');
        expect(
            p.nil().or(p.empty()).or(p.empty()).toString()
        ).toBe('(∅|ε)|ε');
    });
});