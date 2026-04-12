def multiplicador_gaj_reajustado(indice_reajuste, multiplicador_gaj, multiplicador_repr = 0, vencimento = 1968.34):
    BASE_GRATIFICACAO = 972.37
    total_reajustado = (vencimento + (multiplicador_gaj + multiplicador_repr) * BASE_GRATIFICACAO) * indice_reajuste
    return (total_reajustado - vencimento - (multiplicador_repr * BASE_GRATIFICACAO)) / BASE_GRATIFICACAO