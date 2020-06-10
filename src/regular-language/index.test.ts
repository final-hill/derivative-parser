/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import re from './';
import { MSG_CHAR_EXPECTED } from './Char';

describe('Every expression should have a string representation', () => {
    test('Nil', () => {
        expect(re.Nil().toString()).toBe('∅');
    });
    test('Empty', () => {
        expect(re.Empty().toString()).toBe('ε');
    });
    test('Alt', () => {
        expect(re.Alt(re.Empty(),re.Nil()).toString()).toBe('ε|∅');
        expect(re.Alt(
            re.Empty(),
            re.Alt(
                re.Nil(),
                re.Empty()
            )
        ).toString()).toBe('ε|(∅|ε)');
        expect(re.Alt(
            re.Alt(
                re.Nil(),
                re.Empty()
            ),
            re.Empty()
        ).toString()).toBe('(∅|ε)|ε');
    });
    test('Cat', () => {
        expect(re.Cat(re.Empty(),re.Nil()).toString()).toBe('ε∅');
        expect(re.Cat(
            re.Empty(),
            re.Cat(
                re.Nil(),
                re.Empty()
            )
        ).toString()).toBe('ε(∅ε)');
        expect(re.Cat(
            re.Cat(
                re.Nil(),
                re.Empty()
            ),
            re.Empty()
        ).toString()).toBe('(∅ε)ε');
    });
    test('Char', () => {
        expect(re.Char('a').toString()).toBe('\'a\'');
        expect(() => re.Char('abc')).toThrow(MSG_CHAR_EXPECTED);
    });
    test('Star', () => {
        expect(re.Star(re.Char('c')).toString()).toBe('\'c\'*');

        expect(re.Star(
            re.Alt(re.Nil(),re.Empty())
        ).toString()).toBe('(∅|ε)*');
    });
});