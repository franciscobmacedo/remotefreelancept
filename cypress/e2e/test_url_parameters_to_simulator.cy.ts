describe("simulator loads", () => {
  it("successfully loads the home page", () => {
    cy.visit("/#/"); // change URL to match your dev URL
    cy.contains("h4", " Remote freelancer from Portugal 🇵🇹");
  });
});

describe("pass income through url parameters", () => {
  it("successfully uses income from url", () => {
    cy.visit("/#/?income=50000"); // change URL to match your dev URL
    cy.get('[data-cy="income"]').should("have.value", "50 000");
  });

  it("doesn't update income if incorrect from url", () => {
    cy.visit("/#/?income=-50000"); // change URL to match your dev URL
    cy.get('[data-cy="income"]').should("have.value", "");
  });

  it("doesn't update income if 0 from url", () => {
    cy.visit("/#/?income=0"); // change URL to match your dev URL
    cy.get('[data-cy="income"]').should("have.value", "");
  });
});
describe("pass incomeFrequency through url parameters", () => {
  it("successfully uses incomeFrequency from url", () => {
    cy.visit("/#/?income=50000&incomeFrequency=day"); // change URL to match your dev URL
    cy.get('[data-cy="frequency-dropdown"]>input').should("have.value", "day");
  });
  it("doesn't update incomeFrequency if incorrect from url", () => {
    cy.visit("/#/?income=50000&incomeFrequency=dummyval"); // change URL to match your dev URL
    cy.get('[data-cy="frequency-dropdown"]>input').should("have.value", "year");
  });
});

describe("pass displayFrequency through url parameters", () => {
  it("successfully uses displayFrequency from url", () => {
    cy.visit("/#/?income=50000&displayFrequency=day"); // change URL to match your dev URL
    cy.get('[data-cy="frequency-button"].bg-secondary').should(
      "have.text",
      "Day",
    );
  });
  it("doesn't update displayFrequency if incorrect from url", () => {
    cy.visit("/#/?income=50000&displayFrequency=dummyval"); // change URL to match your dev URL
    cy.get('[data-cy="frequency-button"].bg-secondary').should(
      "have.text",
      "Month",
    );
  });
});

describe("pass nrMonthsDisplay through url parameters", () => {
  it("successfully uses nrMonthsDisplay from url", () => {
    cy.visit("/#/?income=50000&nrMonthsDisplay=13"); // change URL to match your dev URL
    cy.get('[data-cy="nr-months-display"] input:first-of-type').should(
      "have.value",
      "13",
    );
  });
  it("doesn't update nrMonthsDisplay if incorrect from url", () => {
    cy.visit("/#/?income=50000&nrMonthsDisplay=-1"); // change URL to match your dev URL
    cy.get('[data-cy="nr-months-display"] input:first-of-type').should(
      "have.value",
      "12",
    );
  });
});

describe("pass ssDiscount through url parameters", () => {
  it("successfully uses ssDiscount from url", () => {
    cy.visit("/#/?income=50000&ssDiscount=-0.15"); // change URL to match your dev URL
    cy.get('[data-cy="ss-discount"]').should("have.text", "-15%");
  });
  it("doesn't update ssDiscount if incorrect from url", () => {
    cy.visit("/#/?income=50000&ssDiscount=-0.45"); // change URL to match your dev URL
    cy.get('[data-cy="ss-discount"]').should("have.text", "0%");
  });
});

describe("pass expenses through url parameters", () => {
  it("successfully uses positive expenses from url", () => {
    cy.visit("/#/?income=50000&expenses=1534"); // change URL to match your dev URL
    cy.get('[data-cy="expenses"] input:first-of-type').should(
      "have.value",
      "1 534",
    );
  });

  it("successfully uses 0 expenses from url", () => {
    cy.visit("/#/?income=50000&expenses=0"); // change URL to match your dev URL
    cy.get('[data-cy="expenses"] input:first-of-type').should(
      "have.value",
      "0",
    );
  });

  it("doesn't update expenses if incorrect from url", () => {
    cy.visit("/#/?income=50000&expenses=-1534"); // change URL to match your dev URL
    cy.get('[data-cy="expenses"] input:first-of-type').should(
      "have.value",
      "0",
    );
  });
});

