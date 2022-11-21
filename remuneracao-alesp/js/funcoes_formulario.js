function numeroParaMoeda(numero) {

	var numero = numero.toFixed(2).split('.');
	numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
	return numero.join(',');
}

function calcular() {
    camposCalculoId = [
        "cargo", "nivel", "tempo", "percentualGed", "faltas", "iamspe", "idade", "auxilioPreEscolar", "despesasMedicas"
    ];
    camposResultadoId = [
        "vencimento", "gratificacaoLeg", "gratificacaoRepr", "ged", "ats", "remuneracaoBruta", "previdencia", "irpf",
        "deducaoIamspe", "alimentacao", "saude", "preEscolar", "liquido", "refeicao", "total"
    ];
    camposCalculo = {};
    camposResultado = {};
    for (campoCalculoId of camposCalculoId) {
        camposCalculo[campoCalculoId] = document.getElementById(campoCalculoId).value;
    }
    for (campoResultadoId of camposResultadoId) {
        camposResultado[campoResultadoId] = document.getElementById(campoResultadoId);
    }
    camposResultado["vencimento"].innerHTML = numeroParaMoeda(vencimentoBasico(camposCalculo["cargo"], camposCalculo["nivel"]));
    camposResultado["gratificacaoLeg"].innerHTML = numeroParaMoeda(gratificacaoLeg(camposCalculo["cargo"]));
    camposResultado["gratificacaoRepr"].innerHTML = numeroParaMoeda(gratificacaoRepr(camposCalculo["cargo"]));
    camposResultado["ged"].innerHTML = numeroParaMoeda(ged(camposCalculo["percentualGed"]));
    bruto = remuneracaoBruta(camposCalculo["cargo"], camposCalculo["nivel"], camposCalculo["tempo"],
                             camposCalculo["percentualGed"]);
    camposResultado["ats"].innerHTML = numeroParaMoeda(ats(bruto, camposCalculo["tempo"]));
    camposResultado["remuneracaoBruta"].innerHTML = numeroParaMoeda(bruto);
    previdencia = contribuicaoPrevidenciaria(bruto);
    camposResultado["previdencia"].innerHTML = numeroParaMoeda(previdencia);
    irpf = impostoRenda(bruto - previdencia)
    camposResultado["irpf"].innerHTML = numeroParaMoeda(irpf);
    if (camposCalculo["iamspe"] == 1)
        deducaoIamspe = iampse(bruto, camposCalculo["idade"], [], []);
    else deducaoIamspe = 0.00;
    camposResultado["deducaoIamspe"].innerHTML = numeroParaMoeda(deducaoIamspe);
    camposResultado["alimentacao"].innerHTML = numeroParaMoeda(auxilioAlimentacao);
    if (camposCalculo["despesasMedicas"] < auxilioSaude) saude = parseFloat(camposCalculo["despesasMedicas"]);
    else saude = auxilioSaude;
    console.log(numeroParaMoeda(saude))
    camposResultado["saude"].innerHTML = numeroParaMoeda(saude)
    if (camposCalculo["auxilioPreEscolar"] == 1) preEscolar = auxilioPreEscolar;
    else preEscolar = 0.00;
    camposResultado["preEscolar"].innerHTML = numeroParaMoeda(preEscolar);
    liquido = bruto - previdencia - irpf - deducaoIamspe + auxilioAlimentacao + saude + preEscolar;
    camposResultado["liquido"].innerHTML = numeroParaMoeda(liquido);
    camposResultado["refeicao"].innerHTML = numeroParaMoeda(auxilioRefeicao(camposCalculo["faltas"]));
    camposResultado["total"].innerHTML = numeroParaMoeda(auxilioRefeicao(camposCalculo["faltas"]) + liquido);
};
