import { defineStore } from "pinia";
import {
  FrequencyChoices,
  GrossIncome,
  TaxRank,
  ContractType,
  ContractComparison,
  AdditionalExpenses,
  Benefits,
} from "@/typings";
import {
  YEAR_BUSINESS_DAYS,
  SUPPORTED_TAX_RANK_YEARS,
  useTaxesStore
} from "./index";

// Taxas de Segurança Social
const SS_WORKER_RATE = 0.11; // 11% para trabalhador por conta de outrem
const SS_EMPLOYER_RATE = 0.2375; // 23.75% para empregador
const SS_INDEPENDENT_RATE = 0.214; // 21.4% para trabalhador independente
const SS_INDEPENDENT_BASE = 0.7; // 70% do rendimento como base

// Taxas de IRC (Imposto sobre o Rendimento das Pessoas Coletivas)
const IRC_RATE_LOW = 0.17; // 17% até 50.000€
const IRC_RATE_HIGH = 0.21; // 21% acima de 50.000€
const IRC_THRESHOLD = 50000;

// Salário mínimo nacional 2024/2025
const MINIMUM_WAGE_2024 = 820; // €/mês
const MINIMUM_WAGE_2025 = 870; // €/mês (atualizado em 2025)

// Deduções específicas por estado civil e dependentes (2025)
const SPECIFIC_DEDUCTIONS = {
  single: 4104, // Solteiro sem dependentes
  married: 8208, // Casado/unido de facto
  perDependent: 630, // Por dependente
  perDependentWithDisability: 1260, // Por dependente com deficiência
};

// Cartão refeição - isento até 9.60€/dia (2025)
const MEAL_CARD_DAILY_LIMIT = 9.60;
const MEAL_CARD_MONTHLY_LIMIT = MEAL_CARD_DAILY_LIMIT * 22; // ~211.20€/mês

interface ComparisonState {
  income: number | null;
  incomeFrequency: FrequencyChoices;
  displayFrequency: FrequencyChoices;
  nrMonthsDisplay: number;
  nrDaysOff: number;
  currentTaxRankYear: (typeof SUPPORTED_TAX_RANK_YEARS)[number];
  // CTI specific
  ctiMonths: number; // Normalmente 14 (12 + subsídios)
  ctiLocation: "continental" | "islands"; // Localização
  ctiMaritalStatus: "single" | "married"; // Estado civil
  ctiTitulares: 1 | 2; // Número de titulares (só para casados)
  ctiDependents: number; // Número de dependentes
  ctiMealCard: number; // Valor do cartão refeição mensal
  // Unipessoal specific
  unipessoalSalary: number | null; // Salário do sócio-gerente
  unipessoalExpenses: number; // Despesas dedutíveis no IRC
  unipessoalExpensesAuto: boolean;
  unipessoalExpensesAsLiquidity: boolean; // Se true, adiciona despesas ao rendimento líquido (benefícios)
  unipessoalDistributeLucros: boolean; // Se true, distribui lucros; se false, retira salário
  // Additional expenses (for B2B/Unipessoal)
  accountantFee: number; // Contabilista anual
  healthInsurance: number; // Seguro de saúde anual
  personalInsurance: number; // Seguro pessoal anual
  workInsurance: number; // Seguro de trabalho anual
  otherExpenses: number; // Outras despesas anuais
  vatEnabled: boolean; // Se true, calcula IVA (23%)
  language: 'pt' | 'en'; // Idioma da interface
}

