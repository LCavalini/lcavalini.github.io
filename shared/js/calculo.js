
/**
 * Calcula o IRPF da base de cálculo (rendimento bruto - contribuição previdenciária)
 * @param {*} baseCalculo 
 * @returns 
 */
function calcularIrpf(baseCalculo) {
    
    const faixas = [
        { limite: 2259.20, aliquota: 0.075, deducao: 169.44 },
        { limite: 2828.66, aliquota: 0.15, deducao: 381.44 },
        { limite: 3751.06, aliquota: 0.225, deducao: 662.77 },
        { limite: 4664.68, aliquota: 0.275, deducao: 896.00 }
    ];

    if (baseCalculo > faixas[0].limite && baseCalculo <= faixas[1].limite) {
		return baseCalculo * faixas[0].aliquota - faixas[0].deducao;
    }

    if (baseCalculo > faixas[1].limite && baseCalculo <= faixas[2].limite) {
        return baseCalculo * faixas[1].aliquota - faixas[1].deducao;
    }

    if (baseCalculo > faixas[2].limite && baseCalculo <= faixas[3].limite) {
		return baseCalculo * faixas[2].aliquota - faixas[2].deducao;
    }

    if (baseCalculo > faixas[3].limite) {
		return baseCalculo * faixas[3].aliquota - faixas[3].deducao;
    }

	return 0.0;

}

/**
 * Retorna o valor do teto do INSS.
 * @returns 
 */
function obterTetoInss() {
    return 7786.02;
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