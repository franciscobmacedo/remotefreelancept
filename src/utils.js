export function round(num, decimal = 0){
    return parseFloat(num).toFixed(decimal)
  }

function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
}
export function currency(num, decimalPlaces=0){
    return formatNumber(parseFloat(num).toFixed(decimalPlaces)).toString() + "€"
}

export const frequencyItems = {
    YEAR: "year",
    MONTH: "month",
    DAY: "day",
  };
  