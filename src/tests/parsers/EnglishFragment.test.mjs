import { token, seq, alt, matches } from "../../index.mjs"

describe('English Fragment', () => {
    const SENTENCE = seq(() => NOUN_PHRASE, ' ', () => VERB_PHRASE),
        NOUN_PHRASE = alt(() => CMPLX_NOUN, seq(() => CMPLX_NOUN, ' ', () => PREP_PHRASE)),
        VERB_PHRASE = alt(() => CMPLX_VERB, seq(() => CMPLX_VERB, ' ', () => PREP_PHRASE)),
        PREP_PHRASE = seq(() => PREP, ' ', () => CMPLX_NOUN),
        CMPLX_NOUN = seq(() => ARTICLE, () => NOUN),
        CMPLX_VERB = alt(() => VERB, seq(() => VERB, () => NOUN_PHRASE)),
        ARTICLE = alt('the', 'a'),
        NOUN = alt('boy', 'girl', 'flower'),
        VERB = alt('touches', 'likes', 'sees'),
        PREP = token('with')

    test('matches', () => {
        const s1 = 'a boy sees'

        expect(matches(SENTENCE, s1)).toBe(true)

        const s2 = 'the boy sees a flower'
        expect(matches(SENTENCE, s2)).toBe(true)

        const s3 = 'a girl with a flower likes the boy'
        expect(matches(SENTENCE, s3)).toBe(true)
    })
})