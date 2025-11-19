# Teste de Cálculos - Comparação de Regimes

## Cenário: Rendimento Bruto Anual de 60.000€

### 1. Recibos Verdes (Trabalhador Independente)
**Input**: 60.000€ de faturamento anual

**Cálculos**:
- Rendimento Bruto: 60.000€
- SS (21.4% sobre 70% do rendimento): 60.000 × 0.70 × 0.214 = 8.988€
- Rendimento após SS: 60.000 - 8.988 = 51.012€
- Deduções específicas: 4.104€ (mínimo) ou 10% = 6.000€ → usa 6.000€
- Rendimento tributável (75%): (60.000 - 6.000) × 0.75 = 40.500€
- IRS (escalão ~25%): ~8.000€
- **Líquido**: 60.000 - 8.988 - 8.000 = **43.012€**

### 2. CTI (Contrato de Trabalho)
**Input**: 60.000€ de salário bruto anual (incluindo subsídios)

**Cálculos**:
- Salário bruto anual: 60.000€
- Salário mensal (÷14): 60.000 / 14 = 4.286€
- Salário base anual (12 meses): 4.286 × 12 = 51.432€
- SS trabalhador (11%): 51.432 × 0.11 = 5.657€
- Deduções específicas: 4.104€ (solteiro)
- Rendimento tributável: 51.432 - 4.104 = 47.328€
- IRS: ~9.500€
- **Líquido**: 51.432 - 5.657 - 9.500 = **36.275€**

**PROBLEMA IDENTIFICADO**: 
- O CTI está usando 60.000€ como salário bruto total (14 meses)
- Mas deveria comparar com o mesmo "custo" para o empregador
- Custo empregador = Salário + SS empregador (23.75%)
- Se o custo total é 60.000€, o salário seria: 60.000 / 1.2375 = 48.485€

### 3. Unipessoal
**Input**: 60.000€ de faturamento da empresa

**Cálculos**:
- Faturamento: 60.000€
- Salário sócio-gerente (60%): 36.000€
- Lucro: 60.000 - 36.000 = 24.000€
- IRC (17%): 24.000 × 0.17 = 4.080€
- SS sobre salário (21.4% de 70%): 36.000 × 0.70 × 0.214 = 5.395€
- IRS sobre salário: ~6.000€
- **Líquido**: 36.000 - 5.395 - 6.000 = **24.605€**

## Conclusão

O problema é que estamos comparando "maçãs com laranjas":
- **Recibos Verdes**: 60k é o que você fatura (100% seu)
- **CTI**: 60k deveria ser o custo para o empregador (não o seu salário)
- **Unipessoal**: 60k é o faturamento da empresa (não o seu salário)

### Solução Proposta:

Adicionar uma nota explicativa dizendo:
"Para uma comparação justa, o valor inserido representa:
- **Recibos Verdes**: Seu faturamento anual
- **CTI**: O custo total para o empregador (salário + encargos)
- **Unipessoal**: O faturamento da empresa"
