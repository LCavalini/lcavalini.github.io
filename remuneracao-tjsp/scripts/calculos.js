function numberToReal(numero) {
	let resultado = numero.toFixed(2).split('.');
	resultado[0] = "R$ " + resultado[0].split(/(?=(?:...)*$)/).join('.');
	return resultado.join(',');
}

function calcSallary() {
	
	// valores atualizados até 04/2023
	const base =  1968.34;
	const gaj =  3.951 * 972.37; // PORTARIA Nº 10.231/2023
	const auxilioCreche = 522; // PORTARIA Nº 10.282/2023
	const auxilioAlimentacao = 60; // PORTARIA Nº 10.227/2023
	const auxilioTransporte = 8.8;
	const auxilioSaude = 500; // PORTARIA Nº 10.228/2023
	const percentualAcrescimoAuxilioSaude = 0.5; // PORTARIA Nº 10.258/2023
	const descontoIamspe = 0.02;
	
	// valores atualizados até 06/2019
	const faixasIRPF = [
		{limite: 1903.98, aliquota: 0.075, deducao: 142.8},
		{limite: 2826.65, aliquota: 0.15, deducao: 354.8},
		{limite: 3751.05, aliquota: 0.225, deducao: 636.13},
		{limite: 4664.68, aliquota: 0.275, deducao: 869.36}
	];
	const deducaoDependenteIRPF = 189.59;
	
	// valor atualizado até 03/2023
	const faixasContribuicaoPrevidenciaria = [
		{limite: 1302.01, aliquota: 0.11, deducao: 0},
		{limite: 3722.57, aliquota: 0.12, deducao: 13.02},
		{limite: 7507.49, aliquota: 0.14, deducao: 87.47},
		{limite: Infinity, aliquota: 0.16, deducao: 237.62}
	];

	// obtém os parâmetros fornecidos pelo usuário
	let diasTransporte = Number(document.getElementById("diasTransporte").value);
	let diasAlimentacao = Number(document.getElementById("diasAlimentacao").value);
	let numAuxilioCreche = Number(document.getElementById("auxilioCreche").value);
	let formacaoAcademica = Number(document.getElementById("formacaoAcademica").value);
	let iamspe = Number(document.getElementById("iamspe").value);
	let agregadosIamspe = Number(document.getElementById("agregadosIamspe").value);
	let dependentes = Number(document.getElementById("dependentes").value);
	let quinquenios = Number(document.getElementById("quinquenios").value);
	let acrescimoAuxilioSaude = Number(document.getElementById("acrescimoAuxilioSaude").value);
	let adicionalQualificacao = formacaoAcademica * (base + gaj);
	let adicionalTempoServico = 0.0;
	let totalContribuicaoPrevidenciaria = 0.0;
	
	// com sexta parte (20 anos = 4 quinquenios)
	if (quinquenios >= 4) {
		adicionalTempoServico = (0.05 * quinquenios + 0.2) * (base + gaj);
	} else { // sem sexta parte
		adicionalTempoServico = 0.05 * quinquenios * (base + gaj);
	}
				
	// cálculo dos auxílios
	let totalAuxilioAlimentacao = diasAlimentacao * auxilioAlimentacao;
	let totalAuxilioTransporte = diasTransporte * auxilioTransporte;
	let totalAuxilioCreche = numAuxilioCreche * auxilioCreche;
	let totalAdicionais = adicionalQualificacao + adicionalTempoServico;
	let totalAuxilioSaude = auxilioSaude * (1 + acrescimoAuxilioSaude * percentualAcrescimoAuxilioSaude);
	let vencimentos = base + gaj;
	let baseCalculoDeducoes = base + gaj + adicionalQualificacao + adicionalTempoServico;
	
	// cálculo das deduções
	let totalDescontoIamspe = (iamspe + agregadosIamspe) * descontoIamspe * baseCalculoDeducoes;			
	let totalDeducaoDependenteIRPF = dependentes * deducaoDependenteIRPF;

	if (baseCalculoDeducoes <= faixasContribuicaoPrevidenciaria[0].limite) {
		totalContribuicaoPrevidenciaria = baseCalculoDeducoes * faixasContribuicaoPrevidenciaria[0].aliquota - faixasContribuicaoPrevidenciaria[0].deducao;
	} else if (baseCalculoDeducoes <= faixasContribuicaoPrevidenciaria[1].limite) {
		totalContribuicaoPrevidenciaria = baseCalculoDeducoes * faixasContribuicaoPrevidenciaria[1].aliquota - faixasContribuicaoPrevidenciaria[1].deducao;
	} else if (baseCalculoDeducoes <= faixasContribuicaoPrevidenciaria[2].limite) {
		totalContribuicaoPrevidenciaria = baseCalculoDeducoes * faixasContribuicaoPrevidenciaria[2].aliquota - faixasContribuicaoPrevidenciaria[2].deducao;
	} else {
		totalContribuicaoPrevidenciaria = baseCalculoDeducoes * faixasContribuicaoPrevidenciaria[3].aliquota - faixasContribuicaoPrevidenciaria[3].deducao;
	}
		
	let baseCalculoIRPF = baseCalculoDeducoes - totalDeducaoDependenteIRPF - totalContribuicaoPrevidenciaria;
	
	// cálculo do IRPF de acordo com as faixas
	if (baseCalculoIRPF > faixasIRPF[0].limite && baseCalculoIRPF <= faixasIRPF[1].limite) {
		totalIRPF = baseCalculoIRPF * faixasIRPF[0].aliquota - faixasIRPF[0].deducao;
	} else if(baseCalculoIRPF > faixasIRPF[1].limite && baseCalculoIRPF <= faixasIRPF[2].limite) {
		totalIRPF = baseCalculoIRPF * faixasIRPF[1].aliquota - faixasIRPF[1].deducao;
	} else if(baseCalculoIRPF > faixasIRPF[2].limite && baseCalculoIRPF <= faixasIRPF[3].limite) {
		totalIRPF = baseCalculoIRPF * faixasIRPF[2].aliquota - faixasIRPF[2].deducao;
	} else if(baseCalculoIRPF > faixasIRPF[3].limite) {
		totalIRPF = baseCalculoIRPF * faixasIRPF[3].aliquota - faixasIRPF[3].deducao;
	} else {
		totalIRPF = 0;
	}
	
	let totalAuxilios =  totalAuxilioAlimentacao + totalAuxilioTransporte + totalAuxilioCreche + totalAuxilioSaude;
	let remuneracaoBruta = baseCalculoDeducoes + totalAuxilios;
	let totalDescontos = totalDescontoIamspe + totalContribuicaoPrevidenciaria + totalIRPF
	let remuneracaoLiquida = remuneracaoBruta - totalDescontos;
	
	document.getElementById("totalAuxilioAlimentacao").innerHTML = numberToReal(totalAuxilioAlimentacao);
	document.getElementById("totalAuxilioTransporte").innerHTML = numberToReal(totalAuxilioTransporte);
	document.getElementById("totalAuxilioSaude").innerHTML = numberToReal(totalAuxilioSaude);
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
	
	document.getElementById("base").innerHTML = numberToReal(base);
	document.getElementById("gaj").innerHTML = numberToReal(gaj);
	document.getElementById("vencimentos").innerHTML = numberToReal(vencimentos);
	for (elementoTotalAdicionais of document.getElementsByClassName("totalAdicionais")) {
		elementoTotalAdicionais.innerHTML = numberToReal(totalAdicionais);
	}
	for (elementoTotalAuxilios of document.getElementsByClassName("totalAuxilios")) {
		elementoTotalAuxilios.innerHTML = numberToReal(totalAuxilios);
	}
	for (elementoTotalDescontos of document.getElementsByClassName("totalDescontos")) {
		elementoTotalDescontos.innerHTML = numberToReal(totalDescontos);
	}
	document.getElementById("remuneracaoBruta").innerHTML = numberToReal(remuneracaoBruta);
	document.getElementById("remuneracaoLiquida").innerHTML = numberToReal(remuneracaoLiquida);

}
