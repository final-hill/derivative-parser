/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from "./";

describe('Cat', () => {
    const p = new Parser();
    test('Cat.deriv(c)', () => {
        const p1 = p.char('a').or(p.empty()),
              p2 = p.char('b');
        expect(
            p1.then(p2).deriv('a')
        ).toEqual(
            p1.deriv('a').then(p2)
            .or(
                p1.nilOrEmpty().then(p2.deriv('a'))
            )
        );
    });

    test('Cat.matches(c)', () => {
        const p1 = p.char('a').then(p.char('b'));
        expect(p1.matches('')).toBe(false);
        expect(p1.matches('a')).toBe(false);
        expect(p1.matches('b')).toBe(false);
        expect(p1.matches('ab')).toBe(true);
        expect(p1.matches('ba')).toBe(false);
    });

    test('Cat.toString()', () => {
        expect(
            p.empty().then(p.nil()).toString()
        ).toBe('ε∅');
        expect(
            p.empty().then(p.nil().then(p.empty())).toString()
        ).toBe('ε(∅ε)');
        expect(
            p.nil().then(p.empty()).then(p.empty()).toString()
        ).toBe('(∅ε)ε');
    });
});