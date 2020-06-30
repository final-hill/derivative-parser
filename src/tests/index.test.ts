/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import lang from '../language';
import { MSG_CHAR_EXPECTED } from '../Messages';
import Alt from '../language/Alt';
import Cat from '../language/Cat';

describe('Every expression should have a string representation', () => {
    test('Nil', () => {
        expect(lang.Nil().toString()).toBe('∅');
    });
    test('Empty', () => {
        expect(lang.Empty().toString()).toBe('ε');
    });
    test('Alt', () => {
        expect(lang.Alt(lang.Empty(),lang.Nil()).toString()).toBe('ε|∅');
        expect(lang.Alt(
            lang.Empty(),
            lang.Alt(
                lang.Nil(),
                lang.Empty()
            )
        ).toString()).toBe('ε|(∅|ε)');
        expect(lang.Alt(
            lang.Alt(
                lang.Nil(),
                lang.Empty()
            ),
            lang.Empty()
        ).toString()).toBe('(∅|ε)|ε');
    });
    test('Cat', () => {
        expect(lang.Cat(lang.Empty(),lang.Nil()).toString()).toBe('ε∅');
        expect(lang.Cat(
            lang.Empty(),
            lang.Cat(
                lang.Nil(),
                lang.Empty()
            )
        ).toString()).toBe('ε(∅ε)');
        expect(lang.Cat(
            lang.Cat(
                lang.Nil(),
                lang.Empty()
            ),
            lang.Empty()
        ).toString()).toBe('(∅ε)ε');
    });
    test('Char', () => {
        expect(lang.Char('a').toString()).toBe('\'a\'');
        expect(() => lang.Char('abc')).toThrow(MSG_CHAR_EXPECTED);
    });
    test('Star', () => {
        expect(lang.Star(lang.Char('c')).toString()).toBe('\'c\'*');

        expect(lang.Star(
            lang.Alt(lang.Nil(),lang.Empty())
        ).toString()).toBe('(∅|ε)*');
    });
});

describe('It must be possible to take the derivative of a language', () => {
    test('Alt', () => {
        expect(
            lang.Alt(
                lang.Char('a'),
                lang.Char('b')
            ).deriv('a')
        ).toEqual(lang.Alt(
            lang.Char('a').deriv('a'),
            lang.Char('b').deriv('a')
        ));
    });
    test('Cat', () => {
        const l1 = lang.Alt(lang.Char('a'), lang.Empty()),
              l2 = lang.Char('b');
        expect(
            lang.Cat(l1, l2).deriv('a')
        ).toEqual(new Alt(
            lang.Cat(l1.deriv('a'),l2),
            new Cat(l1.nilOrEmpty(), l2.deriv('a'))
        ));
    });
    test('Char', () => {
        expect(lang.Char('a').deriv('a')).toEqual(lang.Empty());
        expect(lang.Char('a').deriv('b')).toEqual(lang.Nil());
    });
    test('Empty', () => {
        expect(lang.Empty().deriv('a')).toEqual(lang.Nil());
    });
    test('Nil', () => {
        expect(lang.Nil().deriv('a')).toEqual(lang.Nil());
    });
    test('Star', () => {
        const L = lang.Char('a');
        expect(
            lang.Star(L).deriv('a')
        ).toEqual(
            lang.Cat(L.deriv('a'),lang.Star(L))
        );
    });
});

describe('It must be possible to test if a string matches a regular language', () => {
    test('Alt', () => {
        const l = lang.Alt(lang.Char('a'), lang.Char('b'));
        expect(l.matches('')).toBe(false);
        expect(l.matches('a')).toBe(true);
        expect(l.matches('b')).toBe(true);
        expect(l.matches('c')).toBe(false);
    });
    test('Cat', () => {
        const l = lang.Cat(lang.Char('a'), lang.Char('b'));
        expect(l.matches('')).toBe(false);
        expect(l.matches('a')).toBe(false);
        expect(l.matches('b')).toBe(false);
        expect(l.matches('ab')).toBe(true);
        expect(l.matches('ba')).toBe(false);
    });
    test('Char', () => {
        const l = lang.Char('a');
        expect(l.matches('a')).toBe(true);
        expect(l.matches('b')).toBe(false);
    });
    test('Empty', () => {
        const l = lang.Empty();
        expect(l.matches('')).toBe(true);
        expect(l.matches('a')).toBe(false);
    });
    test('Nil', () => {
        const l = lang.Nil();
        expect(l.matches('')).toBe(false);
        expect(l.matches('a')).toBe(false);
    });
    test('Star', () => {
        const l = lang.Star(lang.Char('a'));
        expect(l.matches('')).toBe(true);
        expect(l.matches('a')).toBe(true);
        expect(l.matches('aaa')).toBe(true);
        expect(l.matches('b')).toBe(false);
    });
});