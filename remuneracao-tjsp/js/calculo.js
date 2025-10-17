function numberToReal(numero) {
	let resultado = numero.toFixed(2).split('.');
	resultado[0] = "R$ " + resultado[0].split(/(?=(?:...)*$)/).join('.');
	return resultado.join(',');
}

function calcSallary() {
	
	// valores atualizados até 07/2025.
	const base = [
		{ cargo: "", valor: 1968.34 },
		{ cargo: "csj", valor: 2687.15 },
		{ cargo: "csjGab", valor: 2687.15 }
	];
	const baseGratificacao = 972.37;
	// Resolução nº 959/2025.
	const multiplicadoresGaj = [
		{ cargo: "", valor:  4.66516 },
		{ cargo: "estenotipista", valor: 4.66516 },
		{ cargo: "etjGabUpj", valor: 4.66516 },
		{ cargo: "etjGab", valor: 5.954 },
		{ cargo: "esadm", valor: 5.954 },
		{ cargo: "ajc", valor: 8.065 },
		{ cargo: "csj", valor: 6.61 },
		{ cargo: "csjGab", valor: 9.14637 }, // Não tenho a informação exata de quanto é GAJ e quanto é Representação.
		{ cargo: "ajur", valor: 11.105 },
		{ cargo: "coord", valor: 11.661 },
		{ cargo: "super", valor: 10.9438 },
		{ cargo: "eqgab", valor: 4.66516 } // Comunicado SGP nº 58/2025.
	];
	const multiplicadoresRepr = [
		{ cargo: "", valor: 0.0 },
		{ cargo: "etjGabUpj", valor: 0.6999 },  // COMUNICADO Nº 94/2024 SGP.
		{ cargo: "etjGab", valor: 0.434 },
		{ cargo: "esadm", valor: 0.434 },
		{ cargo: "ajc", valor: 1.815 },
		{ cargo: "csj", valor: 0.283 },
		{ cargo: "csjGab", valor: 0.283 },
		{ cargo: "estenotipista", valor: 2.424 },
		{ cargo: "ajur", valor: 3.35149 },
		{ cargo: "coord", valor: 3.56111 },
		{ cargo: "super", valor: 2.89087 },
		{ cargo: "eqgab", valor: 1 }
	];
	const valoresProgressao = [
		{ padrao: "5A-CE", valor: 0.0 },
		{ padrao: "5B-CE", valor: 29.53 },
		{ padrao: "5C-CE", valor: 59.49},
		{ padrao: "5D-CE", valor: 89.91 },
		{ padrao: "5E-CE", valor: 120.79 },
		{ padrao: "5F-CE", valor: 152.12 },
		{ padrao: "5G-CE", valor: 215.74 },
		{ padrao: "5H-CE", valor: 248.5 },
		{ padrao: "5I-CE", valor: 281.75 },
		{ padrao: "5J-CE", valor: 315.5 },
		{ padrao: "5K-CE", valor: 349.76 },
		{ padrao: "5L-CE", valor: 384.53 },
		{ padrao: "5M-CE", valor: 455.12 },
		{ padrao: "5N-CE", valor: 491.47 },
		{ padrao: "5O-CE", valor: 528.37 },
		{ padrao: "5P-CE", valor: 565.82 },
		{ padrao: "5Q-CE", valor: 603.83 },
		{ padrao: "5R-CE", valor: 642.41 }
	]
	const auxilioCreche = 805; // COMUNICADO Nº 35/2025 SGP.
	const auxilioFillhoDeficiencia = 1207.5; // COMUNICADO Nº 35/2025 SGP.
	const auxilioAlimentacao = 80; // COMUNICADO Nº 35/2025 SGP.
	const auxilioTransporte = 14; // PORTARIA Nº 10.536/2025.
	const auxilioSaude = 718; // COMUNICADO Nº 94/2024 SGP.
	const percentuaisAuxilioSaude = [ 
		1,  1.04, 1.06, 1.1, 1.67, 1.71
	]; // COMUNICADO Nº 94/2024 SGP.

	const deducaoDependenteIRPF = 189.59;
	
	// valor atualizado até 01/2025
	// fonte: https://www.apatej.org.br/portaria-da-spprev-estabelece-aliquotas-de-contribuicao-previdenciaria-para-servidores.
	const faixasContribuicaoPrevidenciaria = [
		{limite: 1518.00, aliquota: 0.11, deducao: 0},
		{limite: 4022.46, aliquota: 0.12, deducao: 15.18},
		{limite: 8157.41, aliquota: 0.14, deducao: 95.63},
		{limite: Infinity, aliquota: 0.16, deducao: 258.78}
	];

	const cargoNivelSuperior = [
		"ajc", "ajur", "coord", "super"
	]

	// valor atualizado até 01/2025.
	const tetoInss = 8157.41;

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
	let padraoVecimento = document.getElementById("padraoVencimento").value;

	let multiplicadorGaj = multiplicadoresGaj.filter(m => m.cargo == cargo).length == 1
		? multiplicadoresGaj.filter(m => m.cargo == cargo)[0]
		: multiplicadoresGaj.filter(m => m.cargo == "")[0];
	let multiplicadorRepr = multiplicadoresRepr.filter(m => m.cargo == cargo).length == 1
		? multiplicadoresRepr.filter(m => m.cargo == cargo)[0]
		: multiplicadoresRepr.filter(m => m.cargo == "")[0];
	let gaj = multiplicadorGaj.valor * baseGratificacao;
	let repr = multiplicadorRepr.valor * baseGratificacao;
	let adicionalProgressao = valoresProgressao.filter(v => v.padrao == padraoVecimento).length == 1
		? valoresProgressao.filter(v => v.padrao == padraoVecimento)[0].valor
		: valoresProgressao.filter(v => v.padrao == "5A-CE")[0].valor;
	let valorBase = base.filter(b => b.cargo == cargo).length == 1
		? base.filter(b => b.cargo == cargo)[0].valor
		: base.filter(b => b.cargo == "")[0].valor;
	let vencimentos = valorBase + gaj + repr + adicionalProgressao;
	let adicionalQualificacao = cargoNivelSuperior.includes(cargo)  && formacaoAcademica == 0.05
		? 0.0
		: formacaoAcademica * (vencimentos);
	let adicionalTempoServico = 0.0;
	let totalContribuicaoPrevidenciaria = 0.0;
	
	// com sexta parte (20 anos = 4 quinquenios)
	// COMUNICADO Nº 94/2024 SGP: incluiu o adicional de qualificação na base de cálculo do adicional de tempo.
	if (quinquenios >= 4) {
		adicionalTempoServico = (0.05 * quinquenios + 0.2) * (vencimentos + adicionalQualificacao);
	} else { // sem sexta parte
		adicionalTempoServico = 0.05 * quinquenios * (vencimentos + adicionalQualificacao);
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
	
	let totalIRPF = calcularIrpf(baseCalculoDeducoes, baseCalculoIRPF);
	
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
	document.getElementById("progressao").innerHTML = numberToReal(adicionalProgressao);
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
