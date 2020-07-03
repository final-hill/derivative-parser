/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

 /*
import rl from '../src/regular-language';

describe('RegularLanguage.toString', () => {
    test(`Nil == ∅`, () => {
        expect(`${rl.NIL}`).toBe('∅')
    })

    test(`Empty == ε`, () => {
        expect(`${rl.EMPTY}`).toBe('ε')
    })

    test(`Char('a') == 'a'`, () => {
        expect(`${rl.Char('a')}`).toBe(`'a'`)
    })

    test(`Alt(Nil,Nil) == ∅ | ∅`, () => {
        expect(`${rl.Alt(rl.NIL, rl.NIL)}`).toBe('∅ | ∅')
    })

    test(`Alt(Char('a'),Char('b')) == 'a' | 'b'`, () => {
        expect(`${rl.Alt(rl.Char('a'), rl.Char('b'))}`).toBe(`'a' | 'b'`)
    })

    test(`Alt(Char('a'),Alt(Char('b'),Char('c'))) == 'a' | ('b' | 'c')`, () => {
        expect(`${rl.Alt(rl.Char('a'), rl.Alt(rl.Char('b'), rl.Char('c')))}`).toBe(`'a' | ('b' | 'c')`)
    })

    test(`Cat(Nil,Nil) == ∅∅`, () => {
        expect(`${rl.Cat(rl.NIL, rl.NIL)}`).toBe('∅∅')
    })

    test(`Cat(Char('a'),Cat(rl.Char('b'),Char('c')))`, () => {
        expect(`${rl.Cat(rl.Char('a'), rl.Cat(rl.Char('b'), rl.Char('c')))}`).toBe(`'a'('b''c')`)
    })

    test(`Star(Nil) == ∅*`, () => {
        expect(`${rl.Star(rl.NIL)}`).toBe('∅*')
    })

    test(`Star(Alt(Nil,Nil)) == (∅ | ∅)*`, () => {
        expect(`${rl.Star(rl.Alt(rl.NIL, rl.NIL))}`).toBe('(∅ | ∅)*')
    })
})
*/