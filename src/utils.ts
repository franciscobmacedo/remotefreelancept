export const round = (num: number, decimal = 0) => {
  return num.toFixed(decimal);
};

export const formatNumber = (num: string) => {
  return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
};

export const spacedNumber = (num: number, decimalPlaces = 0) => {
  if (num === null) return ""
  return formatNumber(num.toFixed(decimalPlaces));
};

export const asCurrency = (num: number, decimalPlaces = 0) => {
  return spacedNumber(num, decimalPlaces) + "€";
};

export const asPercentage = (num: number) => {
  return round(num*100).toString() + "%";
};

export const reverseCurrency = (num: string) => {
  const result = parseFloat(num.replaceAll(" ", "").replaceAll("€", ""));
  return isNaN(result) ? 0 : result;
};