describe("pass currentTaxRankYear through url parameters", () => {
  it("successfully uses currentTaxRankYear from url", () => {
    cy.visit("/#/?income=50000&currentTaxRankYear=2023"); // change URL to match your dev URL
    cy.get('[data-cy="tax-rank-years-dropdown"] input:first-of-type').should(
      "have.value",
      "2023",
    );
  });

  it("doesn't update currentTaxRankYear if invalid year from url", () => {
    cy.visit("/#/?income=50000&currentTaxRankYear=2026"); // change URL to match your dev URL
    cy.get('[data-cy="tax-rank-years-dropdown"] input:first-of-type').should(
      "have.value",
      "2025",
    );
  });

  it("doesn't update currentTaxRankYear if incorrect type from url", () => {
    cy.visit("/#/?income=50000&currentTaxRankYear=dummyval"); // change URL to match your dev URL
    cy.get('[data-cy="tax-rank-years-dropdown"] input:first-of-type').should(
      "have.value",
      "2025",
    );
  });
});

describe("pass ssFirstYear through url parameters", () => {
  it("successfully uses true ssFirstYear from url", () => {
    cy.visit("/#/?income=50000&ssFirstYear=true"); // change URL to match your dev URL
    cy.get('[data-cy="ss-first-year"] input:first-of-type').should(
      "have.value",
      "true",
    );
  });

  it("successfully uses false ssFirstYear from url", () => {
    cy.visit("/#/?income=50000&ssFirstYear=false"); // change URL to match your dev URL
    cy.get('[data-cy="ss-first-year"] input:first-of-type').should(
      "have.value",
      "false",
    );
  });

  it("doesn't update ssFirstYear if string type from url", () => {
    cy.visit("/#/?income=50000&ssFirstYear=yes"); // change URL to match your dev URL
    cy.get('[data-cy="ss-first-year"] input:first-of-type').should(
      "have.value",
      "false",
    );
  });

  it("doesn't update ssFirstYear if number type from url", () => {
    cy.visit("/#/?income=50000&ssFirstYear=1"); // change URL to match your dev URL
    cy.get('[data-cy="ss-first-year"] input:first-of-type').should(
      "have.value",
      "false",
    );
  });
});

describe("pass firstYear through url parameters", () => {
  it("successfully uses true firstYear from url", () => {
    cy.visit("/#/?income=50000&firstYear=true"); // change URL to match your dev URL
    cy.get('[data-cy="first-year"] input:first-of-type').should(
      "have.value",
      "true",
    );
  });

  it("successfully uses false firstYear from url", () => {
    cy.visit("/#/?income=50000&firstYear=false"); // change URL to match your dev URL
    cy.get('[data-cy="first-year"] input:first-of-type').should(
      "have.value",
      "false",
    );
  });

  it("doesn't update firstYear if string type from url", () => {
    cy.visit("/#/?income=50000&firstYear=yes"); // change URL to match your dev URL
    cy.get('[data-cy="first-year"] input:first-of-type').should(
      "have.value",
      "false",
    );
  });

  it("doesn't update firstYear if number type from url", () => {
    cy.visit("/#/?income=50000&firstYear=1"); // change URL to match your dev URL
    cy.get('[data-cy="first-year"] input:first-of-type').should(
      "have.value",
      "false",
    );
  });
});