const useComparisonStore = defineStore({
  id: "comparison",
  state: (): ComparisonState => ({
    income: null,
    incomeFrequency: FrequencyChoices.Year,
    displayFrequency: FrequencyChoices.Month,
    nrMonthsDisplay: 12,
    nrDaysOff: 0,
    currentTaxRankYear: SUPPORTED_TAX_RANK_YEARS[0],
    ctiMonths: 14, // 12 meses + subsídio férias + subsídio natal
    ctiLocation: "continental",
    ctiMaritalStatus: "single",
    ctiTitulares: 2, // Por padrão 2 titulares para casados
    ctiDependents: 0,
    ctiMealCard: 0,
    unipessoalSalary: null,
    unipessoalExpenses: 0,
    unipessoalExpensesAuto: true,
    unipessoalExpensesAsLiquidity: false,
    unipessoalDistributeLucros: false, // Por padrão, retira salário
    accountantFee: 1200, // ~100€/mês
    healthInsurance: 400, // ~33€/mês
    personalInsurance: 200, // ~16€/mês
    workInsurance: 150, // ~12€/mês
    otherExpenses: 0,
    vatEnabled: false, // Se true, calcula IVA (23%)
    language: 'pt', // Idioma padrão: Português
  }),
  getters: {
    grossIncome(): GrossIncome {
      const result: GrossIncome = {
        year: 0,
        month: 0,
        day: 0,
      };
      if (this.income && this.nrMonthsDisplay) {
        switch (this.incomeFrequency) {
          case FrequencyChoices.Year:
            result.year = this.income;
            result.month = this.income / this.nrMonthsDisplay;
            result.day = this.income / (YEAR_BUSINESS_DAYS - this.nrDaysOff);
            break;
          case FrequencyChoices.Month:
            result.year = this.income * this.nrMonthsDisplay;
            result.month = this.income;
            result.day = result.year / (YEAR_BUSINESS_DAYS - this.nrDaysOff);
            break;
          case FrequencyChoices.Day:
            result.year = this.income * (YEAR_BUSINESS_DAYS - this.nrDaysOff);
            result.month = result.year / this.nrMonthsDisplay;
            result.day = this.income;
        }
      }
      return result;
    },
    taxRanks(): TaxRank[] {
      try {
        const taxesStore = useTaxesStore();
        // Acessar diretamente do estado usando o ano atual
        const year = this.currentTaxRankYear;
        const directRanks = taxesStore.taxRanks?.[year];
        if (directRanks && Array.isArray(directRanks) && directRanks.length > 0) {
          return directRanks;
        }
        // Fallback: tentar usar o getter
        const ranks = taxesStore.getTaxRanks;
        if (ranks && Array.isArray(ranks) && ranks.length > 0) {
          return ranks;
        }
        return [];
      } catch (error) {
        console.warn("Error getting tax ranks:", error);
        return [];
      }
    },
    currentIas(): number {
      const taxesStore = useTaxesStore();
      return taxesStore.currentIas;
    },
    maxSsIncome(): number {
      return 12 * this.currentIas;
    },
    // Cálculo para Recibos Verdes (usa a store existente)
    recibosVerdes(): ContractComparison {
      const taxesStore = useTaxesStore();
      // Sincronizar valores
      taxesStore.setIncome(this.income || 0);
      taxesStore.setIncomeFrequency(this.incomeFrequency);
      taxesStore.setDisplayFrequency(this.displayFrequency);
      taxesStore.setNrMonthsDisplay(this.nrMonthsDisplay);
      taxesStore.setNrDaysOff(this.nrDaysOff);
      taxesStore.setCurrentTaxRankYear(this.currentTaxRankYear);

      // Despesas adicionais (anuais)
      const additionalExpenses: AdditionalExpenses = {
        accountant: this.accountantFee,
        healthInsurance: this.healthInsurance,
        personalInsurance: this.personalInsurance,
        workInsurance: this.workInsurance,
        otherExpenses: this.otherExpenses,
      };

      const totalAdditionalExpensesYear =
        this.accountantFee +
        this.healthInsurance +
        this.personalInsurance +
        this.workInsurance +
        this.otherExpenses;

      const totalAdditionalExpensesMonth = totalAdditionalExpensesYear / 12;
      const totalAdditionalExpensesDay = totalAdditionalExpensesYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff);

      // Garantir que os valores da store são válidos
      const irsPay: GrossIncome = taxesStore.irsPay?.year !== undefined
        ? taxesStore.irsPay as GrossIncome
        : { year: 0, month: 0, day: 0 };

      const ssPay: GrossIncome = taxesStore.ssPay?.year !== undefined
        ? taxesStore.ssPay as GrossIncome
        : { year: 0, month: 0, day: 0 };

      const netIncome: GrossIncome = taxesStore.netIncome?.year !== undefined
        ? taxesStore.netIncome as GrossIncome
        : { year: 0, month: 0, day: 0 };

      const totalTaxesYear = irsPay.year + ssPay.year;
      const totalExpensesYear = totalTaxesYear + totalAdditionalExpensesYear;
      const finalNetIncomeYear = netIncome.year - totalAdditionalExpensesYear;

      return {
        type: ContractType.RecibosVerdes,
        grossIncome: taxesStore.grossIncome,
        irsPay,
        ssPay,
        netIncome,
        totalTaxes: {
          year: totalTaxesYear,
          month: totalTaxesYear / 12,
          day: totalTaxesYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
        },
        additionalExpenses,
        totalExpenses: {
          year: totalExpensesYear,
          month: totalExpensesYear / 12,
          day: totalExpensesYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
        },
        finalNetIncome: {
          year: finalNetIncomeYear,
          month: finalNetIncomeYear / 12,
          day: finalNetIncomeYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
        },
      };
    },
    // Cálculo para CTI (Contrato de Trabalho Individual)
    cti(): ContractComparison {
      const grossIncome = this.grossIncome;
      // Para CTI, o salário anual é dividido por 14 meses (incluindo subsídios)
      const monthlySalary = grossIncome.year / this.ctiMonths;
      const annualSalary = monthlySalary * 12; // Base para cálculos (12 meses)

      // Cartão refeição isento (até 9.60€/dia = ~211.20€/mês)
      const mealCardExempt = Math.min(this.ctiMealCard, MEAL_CARD_MONTHLY_LIMIT);
      const mealCardTaxable = Math.max(0, this.ctiMealCard - MEAL_CARD_MONTHLY_LIMIT);

      // Rendimento bruto mensal incluindo cartão refeição
      const monthlyGrossWithMealCard = monthlySalary + mealCardTaxable;
      const annualGrossWithMealCard = annualSalary + (mealCardTaxable * 12);

      // Segurança Social do trabalhador (11%) - apenas sobre salário, não sobre cartão refeição
      const ssWorkerYear = annualSalary * SS_WORKER_RATE;
      const ssWorkerMonth = ssWorkerYear / 12;
      const ssWorkerDay = ssWorkerYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff);

      // Segurança Social do empregador (23.75%) - custo para empregador
      const ssEmployerYear = annualSalary * SS_EMPLOYER_RATE;
      const ssEmployerMonth = ssEmployerYear / 12;
      const ssEmployerDay = ssEmployerYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff);

      // Custo total para o empregador (salário + SS empregador + cartão refeição)
      const employerCostYear = annualSalary + ssEmployerYear + (this.ctiMealCard * 12);
      const employerCostMonth = employerCostYear / 12;
      const employerCostDay = employerCostYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff);

      // Deduções específicas (estado civil + dependentes + titulares)
      // Se casado com 2 titulares, usa tabela de "não casado" (deduções menores)
      // Se casado com 1 titular, usa tabela de "casado" (deduções maiores)
      let baseDeduction: number;
      if (this.ctiMaritalStatus === "married") {
        baseDeduction = this.ctiTitulares === 1
          ? SPECIFIC_DEDUCTIONS.married
          : SPECIFIC_DEDUCTIONS.single; // Casado 2 titulares = tabela de não casado
      } else {
        baseDeduction = SPECIFIC_DEDUCTIONS.single;
      }
      const dependentsDeduction = this.ctiDependents * SPECIFIC_DEDUCTIONS.perDependent;
      const totalSpecificDeductions = baseDeduction + dependentsDeduction;

      // Rendimento tributável = rendimento bruto - deduções específicas
      // Para cálculo mensal de retenção na fonte, dividimos as deduções por 12
      const monthlyDeductions = totalSpecificDeductions / 12;
      const monthlyTaxableIncome = Math.max(0, monthlyGrossWithMealCard - monthlyDeductions);
      const annualTaxableIncome = Math.max(0, annualGrossWithMealCard - totalSpecificDeductions);

      // IRS - cálculo mensal (retenção na fonte) e anual
      const taxRanks = this.taxRanks;
      if (!taxRanks || taxRanks.length === 0) {
        // Retornar valores zero se não houver escalões disponíveis
        return {
          type: ContractType.CTI,
          grossIncome: { year: 0, month: 0, day: 0 },
          irsPay: { year: 0, month: 0, day: 0 },
          ssPay: { year: 0, month: 0, day: 0 },
          netIncome: { year: 0, month: 0, day: 0 },
          totalTaxes: { year: 0, month: 0, day: 0 },
          employerCost: { year: 0, month: 0, day: 0 },
          totalExpenses: { year: 0, month: 0, day: 0 },
          finalNetIncome: { year: 0, month: 0, day: 0 },
        };
      }

      const taxRank = this.getTaxRankForIncome(annualTaxableIncome);
      const irsPayAnnual = this.calculateIRS(annualTaxableIncome, taxRank);

      // Retenção mensal aproximada (baseada no rendimento mensal tributável)
      const monthlyTaxRank = this.getTaxRankForIncome(monthlyTaxableIncome * 12);
      const irsPayMonthly = this.calculateIRS(monthlyTaxableIncome * 12, monthlyTaxRank);
      const irsPayMonth = irsPayMonthly.year / 12;

      // Rendimento líquido mensal = salário + cartão refeição isento - SS - IRS retido
      const netIncomeMonth = monthlySalary + mealCardExempt - ssWorkerMonth - irsPayMonth;
      // Rendimento líquido anual = rendimento mensal × 14 (inclui subsídios de férias e natal)
      const netIncomeYear = netIncomeMonth * this.ctiMonths;
      const netIncomeDay = netIncomeYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff);

      // Benefícios
      const benefits: Benefits = {
        mealTicket: {
          year: this.ctiMealCard * 12,
          month: this.ctiMealCard,
          day: (this.ctiMealCard * 12) / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
        },
      };

      const totalTaxesYear = irsPayAnnual.year + ssWorkerYear;
      const finalNetIncomeYear = netIncomeYear; // CTI não tem despesas adicionais normalmente

      return {
        type: ContractType.CTI,
        grossIncome: {
          year: annualGrossWithMealCard,
          month: monthlyGrossWithMealCard,
          day: annualGrossWithMealCard / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
        },
        irsPay: {
          year: irsPayAnnual.year,
          month: irsPayMonth,
          day: irsPayAnnual.day,
        },
        ssPay: {
          year: ssWorkerYear,
          month: ssWorkerMonth,
          day: ssWorkerDay,
        },
        netIncome: {
          year: netIncomeYear,
          month: netIncomeMonth,
          day: netIncomeDay,
        },
        totalTaxes: {
          year: totalTaxesYear,
          month: irsPayMonth + ssWorkerMonth,
          day: totalTaxesYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
        },
        employerCost: {
          year: employerCostYear,
          month: employerCostMonth,
          day: employerCostDay,
        },
        benefits,
        totalExpenses: {
          year: totalTaxesYear,
          month: totalTaxesYear / 12,
          day: totalTaxesYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
        },
        finalNetIncome: {
          year: finalNetIncomeYear,
          month: finalNetIncomeYear / 12,
          day: finalNetIncomeYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
        },
      };
    },
    // Cálculo para Unipessoal
    unipessoal(): ContractComparison {
      if (!this.income) {
        return this.getEmptyComparison(ContractType.Unipessoal);
      }

      const grossIncome = this.grossIncome;
      const minimumWage = this.currentTaxRankYear >= 2025 ? MINIMUM_WAGE_2025 : MINIMUM_WAGE_2024;

      if (this.unipessoalDistributeLucros) {
        // OPÇÃO 1: Distribuição de Lucros
        // Salário mínimo obrigatório para o sócio-gerente
        const salary = minimumWage * 12;
        const monthlySalary = minimumWage;

        // Despesas dedutíveis
        const expenses = this.unipessoalExpensesAuto
          ? Math.max(0, grossIncome.year * 0.15)
          : this.unipessoalExpenses;

        // Lucro = Faturamento - Salário - Despesas
        const profit = Math.max(0, grossIncome.year - salary - expenses);

        // IRC sobre o lucro (17% até 50k, 21% acima)
        const ircPay = this.calculateIRC(profit);

        // Lucro líquido após IRC
        const profitAfterIRC = profit - ircPay.year;

        // IRS sobre dividendos (28% taxa liberatória)
        const irsDividendos = profitAfterIRC * 0.28;

        // Segurança Social sobre salário mínimo
        const ssBase = Math.min(this.maxSsIncome / 12, monthlySalary * SS_INDEPENDENT_BASE);
        const ssMonth = ssBase * SS_INDEPENDENT_RATE;
        const ssYear = Math.max(12 * ssMonth, 20 * 12);
        const ssDay = ssYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff);

        // IRS sobre salário mínimo
        const taxRank = this.getTaxRankForIncome(salary);
        const irsSalary = this.calculateIRS(salary, taxRank);

        // Rendimento líquido total = Salário líquido + Dividendos líquidos
        const salaryNet = salary - irsSalary.year - ssYear;
        const dividendosNet = profitAfterIRC - irsDividendos;
        let netIncomeYear = salaryNet + dividendosNet;
        if (this.unipessoalExpensesAsLiquidity) {
          netIncomeYear += expenses;
        }
        const netIncomeMonth = netIncomeYear / 12;
        const netIncomeDay = netIncomeYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff);

        const additionalExpenses: AdditionalExpenses = {
          accountant: this.accountantFee,
          healthInsurance: this.healthInsurance,
          personalInsurance: this.personalInsurance,
          workInsurance: this.workInsurance,
          otherExpenses: this.otherExpenses,
        };

        const totalAdditionalExpensesYear =
          this.accountantFee + this.healthInsurance + this.personalInsurance +
          this.workInsurance + this.otherExpenses;

        const totalTaxesYear = irsSalary.year + irsDividendos + ssYear + ircPay.year;
        const totalExpensesYear = totalTaxesYear + totalAdditionalExpensesYear;
        const finalNetIncomeYear = netIncomeYear - totalAdditionalExpensesYear;

        return {
          type: ContractType.Unipessoal,
          grossIncome: {
            year: grossIncome.year,
            month: grossIncome.month,
            day: grossIncome.day,
          },
          irsPay: {
            year: irsSalary.year + irsDividendos,
            month: (irsSalary.year + irsDividendos) / 12,
            day: (irsSalary.year + irsDividendos) / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
          ssPay: {
            year: ssYear,
            month: ssMonth,
            day: ssDay,
          },
          ircPay: {
            year: ircPay.year,
            month: ircPay.year / 12,
            day: ircPay.year / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
          netIncome: {
            year: netIncomeYear,
            month: netIncomeMonth,
            day: netIncomeDay,
          },
          totalTaxes: {
            year: totalTaxesYear,
            month: totalTaxesYear / 12,
            day: totalTaxesYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
          additionalExpenses,
          totalExpenses: {
            year: totalExpensesYear,
            month: totalExpensesYear / 12,
            day: totalExpensesYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
          finalNetIncome: {
            year: finalNetIncomeYear,
            month: finalNetIncomeYear / 12,
            day: finalNetIncomeYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
          liquidityExpenses: {
            year: this.unipessoalExpensesAsLiquidity ? expenses : 0,
            month: (this.unipessoalExpensesAsLiquidity ? expenses : 0) / 12,
            day: (this.unipessoalExpensesAsLiquidity ? expenses : 0) / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
        };
      } else {
        // OPÇÃO 2: Salário do Sócio-Gerente
        const salary = this.unipessoalSalary || Math.max(minimumWage * 12, grossIncome.year * 0.6);
        const monthlySalary = salary / 12;

        // SS Calculations (Corrected for Sócio-Gerente)
        // Base is 100% of salary, capped at max limit (12x IAS)
        // Taxas: 11% (Trabalhador) + 23.75% (Empresa) = 34.75%
        const ssBase = Math.min(this.maxSsIncome, monthlySalary);
        const ssWorkerMonth = ssBase * SS_WORKER_RATE;
        const ssCompanyMonth = ssBase * SS_EMPLOYER_RATE;

        const ssWorkerYear = ssWorkerMonth * 12;
        const ssCompanyYear = ssCompanyMonth * 12;

        const expenses = this.unipessoalExpensesAuto
          ? Math.max(0, grossIncome.year * 0.15 - salary * 0.1)
          : this.unipessoalExpenses;

        // Lucro da empresa deduz salário, despesas e TSU da empresa
        const profit = Math.max(0, grossIncome.year - salary - expenses - ssCompanyYear);

        const ircPay = this.calculateIRC(profit);

        const taxableIncome = salary;
        const taxRank = this.getTaxRankForIncome(taxableIncome);
        const irsPay = this.calculateIRS(taxableIncome, taxRank);

        // Rendimento líquido do salário (deduz IRS e SS do trabalhador)
        const salaryNet = salary - irsPay.year - ssWorkerYear;

        // Lucro líquido após IRC (pode ser distribuído como dividendos ou reinvestido)
        const profitAfterIRC = profit - ircPay.year;

        // Rendimento líquido total = Salário líquido + Lucros após IRC
        // Nota: Os lucros após IRC podem ser distribuídos como dividendos (pagando IRS 28%)
        // ou mantidos na empresa. Para comparação justa, consideramos que são distribuídos.
        const irsDividendos = profitAfterIRC * 0.28; // IRS sobre dividendos
        const dividendosNet = profitAfterIRC - irsDividendos;

        let netIncomeYear = salaryNet + dividendosNet;
        if (this.unipessoalExpensesAsLiquidity) {
          netIncomeYear += expenses;
        }
        const netIncomeMonth = netIncomeYear / 12;
        const netIncomeDay = netIncomeYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff);

        const additionalExpenses: AdditionalExpenses = {
          accountant: this.accountantFee,
          healthInsurance: this.healthInsurance,
          personalInsurance: this.personalInsurance,
          workInsurance: this.workInsurance,
          otherExpenses: this.otherExpenses,
        };

        const totalAdditionalExpensesYear =
          this.accountantFee + this.healthInsurance + this.personalInsurance +
          this.workInsurance + this.otherExpenses;

        // Total impostos inclui IRS Salário, IRS Dividendos, SS Trabalhador, SS Empresa, IRC
        const totalTaxesYear = irsPay.year + irsDividendos + ssWorkerYear + ssCompanyYear + ircPay.year;
        const totalExpensesYear = totalTaxesYear + totalAdditionalExpensesYear;
        const finalNetIncomeYear = netIncomeYear - totalAdditionalExpensesYear;

        return {
          type: ContractType.Unipessoal,
          grossIncome: {
            year: grossIncome.year, // Faturamento total da empresa
            month: grossIncome.month,
            day: grossIncome.day,
          },
          irsPay: {
            year: irsPay.year + irsDividendos, // IRS sobre salário + IRS sobre dividendos
            month: (irsPay.year + irsDividendos) / 12,
            day: (irsPay.year + irsDividendos) / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
          ssPay: {
            year: ssWorkerYear + ssCompanyYear, // Total SS (Trabalhador + Empresa)
            month: ssWorkerMonth + ssCompanyMonth,
            day: (ssWorkerYear + ssCompanyYear) / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
          ircPay: {
            year: ircPay.year,
            month: ircPay.year / 12,
            day: ircPay.year / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
          netIncome: {
            year: netIncomeYear,
            month: netIncomeMonth,
            day: netIncomeDay,
          },
          totalTaxes: {
            year: totalTaxesYear,
            month: totalTaxesYear / 12,
            day: totalTaxesYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
          additionalExpenses,
          totalExpenses: {
            year: totalExpensesYear,
            month: totalExpensesYear / 12,
            day: totalExpensesYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
          finalNetIncome: {
            year: finalNetIncomeYear,
            month: finalNetIncomeYear / 12,
            day: finalNetIncomeYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
          liquidityExpenses: {
            year: this.unipessoalExpensesAsLiquidity ? expenses : 0,
            month: (this.unipessoalExpensesAsLiquidity ? expenses : 0) / 12,
            day: (this.unipessoalExpensesAsLiquidity ? expenses : 0) / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
          },
        };
      }
    },
    // Comparação de todos os regimes
    allComparisons(): ContractComparison[] {
      return [
        this.recibosVerdes,
        this.cti,
        this.unipessoal,
      ];
    },
  },
  actions: {
    setIncome(value: number | null) {
      this.income = value;
    },
    setIncomeFrequency(frequency: FrequencyChoices) {
      this.incomeFrequency = frequency;
    },
    setDisplayFrequency(frequency: FrequencyChoices) {
      this.displayFrequency = frequency;
    },
    setNrMonthsDisplay(months: number) {
      this.nrMonthsDisplay = months;
    },
    setNrDaysOff(days: number) {
      this.nrDaysOff = days;
    },
    setCurrentTaxRankYear(year: (typeof SUPPORTED_TAX_RANK_YEARS)[number]) {
      this.currentTaxRankYear = year;
    },
    setCtiMonths(months: number) {
      this.ctiMonths = months;
    },
    setCtiLocation(location: "continental" | "islands") {
      this.ctiLocation = location;
    },
    setCtiMaritalStatus(status: "single" | "married") {
      this.ctiMaritalStatus = status;
    },
    setCtiDependents(dependents: number) {
      this.ctiDependents = Math.max(0, dependents);
    },
    setCtiTitulares(titulares: 1 | 2) {
      this.ctiTitulares = titulares;
    },
    setCtiMealCard(value: number) {
      this.ctiMealCard = Math.max(0, value);
    },
    setAccountantFee(value: number) {
      this.accountantFee = Math.max(0, value);
    },
    setHealthInsurance(value: number) {
      this.healthInsurance = Math.max(0, value);
    },
    setPersonalInsurance(value: number) {
      this.personalInsurance = Math.max(0, value);
    },
    setWorkInsurance(value: number) {
      this.workInsurance = Math.max(0, value);
    },
    setOtherExpenses(value: number) {
      this.otherExpenses = Math.max(0, value);
    },
    setUnipessoalSalary(salary: number | null) {
      this.unipessoalSalary = salary;
    },
    setUnipessoalExpenses(expenses: number) {
      this.unipessoalExpenses = expenses;
    },
    setUnipessoalExpensesAuto(auto: boolean) {
      this.unipessoalExpensesAuto = auto;
    },
    setUnipessoalDistributeLucros(distribute: boolean) {
      this.unipessoalDistributeLucros = distribute;
    },
    optimizeUnipessoal() {
      if (!this.income) return;

      const grossIncomeYear = this.grossIncome.year;
      const minimumWage = this.currentTaxRankYear >= 2025 ? MINIMUM_WAGE_2025 : MINIMUM_WAGE_2024;
      const minSalary = minimumWage * 12;

      // Se o rendimento for menor que o salário mínimo anual, não há o que otimizar
      if (grossIncomeYear <= minSalary) {
        this.unipessoalSalary = minSalary;
        this.unipessoalDistributeLucros = false;
        return;
      }

      let bestSalary = minSalary;
      let maxNetIncome = 0;

      // Iterar sobre possíveis salários (passo de 100€)
      for (let salary = minSalary; salary <= grossIncomeYear; salary += 100) {
        const monthlySalary = salary / 12;

        // SS Calculations (Corrected)
        const ssBase = Math.min(this.maxSsIncome, monthlySalary);
        const ssWorkerYear = ssBase * SS_WORKER_RATE * 12;
        const ssCompanyYear = ssBase * SS_EMPLOYER_RATE * 12;

        const expenses = this.unipessoalExpensesAuto
          ? Math.max(0, grossIncomeYear * 0.15 - salary * 0.1)
          : this.unipessoalExpenses;

        // Verificar se a empresa tem fundos para pagar este salário + TSU + despesas
        const totalCompanyCost = salary + ssCompanyYear + expenses;
        if (totalCompanyCost > grossIncomeYear) {
          break;
        }

        // Lucro deduz TSU da empresa também
        const profit = Math.max(0, grossIncomeYear - salary - expenses - ssCompanyYear);

        // IRC
        let ircYear = 0;
        if (profit <= IRC_THRESHOLD) {
          ircYear = profit * IRC_RATE_LOW;
        } else {
          ircYear = IRC_THRESHOLD * IRC_RATE_LOW + (profit - IRC_THRESHOLD) * IRC_RATE_HIGH;
        }

        // IRS Salário
        const taxRank = this.getTaxRankForIncome(salary);
        const irsPay = this.calculateIRS(salary, taxRank);

        // Líquidos
        const salaryNet = salary - irsPay.year - ssWorkerYear;
        const profitAfterIRC = profit - ircYear;
        const irsDividendos = profitAfterIRC * 0.28;
        const dividendosNet = profitAfterIRC - irsDividendos;

        const totalNet = salaryNet + dividendosNet;

        if (totalNet > maxNetIncome) {
          maxNetIncome = totalNet;
          bestSalary = salary;
        }
      }

      this.unipessoalSalary = bestSalary;
      this.unipessoalDistributeLucros = false;
    },
    setUnipessoalExpensesAsLiquidity(value: boolean) {
      this.unipessoalExpensesAsLiquidity = value;
    },
    setVatEnabled(enabled: boolean) {
      this.vatEnabled = enabled;
    },
    setLanguage(lang: 'pt' | 'en') {
      this.language = lang;
    },
    // Helper: obter escalão de IRS para um rendimento
    getTaxRankForIncome(income: number): TaxRank {
      const ranks = this.taxRanks;
      if (!ranks || ranks.length === 0) {
        // Retornar um escalão padrão se não houver escalões disponíveis
        return {
          id: 1,
          min: 0,
          max: null,
          normalTax: 0.13,
          averageTax: 0.13,
        };
      }
      for (let i = ranks.length - 1; i >= 0; i--) {
        const rank = ranks[i];
        if (income >= rank.min && (rank.max === null || income <= rank.max)) {
          return rank;
        }
      }
      return ranks[0];
    },
    // Helper: calcular IRS
    calculateIRS(taxableIncome: number, taxRank: TaxRank): GrossIncome {
      let yearIRS: number;
      const taxRanks = this.taxRanks;

      if (taxRank.id === 1) {
        yearIRS = taxableIncome * taxRank.normalTax;
      } else {
        // Encontrar o escalão anterior para cálculo da taxa média
        const avgRankIndex = taxRank.id - 2;
        if (!taxRanks || !taxRanks[avgRankIndex]) {
          yearIRS = taxableIncome * taxRank.normalTax;
        } else {
          const avgRank = taxRanks[avgRankIndex];
          const taxIncomeAvg = avgRank.max || 0;
          const taxIncomeNormal = taxableIncome - taxIncomeAvg;
          yearIRS = taxIncomeAvg * (avgRank.averageTax || avgRank.normalTax) + taxIncomeNormal * taxRank.normalTax;
        }
      }

      const monthIRS = yearIRS / 12;
      const dayIRS = yearIRS / (YEAR_BUSINESS_DAYS - this.nrDaysOff);

      return {
        year: Math.max(yearIRS, 0),
        month: Math.max(monthIRS, 0),
        day: Math.max(dayIRS, 0),
      };
    },
    // Helper: calcular IRC
    calculateIRC(profit: number): GrossIncome {
      let ircYear: number;
      if (profit <= IRC_THRESHOLD) {
        ircYear = profit * IRC_RATE_LOW;
      } else {
        ircYear = IRC_THRESHOLD * IRC_RATE_LOW + (profit - IRC_THRESHOLD) * IRC_RATE_HIGH;
      }

      return {
        year: Math.max(ircYear, 0),
        month: Math.max(ircYear / 12, 0),
        day: Math.max(ircYear / (YEAR_BUSINESS_DAYS - this.nrDaysOff), 0),
      };
    },
    // Helper: comparação vazia
    getEmptyComparison(type: ContractType): ContractComparison {
      return {
        type,
        grossIncome: { year: 0, month: 0, day: 0 },
        irsPay: { year: 0, month: 0, day: 0 },
        ssPay: { year: 0, month: 0, day: 0 },
        netIncome: { year: 0, month: 0, day: 0 },
        totalTaxes: { year: 0, month: 0, day: 0 },
      };
    },
  },
});

export { useComparisonStore };

