class Formulario {

    static camposCalculoIds = [
        'cargo', 'padrao-vencimento', 'tempo', 'percentual-gliep', 'dias-trabalhados', 'beneficiarios-auxilio-saude',
        'percentual-prevcom', 'funcao-gratificada', 'sindicalizado', 'regime-previdencia', 'gliep-previdencia',
        'participacao-comite'
    ];

    static camposCalculoClasses = [
        'idade-auxilio-saude', 'despesa-auxilio-saude'
    ];

    static camposResultadoIds = [
        'vencimento', 'valor-gliep', 'ats', 'remuneracao-bruta', 'previdencia', 'prevcom', 'irpf',
        'alimentacao', 'liquido', 'refeicao', 'total', 'extra-teto', 'auxilio-saude', 'liquido-dinheiro',
        'contrapartida-prevcom', 'acrescimo-fg', 'desconto-sindicato', 'indenizacao-comite'
    ];

    static padroesVencimentoConsultor = [
        { value: 15, label: 'QPL-15 (0 anos)' },
        { value: 16, label: 'QPL-16 (4 anos)' },
        { value: 17, label: 'QPL-17 (8 anos)' },
        { value: 18, label: 'QPL-18 (12 anos)' },
        { value: 19, label: 'QPL-19 (15 anos)' },
        { value: 20, label: 'QPL-20 (17 anos)' },
        { value: 21, label: 'QPL-21 (19 anos)' },
        { value: 22, label: 'QPL-22 (21 anos)' }
    ];

    static padroesVencimentoTecnico = [
        { value: 7, label: 'QPL-7 (0 anos)' },
        { value: 8, label: 'QPL-8 (4 anos)' },
        { value: 9, label: 'QPL-9 (8 anos)' },
        { value: 10, label: 'QPL-10 (12 anos)' },
        { value: 11, label: 'QPL-11 (14 anos)' },
        { value: 12, label: 'QPL-12 (15 anos)' },
        { value: 13, label: 'QPL-13 (16 anos)' },
        { value: 14, label: 'QPL-14 (17 anos)' },
        { value: 15, label: 'QPL-15 (18 anos)' },
        { value: 16, label: 'QPL-16 (19 anos)' },
        { value: 17, label: 'QPL-17 (20 anos)' },
        { value: 18, label: 'QPL-18 (21 anos)' }
    ];

    static percentuaisGliepConsultor = [
        { value: 0.0, label: 'Nenhum'},
        { value: 0.28, label: 'Qualificação básica exigida e aferição de produtividade'},
        { value: 0.35, label: '1º nível de especialização (2ª graduação superior ou especialização) e aferição de produtividade'},
        { value: 0.38, label: '2º nível de especialização (mestrado ou doutorado) e aferição de produtividade '}
    ];

    static percentuaisGliepTecnico = [
        { value: 0.0, label: 'Nenhum'},
        { value: 0.18, label: 'Qualificação básica exigida e aferição de produtividade'},
        { value: 0.23, label: '1º nível de especialização (graduação superior) e aferição de produtividade'},
        { value: 0.25, label: '2º nível de especialização (2ª graduação superior, especialização, mestrado ou doutorado) e aferição de produtividade '}
    ];

    // Valores reajustados a partir do Anexo da Lei nº 14.381/2007:
    // https://legislacao.prefeitura.sp.gov.br/leis/lei-14381-de-7-de-maio-de-2007
    static opcoesFuncaoGratificada = [
        { value: 0.0, label: 'Nenhum' },
        { value: 3608.98, label: 'FG-1' },
        { value: 7217.96, label: 'FG-2' },
        { value: 10826.94, label: 'FG-3' },
        { value: 14435.89, label: 'FG-4' }
    ];

    camposCalculo = [];
    camposResultado = [];

    cargo = '';
    padraoVencimento = 0;
    tempoExercicio = 0;
    percentualGliep = 0.0;
    percentualPrevcom = 0.0;
    diasTrabalhados = 0;
    idadesSaude = [];
    despesasMedicas = [];
    quantidadeBeneficiarios = 1;
    sindicalizado = 0;
    isRegimeAntigo = false;
    isIncluiGliepPrevidencia = true;
    isParticipacaoComite = false;

