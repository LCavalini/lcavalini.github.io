class Formulario {

    static camposCalculoIds = [
        'cargo', 'padrao-vencimento', 'tempo', 'percentual-gliep', 'faltas', 'beneficiarios-auxilio-saude'
    ];

    static camposCalculoClasses = [
        'idade-auxilio-saude', 'despesa-auxilio-saude'
    ];

    static camposResultadoIds = [
        'vencimento', 'valor-gliep', 'ats', 'remuneracao-bruta', 'previdencia', 'irpf', 'alimentacao',
        'liquido', 'refeicao', 'total', 'extra-teto', 'auxilio-saude', 'liquido-dinheiro'
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
        { value: 0.35, label: '1º nível de especialização (2ª graduação superio ou especialização) e aferição de produtividade'},
        { value: 0.38, label: '2º nível de especialização (mestrado ou doutorado) e aferição de produtividade '}
    ];

    static percentuaisGliepTecnico = [
        { value: 0.0, label: 'Nenhum'},
        { value: 0.18, label: 'Qualificação básica exigida e aferição de produtividade'},
        { value: 0.23, label: '1º nível de especialização (graduação superior) e aferição de produtividade'},
        { value: 0.25, label: '2º nível de especialização (2ª graduação superior, especialização, mestrado ou doutorado) e aferição de produtividade '}
    ];

    camposCalculo = [];
    camposResultado = [];

    cargo = '';
    padraoVencimento = 0;
    tempoExercicio = 0;
    percentualGliep = 0.0;
    faltas = 0;
    idadesSaude = [];
    despesasMedicas = [];
    quantidadeBeneficiarios = 1;

    vencimentoBasico = 0;
    valorGliep = 0;
    bruto = 0;
    ats = 0;
    extraTeto = 0;
    previdencia = 0;
    irpf = 0;
    alimentacao = 0;
    refeicao = 0;
    saude = 0;
    liquido = 0;
    liquidoDinheiro = 0;

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
        this.atualizarOpcoes();
        this.atualizarBeneficiariosAuxilioSaude(true);
        this.recuperarEntrada();
    }

    atualizarBeneficiariosAuxilioSaude(inicial=false) {
        if (inicial) {
            this.quantidadeBeneficiarios = localStorage.getItem('beneficiarios-auxilio-saude');
            this.camposCalculo['beneficiarios-auxilio-saude'].value = this.quantidadeBeneficiarios;
        } else {
            this.quantidadeBeneficiarios = this.camposCalculo['beneficiarios-auxilio-saude'].value;
        }
        if (this.quantidadeBeneficiarios < 1) {
            this.camposCalculo['beneficiarios-auxilio-saude'].value = 1;
            this.quantidadeBeneficiarios = 1;
        }
        let areaAuxilioSaude = document.getElementById('area-auxilio-saude');
        areaAuxilioSaude.innerHTML = '';
        for (let i = 0; i < this.quantidadeBeneficiarios; i++) {
            let fragmento = document.getElementById('depedente-auxilio-saude');
            areaAuxilioSaude.insertAdjacentHTML('beforeend', fragmento.innerHTML);
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
        let cargo = this.camposCalculo['cargo'].value;
        if (cargo == 'consultor') {
            this.alterarOptions(this.camposCalculo['padrao-vencimento'], Formulario.padroesVencimentoConsultor);
            this.alterarOptions(this.camposCalculo['percentual-gliep'], Formulario.percentuaisGliepConsultor);
        } else if (cargo == 'tecnico') {
            this.alterarOptions(this.camposCalculo['padrao-vencimento'], Formulario.padroesVencimentoTecnico);
            this.alterarOptions(this.camposCalculo['percentual-gliep'], Formulario.percentuaisGliepTecnico);
        }
    }

    atualizarValoresCalculo() {
        this.cargo = this.camposCalculo['cargo'].value;
        this.padraoVencimento = this.camposCalculo['padrao-vencimento'].value;
        this.tempoExercicio = this.camposCalculo['tempo'].value;
        this.percentualGliep = this.camposCalculo['percentual-gliep'].value;
        this.faltas = this.camposCalculo['faltas'].value;
        this.quantidadeBeneficiarios = this.camposCalculo['beneficiarios-auxilio-saude'].value;
        this.idadesSaude = [];
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
    }

    atualizarValoresResultado() {
        this.camposResultado['vencimento'].innerHTML = numeroParaMoeda(this.vencimentoBasico);
        this.camposResultado['valor-gliep'].innerHTML = numeroParaMoeda(this.valorGliep);
        this.camposResultado['extra-teto'].innerHTML = numeroParaMoeda(this.extraTeto);
        this.camposResultado['remuneracao-bruta'].innerHTML = numeroParaMoeda(this.bruto);
        this.camposResultado['ats'].innerHTML = numeroParaMoeda(this.ats);
        this.camposResultado['previdencia'].innerHTML = numeroParaMoeda(this.previdencia);
        this.camposResultado['irpf'].innerHTML = numeroParaMoeda(this.irpf);
        this.camposResultado['alimentacao'].innerHTML = numeroParaMoeda(Calculo.auxilioAlimentacao);
        this.camposResultado['refeicao'].innerHTML = numeroParaMoeda(this.refeicao);
        this.camposResultado['auxilio-saude'].innerHTML = numeroParaMoeda(this.saude);
        this.camposResultado['liquido'].innerHTML = numeroParaMoeda(this.liquido);
        this.camposResultado['liquido-dinheiro'].innerHTML = numeroParaMoeda(this.liquidoDinheiro);
    }

    calcular() {
        this.atualizarValoresCalculo();

        this.vencimentoBasico = Calculo.vencimentoBasico(this.padraoVencimento);
        this.valorGliep = Calculo.gliep(this.percentualGliep);
        this.bruto = Calculo.bruto(this.padraoVencimento, this.tempoExercicio, this.percentualGliep);
        let baseCalculoAts = Calculo.bruto(this.padraoVencimento, 0, 0);
        this.ats = Calculo.ats(baseCalculoAts, this.tempoExercicio);
    
        this.extraTeto = Calculo.extraTeto(this.bruto);

        // Se a remuneração bruta ultrapassar o teto, então aquela deve ser equivalente a este.
        let brutoDeduzido = this.extraTeto > 0 ? Calculo.tetoMunicipioSp : this.bruto;
    
        this.previdencia = Calculo.previdencia(brutoDeduzido);
        let baseCalculoIrpf = brutoDeduzido - this.previdencia;
        this.irpf = calcularIrpf(baseCalculoIrpf);
        this.refeicao = Calculo.auxilioRefeicao(this.faltas);

        this.saude = 0;
        for (let i = 0; i < this.idadesSaude.length; i++) {
            let totalReembolso = Calculo.auxilioSaude(this.idadesSaude[i]);
            if (this.despesasMedicas[i] > totalReembolso) {
                this.saude += parseFloat(totalReembolso);
            } else {
                this.saude += parseFloat(this.despesasMedicas[i]);
            }
        }
        
        this.liquidoDinheiro = brutoDeduzido - this.previdencia - this.irpf;
        this.liquido = brutoDeduzido - this.previdencia - this.irpf + Calculo.auxilioAlimentacao + this.refeicao +
            this.saude;

        this.salvarEntrada();
        this.atualizarValoresResultado();
    };

    salvarEntrada() {
        for (let [nomeCampo, campo] of Object.entries(this.camposCalculo)) {
            // É uma lista de campos e não apenas um campo.
            if (campo instanceof HTMLCollection) {
                let valores = [];
                for (let item of campo) {
                    valores.push(item.value);
                }
                localStorage.setItem(nomeCampo, valores);
            } else {
                localStorage.setItem(nomeCampo, campo.value);
            }
        }
    }

    recuperarEntrada() {
        for (let [nomeCampo, campo] of Object.entries(this.camposCalculo)) {
            let valorSalvo = localStorage.getItem(nomeCampo);
            if (valorSalvo == undefined) {
                continue;
            }
            // É uma lista de campos e não apenas um campo.
            if (campo instanceof HTMLCollection) {
                let valorSalvoLista = valorSalvo.split(',');
                for (let i = 0; i < campo.length; i++) {
                    if (i < valorSalvoLista.length) {
                        campo[i].value = valorSalvoLista[i];
                    }
                }
            } else {
                campo.value = valorSalvo;
            }
        }
    }

}
