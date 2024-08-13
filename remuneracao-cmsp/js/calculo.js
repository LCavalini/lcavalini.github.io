// Funções de cálculo de remuneração

class Calculo {
    
    static padraoQpl22 = 30002.47;

    static vencimento = [
        { padrao: 7, valor: 7181.67 },
        { padrao: 8, valor: 7899.85 },
        { padrao: 9, valor: 8689.85 },
        { padrao: 10, valor: 9558.92 },
        { padrao: 11, valor: 10514.75 },
        { padrao: 12, valor: 11566.26 },
        { padrao: 13, valor: 12722.94 },
        { padrao: 14, valor: 13995.23 },
        { padrao: 15, valor: 15394.69 },
        { padrao: 16, valor: 16934.16 },
        { padrao: 17, valor: 18627.60 },
        { padrao: 18, valor: 20490.36 },
        { padrao: 19, valor: 22539.4 },
        { padrao: 20, valor: 24793.33 },
        { padrao: 21, valor: 27272.69 },
        { padrao: 22, valor: Calculo.padraoQpl22 }
    ];

    static auxilioAlimentacao = 1859.00;
    static cotaAuxilioRefeicao = 85;  // a base é 22 dias;
    
    static aliquotaPrevidencia = 0.14;
    static tetoMunicipioSp = 38039.38;
    
    static tabelaAuxilioSaude = [
        {idadeLimite: 18, valor: 515.68},
        {idadeLimite: 23, valor: 724.43},
        {idadeLimite: 28, valor: 761.75},
        {idadeLimite: 33, valor: 814.51},
        {idadeLimite: 38, valor: 867.1},
        {idadeLimite: 43, valor: 939.53},
        {idadeLimite: 48, valor: 1263.25},
        {idadeLimite: 53, valor: 1542.11},
        {idadeLimite: 58, valor: 1813.91},
        {idadeLimite: Infinity, valor: 3093.49}
    ];
    
    static vencimentoBasico(padrao) {
        let registro = Calculo.vencimento.find(vencimento => Number(vencimento.padrao) === Number(padrao));
        if (registro == undefined) {
            throw new Error(`O cargo ${cargo} é inválido`);        
        }
        return registro.valor;
    }
    
    static gliep(percentual) {
        return percentual * Calculo.padraoQpl22;
    }
    
    static ats(baseCalculo, tempo) {
        let adicionalTempo = 0;
        // Quinquênios.
        if (tempo >= 5) {
            // O município de SP faz cálculo de juros compostos.
            adicionalTempo += (1.05 ** Math.floor(tempo / 5)) - 1;
        }
        // Sexta-parte.
        if (tempo >= 20) {
            adicionalTempo += 0.2;
        }
        return adicionalTempo * baseCalculo;
    }
    
    static bruto(padrao, tempo, percentualGliep) {
        let baseCalculoAts = Calculo.vencimentoBasico(padrao);
        return baseCalculoAts + Calculo.ats(baseCalculoAts, tempo) + Calculo.gliep(percentualGliep);
    }
    
    static extraTeto(remuneracao) {
        if (remuneracao > Calculo.tetoMunicipioSp) {
            return remuneracao - Calculo.tetoMunicipioSp;
        }
        return 0.00;
    }
    
    static previdencia(baseCalculo) {
        // a contribuição previdenciária é limitada ao teto do INSS.
        if (baseCalculo > obterTetoInss()) {
            baseCalculo = obterTetoInss();
        }
        return baseCalculo * 0.14;
    }
    
    static auxilioRefeicao(faltas) {
        return Calculo.cotaAuxilioRefeicao * (22 - faltas);
    }
    
    
    static auxilioSaude(idade) {
        let tamanho = Calculo.tabelaAuxilioSaude.length;
        for (let i = 0; i < tamanho; i++) {
            if (idade <= Calculo.tabelaAuxilioSaude[i].idadeLimite) {
                return Calculo.tabelaAuxilioSaude[i].valor;
            }
        }
        return Calculo.tabelaAuxilioSaude[tamanho-1].valor;
    }

}