    vencimentoBasico = 0;
    valorGliep = 0;
    bruto = 0;
    ats = 0;
    extraTeto = 0;
    previdencia = 0;
    prevcom = 0;
    irpf = 0;
    alimentacao = 0;
    refeicao = 0;
    saude = 0;
    liquido = 0;
    liquidoDinheiro = 0;
    contrapartidaPrevcom = 0;
    acrescimoFg = 0;
    descontoSindicato = 0;
    indenizacaoComite = 0;

    constructor() {
        // Define os campos de cálculo (entrada de dados) e de resultado (saída de dados).
        Formulario.camposCalculoIds.forEach(id => {
            this.camposCalculo[id] = document.getElementById(id);
        });
        Formulario.camposCalculoClasses.forEach(classe => {
            this.camposCalculo[classe] = document.getElementsByClassName(classe);
        })
        Formulario.camposResultadoIds.forEach(id => {
            this.camposResultado[id] = document.getElementById(id);
        });
        this.recuperarEntrada();
    }

    atualizarBeneficiariosAuxilioSaude() {
        this.atualizarValoresCalculo();
        // O valor mínimo de quantidade de beneficiários do auxílio saúde é 1.
        if (this.quantidadeBeneficiarios < 1) {
            this.camposCalculo['beneficiarios-auxilio-saude'].value = 1;
            this.quantidadeBeneficiarios = 1;
        }
        // Limpa a área de dados do auxílio saúde e a reconstrói.
        let areaAuxilioSaude = document.getElementById('area-auxilio-saude');
        areaAuxilioSaude.innerHTML = '';
        for (let i = 0; i < this.quantidadeBeneficiarios; i++) {
            let fragmento = document.getElementById('depedente-auxilio-saude');
            areaAuxilioSaude.insertAdjacentHTML('beforeend', fragmento.innerHTML);
        }
        // Insere os valores anteriormente preenchidos.
        for (let i = 0; i < this.camposCalculo['idade-auxilio-saude'].length && i < this.idadesSaude.length; i++) {
            this.camposCalculo['idade-auxilio-saude'][i].value = this.idadesSaude[i];
        }
        for (let i = 0; i < this.camposCalculo['despesa-auxilio-saude'].length && i < this.despesasMedicas.length; i++) {
            this.camposCalculo['despesa-auxilio-saude'][i].value = this.despesasMedicas[i];
        }
    }

    alterarOptions(selectHtml, options) {
        selectHtml.innerHTML = '';
        options.forEach(option => {
            const element = document.createElement('option');
            element.value = option.value;
            element.innerHTML = option.label;
            selectHtml.appendChild(element);
        })
    }

    atualizarOpcoes() {
        this.atualizarValoresCalculo();
        if (this.cargo == 'consultor') {
            this.alterarOptions(this.camposCalculo['padrao-vencimento'], Formulario.padroesVencimentoConsultor);
            this.alterarOptions(this.camposCalculo['percentual-gliep'], Formulario.percentuaisGliepConsultor);
        } else if (this.cargo == 'tecnico') {
            this.alterarOptions(this.camposCalculo['padrao-vencimento'], Formulario.padroesVencimentoTecnico);
            this.alterarOptions(this.camposCalculo['percentual-gliep'], Formulario.percentuaisGliepTecnico);
        }
        this.alterarOptions(this.camposCalculo['funcao-gratificada'], Formulario.opcoesFuncaoGratificada);
    }

    atualizarRegimePrevidencia(form) {
        if (form.value == "1") {
            this.camposCalculo['percentual-prevcom'].value = 0;
            this.camposCalculo['percentual-prevcom'].disabled = true;
        } else {
            this.camposCalculo['percentual-prevcom'].value = 7.5;
            this.camposCalculo['percentual-prevcom'].disabled = false;
        }
    }

