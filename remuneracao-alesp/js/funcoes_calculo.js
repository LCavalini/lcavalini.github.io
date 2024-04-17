// Funções de cálculo de remuneração

// reajuste: LC 1.386/2023 (03/07/2023) 
const vencimentoTecnico = [
    3449.66, 3579.01, 3713.22, 3852.48, 3996.95, 4146.83, 4302.35, 4463.69, 4631.09, 4804.74, 4984.94, 5171.84,
    5365.81, 5567.03, 5775.81, 5992.41, 6217.12, 6450.24, 6692.12, 6943.08
];
const vencimentoAnalista = [
    6975.63, 7237.21, 7508.6, 7790.18, 8082.33, 8385.4, 8699.87, 9026.1, 9364.58, 9715.76, 10080.11, 10458.13,
    10850.3, 11257.19, 11679.33, 12117.31, 12571.74, 13043.15, 13532.29, 14039.72
];
const vencimentoAuditor = [
    6975.63, 7237.21, 7508.6, 7790.18, 8082.33, 8385.4, 8699.87, 9026.1, 9364.58, 9715.76, 10080.11, 10458.13,
    10850.3, 11257.19, 11679.33, 12117.31, 12571.74, 13043.15, 13532.29, 14039.72
];
// reajuste: LC 1.386/2023 (03/07/2023) 
const gratificacaoLegTecnico = 2906.28;
const gratificacaoReprTecnico = 1893.94;
const gratificacaoLegAnalista = 3985.48;
const gratificacaoReprAnalista = 2557.85;
const gratificacaoLegAuditor = 3985.48;
const gratificacaoReprAuditor = 2557.85
const maximoGed = 6975.63;
// alterado pelo Ato da Mesa nº 28/2023
const auxilioAlimentacao = 799.78;  // creditado em espécie
// alterado pelo Ato da Mesa nº 30/2023
const cotaAuxilioRefeicao = 66.42;  // a base é 22 dias, havendo desconto somente em caso de falta
// alterado pelo Ato da Mesa nº 32/2023
const tabelaAuxilioSaude = [
    {idadeLimite: 23, valor: 580.8},
    {idadeLimite: 28, valor: 580.8},
    {idadeLimite: 33, valor: 596.93},
    {idadeLimite: 38, valor: 596.93},
    {idadeLimite: 43, valor: 669.94},
    {idadeLimite: 48, valor: 669.94},
    {idadeLimite: 53, valor: 794.15},
    {idadeLimite: 58, valor: 794.15},
    {idadeLimite: Infinity, valor: 1082.78}
];
// alterado pelo Ato da Mesa nº 29/2023
const auxilioPreEscolar = 719.09 // indenização máxima
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
    let baseCalculoAts = vencimentoBasico(cargo, nivel, tempo) + gratificacaoLeg(cargo) + gratificacaoRepr(cargo)
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