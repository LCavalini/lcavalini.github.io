// Funções de cálculo de remuneração

class Calculo {
    
    static padraoQpl22 = 31520.59; // Conforme PL 374/2025.

    static vencimento = [ // Conforme PL 374/2025.
        { padrao: 7, valor: 7545.06 },
        { padrao: 8, valor: 8299.58 },
        { padrao: 9, valor:  9129.56 },
        { padrao: 10, valor: 10042.6 },
        { padrao: 11, valor: 11046.8 },
        { padrao: 12, valor: 12151.51 },
        { padrao: 13, valor: 13366.72 },
        { padrao: 14, valor: 14703.39 },
        { padrao: 15, valor: 16173.67 },
        { padrao: 16, valor: 17791.03 },
        { padrao: 17, valor: 19570.16 },
        { padrao: 18, valor: 21527.17 },
        { padrao: 19, valor: 23679.89 },
        { padrao: 20, valor: 26047.87 },
        { padrao: 21, valor: 28652.69 },
        { padrao: 22, valor: Calculo.padraoQpl22 }
    ];

    static auxilioAlimentacao = 2034; // Conforme estimativa.
    static cotaAuxilioRefeicao = 93;  // Conforme estimativa.
    
    static aliquotaPrevidencia = 0.14;
    static tetoMunicipioSp = 38039.38;
    
    static tabelaAuxilioSaude = [ // Conforme estimativa.
        {idadeLimite: 18, valor: 798.93},
        {idadeLimite: 23, valor: 1122.36},
        {idadeLimite: 28, valor: 1180.14},
        {idadeLimite: 33, valor: 1261.88},
        {idadeLimite: 38, valor: 1343.39},
        {idadeLimite: 43, valor: 1455.61},
        {idadeLimite: 48, valor: 1957.12},
        {idadeLimite: 53, valor: 2389.16},
        {idadeLimite: 58, valor: 2810.25},
        {idadeLimite: Infinity, valor: 7189.01}
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
