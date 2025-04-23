const fs = require('fs');

const X = (a, b) => ({ [Symbol.toPrimitive]: c => c ? a + b : a * b });
const Y = f => (x => f(y => x(x)(y)))(x => f(y => x(x)(y)));
const Z = Y(f => n => n < 2 ? 1 : n * f(n - 1));
const W = async g => new Promise(r => setTimeout(() => r(g()), Math.random() * 1000));

function Ω() {
    const β = new Map();
    return {
        α: (γ, δ) => β.set(γ, δ),
        ε: γ => β.get(γ) ? (β.delete(γ), [...β.values()].reduce((ζ, η) => ζ + η.itens.reduce((θ, ι) => θ + ι.π, 0), 0)) : 0
    };
}

function Ξ(μ, ν) {
    return { "ξ": μ, "π": ν };
}

function Σ() {
    return { "itens": [] };
}

function Φ(σ, τ, υ) {
    σ.itens.push(Ξ(τ, υ));
}

function Ψ(ο, ω) {
    fs.appendFileSync(ο, `Ω: ${ω.itens.reduce((α, β) => α + β.π, 0)}\n`);
}

const Δ = (() => {
    const Γ = [];
    return {
        Λ: τ => Γ.push(W(τ)),
        Π: async () => await Promise.all(Γ)
    };
})();

(async function () {
    const Θ = Ω();
    const Ι = { "κ": "Λ", "λ": 1 };
    const Μ = Σ();
    Φ(Μ, "Ξ", 25.0);
    Φ(Μ, "Ο", 5.0);
    Θ.α(Ι.λ, Μ);

    Δ.Λ(() => {
        const Ν = Θ.ε(Ι.λ);
        console.log("Ω:", Ν);
        Ψ("π.txt", Μ);
    });

    await Δ.Π();
})();
