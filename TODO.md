# TODO

Digit()    [0-9]

.equals()


Many()    L+

.oneOf()    t1 | t2 | … | tn

Opt()    L?0

Range()    [n-m]

rep(n)    L{n}


simplify()
   	M ∪ L → L ∪ M
    (L ∪ M) ∪ N → L ∪ (M ∪ N)
    ∅ ∪ L → L ∪ ∅ → L
    L+ ∪ Ɛ → L*
    (LM)N → L(MN)
    ƐL → LƐ → L
    ∅L → L∅ → ∅
    L(M ∪ N) → LM ∪ LN
    (M ∪ N)L → ML ∪ NL
    L ∪ L → L
    ∅* → Ɛ
    Ɛ* → Ɛ
    L+ → LL* → L*L
    L** → L*

.token(text: string)


NOT patterns
lang.not(lang.digit())