# Guia de Teste Local - Funcionalidade de Comparação

## 🚀 Início Rápido

### 1. Instalar Dependências

Se ainda não instalou as dependências:

```bash
npm install
```

### 2. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor irá iniciar e mostrará uma URL (geralmente `http://localhost:5173` ou similar).

### 3. Acessar a Funcionalidade de Comparação

Após o servidor iniciar:

1. **Abra o navegador** e acesse a URL mostrada no terminal
2. **No menu superior**, clique em **"comparação"** (ou acesse diretamente `http://localhost:5173/#/comparison`)

## 📋 Como Testar a Funcionalidade

### Teste Básico - Comparação Simples

1. **Insira um rendimento bruto anual** (ex: 50000)
2. **Selecione a frequência de exibição** (Year/Month/Day)
3. **Escolha o ano fiscal** (2024 ou 2025)
4. **Veja a comparação** entre os 3 regimes aparecer automaticamente

### Teste Avançado - CTI com Parâmetros

1. **Configure o CTI:**
   - Número de meses: 14 (padrão) ou 12
   - Estado civil: Solteiro ou Casado
   - Número de dependentes: 0, 1, 2, etc.
   - Cartão refeição mensal: ex: 211.20 (isento) ou 300 (parcialmente tributado)

2. **Configure a Unipessoal:**
   - Salário do sócio-gerente (ou deixe automático)
   - Despesas dedutíveis (ou use o modo "Auto")

3. **Compare os resultados** na tabela

### Exemplo de Teste Completo

```
Rendimento Bruto Anual: 60.000€
Ano Fiscal: 2025
Frequência: Month

CTI:
- Meses: 14
- Estado Civil: Casado
- Dependentes: 2
- Cartão Refeição: 211.20€

Unipessoal:
- Salário: 36.000€ (60% do rendimento)
- Despesas: Auto
```

## 🔍 O Que Verificar

### ✅ Funcionalidades a Testar

1. **Cálculo de Recibos Verdes**
   - Verificar se usa os valores do simulador principal
   - Confirmar descontos de 1º/2º ano
   - Verificar SS e IRS

2. **Cálculo de CTI**
   - Verificar retenção na fonte mensal
   - Confirmar deduções específicas (estado civil + dependentes)
   - Verificar cartão refeição isento até 211.20€/mês
   - Confirmar SS trabalhador (11%) e empregador (23.75%)

3. **Cálculo de Unipessoal**
   - Verificar IRC (17% até 50k, 21% acima)
   - Confirmar SS do sócio-gerente
   - Verificar IRS sobre salário

4. **Interface**
   - Campos aparecem quando há rendimento inserido
   - Valores atualizam em tempo real
   - Tabela mostra comparação correta

### 🐛 Problemas Comuns

**Problema:** Página não carrega
- **Solução:** Verifique se o servidor está rodando (`npm run dev`)
- Verifique se há erros no console do navegador (F12)

**Problema:** Cálculos não aparecem
- **Solução:** Certifique-se de inserir um rendimento válido (> 0)
- Verifique o console do navegador para erros

**Problema:** Valores parecem incorretos
- **Solução:** Compare com o simulador do Doutor Finanças
- Verifique se os parâmetros estão corretos (ano fiscal, estado civil, etc.)

## 🧪 Testes Automatizados

### Executar Testes Unitários

```bash
npm run vitest
```

### Executar Testes E2E (Cypress)

Abrir interface do Cypress:
```bash
npm run cy:e2e:open
```

Executar testes em modo headless:
```bash
npm run cy:e2e:run
```

## 📊 Comparação com Referência

Para validar os cálculos, compare com:

- **Simulador Doutor Finanças (CTI):** https://www.doutorfinancas.pt/ferramentas/simulador-salario-liquido-2025/
- **Simulador Principal (Recibos Verdes):** Use a página inicial do projeto

## 🐳 Teste com Docker (Alternativa)

Se preferir usar Docker:

```bash
docker compose up --build -V
```

Acesse `http://localhost` no navegador.

## 📝 Checklist de Teste

- [ ] Servidor inicia sem erros
- [ ] Página de comparação carrega
- [ ] Campos de entrada funcionam
- [ ] Cálculo de Recibos Verdes está correto
- [ ] Cálculo de CTI está correto (com e sem parâmetros)
- [ ] Cálculo de Unipessoal está correto
- [ ] Tabela de comparação exibe todos os valores
- [ ] Mudança de frequência (Year/Month/Day) funciona
- [ ] Mudança de ano fiscal atualiza cálculos
- [ ] Estado civil afeta deduções no CTI
- [ ] Dependentes afetam deduções no CTI
- [ ] Cartão refeição isento funciona corretamente
- [ ] Custo do empregador é calculado corretamente

## 💡 Dicas

1. **Use o Console do Navegador (F12)** para ver erros ou logs
2. **Teste com valores diferentes** para validar os cálculos
3. **Compare com calculadoras oficiais** para garantir precisão
4. **Teste casos extremos** (valores muito altos/baixos, muitos dependentes, etc.)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do terminal onde o servidor está rodando
2. Verifique o console do navegador (F12 → Console)
3. Verifique se todas as dependências estão instaladas (`npm install`)
4. Tente limpar o cache: `npm run build` e depois `npm run dev`


