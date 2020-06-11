/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import re from './';
import { MSG_CHAR_EXPECTED } from './Char';
import RegularLanguage from './RegularLanguage';
import { MSG_NOT_IMPLEMENTED } from '../Messages';
import Alt from './Alt';
import Cat from './Cat';

describe('Abstract RegularLanguage usage', () => {
    const r = new RegularLanguage();
    test('toString() throws', () => {
        expect(() => r.toString()).toThrow(MSG_NOT_IMPLEMENTED);
        expect(() => r.deriv('a')).toThrow(MSG_NOT_IMPLEMENTED);
        expect(r.isAtomic()).toBe(false);
        expect(() => r.nilOrEmpty()).toThrow(MSG_NOT_IMPLEMENTED);
    });
});

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

describe('It must be possible to take the derivative of a language', () => {
    test('Alt', () => {
        expect(
            re.Alt(
                re.Char('a'),
                re.Char('b')
            ).deriv('a')
        ).toEqual(re.Alt(
            re.Char('a').deriv('a'),
            re.Char('b').deriv('a')
        ));
    });
    test('Cat', () => {
        const l1 = re.Alt(re.Char('a'), re.Empty()),
              l2 = re.Char('b');
        expect(
            re.Cat(l1, l2).deriv('a')
        ).toEqual(new Alt(
            re.Cat(l1.deriv('a'),l2),
            new Cat(l1.nilOrEmpty(), l2.deriv('a'))
        ));
    });
    test('Char', () => {
        expect(re.Char('a').deriv('a')).toEqual(re.Empty());
        expect(re.Char('a').deriv('b')).toEqual(re.Nil());
    });
    test('Empty', () => {
        expect(re.Empty().deriv('a')).toEqual(re.Nil());
    });
    test('Nil', () => {
        expect(re.Nil().deriv('a')).toEqual(re.Nil());
    });
    test('Star', () => {
        const L = re.Char('a');
        expect(
            re.Star(L).deriv('a')
        ).toEqual(
            re.Cat(L.deriv('a'),re.Star(L))
        );
    });
});

describe('It must be possible to test if a string matches a regular language', () => {
    test('Alt', () => {
        const l = re.Alt(re.Char('a'), re.Char('b'));
        expect(l.matches('')).toBe(false);
        expect(l.matches('a')).toBe(true);
        expect(l.matches('b')).toBe(true);
        expect(l.matches('c')).toBe(false);
    });
    test('Cat', () => {
        const l = re.Cat(re.Char('a'), re.Char('b'));
        expect(l.matches('')).toBe(false);
        expect(l.matches('a')).toBe(false);
        expect(l.matches('b')).toBe(false);
        expect(l.matches('ab')).toBe(true);
        expect(l.matches('ba')).toBe(false);
    });
    test('Char', () => {
        const l = re.Char('a');
        expect(l.matches('a')).toBe(true);
        expect(l.matches('b')).toBe(false);
    });
    test('Empty', () => {
        const l = re.Empty();
        expect(l.matches('')).toBe(true);
        expect(l.matches('a')).toBe(false);
    });
    test('Nil', () => {
        const l = re.Nil();
        expect(l.matches('')).toBe(false);
        expect(l.matches('a')).toBe(false);
    });
    test('Star', () => {
        const l = re.Star(re.Char('a'));
        expect(l.matches('')).toBe(true);
        expect(l.matches('a')).toBe(true);
        expect(l.matches('aaa')).toBe(true);
        expect(l.matches('b')).toBe(false);
    });
});