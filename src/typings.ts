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
  [key: number] : YouthIrsRank;
}
