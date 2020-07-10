# TODO

Many()    L+

.oneOf()    t1 | t2 | … | tn

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

NOT patterns
lang.not(lang.digit())


array access faster than charCodeAt
https://mrale.ph/blog/2018/02/03/maybe-you-dont-need-rust-to-speed-up-your-js.html