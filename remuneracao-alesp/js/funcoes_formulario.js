function numeroParaMoeda(numero) {

	var numero = numero.toFixed(2).split('.');
	numero[0] = 'R$ ' + numero[0].split(/(?=(?:...)*$)/).join('.');
	return numero.join(',');
}

function calcular() {
    camposCalculoId = [
        'cargo', 'nivel', 'tempo', 'percentualGed', 'faltas', 'iamspe', 'idade', 'auxilioPreEscolar', 'despesasMedicas'];
    camposResultadoId = [
        'vencimento', 'gratificacaoLeg', 'gratificacaoRepr', 'ged', 'ats', 'remuneracaoBruta', 'previdencia', 'irpf',
        'deducaoIamspe', 'alimentacao', 'saude', 'preEscolar', 'liquido', 'refeicao', 'total', 'extraTeto',
        'adicionalQualificacao'
    ];
    camposCalculo = {};
    camposResultado = {};
    for (campoCalculoId of camposCalculoId) {
        camposCalculo[campoCalculoId] = document.getElementById(campoCalculoId).value;
    }
    for (campoResultadoId of camposResultadoId) {
        camposResultado[campoResultadoId] = document.getElementById(campoResultadoId);
    }
    camposResultado['vencimento'].innerHTML = numeroParaMoeda(vencimentoBasico(camposCalculo['cargo'],
                                                                               camposCalculo['nivel'],
                                                                               camposCalculo['tempo']));
    camposResultado['gratificacaoLeg'].innerHTML = numeroParaMoeda(gratificacaoLeg(camposCalculo['cargo']));
    camposResultado['gratificacaoRepr'].innerHTML = numeroParaMoeda(gratificacaoRepr(camposCalculo['cargo']));
    camposResultado['ged'].innerHTML = numeroParaMoeda(ged(camposCalculo['percentualGed']));
    let adicionaisQualificacao = [];
    let camposAdicionaisQualificacao = document.getElementsByClassName('adicionalQualificacao');
    for (let campo of camposAdicionaisQualificacao) {
        if (campo.checked == true && adicionaisQualificacao.length < 3) {
            adicionaisQualificacao.push(campo.name);
        }
    }
    qualificacao = adicionalQualificacao(adicionaisQualificacao);
    bruto = remuneracaoBruta(camposCalculo['cargo'], camposCalculo['nivel'], camposCalculo['tempo'],
                             camposCalculo['percentualGed'], qualificacao);
    baseAts = remuneracaoBruta(camposCalculo['cargo'], camposCalculo['nivel'], 0, 0, 0);
    camposResultado['ats'].innerHTML = numeroParaMoeda(ats(baseAts, camposCalculo['tempo']));
    camposResultado['adicionalQualificacao'].innerHTML = numeroParaMoeda(qualificacao);
    camposResultado['remuneracaoBruta'].innerHTML = numeroParaMoeda(bruto);
    extra = extraTeto(bruto);
    if (extra > 0) bruto = tetoEstadoSp;
    camposResultado['extraTeto'].innerHTML = numeroParaMoeda(extra);
    // O adicional de qualificação não entra na base de cálculo para a contribuição previdenciária.
    previdencia = contribuicaoPrevidenciaria(bruto - qualificacao);
    camposResultado['previdencia'].innerHTML = numeroParaMoeda(previdencia);
    irpf = calcularIrpf(bruto, bruto - previdencia);
    camposResultado['irpf'].innerHTML = numeroParaMoeda(irpf);
    if (camposCalculo['iamspe'] == 1)
        deducaoIamspe = iampse(bruto, camposCalculo['idade'], [], []);
    else deducaoIamspe = 0.00;
    camposResultado['deducaoIamspe'].innerHTML = numeroParaMoeda(deducaoIamspe);
    camposResultado['alimentacao'].innerHTML = numeroParaMoeda(auxilioAlimentacao);
    if (camposCalculo['despesasMedicas'] < auxilioSaude(camposCalculo['idade'])) saude = parseFloat(camposCalculo['despesasMedicas']);
    else saude = auxilioSaude(camposCalculo['idade']);
    camposResultado['saude'].innerHTML = numeroParaMoeda(saude)
    if (camposCalculo['auxilioPreEscolar'] == 1) preEscolar = auxilioPreEscolar;
    else preEscolar = 0.00;
    camposResultado['preEscolar'].innerHTML = numeroParaMoeda(preEscolar);
    liquido = bruto - previdencia - irpf - deducaoIamspe + auxilioAlimentacao + saude + preEscolar;
    camposResultado['liquido'].innerHTML = numeroParaMoeda(liquido);
    camposResultado['refeicao'].innerHTML = numeroParaMoeda(auxilioRefeicao(camposCalculo['faltas']));
    camposResultado['total'].innerHTML = numeroParaMoeda(auxilioRefeicao(camposCalculo['faltas']) + liquido);
};
