function calcular() {

    camposCalculoId = [
        'cargo', 'padrao', 'tempo', 'percentualGliep', 'faltas', 'despesasMedicas'
    ];
    camposResultadoId = [
        'vencimento', 'gliep', 'ats', 'remuneracaoBruta', 'previdencia', 'irpf', 'alimentacao',
        'liquido', 'refeicao', 'total', 'extraTeto', 'auxilioSaude'
    ];

    camposCalculo = {};
    camposResultado = {};
    
    for (campoCalculoId of camposCalculoId) {
        camposCalculo[campoCalculoId] = document.getElementById(campoCalculoId).value;
    }

    for (campoResultadoId of camposResultadoId) {
        camposResultado[campoResultadoId] = document.getElementById(campoResultadoId);
    }

    let idades = [];
    for (let idade of document.getElementsByClassName('idadeSaude')) {
        if (idade.value) {
            idades.push(idade.value);
        }
    }

    camposResultado['vencimento'].innerHTML = numeroParaMoeda(calcularVencimentoBasico(camposCalculo['cargo'],
        camposCalculo['padrao']));
    camposResultado['gliep'].innerHTML = numeroParaMoeda(calcularGliep(camposCalculo['cargo'],
        camposCalculo['percentualGliep']));
    bruto = calcularBruto(camposCalculo['cargo'], camposCalculo['padrao'], camposCalculo['tempo'],
                             camposCalculo['percentualGliep']);
    baseAts = calcularBruto(camposCalculo['cargo'], camposCalculo['padrao'], 0, 0);
    camposResultado['ats'].innerHTML = numeroParaMoeda(calcularAts(baseAts, camposCalculo['tempo']));
    camposResultado['remuneracaoBruta'].innerHTML = numeroParaMoeda(bruto);

    extra = calcularExtraTeto(bruto);
    if (extra > 0) {
        bruto = tetoMunicipioSp;
    } 
    camposResultado['extraTeto'].innerHTML = numeroParaMoeda(extra);

    let previdencia = calcularPrevidencia(bruto);
    camposResultado['previdencia'].innerHTML = numeroParaMoeda(previdencia);

    let irpf = calcularIrpf(bruto - previdencia)
    camposResultado['irpf'].innerHTML = numeroParaMoeda(irpf);

    camposResultado['alimentacao'].innerHTML = numeroParaMoeda(auxilioAlimentacao);

    let refeicao = calcularAuxilioRefeicao(camposCalculo['faltas']);
    camposResultado['refeicao'].innerHTML = numeroParaMoeda(refeicao);

    let saude = 0.0;
    let totalReembolso = idades.map(i => calcularAuxilioSaude(i)).reduce((i, j) =>  i + j);
    if (camposCalculo['despesasMedicas'] > totalReembolso) {
        saude = parseFloat(totalReembolso);
    } else {
        saude = parseFloat(camposCalculo['despesasMedicas']);
    }
    camposResultado['auxilioSaude'].innerHTML = numeroParaMoeda(saude);

    let liquido = bruto - previdencia - irpf + auxilioAlimentacao + refeicao + saude;
    camposResultado['liquido'].innerHTML = numeroParaMoeda(liquido);
};

