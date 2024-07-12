// Funções de cálculo de remuneração

const vencimentoConsultor = [
    14748.70, 16223.57, 17845.95, 19630.55, 21593.6, 23752.95, 26128.27, 28743.5
];

const auxilioAlimentacao = 1859.00;
const cotaAuxilioRefeicao = 85;  // a base é 22 dias;

const aliquotaPrevidencia = 0.14;
const tetoMunicipioSp = 38039.38;

const tabelaAuxilioSaude = [
    {idadeLimite: 18, valor: 515.68},
    {idadeLimite: 23, valor: 724.43},
    {idadeLimite: 28, valor: 761.75},
    {idadeLimite: 33, valor: 814.51},
    {idadeLimite: 38, valor: 867.1},
    {idadeLimite: 43, valor: 939.53},
    {idadeLimite: 48, valor: 1263.25},
    {idadeLimite: 53, valor: 1542.11},
    {idadeLimite: 58, valor: 1813.91},
    {idadeLimite: Infinity, valor: 3093.49}
];

function calcularVencimentoBasico(cargo, padrao) {
    if (cargo == 'consultor') {
        return vencimentoConsultor[padrao-1];
    } else {
        throw new Error(`O cargo ${cargo} é inválido`);        
    }
}

function calcularGliep(cargo, percentual) {
    if (cargo == 'consultor') {
        let qpl22 = vencimentoConsultor.length - 1;
        return percentual * vencimentoConsultor[qpl22];
    } else {
        throw new Error(`O cargo ${cargo} é inválido`);        
    }
}

function calcularAts(baseCalculo, tempo) {
    let adicionalTempo = 0;
    // Quinquênios.
    if (tempo >= 5) {
        // O município de SP faz cálculo de juros compostos.
        adicionalTempo += (1.05 ** Math.floor(tempo / 5)) - 1;
    }
    // Sexta-parte.
    if (tempo >= 20) {
        adicionalTempo += 0.2;
    }
    return adicionalTempo * baseCalculo;
}

function calcularBruto(cargo, padrao, tempo, percentualGliep) {
    let baseCalculoAts = calcularVencimentoBasico(cargo, padrao);
    return baseCalculoAts + calcularAts(baseCalculoAts, tempo) + calcularGliep(cargo, percentualGliep);
}

function calcularExtraTeto(remuneracao) {
    if (remuneracao > tetoMunicipioSp) {
        return remuneracao - tetoMunicipioSp;
    }
    return 0.00;
}

function calcularPrevidencia(baseCalculo) {
    // a contribuição previdenciária é limitada ao teto do INSS.
    if (baseCalculo > obterTetoInss()) {
        baseCalculo = obterTetoInss();
    }
    return baseCalculo * 0.14;
}

function calcularAuxilioRefeicao(faltas) {
    return cotaAuxilioRefeicao * (22 - faltas);
}


function calcularAuxilioSaude(idade) {
    let tamanho = tabelaAuxilioSaude.length;
    for (let i = 0; i < tamanho; i++) {
        if (idade <= tabelaAuxilioSaude[i].idadeLimite) {
            return tabelaAuxilioSaude[i].valor;
        }
    }
    return tabelaAuxilioSaude[tamanho-1].valor;
}
