function numberToReal(numero) {
	let resultado = numero.toFixed(2).split('.');
	resultado[0] = "R$ " + resultado[0].split(/(?=(?:...)*$)/).join('.');
	return resultado.join(',');
}

function calcSallary() {
	
	// valores atualizados até 04/2023
	const base = [
		{ cargo: "", valor: 1968.34 },
		{ cargo: "csj", valor: 2687.15 }
	];
	const baseGratificacao = 972.37;
	// RESOLUÇÃO N° 923/2024
	const multiplicadoresGaj = [
		{ cargo: "", valor:  4.191 },
		{ cargo: "etjGab", valor: 5.367 },
		{ cargo: "ajc", valor: 6.187 },
		{ cargo: "csj", valor: 5.948 }
	];
	const multiplicadoresRepr = [
		{ cargo: "", valor: 0.0 },
		{ cargo: "etjGab", valor: 0.434 },
		{ cargo: "ajc", valor: 1.815 },
		{ cargo: "csj", valor: 0.283 }
	];
	const auxilioCreche = 700; // PORTARIA Nº 10.282/2023
	const auxilioFillhoDeficiencia = 1050; // PORTARIA Nº 10.428/2024
	const auxilioAlimentacao = 65; // PORTARIA Nº 10.425/2024
	const auxilioTransporte = 12; // PORTARIA Nº 10.442/2024
	const auxilioSaude = 520; // PORTARIA Nº 10.426/2024
	const percentuaisAuxilioSaude = [ 
		1,  1.04, 1.06, 1.1, 1.67, 1.71
	]; // PORTARIA Nº 10.426/2024

	// valores atualizados até 01/04/2024
	const faixasIRPF = [
		{ limite: 2259.20, aliquota: 0.075, deducao: 169.44 },
		{ limite: 2828.66, aliquota: 0.15, deducao: 381.44 },
		{ limite: 3751.06, aliquota: 0.225, deducao: 662.77 },
		{ limite: 4664.68, aliquota: 0.275, deducao: 896.00 }
	];
	const deducaoDependenteIRPF = 189.59;
	
	// valor atualizado até 01/2024
	const faixasContribuicaoPrevidenciaria = [
		{limite: 1412.00, aliquota: 0.11, deducao: 0},
		{limite: 3842.09, aliquota: 0.12, deducao: 14.12},
		{limite: 7786.02, aliquota: 0.14, deducao: 90.96},
		{limite: Infinity, aliquota: 0.16, deducao: 246.68}
	];

	const tetoInss = 7786.02;

	// obtém os parâmetros fornecidos pelo usuário
	let cargo = document.getElementById("cargo").value;
	let diasTransporte = Number(document.getElementById("diasTransporte").value);
	let diasAlimentacao = Number(document.getElementById("diasAlimentacao").value);
	let numAuxilioCreche = Number(document.getElementById("auxilioCreche").value);
	let numAuxilioFilhoDeficiencia = Number(document.getElementById("auxilioFilhoDeficiencia").value);
	let formacaoAcademica = Number(document.getElementById("formacaoAcademica").value);
	let iamspe = Number(document.getElementById("iamspe").value);
	let agregadosIamspeIdadeInferior = Number(document.getElementById("agregadosIamspeIdadeInferior").value);
	let agregadosIamspeIdadeSuperior = Number(document.getElementById("agregadosIamspeIdadeSuperior").value);
	let dependentesIamspeIdadeInferior = Number(document.getElementById("dependentesIamspeIdadeInferior").value);
	let dependentesIamspeIdadeSuperior = Number(document.getElementById("dependentesIamspeIdadeSuperior").value);
	let dependentes = Number(document.getElementById("dependentes").value);
	let quinquenios = Number(document.getElementById("quinquenios").value);
	let acrescimoAuxilioSaude = Number(document.getElementById("acrescimoAuxilioSaude").value);
	let faixaEtariaAuxilioSaude = Number(document.getElementById("faixaEtariaAuxilioSaude").value);

	let multiplicadorGaj = multiplicadoresGaj.filter(m => m.cargo == cargo).length == 1
		? multiplicadoresGaj.filter(m => m.cargo == cargo)[0]
		: multiplicadoresGaj.filter(m => m.cargo == "")[0];
	let multiplicadorRepr = multiplicadoresRepr.filter(m => m.cargo == cargo).length == 1
		? multiplicadoresRepr.filter(m => m.cargo == cargo)[0]
		: multiplicadoresRepr.filter(m => m.cargo == "")[0];
	let gaj = multiplicadorGaj.valor * baseGratificacao;
	let repr = multiplicadorRepr.valor * baseGratificacao;
	let valorBase = base.filter(b => b.cargo == cargo).length == 1
		? base.filter(b => b.cargo == cargo)[0].valor
		: base.filter(b => b.cargo == "")[0].valor;
	let vencimentos = valorBase + gaj + repr;
	// Assistente Judiciário não recebe adicional de nível superior.
	let adicionalQualificacao = cargo == "ajc" && formacaoAcademica == 0.05
		? 0.0
		: formacaoAcademica * (vencimentos);
	let adicionalTempoServico = 0.0;
	let totalContribuicaoPrevidenciaria = 0.0;
	
	// com sexta parte (20 anos = 4 quinquenios)
	if (quinquenios >= 4) {
		adicionalTempoServico = (0.05 * quinquenios + 0.2) * (vencimentos);
	} else { // sem sexta parte
		adicionalTempoServico = 0.05 * quinquenios * (vencimentos);
	}
				
	// cálculo dos auxílios
	let totalAuxilioAlimentacao = diasAlimentacao * auxilioAlimentacao;
	let totalAuxilioTransporte = diasTransporte * auxilioTransporte;
	let totalAuxilioCreche = numAuxilioCreche * auxilioCreche;
	let totalAuxilioFilhoDeficiencia = numAuxilioFilhoDeficiencia * auxilioFillhoDeficiencia;
	let totalAdicionais = adicionalQualificacao + adicionalTempoServico;
	let totalAuxilioSaude = faixaEtariaAuxilioSaude != null && faixaEtariaAuxilioSaude > 0 && faixaEtariaAuxilioSaude < 6
		? Math.ceil(auxilioSaude * percentuaisAuxilioSaude[faixaEtariaAuxilioSaude]) * acrescimoAuxilioSaude
		: auxilioSaude * acrescimoAuxilioSaude;
	let baseCalculoDeducoes = vencimentos + adicionalQualificacao + adicionalTempoServico;
	
	// cálculo das deduções
	let descontoIamspeAgregados = agregadosIamspeIdadeInferior * 0.02 + agregadosIamspeIdadeSuperior * 0.03;
	let descontoIamspeDependentes = dependentesIamspeIdadeInferior * 0.005 + dependentesIamspeIdadeSuperior * 0.01;
	let totalDescontoIamspe = (iamspe + descontoIamspeAgregados + descontoIamspeDependentes) * baseCalculoDeducoes;			
	let totalDeducaoDependenteIRPF = dependentes * deducaoDependenteIRPF;

	// a contribuição previdenciária SPPREV é limitada ao teto do INSS
	let baseCalculoPrevidencia = baseCalculoDeducoes > tetoInss ? tetoInss : baseCalculoDeducoes;
	if (baseCalculoPrevidencia <= faixasContribuicaoPrevidenciaria[0].limite) {
		totalContribuicaoPrevidenciaria = baseCalculoPrevidencia * faixasContribuicaoPrevidenciaria[0].aliquota - faixasContribuicaoPrevidenciaria[0].deducao;
	} else if (baseCalculoPrevidencia <= faixasContribuicaoPrevidenciaria[1].limite) {
		totalContribuicaoPrevidenciaria = baseCalculoPrevidencia * faixasContribuicaoPrevidenciaria[1].aliquota - faixasContribuicaoPrevidenciaria[1].deducao;
	} else if (baseCalculoPrevidencia <= faixasContribuicaoPrevidenciaria[2].limite) {
		totalContribuicaoPrevidenciaria = baseCalculoPrevidencia * faixasContribuicaoPrevidenciaria[2].aliquota - faixasContribuicaoPrevidenciaria[2].deducao;
	} else {
		totalContribuicaoPrevidenciaria = baseCalculoPrevidencia * faixasContribuicaoPrevidenciaria[3].aliquota - faixasContribuicaoPrevidenciaria[3].deducao;
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
	
	let totalAuxilios =  totalAuxilioAlimentacao + totalAuxilioTransporte + totalAuxilioCreche +
		totalAuxilioFilhoDeficiencia + totalAuxilioSaude;
	let remuneracaoBruta = baseCalculoDeducoes + totalAuxilios;
	let totalDescontos = totalDescontoIamspe + totalContribuicaoPrevidenciaria + totalIRPF
	let remuneracaoLiquida = remuneracaoBruta - totalDescontos;
	
	document.getElementById("totalAuxilioAlimentacao").innerHTML = numberToReal(totalAuxilioAlimentacao);
	document.getElementById("totalAuxilioTransporte").innerHTML = numberToReal(totalAuxilioTransporte);
	document.getElementById("totalAuxilioSaude").innerHTML = numberToReal(totalAuxilioSaude);
	document.getElementById("totalAuxilioCreche").innerHTML = numberToReal(totalAuxilioCreche);
	document.getElementById("totalAuxilioFilhoDeficiencia").innerHTML = numberToReal(totalAuxilioFilhoDeficiencia);
	document.getElementById("totalDescontoIamspe").innerHTML = numberToReal(totalDescontoIamspe);
	document.getElementById("totalContribuicaoPrevidenciaria").innerHTML = 
		numberToReal(totalContribuicaoPrevidenciaria);
	document.getElementById("totalIRPF").innerHTML = 
		numberToReal(totalIRPF);
	
	document.getElementById("totalAdicionalQualificacao").innerHTML = 
	numberToReal(adicionalQualificacao);
	
	document.getElementById("totalAdicionalTempoServico").innerHTML = 
	numberToReal(adicionalTempoServico);
	
	document.getElementById("base").innerHTML = numberToReal(valorBase);
	document.getElementById("gaj").innerHTML = numberToReal(gaj);
	document.getElementById("repr").innerHTML = numberToReal(repr);
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
