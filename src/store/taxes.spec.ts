import { beforeEach, describe, expect, it } from "vitest";

import { createPinia } from "pinia";
import {
  SUPPORTED_TAX_RANK_YEARS,
  YEAR_BUSINESS_DAYS,
  useTaxesStore,
} from "@/store";
import { FrequencyChoices } from "@/typings";
import { asCurrency } from "@/utils";

const MONTHS_IN_YEAR = 12;

const taxesStore = useTaxesStore(createPinia());

describe("Taxes Store", () => {
  const DEFAULT_INCOME = 60_000;
  const DEFAULT_TAXABLE_INCOME = DEFAULT_INCOME * 0.75;

  beforeEach(() => {
    taxesStore.setIncome(DEFAULT_INCOME);
    taxesStore.setIncomeFrequency(FrequencyChoices.Year);
    taxesStore.setDisplayFrequency(FrequencyChoices.Month);
    taxesStore.setCurrentTaxRankYear(2024);
    taxesStore.setSsDiscount(0);

    taxesStore.firstYear = false;
    taxesStore.secondYear = false;
    taxesStore.rnh = false;
  });

  it("should calculate the correct gross income by year", () => {
    expect(taxesStore.grossIncome.year).toBe(DEFAULT_INCOME);
    expect(taxesStore.grossIncome.month).toBe(DEFAULT_INCOME / MONTHS_IN_YEAR);
    expect(taxesStore.grossIncome.day).toBe(
      DEFAULT_INCOME / YEAR_BUSINESS_DAYS,
    );
  });

  it("should calculate the correct gross income by month", () => {
    const newGrossIncome = DEFAULT_INCOME / MONTHS_IN_YEAR;
    taxesStore.setIncome(newGrossIncome);

    taxesStore.setIncomeFrequency(FrequencyChoices.Month);

    expect(taxesStore.grossIncome.year).toBe(newGrossIncome * MONTHS_IN_YEAR);
    expect(taxesStore.grossIncome.month).toBe(newGrossIncome);
    expect(taxesStore.grossIncome.day).toBe(
      taxesStore.grossIncome.year / YEAR_BUSINESS_DAYS,
    );
  });

  it("should calculate the correct gross income by day", () => {
    const newGrossIncome = DEFAULT_INCOME / YEAR_BUSINESS_DAYS;
    taxesStore.setIncome(newGrossIncome);

    taxesStore.setIncomeFrequency(FrequencyChoices.Day);

    expect(taxesStore.grossIncome.year).toBe(
      newGrossIncome * YEAR_BUSINESS_DAYS,
    );
    expect(taxesStore.grossIncome.month).toBe(
      taxesStore.grossIncome.year / MONTHS_IN_YEAR,
    );
    expect(taxesStore.grossIncome.day).toBe(newGrossIncome);
  });

  it("should calculate the correct SS pay in the first year", () => {
    taxesStore.ssFirstYear = true;

    expect(taxesStore.ssPay.year).toBe(0);
    expect(taxesStore.ssPay.month).toBe(0);
    expect(taxesStore.ssPay.day).toBe(0);
  });

  describe("should calculate the correct SS pay in the second year and so on", () => {
    const taxesStore = useTaxesStore(createPinia());
    const SS_TAX = 0.214;

    it("when the income is below the SS max income", () => {
      const newGrossIncome = 24_000;
      taxesStore.setIncome(newGrossIncome);

      expect(taxesStore.ssPay.year).toBe(SS_TAX * (newGrossIncome * 0.7));
      expect(taxesStore.ssPay.month).toBe(
        (SS_TAX * (newGrossIncome * 0.7)) / MONTHS_IN_YEAR,
      );
      expect(taxesStore.ssPay.day).toBe(
        (SS_TAX * (newGrossIncome * 0.7)) / YEAR_BUSINESS_DAYS,
      );
    });

    it("when the income is above the SS max income", () => {
      const newGrossIncome = 120_000;
      taxesStore.setIncome(newGrossIncome);

      expect(taxesStore.ssPay.year).toBe(
        SS_TAX * taxesStore.maxSsIncome * MONTHS_IN_YEAR,
      );
      expect(taxesStore.ssPay.month).toBe(SS_TAX * taxesStore.maxSsIncome);
      expect(taxesStore.ssPay.day).toBe(
        (SS_TAX * taxesStore.maxSsIncome) * MONTHS_IN_YEAR / YEAR_BUSINESS_DAYS,
      );
    });

    it("when the income is lower than max ss pay, positive SS discount is applied", () => {
      const newGrossIncome = 30_000;
      taxesStore.setIncome(newGrossIncome);
      taxesStore.setSsDiscount(0.25);

      const monthlySsPay = Math.min(
        taxesStore.maxSsIncome,
        taxesStore.grossIncome.month * 0.7 * 1.25);

      expect(taxesStore.ssPay.year).toBe(SS_TAX * monthlySsPay * MONTHS_IN_YEAR);
      expect(taxesStore.ssPay.month).toBe(SS_TAX * monthlySsPay);
      expect(taxesStore.ssPay.day).toBe(
        (SS_TAX * monthlySsPay) * MONTHS_IN_YEAR / YEAR_BUSINESS_DAYS,
      );
    });

    it("when income is lower, negative SS discount is applied", () => {
      const newGrossIncome = 30_000;
      taxesStore.setIncome(newGrossIncome);
      taxesStore.setSsDiscount(-0.25);

      const monthlySsPay = Math.min(
        taxesStore.maxSsIncome,
        taxesStore.grossIncome.month * 0.7 * 0.75);

      expect(taxesStore.ssPay.year).toBe(SS_TAX * monthlySsPay * MONTHS_IN_YEAR);
      expect(taxesStore.ssPay.month).toBe(SS_TAX * monthlySsPay);
      expect(taxesStore.ssPay.day).toBe(
        (SS_TAX * monthlySsPay) * MONTHS_IN_YEAR / YEAR_BUSINESS_DAYS,
      );
    });

    test.each([
      { income: 30_000, discount: 0.25 },
      { income: 30_000, discount: -0.25 },])
    ("Low incomes can apply discounts because with the discount," +
      "the monthly gross income is still lower than the maximum SS pay", ({income, discount}) => {
      taxesStore.setIncome(income);
      taxesStore.setSsDiscount(discount);

      const monthlySsPay = Math.min(
        taxesStore.maxSsIncome,
        taxesStore.grossIncome.month * 0.7 * (1 + discount));

      expect(taxesStore.ssPay.year).toBe(SS_TAX * monthlySsPay * MONTHS_IN_YEAR);
      expect(taxesStore.ssPay.month).toBe(SS_TAX * monthlySsPay);
      expect(taxesStore.ssPay.day).toBe(
        (SS_TAX * monthlySsPay) * MONTHS_IN_YEAR / YEAR_BUSINESS_DAYS
      );
    });

    test.each([
      { income: 200_000, discount: 0.25 },
      { income: 200_000, discount: -0.25 },
    ])("High incomes cannot apply discounts because even with the discount," +
      "the monthly gross income is higher than the maximum SS pay", ({income, discount}) => {
      taxesStore.setIncome(income);
      taxesStore.setSsDiscount(discount);

      expect(taxesStore.ssPay.year).toBe(
        SS_TAX * taxesStore.maxSsIncome * MONTHS_IN_YEAR,
      );
      expect(taxesStore.ssPay.month).toBe(SS_TAX * taxesStore.maxSsIncome);
      expect(taxesStore.ssPay.day).toBe(
        (SS_TAX * taxesStore.maxSsIncome) * MONTHS_IN_YEAR / YEAR_BUSINESS_DAYS,
      );
    });
  });

  describe("should calculate the correct specific deductions", () => {
    const taxesStore = useTaxesStore(createPinia());

    it("when the income is below the specific deduction", () => {
      expect(taxesStore.specificDeductions).toBe(4104);
    });

    it("when the income is above the specific deduction", () => {
      const newGrossIncome = 120_000;
      taxesStore.setIncome(newGrossIncome);

      expect(taxesStore.specificDeductions).toBe(120_000 * 0.1);
    });
  });

  it("should calculate correctly the max professional related expenses", () => {
    expect(taxesStore.maxExpenses).toBe(DEFAULT_INCOME * 0.15);
  });

  it("should calculate correctly the expenses needed", () => {
    expect(taxesStore.expensesNeeded).toBe(
      taxesStore.maxExpenses - taxesStore.specificDeductions,
    );
  });

  describe("should calculate correctly the taxable income", () => {
    it("when is first year of activity", () => {
      taxesStore.firstYear = true;

      expect(taxesStore.taxableIncome).toBe(DEFAULT_INCOME * 0.375);
    });

    it("when is second year of activity", () => {
      taxesStore.secondYear = true;

      expect(taxesStore.taxableIncome).toBe(DEFAULT_INCOME * 0.5625);
    });

    it("when is third year of activity and so on", () => {
      expect(taxesStore.taxableIncome).toBe(DEFAULT_INCOME * 0.75);
    });

    it("when expenses are lower than needed", () => {
      const newGrossIncome = 120_000;
      taxesStore.setIncome(newGrossIncome);
      taxesStore.expenses = 1000;

      expect(taxesStore.taxableIncome).toBe(
        newGrossIncome * 0.75 + taxesStore.expensesNeeded - taxesStore.expenses,
      );
    });
  });

  it("should get the correct taxRank value", () => {
    expect(taxesStore.taxRank.max).greaterThanOrEqual(DEFAULT_TAXABLE_INCOME);
    expect(taxesStore.taxRank.min).lessThanOrEqual(DEFAULT_TAXABLE_INCOME);
  });

  SUPPORTED_TAX_RANK_YEARS.forEach((year) => {
    it(`should get the correct taxRanks for ${year}`, () => {
      taxesStore.currentTaxRankYear = year;

      expect(taxesStore.currentTaxRankYear).toEqual(
        taxesStore.getCurrentTaxRankYear,
      );
      expect(taxesStore.taxRanks[year]).toEqual(taxesStore.getTaxRanks);
    });
  });

  it("should get the correct taxRankAvg value", () => {
    const average = taxesStore.getTaxRanks.find(
      (taxRank) =>
        taxesStore.taxRank.id === 1 || taxRank.id === taxesStore.taxRank.id - 1,
    );
    expect(taxesStore.taxRankAvg.max).toEqual(average.max);
    expect(taxesStore.taxRankAvg.min).toEqual(average.min);
  });

  it("should get the correct taxIncomeAvg value", () => {
    expect(taxesStore.taxIncomeAvg).toBe(taxesStore.taxRankAvg.max);

    taxesStore.setIncome(9000);

    expect(taxesStore.taxIncomeAvg).toBe(6_750);
  });

  it("should get the correct taxIncomeNormal value", () => {
    expect(taxesStore.taxIncomeNormal).toBe(
      DEFAULT_TAXABLE_INCOME - taxesStore.taxIncomeAvg,
    );

    taxesStore.setIncome(9000);

    expect(taxesStore.taxIncomeNormal).toBe(0);
  });

  it("should set income and normal taxes to null when user is NHR", () => {
    taxesStore.rnh = true;

    expect(taxesStore.taxIncomeAvg).toBeNull();
    expect(taxesStore.taxIncomeNormal).toBeNull();
  });

  it("should calculate correctly the irs pay", () => {
    const yearIRSCalculation =
      taxesStore.taxIncomeAvg * taxesStore.taxRankAvg.averageTax +
      taxesStore.taxIncomeNormal * taxesStore.taxRank.normalTax;

    expect(taxesStore.irsPay?.year).toBe(yearIRSCalculation);
    expect(taxesStore.irsPay?.month).toBe(yearIRSCalculation / MONTHS_IN_YEAR);
    expect(taxesStore.irsPay?.day).toBe(
      yearIRSCalculation / YEAR_BUSINESS_DAYS,
    );
  });

  it("should calculate correctly the irs pay for NHR", () => {
    taxesStore.rnh = true;

    const yearNHRIRSCalculation = DEFAULT_TAXABLE_INCOME * 0.2;

    expect(taxesStore.irsPay?.year).toBe(yearNHRIRSCalculation);
    expect(taxesStore.irsPay?.month).toBe(
      yearNHRIRSCalculation / MONTHS_IN_YEAR,
    );
    expect(taxesStore.irsPay?.day).toBe(
      yearNHRIRSCalculation / YEAR_BUSINESS_DAYS,
    );
  });

  it("should show taxes displayed correctly", () => {
    expect(taxesStore.taxesDisplay).toBe(
      asCurrency(taxesStore.irsPay?.month + taxesStore.ssPay?.month),
    );
  });

  it("should calculate correctly the net income", () => {
    expect(taxesStore.netIncome.year).toBe(
      DEFAULT_INCOME - taxesStore.irsPay?.year - taxesStore.ssPay?.year,
    );

    expect(taxesStore.netIncome.month).toBe(
      DEFAULT_INCOME / MONTHS_IN_YEAR -
        taxesStore.irsPay?.month -
        taxesStore.ssPay?.month,
    );

    expect(taxesStore.netIncome.day).toBe(
      (DEFAULT_INCOME -
        taxesStore.irsPay?.year -
        taxesStore.ssPay?.year) /
        YEAR_BUSINESS_DAYS,
    );
  });

  describe("Tax store frequency calculations and displays", () => {
    const tests = [
      { key: "irs", payProperty: "irsPay" },
      { key: "ss", payProperty: "ssPay" },
      { key: "netIncome", payProperty: "netIncome" },
    ];

    tests.forEach(({ key, payProperty }) => {
      it(`should calculate correctly the ${key} frequency`, () => {
        expect(taxesStore[`${key}Frequency`]).toBe(
          taxesStore[payProperty]?.month,
        );
      });

      it(`should show ${key} displayed correctly`, () => {
        expect(taxesStore[`${key}Display`]).toBe(
          asCurrency(taxesStore[`${key}Frequency`]),
        );
      });
    });
  });

  it("should get the correctly values when tax year changes", () => {
    expect(taxesStore.getTaxRanks[0].max).toEqual(7703);
    expect(taxesStore.getTaxRanks[1].max).toEqual(11623);
    expect(taxesStore.getTaxRanks[2].max).toEqual(16472);
    expect(taxesStore.getTaxRanks[3].max).toEqual(21321);
    expect(taxesStore.getTaxRanks[4].max).toEqual(27146);
    expect(taxesStore.getTaxRanks[5].max).toEqual(39791);
    expect(taxesStore.getTaxRanks[6].max).toEqual(43000);
    expect(taxesStore.getTaxRanks[7].max).toEqual(80000);
    expect(taxesStore.getTaxRanks[8].max).toBeFalsy();

    taxesStore.setCurrentTaxRankYear(2023);

    expect(taxesStore.getTaxRanks[0].max).toEqual(7479);
    expect(taxesStore.getTaxRanks[1].max).toEqual(11284);
    expect(taxesStore.getTaxRanks[2].max).toEqual(15992);
    expect(taxesStore.getTaxRanks[3].max).toEqual(20700);
    expect(taxesStore.getTaxRanks[4].max).toEqual(26355);
    expect(taxesStore.getTaxRanks[5].max).toEqual(38632);
    expect(taxesStore.getTaxRanks[6].max).toEqual(50483);
    expect(taxesStore.getTaxRanks[7].max).toEqual(78834);
    expect(taxesStore.getTaxRanks[8].max).toBeFalsy();
  });
});
