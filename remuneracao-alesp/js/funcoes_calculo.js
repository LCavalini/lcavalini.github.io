// Funções de cálculo de remuneração

// LC 1.402/2024
const vencimentoTecnico = [3934.37, 4081.9, 4234.97, 4393.78, 4558.56, 4729.5, 4906.88, 5090.88, 5281.81, 5479.86,
    5685.37, 5898.54, 6119.76, 6349.26, 6587.37, 6834.4, 7090.69, 7356.58, 7632.44, 7918.66];
const vencimentoAnalista = [7955.79, 8254.12, 8563.66, 8884.79, 9218, 9563.64, 9922.3, 10294.37, 10680.41, 11080.94,
    11496.48, 11927.62, 12374.89, 12838.95, 13320.42, 13819.94, 14338.21, 14875.88, 15433.74, 16012.48];
const vencimentoAuditor = [7955.79, 8254.12, 8563.66, 8884.79, 9218, 9563.64, 9922.3, 10294.37, 10680.41, 11080.94,
    11496.48, 11927.62, 12374.89, 12838.95, 13320.42, 13819.94, 14338.21, 14875.88, 15433.74, 16012.48];
// LC 1.402/2024
const valoresAdicionaisQualificacao = {
    adicionalGrad: 427.34,
    adicionalPos: 854.67,
    adicionalMes: 1282.01,
    adicionalDout: 1709.35
};

// reajuste: PLC 21/2025.
const gratificacaoLegTecnico = 3314.64;
const gratificacaoReprTecnico = 2160.06;
const gratificacaoLegAnalista = 4545.49;
const gratificacaoReprAnalista = 2917.25;
const gratificacaoLegAuditor = 4545.49;
const gratificacaoReprAuditor = 2917.25;
const maximoGed = 7955.79;
// alterado pelo Ato da Mesa nº 17/2025.
const auxilioAlimentacao = 1100.57;  // creditado em espécie
// alterado pelo Ato da Mesa nº 16/2025.
const cotaAuxilioRefeicao = 76.75;  // a base é 22 dias, havendo desconto somente em caso de falta
// alterado pelo Ato da Mesa nº 20/2025.
const tabelaAuxilioSaude = [
    {idadeLimite: 23, valor: 871.2},
    {idadeLimite: 28, valor: 888.62},
    {idadeLimite: 33, valor: 931.21},
    {idadeLimite: 38, valor: 949.11},
    {idadeLimite: 43, valor: 1085.3},
    {idadeLimite: 48, valor: 1105.4},
    {idadeLimite: 53, valor: 1334.17},
    {idadeLimite: 58, valor: 1357.99},
    {idadeLimite: Infinity, valor: 2078.94}
];
// alterado pelo Ato da Mesa nº 18/2025.
const auxilioPreEscolar = 1294.36 // indenização máxima
// valores atualizados até 07/2025
// fonte: https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/irpf-imposto-de-renda-pessoa-fisica#tabelas-de-incid-ncia-mensal
const faixasIRPF = [
      { limite: 3036, aliquota: 0.075, deducao: 182.16 },
      { limite: 3533.31, aliquota: 0.15, deducao: 394.16 },
      { limite: 4688.85, aliquota: 0.225, deducao: 675.49 },
      { limite: 5830.85, aliquota: 0.275, deducao: 908.73 }
];
// valor atualizado até 01/2025
const faixasContribuicaoPrevidenciaria = [
    {limite: 1518.00, aliquota: 0.11, deducao: 0},
    {limite: 4022.46, aliquota: 0.12, deducao: 15.18},
    {limite: 8157.41, aliquota: 0.14, deducao: 95.63},
    {limite: Infinity, aliquota: 0.16, deducao: 258.78}
];
const tetoInss = 8157.41;
// fonte: https://www.al.sp.gov.br/repositorio/folha-de-pagamento/folha-2022-09.html
const tetoEstadoSp = 34774.64;

function vencimentoBasico(cargo, nivel, tempo) {
    // a progressão de nível só ocorre após o probatório
    if (tempo <= 3) nivel = 1;
    if (cargo == 'tecnico') {
        return vencimentoTecnico[nivel-1]
    } else if (cargo == 'analista') {
        return vencimentoAnalista[nivel-1]
    } else if (cargo == 'auditor') {
        return vencimentoAuditor[nivel-1]
    } else {
        throw new Error(`O cargo ${cargo} é inválido`);        
    }
}

function gratificacaoLeg(cargo) {
    if (cargo == 'tecnico') {
        return gratificacaoLegTecnico;
    } else if (cargo == 'analista') {
        return gratificacaoLegAnalista;
    } else if (cargo == 'auditor') {
        return gratificacaoLegAuditor
    } else {
        throw new Error(`O cargo ${cargo} é inválido`);        
    }
}

function gratificacaoRepr(cargo) {
    if (cargo == 'tecnico') {
        return gratificacaoReprTecnico;
    } else if (cargo == 'analista') {
        return gratificacaoReprAnalista;
    } else if (cargo == 'auditor') {
        return gratificacaoReprAuditor
    } else {
        throw new Error(`O cargo ${cargo} é inválido`);        
    }
}

function adicionalQualificacao(adicionais) {
    if (adicionais == undefined || adicionais.length == 0) {
        return 0;
    }
    return adicionais.map(adicional => adicional in valoresAdicionaisQualificacao
            ? valoresAdicionaisQualificacao[adicional] : 0)
        .reduce((x, y) => x + y);
}

function ged(percentualGed) {
    return (percentualGed / 100) * maximoGed;
}


function ats(baseCalculo, tempo) {
    let adicionalTempo = 0;
    if (tempo >= 5) adicionalTempo += (Math.floor(tempo / 5) * 0.05);
    if (tempo >= 20) adicionalTempo += 0.2;
    return adicionalTempo * baseCalculo;
}

function remuneracaoBruta(cargo, nivel, tempo, percentualGed, valorQualificacao) {
    let baseCalculoAts = vencimentoBasico(cargo, nivel, tempo) + gratificacaoLeg(cargo) + gratificacaoRepr(cargo)
    return baseCalculoAts + ats(baseCalculoAts, tempo) + ged(percentualGed) + valorQualificacao;
}

function extraTeto(remuneracao) {
    if (remuneracao > tetoEstadoSp) return remuneracao - tetoEstadoSp;
    else return 0.00;
}

function contribuicaoPrevidenciaria(baseCalculo) {
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

function impostoRenda(baseCalculo) {
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

function auxilioRefeicao(faltas) {
    return cotaAuxilioRefeicao * (22 - faltas); 
}

function iampse(baseCalculo, idadeContribuinte, beneficiarios, agregados) {
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

function auxilioSaude(idade) {
    for (let i = 0; i < 8; i++) {
        if (idade <= tabelaAuxilioSaude[i].idadeLimite) {
            return tabelaAuxilioSaude[i].valor;
        }
    }
    return tabelaAuxilioSaude[8].valor;
}
