export function round(num, decimal = 0){
    return parseFloat(num).toFixed(decimal)
  }

export function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
}


export function currencyNoSymbol(num, decimalPlaces=0){
    return formatNumber(parseFloat(num).toFixed(decimalPlaces))
}

export function currency(num, decimalPlaces=0){
    return currencyNoSymbol(num, decimalPlaces) + "€"
}


export function reverseCurrency(num){
     
    const result = parseFloat(num.replaceAll(' ','').replaceAll('€', ''))
    return result <= 0 ? NaN:result
}

export const frequencyItems = {
    YEAR: "year",
    MONTH: "month",
    DAY: "day",
  };
  