    atualizarValoresCalculo() {
        this.cargo = this.camposCalculo['cargo'].value;
        this.padraoVencimento = this.camposCalculo['padrao-vencimento'].value;
        this.tempoExercicio = this.camposCalculo['tempo'].value;
        this.percentualGliep = this.camposCalculo['percentual-gliep'].value;
        this.diasTrabalhados = this.camposCalculo['dias-trabalhados'].value;
        this.quantidadeBeneficiarios = this.camposCalculo['beneficiarios-auxilio-saude'].value;
        this.percentualPrevcom = this.camposCalculo['percentual-prevcom'].value;
        this.idadesSaude = [];
        this.acrescimoFg = this.camposCalculo['funcao-gratificada'].value;
        this.sindicalizado = this.camposCalculo['sindicalizado'].value;
        for (let idade of this.camposCalculo['idade-auxilio-saude']) {
            if (idade.value) {
                this.idadesSaude.push(idade.value);
            }
        }
        this.despesasMedicas = [];
        for (let despesa of this.camposCalculo['despesa-auxilio-saude']) {
            if (despesa.value) {
                this.despesasMedicas.push(despesa.value);
            }
        }
        this.isRegimeAntigo = this.camposCalculo['regime-previdencia'].value == "1";
        this.isIncluiGliepPrevidencia = this.camposCalculo['gliep-previdencia'].value == "1";
        this.isParticipacaoComite = this.camposCalculo['participacao-comite'].value == "1";
    }

    atualizarValoresResultado() {
        this.camposResultado['vencimento'].innerHTML = numeroParaMoeda(this.vencimentoBasico);
        this.camposResultado['valor-gliep'].innerHTML = numeroParaMoeda(this.valorGliep);
        this.camposResultado['extra-teto'].innerHTML = numeroParaMoeda(this.extraTeto);
        this.camposResultado['remuneracao-bruta'].innerHTML = numeroParaMoeda(this.bruto);
        this.camposResultado['ats'].innerHTML = numeroParaMoeda(this.ats);
        this.camposResultado['acrescimo-fg'].innerHTML = numeroParaMoeda(this.acrescimoFg);
        this.camposResultado['previdencia'].innerHTML = numeroParaMoeda(this.previdencia);
        this.camposResultado['prevcom'].innerHTML = numeroParaMoeda(this.prevcom);
        this.camposResultado['irpf'].innerHTML = numeroParaMoeda(this.irpf);
        this.camposResultado['desconto-sindicato'].innerHTML = numeroParaMoeda(this.descontoSindicato);
        this.camposResultado['alimentacao'].innerHTML = numeroParaMoeda(Calculo.auxilioAlimentacao);
        this.camposResultado['refeicao'].innerHTML = numeroParaMoeda(this.refeicao);
        this.camposResultado['auxilio-saude'].innerHTML = numeroParaMoeda(this.saude);
        this.camposResultado['liquido'].innerHTML = numeroParaMoeda(this.liquido);
        this.camposResultado['liquido-dinheiro'].innerHTML = numeroParaMoeda(this.liquidoDinheiro);
        this.camposResultado['contrapartida-prevcom'].innerHTML = numeroParaMoeda(this.contrapartidaPrevcom);
        this.camposResultado['indenizacao-comite'].innerHTML = numeroParaMoeda(this.indenizacaoComite);
    }

