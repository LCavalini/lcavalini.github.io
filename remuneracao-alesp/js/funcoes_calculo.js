// Funções de cálculo de remuneração

const vencimentoTecnico = [
    3206.00, 3326.22, 3450.95, 3580.37, 3714.64, 3853.93, 3998.47, 4148.41, 4303.99, 4465.37, 4632.84, 4806.54,
    4986.81, 5173.82, 5367.85, 5569.15, 5777.99, 5994.65, 6219.44, 6452.68
];
const vencimentoAnalista = [
    6482.93, 6726.03, 6978.25, 7239.94, 7511.46, 7793.12, 8085.38, 8388.57, 8703.14, 9029.52, 9368.13, 9719.45,
    10083.92, 10462.07, 10854.40, 11261.44, 11683.77, 12121.89, 12576.48, 13048.07
];
const vencimentoAuditor = [
    6482.93, 6726.03, 6978.25, 7239.94, 7511.46, 7793.12, 8085.38, 8388.57, 8703.14, 9029.52, 9368.13, 9719.45,
    10083.92, 10462.07, 10854.40, 11261.44, 11683.77, 12121.89, 12576.48, 13048.07
];
const gratificacaoLegTecnico = 2701.00
const gratificacaoReprTecnico = 1760.17
const gratificacaoLegAnalista = 3703.98
const gratificacaoReprAnalista = 2377.18
const gratificacaoLegAuditor = 3703.98
const gratificacaoReprAuditor = 2377.18
const maximoGed = 6482.93
// fonte dos auxílios: https://www3.al.sp.gov.br/DrhOnline/pages/servidor/auxilios-beneficios
const auxilioAlimentacao = 757.37  // creditado em espécie
const cotaAuxilioRefeicao = 57.18  // a base é 22 dias, havendo desconto somente em caso de falta
const auxilioSaude = 500.00 // reembolso máximo
const auxilioPreEscolar = 680.96 // indenização máxima
// valores atualizados até 11/2022
// fonte: https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/irpf-imposto-de-renda-pessoa-fisica#tabelas-de-incid-ncia-mensal
const faixasIRPF = [
    {limite: 1903.98, aliquota: 0.075, deducao: 142.8},
    {limite: 2826.65, aliquota: 0.15, deducao: 354.8},
    {limite: 3751.05, aliquota: 0.225, deducao: 636.13},
    {limite: 4664.68, aliquota: 0.275, deducao: 869.36}
];
// valor atualizado até 01/2022
// fonte: https://portal.fazenda.sp.gov.br/servicos/folha/Paginas/Contribuicao_Previdenciaria_Servidores_Ativos.aspx
const faixasContribuicaoPrevidenciaria = [
    {limite: 1212, aliquota: 0.11, deducao: 0},
    {limite: 3473.74, aliquota: 0.12, deducao: 12.12},
    {limite: 7087.22, aliquota: 0.14, deducao: 81.60},
    {limite: Infinity, aliquota: 0.16, deducao: 223.34}
];
const tetoInss = 7087.22;
// fonte: http://www.recursoshumanos.sp.gov.br/teto_salarial.html
const tetoEstadoSp = 23048.59

function vencimentoBasico(cargo, nivel) {
    // a progressão de nível só ocorre após o probatório
    if (nivel <= 3) nivel = 1;
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

function ged(percentualGed) {
    return (percentualGed / 100) * maximoGed;
}


function ats(baseCalculo, tempo) {
    let adicionalTempo = 0;
    if (tempo >= 5) adicionalTempo += (Math.floor(tempo / 5) * 0.05);
    if (tempo >= 20) adicionalTempo += 0.2;
    return adicionalTempo * baseCalculo;
}

function remuneracaoBruta(cargo, nivel, tempo, percentualGed) {
    baseCalculoAts = vencimentoBasico(cargo, nivel) + gratificacaoLeg(cargo) + gratificacaoRepr(cargo)
    return baseCalculoAts + ats(baseCalculoAts, tempo) + ged(percentualGed);
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
    aliquota = 0.02
    if (idadeContribuinte >= 59) aliquota = 0.03
    for (beneficiario of beneficiarios) {
        if (beneficiario < 59) aliquota += 0.005;
        else aliquota += 0.01; 
    }
    for (agregado of agregados) {
        if (agregado < 59) aliquota += 0.02;
        else aliquota += 0.03
    }
    return aliquota * baseCalculo;
}
