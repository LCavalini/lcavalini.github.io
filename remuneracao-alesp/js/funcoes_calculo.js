// Funções de cálculo de remuneração

// LC 1.402/2024
const vencimentoTecnico = [
    3676.98, 3814.86, 3957.92, 4106.34, 4260.34, 4420.09, 4585.87, 4757.83, 4936.27, 5121.36, 5313.43, 5512.65,
    5719.40, 5933.89, 6156.42, 6387.29, 6626.81, 6875.31, 7133.12, 7400.62
];
const vencimentoAnalista = [
    7435.32, 7714.13, 8003.42, 8303.54, 8614.95, 8937.98, 9273.18, 9620.91, 9981.69, 10356.02, 10744.37, 11147.31,
    11565.32, 11999.02, 12448.99, 12915.83, 13400.20, 13902.69, 14424.06, 14964.93
];
const vencimentoAuditor = [
    7435.32, 7714.13, 8003.42, 8303.54, 8614.95, 8937.98, 9273.18, 9620.91, 9981.69, 10356.02, 10744.37, 11147.31,
    11565.32, 11999.02, 12448.99, 12915.83, 13400.20, 13902.69, 14424.06, 14964.93
];
// LC 1.402/2024
const valoresAdicionalQualificacao = [
    0, 399.38, 798.76, 1198.14, 1597.52
]
// reajuste: LC 1.386/2023 (03/07/2023) 
const gratificacaoLegTecnico = 3097.79;
const gratificacaoReprTecnico = 2018.75;
const gratificacaoLegAnalista = 4248.12;
const gratificacaoReprAnalista = 2726.40;
const gratificacaoLegAuditor = 4248.12;
const gratificacaoReprAuditor = 2726.40
const maximoGed = 7435.32;
// alterado pelo Ato da Mesa nº 09/2024
const auxilioAlimentacao = 1000.52;  // creditado em espécie
// alterado pelo Ato da Mesa nº 10/2024
const cotaAuxilioRefeicao = 73.06;  // a base é 22 dias, havendo desconto somente em caso de falta
// alterado pelo Ato da Mesa nº 32/2023
const tabelaAuxilioSaude = [
    {idadeLimite: 23, valor: 726.0},
    {idadeLimite: 28, valor: 740.52},
    {idadeLimite: 33, valor: 776.01},
    {idadeLimite: 38, valor: 790.93},
    {idadeLimite: 43, valor: 904.42},
    {idadeLimite: 48, valor: 921.17},
    {idadeLimite: 53, valor: 1111.81},
    {idadeLimite: 58, valor: 1131.66},
    {idadeLimite: Infinity, valor: 1732.45}
];
// alterado pelo Ato da Mesa nº 11/2024
const auxilioPreEscolar = 1078.64 // indenização máxima
// valores atualizados até 04/2024
// fonte: https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/irpf-imposto-de-renda-pessoa-fisica#tabelas-de-incid-ncia-mensal
const faixasIRPF = [
    { limite: 2259.20, aliquota: 0.075, deducao: 169.44 },
    { limite: 2828.66, aliquota: 0.15, deducao: 381.44 },
    { limite: 3751.06, aliquota: 0.225, deducao: 662.77 },
    { limite: 4664.68, aliquota: 0.275, deducao: 896.00 }
];
// valor atualizado até 01/2024
// fonte: https://portal.fazenda.sp.gov.br/servicos/folha/Paginas/Contribuicao_Previdenciaria_Servidores_Ativos.aspx
const faixasContribuicaoPrevidenciaria = [
    {limite: 1412.00, aliquota: 0.11, deducao: 0},
    {limite: 3842.09, aliquota: 0.12, deducao: 14.12},
    {limite: 7786.02, aliquota: 0.14, deducao: 90.96},
    {limite: Infinity, aliquota: 0.16, deducao: 246.68}
];
const tetoInss = 7786.02;
// fonte: https://www.al.sp.gov.br/repositorio/folha-de-pagamento/folha-2022-09.html
const tetoEstadoSp = 33006.39

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

function adicionalQualificacao(adicional) {
    if (isNaN(adicional) || adicional < 0 && adicional > 4) {
        throw new Error('O índice do adicional de qualificação é inválido.')
    }
    return valoresAdicionalQualificacao[adicional];
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

function remuneracaoBruta(cargo, nivel, tempo, percentualGed, indiceQualificacao) {
    let baseCalculoAts = vencimentoBasico(cargo, nivel, tempo) + gratificacaoLeg(cargo) + gratificacaoRepr(cargo)
    return baseCalculoAts + ats(baseCalculoAts, tempo) + ged(percentualGed) + adicionalQualificacao(indiceQualificacao);
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