    calcular() {
        this.atualizarValoresCalculo();

        this.vencimentoBasico = Calculo.vencimentoBasico(this.padraoVencimento);
        // Se tem acréscimo de função gratificada, então tem função, o que eleva o valor da GLIEP.  
        let temFuncao = this.acrescimoFg > 0;
        this.valorGliep = Calculo.gliep(this.percentualGliep, temFuncao);
        this.bruto = Calculo.bruto(this.padraoVencimento, this.tempoExercicio, this.percentualGliep, this.acrescimoFg);
        let baseCalculoAts = Calculo.bruto(this.padraoVencimento, 0, 0, 0);
        this.ats = Calculo.ats(baseCalculoAts, this.tempoExercicio);
    
        this.extraTeto = Calculo.extraTeto(this.bruto);

        // Se a remuneração bruta ultrapassar o teto, então aquela deve ser equivalente a este.
        let brutoDeduzido = this.extraTeto > 0 ? Calculo.tetoMunicipioSp : this.bruto;
        let baseCalculoPrevidencia = this.isIncluiGliepPrevidencia ? brutoDeduzido : brutoDeduzido - this.valorGliep;
    
        this.previdencia = Calculo.previdencia(baseCalculoPrevidencia, this.isRegimeAntigo);
        this.prevcom = Calculo.prevcom(this.percentualPrevcom, baseCalculoPrevidencia);
        this.contrapartidaPrevcom = Calculo.contrapartidaPrevcom(this.percentualPrevcom, baseCalculoPrevidencia);
        let baseCalculoIrpf = brutoDeduzido - this.previdencia - this.prevcom;
        this.irpf = calcularIrpf(brutoDeduzido, baseCalculoIrpf);
        this.refeicao = Calculo.auxilioRefeicao(this.diasTrabalhados);
        // O valor da indenização por participação em Comitê considera o bruto deduzido do teto.
        this.indenizacaoComite = this.isParticipacaoComite ? Calculo.indenizacaoComite(brutoDeduzido) : 0.00;

        this.saude = 0;
        for (let i = 0; i < this.idadesSaude.length; i++) {
            let reembolso = parseFloat(Calculo.auxilioSaude(this.idadesSaude[i]));
            let despesa = parseFloat(this.despesasMedicas[i].replace(',', '.'));
            if (despesa > reembolso) {
                this.saude += reembolso;
            } else {
                this.saude += despesa;
            }
        }

        this.descontoSindicato = Number.parseInt(this.sindicalizado) * Calculo.mensalidadeSindicato;
                
        this.liquidoDinheiro = brutoDeduzido - this.previdencia - this.prevcom - this.irpf - this.descontoSindicato;
        this.liquido = this.liquidoDinheiro + Calculo.auxilioAlimentacao + this.refeicao + this.saude + this.indenizacaoComite;

        this.salvarEntrada();
        this.atualizarValoresResultado();
    };

    salvarEntrada() {
        for (let [nomeCampo, campo] of Object.entries(this.camposCalculo)) {
            // É uma lista de campos e não apenas um campo.
            if (campo instanceof HTMLCollection) {
                let valores = [];
                for (let item of campo) {
                    let valor = item.value;
                    // Para salvar corretamente valores decimais, é preciso converter o separador.
                    if (nomeCampo == 'despesa-auxilio-saude') {
                        valor = item.value.replace(',', '.');
                    }
                    valores.push(valor);
                }
                localStorage.setItem(nomeCampo, valores);
            } else {
                localStorage.setItem(nomeCampo, campo.value);
            }
        }
    }

    recuperarEntrada() {
        let cargo = localStorage.getItem('cargo');
        if (cargo != undefined) {
            this.cargo = cargo;
            this.camposCalculo['cargo'].value = cargo;
        }
        this.atualizarOpcoes();
        let quantidadeBeneficiarios = localStorage.getItem('beneficiarios-auxilio-saude');
        if (quantidadeBeneficiarios != undefined) {
            this.quantidadeBeneficiarios = quantidadeBeneficiarios;
            this.camposCalculo['beneficiarios-auxilio-saude'].value = quantidadeBeneficiarios;
        }
        this.atualizarBeneficiariosAuxilioSaude();
        for (let [nomeCampo, campo] of Object.entries(this.camposCalculo)) {
            let valorSalvo = localStorage.getItem(nomeCampo);
            // Se não existir valor, passa para o próximo.
            if (valorSalvo == undefined) {
                continue;
            }
            // É uma lista de campos e não apenas um campo.
            if (campo instanceof HTMLCollection) {
                let valorSalvoLista = valorSalvo.split(',');
                for (let i = 0; i < campo.length; i++) {
                    let valor = valorSalvoLista[i];
                    if (nomeCampo == 'despesa-auxilio-saude') {
                        // Para mostrar corretamente valores decimais, é preciso converter o separador.
                        valor = valor.replace('.', ',');
                    }
                    if (i < valorSalvoLista.length) {
                        campo[i].value = valor;
                    }
                }
            } else {
                campo.value = valorSalvo;
            }
        }
    }

}