describe("pass secondYear through url parameters", () => {
  it("successfully uses true secondYear from url", () => {
    cy.visit("/#/?income=50000&secondYear=true"); // change URL to match your dev URL
    cy.get('[data-cy="second-year"] input:first-of-type').should(
      "have.value",
      "true",
    );
  });

  it("successfully uses false secondYear from url", () => {
    cy.visit("/#/?income=50000&secondYear=false"); // change URL to match your dev URL
    cy.get('[data-cy="second-year"] input:first-of-type').should(
      "have.value",
      "false",
    );
  });

  it("doesn't update secondYear if string type from url", () => {
    cy.visit("/#/?income=50000&secondYear=yes"); // change URL to match your dev URL
    cy.get('[data-cy="second-year"] input:first-of-type').should(
      "have.value",
      "false",
    );
  });

  it("doesn't update secondYear if number type from url", () => {
    cy.visit("/#/?income=50000&secondYear=1"); // change URL to match your dev URL
    cy.get('[data-cy="second-year"] input:first-of-type').should(
      "have.value",
      "false",
    );
  });
});

describe("pass rnh through url parameters", () => {
  it("successfully uses true rnh from url", () => {
    cy.visit("/#/?income=50000&rnh=true"); // change URL to match your dev URL
    cy.get('[data-cy="rnh"] input:first-of-type').should("have.value", "true");
  });

  it("successfully uses false rnh from url", () => {
    cy.visit("/#/?income=50000&rnh=false"); // change URL to match your dev URL
    cy.get('[data-cy="rnh"] input:first-of-type').should("have.value", "false");
  });

  it("doesn't update rnh if string type from url", () => {
    cy.visit("/#/?income=50000&rnh=yes"); // change URL to match your dev URL
    cy.get('[data-cy="rnh"] input:first-of-type').should("have.value", "false");
  });

  it("doesn't update rnh if number type from url", () => {
    cy.visit("/#/?income=50000&rnh=1"); // change URL to match your dev URL
    cy.get('[data-cy="rnh"] input:first-of-type').should("have.value", "false");
  });
});

describe("pass youth irs through url parameters", () => {
  it("successfully uses youth irs year from url 2025", () => {
    cy.visit("/#/?income=50000&benefitsOfYouthIrs=true&yearOfYouthIrs=8&currentTaxRankYear=2025"); 
    cy.get('[data-cy="youth-irs"] input[type="checkbox"]').should("have.value", "true");
    cy.get('[data-cy="youth-irs-years-dropdown"] input:first-of-type').should("have.value", "8");
    
  });

  it("doesn't update youth irs year if incorrect from url 2025", () => {
    cy.visit("/#/?income=50000&benefitsOfYouthIrs=true&yearOfYouthIrs=15&currentTaxRankYear=2025"); 
    cy.get('[data-cy="youth-irs"] input[type="checkbox"]').should("be.checked");
    cy.get('[data-cy="youth-irs-years-dropdown"] input:first-of-type').should("have.value", "1");
  });

  it("successfully uses youth irs year from url 2024", () => {
    cy.visit("/#/?income=50000&benefitsOfYouthIrs=true&yearOfYouthIrs=5&currentTaxRankYear=2024"); 
    cy.get('[data-cy="youth-irs"] input[type="checkbox"]').should("be.checked");
    cy.get('[data-cy="youth-irs-years-dropdown"] input:first-of-type').should("have.value", "5");
  });

  it("doesn't update youth irs year if incorrect from url 2024", () => {
    cy.visit("/#/?income=50000&benefitsOfYouthIrs=true&yearOfYouthIrs=10&currentTaxRankYear=2024"); 
    cy.get('[data-cy="youth-irs"] input[type="checkbox"]').should("be.checked");
    cy.get('[data-cy="youth-irs-years-dropdown"] input:first-of-type').should("have.value", "1"); 
  });

  it("doesn't update youth irs year if it is not selected", () => {
    cy.visit("/#/?income=50000"); 
    cy.get('[data-cy="youth-irs"] input[type="checkbox"]').should("not.be.checked");
  });
});