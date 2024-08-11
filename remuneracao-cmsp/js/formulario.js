class Formulario {

    static camposCalculoIds = [
        'cargo', 'padrao-vencimento', 'tempo', 'percentual-gliep', 'faltas', 'despesas-medicas'
    ];

    static camposCalculoClasses = [
        'idades-saude'
    ];

    static camposResultadoIds = [
        'vencimento', 'valor-gliep', 'ats', 'remuneracao-bruta', 'previdencia', 'irpf', 'alimentacao',
        'liquido', 'refeicao', 'total', 'extra-teto', 'auxilio-saude'
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
    ]

    static padroesVencimentoTecnico = [
        { value: 7, label: 'QPL-7 (0 anos)' },
        { value: 8, label: 'QPL-8 (4 anos)' },
        { value: 9, label: 'QPL-9 (8 anos)' },
        { value: 10, label: 'QPL-10 (12 anos)' },
        { value: 11, label: 'QPL-11 (15 anos)' },
        { value: 12, label: 'QPL-12 (17 anos)' },
        { value: 13, label: 'QPL-13 (19 anos)' },
        { value: 14, label: 'QPL-14 (21 anos)' }
    ]

    camposCalculo = [];
    camposResultado = [];

    cargo = '';
    padraoVencimento = 0;
    tempoExercicio = 0;
    percentualGliep = 0.0;
    faltas = 0;
    idadesSaude = [];
    despesasMedicas = 0;

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
        this.atualizarValoresCalculo();
    }

    atualizarPadraoVencimento() {
        this.camposCalculo['padrao-vencimento'].innerHTML = '';
        if (this.cargo == 'consultor') {
            Formulario.padroesVencimentoConsultor.forEach(padrao => {
                const option = document.createElement('option');
                option.value = padrao.value;
                option.innerHTML = padrao.label;
                this.camposCalculo['padrao-vencimento'].appendChild(option);
            });
        } else if (this.cargo == 'tecnico') {
            Formulario.padroesVencimentoTecnico.forEach(padrao => {
                const option = document.createElement('option');
                option.value = padrao.value;
                option.innerHTML = padrao.label;
                this.camposCalculo['padrao-vencimento'].appendChild(option);
            });
        }
    }

    atualizarValoresCalculo() {
        this.cargo = this.camposCalculo['cargo'].value;
        this.atualizarPadraoVencimento();
        this.padraoVencimento = this.camposCalculo['padrao-vencimento'].value;
        this.tempoExercicio = this.camposCalculo['tempo'].value;
        this.gliep = this.camposCalculo['percentual-gliep'].value;
        this.faltas = this.camposCalculo['faltas'].value;
        for (let idade of this.camposCalculo['idades-saude']) {
            if (idade.value) {
                this.idadesSaude.push(idade.value);
            }
        }
        this.despesasMedicas = this.camposCalculo['despesas-medicas'].value;
    }

    atualizarValoresResultado() {
        this.camposResultado['vencimento'].innerHTML = numeroParaMoeda(this.vecimentoBasico);
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
    }

    calcular() {

        this.vecimentoBasico = Calculo.vencimentoBasico(this.cargo, this.padraoVencimento);
        this.valorGliep = Calculo.gliep(this.cargo, this.percentualGliep);
        this.bruto = Calculo.bruto(this.cargo, this.padraoVencimento, this.tempoExercicio, this.percentualGliep);

        let baseCalculoAts = Calculo.bruto(this.cargo, this.padraoVencimento, 0, 0);
        this.ats = Calculo.ats(baseCalculoAts, this.tempoExercicio); 
    
        this.extraTeto = Calculo.extraTeto(this.bruto);

        // Se a remuneração bruta ultrapassar o teto, então aquela deve ser equivalente a este.
        if (this.extraTeto > 0) {
            this.bruto = Calculo.tetoMunicipioSp;
        } 
    
        this.previdencia = Calculo.previdencia(this.bruto);

        let baseCalculoIrpf = this.bruto - this.previdencia;
        this.irpf = calcularIrpf(baseCalculoIrpf);
        
        this.refeicao = Calculo.auxilioRefeicao(this.faltas);
    
        let totalReembolso = this.idadesSaude.map(i => Calculo.auxilioSaude(i)).reduce((i, j) =>  i + j);

        if (this.despesasMedicas > totalReembolso) {
            this.saude = parseFloat(totalReembolso);
        } else {
            this.saude = parseFloat(this.despesasMedicas);
        }
    
        this.liquido = this.bruto - this.previdencia - this.irpf + Calculo.auxilioAlimentacao + this.refeicao +
            this.saude;

        this.atualizarValoresResultado();
    };

}