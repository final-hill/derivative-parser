/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from "./";

describe('Star', () => {
    const p = new Parser();

    test('Star.deriv(c)', () => {
        const p1 = p.char('a');
        expect(
            p1.star().deriv('a')
        ).toEqual(
            p1.deriv('a').then(p1.star())
        );
    });

    test('Star.matches(c)', () => {
        const p1 = p.char('a').star();
        expect(p1.matches('')).toBe(true);
        expect(p1.matches('a')).toBe(true);
        expect(p1.matches('aaa')).toBe(true);
        expect(p1.matches('b')).toBe(false);
    });

    test('Star.toString()', () => {
        expect(p.char('c').star().toString()).toBe('\'c\'*');

        expect(
            p.nil().or(p.empty()).star().toString()
        ).toBe('(∅|ε)*');
    });
});