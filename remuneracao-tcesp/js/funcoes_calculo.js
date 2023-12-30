// Funções de cálculo de remuneração

// reajuste: LC 1.391/2023 (19/07/2023) 
const vecimentoAuxiliar = {
    nivel1: {grauA: 6992.38, grauB: 7691.62, grauC: 7922.36, grauD: 8160.04, grauE: 8404.84, grauF: 8656.98,
        grauG: 8916.69, grauH: 9184.19, grauI: 9459.72, grauJ: 9743.51, grauK: 10035.81, grauL: 10336.89},
    nivel2: {grauB: 8916.87, grauC: 9184.38, grauD: 9459.91, grauE: 9743.71, grauF: 10036.02, grauG: 10337.10,
        grauH: 10647.21, grauI: 10966.63, grauJ: 11295.63, grauK: 11634.50, grauL: 11983.53},
    nivel3: {grauC: 10337.34, grauD: 10647.46, grauE: 10966.89, grauF: 11295.89, grauG: 11634.77, grauH: 11983.81,
        grauI: 12343.33, grauJ: 12713.63, grauK: 13095.04, grauL: 13487.89}
};

const vencimentoAgente = {
    nivel1: {grauA: 15347.34, grauB: 16882.08, grauC: 17388.54, grauD: 17910.20, grauE: 18447.50, grauF: 19000.93,
        grauG: 19570.96, grauH: 20158.08, grauI: 20762.83, grauJ: 21385.71, grauK: 22027.28, grauL: 22688.10},
    nivel2: {grauB: 19571.40, grauC: 20158.54, grauD: 20763.30, grauE: 21386.19, grauF: 22027.78, grauG: 22688.61,
        grauH: 23369.27, grauI: 24070.35, grauJ: 24792.46, grauK: 25536.23, grauL: 26302.32},
    nivel3: {grauC: 22689.13, grauD: 23369.81, grauE: 24070.90, grauF: 24793.03, grauG: 25536.82, grauH: 26302.92,
        grauI: 27092.01, grauJ: 27904.77, grauK: 28741.91, grauL: 29604.17}
};

const auxilioAlimentacao = 451.00;
const auxilioSaude = 1400.00;
const auxilioPreEscolar = 1985.52; // indenização máxima

const cotaAuxilioRefeicao = 47.00; 
const cotaAuxilioTransporte = 17.20;

// valores atualizados até 11/2022
// fonte: https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/irpf-imposto-de-renda-pessoa-fisica#tabelas-de-incid-ncia-mensal
const faixasIRPF = [
    {limite: 1903.98, aliquota: 0.075, deducao: 142.8},
    {limite: 2826.65, aliquota: 0.15, deducao: 354.8},
    {limite: 3751.05, aliquota: 0.225, deducao: 636.13},
    {limite: 4664.68, aliquota: 0.275, deducao: 869.36}
];

// valor atualizado até 03/2023
// fonte: http://www.spprev.sp.gov.br/loadArquivoNoticia.ashx?ArqCod=831
const faixasContribuicaoPrevidenciaria = [
    {limite: 1302.01, aliquota: 0.11, deducao: 0},
    {limite: 3722.57, aliquota: 0.12, deducao: 13.02},
    {limite: 7507.49, aliquota: 0.14, deducao: 87.47},
    {limite: Infinity, aliquota: 0.16, deducao: 237.62}
];
const tetoInss = 7507.49;
// fonte: https://www.al.sp.gov.br/repositorio/folha-de-pagamento/folha-2022-09.html
const teto = 41650.92

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

function calcularImpostoRenda(baseCalculo) {
    if (baseCalculo > faixasIRPF[0].limite && baseCalculo <= faixasIRPF[1].limite)
		return baseCalculo * faixasIRPF[0].aliquota - faixasIRPF[0].deducao;
	else if (baseCalculo > faixasIRPF[1].limite && baseCalculo <= faixasIRPF[2].limite)
        return baseCalculo * faixasIRPF[1].aliquota - faixasIRPF[1].deducao;
	else if (baseCalculo > faixasIRPF[2].limite && baseCalculo <= faixasIRPF[3].limite)
		return baseCalculo * faixasIRPF[2].aliquota - faixasIRPF[2].deducao;
	else if(baseCalculo > faixasIRPF[3].limite) 
		return baseCalculo * faixasIRPF[3].aliquota - faixasIRPF[3].deducao;
	else 
		return 0;
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

function calcularAuxilioSaude(cargo) {
    if (cargo == "auxiliar") {
        return 0.0;
    }
    return auxilioSaude;
}
