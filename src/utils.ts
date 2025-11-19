export const round = (num: number, decimal = 0) => {
  return num.toFixed(decimal);
};

export const formatNumber = (num: string) => {
  return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
};

export const spacedNumber = (num: number, decimalPlaces = 0) => {
  if (num === null || num === undefined) return "";
  return formatNumber(num.toFixed(decimalPlaces));
};

export const asCurrency = (num: number, decimalPlaces = 0) => {
  return spacedNumber(num, decimalPlaces) + "€";
};

export const asPercentage = (num: number) => {
  return round(num * 100).toString() + "%";
};

export const reverseCurrency = (num: string) => {
  const result = parseFloat(num.replaceAll(" ", "").replaceAll("€", ""));
  return result <= 0 ? NaN : result;
};

export const formatISOString = (isoString: string, locale: string = "en"): string => {
  return new Date(isoString).toLocaleString(locale);
};

export const generateUUID = (): string => {
  const uuid: string[] = [];

  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid[i] = "-";
    } else if (i === 14) {
      uuid[i] = "4";
    } else if (i === 19) {
      uuid[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
    } else {
      uuid[i] = Math.floor(Math.random() * 16).toString(16);
    }
  }

  return uuid.join("");
};
