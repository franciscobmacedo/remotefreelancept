export enum FrequencyChoices {
  Year = "year",
  Month = "month",
  Day = "day",
}

export interface GrossIncome {
  year: number;
  month: number;
  day: number;
}

export interface TaxRank {
  id: number;
  min: number;
  max: number | null;
  normalTax: number;
  averageTax: number | null;
}

export interface Colors {
  netIncome: string;
  irs: string;
  ss: string;
}

export interface YouthIrsRank {
  maxDiscountPercentage: number;
  maxDiscountIasMultiplier: number;
}

export interface YouthIrs {
  [key: number]: YouthIrsRank;
}

export enum ContractType {
  RecibosVerdes = "recibos-verdes",
  CTI = "cti",
  Unipessoal = "unipessoal",
}

export interface AdditionalExpenses {
  accountant?: number; // Contabilista
  healthInsurance?: number; // Seguro de saúde
  personalInsurance?: number; // Seguro pessoal
  workInsurance?: number; // Seguro de trabalho
  otherExpenses?: number; // Outras despesas
}

export interface Benefits {
  mealTicket?: GrossIncome; // Cartão refeição (isento + tributado)
}

export interface ContractComparison {
  type: ContractType;
  grossIncome: GrossIncome;
  irsPay: GrossIncome;
  ssPay: GrossIncome;
  ircPay?: GrossIncome; // Apenas para Unipessoal
  netIncome: GrossIncome;
  totalTaxes: GrossIncome;
  employerCost?: GrossIncome; // Custo total para o empregador (CTI)
  additionalExpenses?: AdditionalExpenses; // Despesas adicionais
  benefits?: Benefits; // Benefícios (cartão refeição, etc.)
  totalExpenses?: GrossIncome; // Total de despesas (impostos + despesas adicionais)
  finalNetIncome?: GrossIncome; // Rendimento líquido final (após todas as despesas)
  liquidityExpenses?: GrossIncome; // Despesas que contam como liquidez (ajudas de custo, benefícios)
}