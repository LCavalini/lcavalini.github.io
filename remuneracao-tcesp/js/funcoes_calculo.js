// Funções de cálculo de remuneração

// reajuste: PLC nº 20/2024
const vecimentoAuxiliar = {
    nivel1: {grauA: 7348.99, grauB: 8083.89, grauC: 8326.41, grauD: 8576.20, grauE: 8833.49, grauF: 9098.49,
        grauG: 9371.44, grauH: 9652.59, grauI: 9942.17, grauJ: 10240.43, grauK: 10547.64, grauL: 10864.07},
    nivel2: {grauB: 9371.63, grauC: 9652.78, grauD: 9942.36, grauE: 10240.63, grauF: 10547.85, grauG: 10864.29,
        grauH: 11190.22, grauI: 11525.92, grauJ: 11871.70, grauK: 12227.85, grauL: 12594.69},
    nivel3: {grauC: 10864.54, grauD: 11190.48, grauE: 11526.20, grauF: 11871.98, grauG: 12228.14, grauH: 12594.98,
        grauI: 12972.83, grauJ: 13362.02, grauK: 13762.88, grauL: 14175.77}
};

const vencimentoAgente = {
    nivel1: {grauA: 16130.05, grauB: 17743.06, grauC: 18275.35, grauD: 18823.61, grauE: 19388.32, grauF: 19969.97,
        grauG: 20569.07, grauH: 21186.14, grauI: 21821.73, grauJ: 22476.38, grauK: 23150.67, grauL: 23845.19},
    nivel2: {grauB: 20569.54, grauC: 21186.63, grauD: 21822.23, grauE: 22476.89, grauF: 23151.20, grauG: 23845.74,
        grauH: 24561.11, grauI: 25297.94, grauJ: 26056.88, grauK: 26838.59, grauL: 27643.74},
    nivel3: {grauC: 23846.28, grauD: 24561.66, grauE: 25298.51, grauF: 26057.47, grauG: 26839.19, grauH: 27644.37,
        grauI: 28473.70, grauJ: 29327.91, grauK: 30207.75, grauL: 31113.98}
};

const auxilioAlimentacao = 470.00;
const auxilioSaude = 1540.00;
const auxilioPreEscolar = 1985.52; // indenização máxima

const cotaAuxilioRefeicao = 50.00; 
const cotaAuxilioTransporte = 20.00;

// valor atualizado até 01/2024
// fonte: https://www.apatej.org.br/portaria-da-spprev-estabelece-aliquotas-de-contribuicao-previdenciaria-para-servidores.
const faixasContribuicaoPrevidenciaria = [
    {limite: 1518.00, aliquota: 0.11, deducao: 0},
    {limite: 4022.46, aliquota: 0.12, deducao: 15.18},
    {limite: 8157.41, aliquota: 0.14, deducao: 95.63},
    {limite: Infinity, aliquota: 0.16, deducao: 258.78}
];
const tetoInss = 8157.41;
// fonte: https://www.al.sp.gov.br/repositorio/folha-de-pagamento/folha-2022-09.html
const teto = 44008.52;

function calcularVencimentoBasico(cargo, nivel, grau) {
    if (cargo == 'auxiliar') {
        return vecimentoAuxiliar[nivel][grau]
    } else if (cargo == 'agente') {
        return vencimentoAgente[nivel][grau];
    } else {
        throw new Error(`O cargo ${cargo} é inválido`);        
    }
}

function calcularAts(baseCalculo, tempo) {
    let adicionalTempo = 0;
    if (tempo >= 5) adicionalTempo += (Math.floor(tempo / 5) * 0.05);
    if (tempo >= 20) adicionalTempo += 0.2;
    return adicionalTempo * baseCalculo;
}

function calcularRemuneracaoBruta(cargo, nivel, grau, tempo) {
    const baseCalculoAts = calcularVencimentoBasico(cargo, nivel, grau) * 1.1;
    return baseCalculoAts + calcularAts(baseCalculoAts, tempo);
}

function calcularExtraTeto(remuneracao) {
    if (remuneracao > teto) return remuneracao - teto;
    else return 0.00;
}

function calcularContribuicaoPrevidenciaria(baseCalculo) {
    // a contribuição previdenciária SPPREV é limitada ao teto do INSS
    if (baseCalculo > tetoInss) baseCalculo = tetoInss;
    if (baseCalculo <= faixasContribuicaoPrevidenciaria[0].limite)
        return baseCalculo * faixasContribuicaoPrevidenciaria[0].aliquota - faixasContribuicaoPrevidenciaria[0].deducao;
	else if (baseCalculo <= faixasContribuicaoPrevidenciaria[1].limite) 
		return baseCalculo * faixasContribuicaoPrevidenciaria[1].aliquota - faixasContribuicaoPrevidenciaria[1].deducao;
	else if (baseCalculo <= faixasContribuicaoPrevidenciaria[2].limite)
		return baseCalculo * faixasContribuicaoPrevidenciaria[2].aliquota - faixasContribuicaoPrevidenciaria[2].deducao;
	else 
        return baseCalculo * faixasContribuicaoPrevidenciaria[3].aliquota - faixasContribuicaoPrevidenciaria[3].deducao;
}

function calcularAuxilioRefeicao(dias) {
    return cotaAuxilioRefeicao * dias; 
}

function calcularAuxilioTransporte(dias) {
    return cotaAuxilioTransporte * dias;
}

function calcularAuxilioPreEscolar(valor) {
    if (valor == undefined) {
        return 0.0;
    }
    const valorConvertido = Number(valor.replace(",", "."));
    if (valorConvertido <= auxilioPreEscolar) {
       return valorConvertido;
    } else {
        return auxilioPreEscolar;
    }
}

function calcularIamspe(baseCalculo, idadeContribuinte, beneficiarios, agregados) {
    // fonte: http://www.iamspe.sp.gov.br/wp-content/uploads/2021/02/Nova_lei_contribui%C3%A7%C3%A3o-25-02-21.pdf
    let aliquota = 0.02
    if (idadeContribuinte >= 59) aliquota = 0.03
    for (let beneficiario of beneficiarios) {
        if (beneficiario < 59) aliquota += 0.005;
        else aliquota += 0.01; 
    }
    for (let agregado of agregados) {
        if (agregado < 59) aliquota += 0.02;
        else aliquota += 0.03
    }
    return aliquota * baseCalculo;
}

function calcularAuxilioSaude(cargo, idade) {
    if (cargo == "auxiliar") {
        return 0;
    }
    if (idade < 50) {
        return auxilioSaude;
    } else {
        return auxilioSaude * 1.5;
    }
}
