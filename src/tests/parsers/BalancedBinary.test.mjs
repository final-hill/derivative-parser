import { alt, seq, matches } from "../../index.mjs"

describe('Balanced Binary', () => {
    // A = 0A1 | #
    const A = alt(seq('0', () => A, '1'), '#')

    test('matches', () => {
        const e = ''
        expect(matches(A, e)).toBe(false)

        const n = '#'
        expect(matches(A, n)).toBe(true)

        const str1 = '0#1'
        expect(matches(A, str1)).toBe(true)

        const str2 = '00#11'
        expect(matches(A, str2)).toBe(true)

        const str3 = '000#111'
        expect(matches(A, str3)).toBe(true)

        const str4 = '0000#1111'
        expect(matches(A, str4)).toBe(true)
    })

    test('bad matches', () => {
        const str1 = '0#'
        expect(matches(A, str1)).toBe(false)

        const str2 = '#1'
        expect(matches(A, str2)).toBe(false)

        const str3 = '0#11'
        expect(matches(A, str3)).toBe(false)

        const str4 = '00#1'
        expect(matches(A, str4)).toBe(false)

        const str5 = '00#111'
        expect(matches(A, str5)).toBe(false)
    })
})