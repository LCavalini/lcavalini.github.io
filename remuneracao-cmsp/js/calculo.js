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
        { padrao: 15, valor: 15394.70 },
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
        {idadeLimite: 18, valor: 654.86},
        {idadeLimite: 23, valor: 919.97},
        {idadeLimite: 28, valor: 967.33},
        {idadeLimite: 33, valor: 1034.33},
        {idadeLimite: 38, valor: 1101.14},
        {idadeLimite: 43, valor: 1193.12},
        {idadeLimite: 48, valor: 1604.20},
        {idadeLimite: 53, valor: 1958.33},
        {idadeLimite: 58, valor: 2303.48},
        {idadeLimite: Infinity, valor: 5892.63}
    ];

    static mensalidadeSindicato = 78.50;
    
    static vencimentoBasico(padrao) {
        let registro = Calculo.vencimento.find(vencimento => Number(vencimento.padrao) === Number(padrao));
        if (registro == undefined) {
            throw new Error(`O cargo ${cargo} é inválido`);        
        }
        return registro.valor;
    }
    
    static gliep(percentual, temFuncao) {
        let valorGliep = percentual * Calculo.padraoQpl22;
        // Art. 29, §6º, da Lei nº 14.381/2007: aplica-se o fator 1.12 para quem tem função gratificada.
        return temFuncao ? valorGliep * 1.12 : valorGliep;
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
    
    static bruto(padrao, tempo, percentualGliep, acrescimoFg) {
        let baseCalculoAts = Calculo.vencimentoBasico(padrao);
        return baseCalculoAts + Calculo.ats(baseCalculoAts, tempo) + Calculo.gliep(percentualGliep) + Number.parseFloat(acrescimoFg);
    }
    
    static extraTeto(remuneracao) {
        if (remuneracao > Calculo.tetoMunicipioSp) {
            return remuneracao - Calculo.tetoMunicipioSp;
        }
        return 0.00;
    }
    
    static previdencia(baseCalculo, isRegimeAntigo) {
        // No regime de previdência antigo, não há limitação ao teto do INSS.
        if (isRegimeAntigo) {
            return baseCalculo * 0.14;
        }
        // No regime de previdência novo, há limitação ao teto do INSS.
        if (baseCalculo > obterTetoInss()) {
            baseCalculo = obterTetoInss();
        }
        return baseCalculo * 0.14;
    }

    static prevcom(percentualPrevcom, remuneracaoBruta) {
        let baseCalculo = remuneracaoBruta - obterTetoInss();
        if (baseCalculo > 0) {
            return (percentualPrevcom / 100) * baseCalculo;
        }
        return 0;
    }

    static contrapartidaPrevcom(percentualPrevcom, remuneracaoBruta) {
        let baseCalculo = remuneracaoBruta - obterTetoInss();
        let percentual = percentualPrevcom > 7.5 ? 7.5 : percentualPrevcom;
        percentual /= 100;
        if (baseCalculo > 0) {
            return percentual * baseCalculo;
        }
        return 0;
    }
    
    static auxilioRefeicao(diasTrabalhados) {
        return Calculo.cotaAuxilioRefeicao * diasTrabalhados;
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

    static indenizacaoComite(brutoDeduzido) {
        return (brutoDeduzido / 30) * 5;
    }

}
