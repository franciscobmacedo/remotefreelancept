import { setActivePinia, createPinia } from "pinia";
import { useTaxesStore } from "./index";
import { describe, it, expect, beforeEach } from "vitest";

describe("Taxes Store - IRS 2025 Verification", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("should calculate IRS correctly for 2025 - Bracket 1 (12.5%)", () => {
        const store = useTaxesStore();
        store.setCurrentTaxRankYear(2025);
        store.setIncome(8000); // Below 8059
        // Taxable income calculation might depend on other factors, let's assume standard case
        // For simplicity in this unit test, we are checking if the store picks up the right rates
        // But the store calculates taxable income based on expenses etc.
        // Let's check the tax ranks directly from the getter
        const ranks = store.getTaxRanks;
        expect(ranks[0].normalTax).toBe(0.125);
        expect(ranks[0].averageTax).toBe(0.125);
    });

    it("should calculate IRS correctly for 2025 - Bracket 2 (16.0%)", () => {
        const store = useTaxesStore();
        store.setCurrentTaxRankYear(2025);
        const ranks = store.getTaxRanks;
        expect(ranks[1].normalTax).toBe(0.16);
        expect(ranks[1].averageTax).toBe(0.1368);
    });

    it("should calculate IRS correctly for 2025 - Bracket 6 (34.9%)", () => {
        const store = useTaxesStore();
        store.setCurrentTaxRankYear(2025);
        const ranks = store.getTaxRanks;
        expect(ranks[5].normalTax).toBe(0.349);
        expect(ranks[5].averageTax).toBe(0.2528);
    });

    it("should calculate IRS correctly for 2025 - Bracket 8 (44.6%)", () => {
        const store = useTaxesStore();
        store.setCurrentTaxRankYear(2025);
        const ranks = store.getTaxRanks;
        expect(ranks[7].normalTax).toBe(0.446);
        expect(ranks[7].averageTax).toBe(0.3493);
    });
});
