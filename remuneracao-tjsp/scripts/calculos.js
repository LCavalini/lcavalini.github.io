function numberToReal(numero) {

	var numero = numero.toFixed(2).split('.');
	numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
	return numero.join(',');
}

function calcSallary() {
	
	// valores atualizados até 03/2020
	const base =  1968.34;
	const gaj =  3.612 * 972.37;
	const auxilioCreche = 423;
	const auxilioAlimentacao = 48;
	const auxilioTransporte = 8.8;
	const auxilioSaude = 370;
	const descontoIamspe = 0.02;
	
	// valores atualizados até 06/2019
	const faixasIRPF = [
		{limite: 1903.98, aliquota: 0.075, deducao: 142.8},
		{limite: 2826.65, aliquota: 0.15, deducao: 354.8},
		{limite: 3751.05, aliquota: 0.225, deducao: 636.13},
		{limite: 4664.68, aliquota: 0.275, deducao: 869.36}
	];
	const deducaoDependenteIRPF = 189.59;
	
	// valor atualizado até 01/2022
	const faixasContribuicaoPrevidenciaria = [{limite: 1212, aliquota: 0.11, deducao: 0},
	{limite: 3473.74, aliquota: 0.12, deducao: 12.12},
	{limite: 7087.22, aliquota: 0.14, deducao: 81.60},
	{limite: Infinity, aliquota: 0.16, deducao: 223.34}];

	// obtém os parâmetros fornecidos pelo usuário
	var diasTrabalhados = Number(document.getElementById("diasTrabalhados").value);
	var numAuxilioCreche = Number(document.getElementById("auxilioCreche").value);
	var formacaoAcademica = Number(document.getElementById("formacaoAcademica").value);
	var iamspe = Number(document.getElementById("iamspe").value);
	var agregadosIamspe = Number(document.getElementById("agregadosIamspe").value);
	var dependentes = Number(document.getElementById("dependentes").value);
	var quinquenios = Number(document.getElementById("quinquenios").value);
	
	var adicionalQualificacao = formacaoAcademica * (base + gaj);
	
	// com sexta parte (20 anos = 4 quinquenios)
	if (quinquenios >= 4) {
	
		var adicionalTempoServico = (0.05 * quinquenios + 0.2) * (base + gaj);

	}
	
	// sem sexta parte
	else {
	
		var adicionalTempoServico = 0.05 * quinquenios * (base + gaj);
	
	}
				
	// cálculo dos auxílios
	var totalAuxilioAlimentacao = diasTrabalhados * auxilioAlimentacao;
	var totalAuxilioTransporte = diasTrabalhados * auxilioTransporte;
	var totalAuxilioCreche = numAuxilioCreche * auxilioCreche;
	
	var baseCalculoDeducoes = base + gaj + adicionalQualificacao + adicionalTempoServico;
	
	// cálculo das deduções
	var totalDescontoIamspe = (iamspe + agregadosIamspe) * descontoIamspe * baseCalculoDeducoes;			
	var totalDeducaoDependenteIRPF = dependentes * deducaoDependenteIRPF;

	if(baseCalculoDeducoes <= faixasContribuicaoPrevidenciaria[0].limite) {

		totalContribuicaoPrevidenciaria = baseCalculoDeducoes * faixasContribuicaoPrevidenciaria[0].aliquota - faixasContribuicaoPrevidenciaria[0].deducao;

	}

	else if(baseCalculoDeducoes <= faixasContribuicaoPrevidenciaria[1].limite) {

		totalContribuicaoPrevidenciaria = baseCalculoDeducoes * faixasContribuicaoPrevidenciaria[1].aliquota - faixasContribuicaoPrevidenciaria[1].deducao;

	}


	else if(baseCalculoDeducoes <= faixasContribuicaoPrevidenciaria[2].limite) {

		totalContribuicaoPrevidenciaria = baseCalculoDeducoes * faixasContribuicaoPrevidenciaria[2].aliquota - faixasContribuicaoPrevidenciaria[2].deducao;

	}

	else {


		totalContribuicaoPrevidenciaria = baseCalculoDeducoes * faixasContribuicaoPrevidenciaria[3].aliquota - faixasContribuicaoPrevidenciaria[3].deducao;

	}
		
	
	var baseCalculoIRPF = baseCalculoDeducoes - totalDeducaoDependenteIRPF - totalContribuicaoPrevidenciaria;
	
	// cálculo do IRPF de acordo com as faixas
	if(baseCalculoIRPF > faixasIRPF[0].limite && baseCalculoIRPF <= faixasIRPF[1].limite) {
	
		totalIRPF = baseCalculoIRPF * faixasIRPF[0].aliquota - faixasIRPF[0].deducao;
	
	}
	
	else if(baseCalculoIRPF > faixasIRPF[1].limite && baseCalculoIRPF <= faixasIRPF[2].limite) {
	
		totalIRPF = baseCalculoIRPF * faixasIRPF[1].aliquota - faixasIRPF[1].deducao;
		
	}
	
	else if(baseCalculoIRPF > faixasIRPF[2].limite && baseCalculoIRPF <= faixasIRPF[3].limite) {
	
		totalIRPF = baseCalculoIRPF * faixasIRPF[2].aliquota - faixasIRPF[2].deducao;
		
	}
	
	else if(baseCalculoIRPF > faixasIRPF[3].limite) {
	
		totalIRPF = baseCalculoIRPF * faixasIRPF[3].aliquota - faixasIRPF[3].deducao;
	
	}
	
	else {
	
		totalIRPF = 0;
	
	}
	
	var remuneracaoBruta = baseCalculoDeducoes + totalAuxilioAlimentacao + totalAuxilioTransporte 
	+ totalAuxilioCreche + auxilioSaude;
	
	var remuneracaoLiquida = remuneracaoBruta - totalDescontoIamspe - 
	totalContribuicaoPrevidenciaria - totalIRPF;
	
	document.getElementById("totalAuxilioAlimentacao").innerHTML = numberToReal(totalAuxilioAlimentacao);
	document.getElementById("totalAuxilioTransporte").innerHTML = numberToReal(totalAuxilioTransporte);
	document.getElementById("totalAuxilioSaude").innerHTML = numberToReal(auxilioSaude);
	document.getElementById("totalAuxilioCreche").innerHTML = numberToReal(totalAuxilioCreche);
	
	document.getElementById("totalDescontoIamspe").innerHTML = numberToReal(totalDescontoIamspe);
	document.getElementById("totalContribuicaoPrevidenciaria").innerHTML = 
	numberToReal(totalContribuicaoPrevidenciaria);
	document.getElementById("totalIRPF").innerHTML = 
	numberToReal(totalIRPF);
	
	document.getElementById("totalAdicionalQualificacao").innerHTML = 
	numberToReal(adicionalQualificacao);
	
	document.getElementById("totalAdicionalTempoServico").innerHTML = 
	numberToReal(adicionalTempoServico);
	
	document.getElementById("remuneracaoBruta").innerHTML = numberToReal(remuneracaoBruta);
	document.getElementById("remuneracaoLiquida").innerHTML = numberToReal(remuneracaoLiquida);

}
