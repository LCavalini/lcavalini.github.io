function converterNumeroParaMoeda(numero) {
	let resultado = numero.toFixed(2).split('.');
	resultado[0] = "R$ " + resultado[0].split(/(?=(?:...)*$)/).join('.');
	return resultado.join(',');
}

function extrairCamposCalculo() {
    const camposCalculoId = [
        "cargo", "nivel", "grau", "tempo", "diasAuxilioRefeicao", "diasAuxilioTransporte", "iamspe", "idade",
        "auxilioPreEscolar"
    ];
    return camposCalculoId.reduce((prev, curr) => (prev[curr] = document.getElementById(curr).value, prev), {});
}

function extrairCamposResultado() {
    const camposResultadoId = [
        "vencimento", "gratificacao", "ats", "remuneracaoBruta", "previdencia", "irpf", "deducaoIamspe", "refeicao",
        "alimentacao", "saude", "transporte", "preEscolar", "total", "extraTeto"
    ];
    return camposResultadoId.reduce((prev, curr) => (prev[curr] = document.getElementById(curr), prev), {});
}

function calcular() {
    const camposCalculo = extrairCamposCalculo();
    const camposResultado = extrairCamposResultado();

    const vencimentos = calcularVencimentoBasico(camposCalculo["cargo"], camposCalculo["nivel"], camposCalculo["grau"]);
    if (vencimentos == undefined) {
        alert(`Não existe grau ${camposCalculo["grau"].replace("grau", "")} no nível ${camposCalculo["nivel"].replace("nivel", "")}.`);
        return;
    }
    camposResultado["vencimento"].innerHTML = converterNumeroParaMoeda(vencimentos);

    const gratificacao = vencimentos * 0.1; // A gratificação de controle externo é definida na LC 1.368/2021.
    camposResultado["gratificacao"].innerHTML = converterNumeroParaMoeda(gratificacao);

    let bruto = calcularRemuneracaoBruta(camposCalculo["cargo"], camposCalculo["nivel"], camposCalculo["grau"],
        camposCalculo["tempo"]);
    camposResultado["remuneracaoBruta"].innerHTML = converterNumeroParaMoeda(bruto);

    const ats = calcularAts(vencimentos, camposCalculo["tempo"])
    camposResultado["ats"].innerHTML = converterNumeroParaMoeda(ats);
    
    const extra = calcularExtraTeto(bruto);
    camposResultado["extraTeto"].innerHTML = converterNumeroParaMoeda(extra);

    // Se houve valor extra-teto, limita ao teto.
    if (extra > 0) {
        bruto = teto;
    }
    
    const previdencia = calcularContribuicaoPrevidenciaria(bruto);
    camposResultado["previdencia"].innerHTML = converterNumeroParaMoeda(previdencia);

    const irpf = calcularImpostoRenda(bruto - previdencia)
    camposResultado["irpf"].innerHTML = converterNumeroParaMoeda(irpf);

    const deducaoIamspe = camposCalculo["iamspe"] == 1
        ? calcularIamspe(bruto, camposCalculo["idade"], [], [])
        : 0.00;
    camposResultado["deducaoIamspe"].innerHTML = converterNumeroParaMoeda(deducaoIamspe);

    const refeicao = calcularAuxilioRefeicao(camposCalculo["diasAuxilioRefeicao"]);
    const transporte = calcularAuxilioTransporte(camposCalculo["diasAuxilioTransporte"]);

    camposResultado["refeicao"].innerHTML = converterNumeroParaMoeda(refeicao);
    camposResultado["alimentacao"].innerHTML = converterNumeroParaMoeda(auxilioAlimentacao);
    const auxilioSaude = calcularAuxilioSaude(camposCalculo["cargo"], camposCalculo["idade"]);
    camposResultado["saude"].innerHTML = converterNumeroParaMoeda(auxilioSaude);
    camposResultado["transporte"].innerHTML = converterNumeroParaMoeda(transporte);

    const preEscolar = calcularAuxilioPreEscolar(camposCalculo["auxilioPreEscolar"]);
    camposResultado["preEscolar"].innerHTML = converterNumeroParaMoeda(preEscolar);

    const liquido = bruto - previdencia - irpf - deducaoIamspe +
        refeicao + auxilioAlimentacao + auxilioSaude + preEscolar + transporte;
    camposResultado["total"].innerHTML = converterNumeroParaMoeda(liquido);
};
