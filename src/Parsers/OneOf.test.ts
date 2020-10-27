/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from "./";

describe('OneOf', () => {
    const p = new Parser();

    test('OneOf.deriv(c)', () => {
        const p1 = p.oneOf('a', 'b', 'c');

        expect(p1.deriv('a').toString()).toEqual("'b'|'c'");
        expect(p1.deriv('b').toString()).toEqual("'a'|'c'");

        expect(() => p1.deriv('')).toThrow();
    });

    test('OneOf.matches(c)', () => {
        const p1 = p.oneOf('a', 'b', 'c');

        expect(p1.matches('a')).toBe(true);
        expect(p1.matches('b')).toBe(true);
        expect(p1.matches('c')).toBe(true);
        expect(p1.matches('d')).toBe(false);
        expect(p1.matches('')).toBe(false);
    });

    test('OneOf.toString()', () => {
        const p1 = p.oneOf('a', 'b', 'c');

        expect(p1.toString()).toBe(`('a'|'b'|'c')`);
    });
});