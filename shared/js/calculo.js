/**
 * Calcula o IRPF da base de cálculo (rendimento bruto - contribuição previdenciária)
 * @param {*} baseCalculo 
 * @returns 
 */
function calcularIrpf(remuneracao, baseCalculo) {
    
    const faixas = [
      { limite: 3036, aliquota: 0.075, deducao: 182.16 },
      { limite: 3533.31, aliquota: 0.15, deducao: 394.16 },
      { limite: 4688.85, aliquota: 0.225, deducao: 675.49 },
      { limite: 5830.85, aliquota: 0.275, deducao: 908.73 }
    ];

    if (remuneracao > faixas[0].limite && remuneracao <= faixas[1].limite) {
		return baseCalculo * faixas[0].aliquota - faixas[0].deducao;
    }

    if (remuneracao > faixas[1].limite && remuneracao <= faixas[2].limite) {
        return baseCalculo * faixas[1].aliquota - faixas[1].deducao;
    }

    if (remuneracao > faixas[2].limite && remuneracao <= faixas[3].limite) {
		return baseCalculo * faixas[2].aliquota - faixas[2].deducao;
    }

    if (remuneracao > faixas[3].limite) {
		return baseCalculo * faixas[3].aliquota - faixas[3].deducao;
    }

	return 0.0;

}

/**
 * Retorna o valor do teto do INSS.
 * @returns 
 */
function obterTetoInss() {
    return 8157.41;
}

/**
 * Transforma número em moeda.
 * @param {*} numero 
 * @returns 
 */
function numeroParaMoeda(valor) {
	let numero = parseFloat(valor).toFixed(2).split('.');
	numero[0] = 'R$ ' + numero[0].split(/(?=(?:...)*$)/).join('.');
	return numero.join(',');
}