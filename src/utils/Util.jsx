
export function formatarValorCompleto(valor, moeda = 'BRL', locale = 'pt-BR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: moeda,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

export function formatarValor(valor, locale = 'pt-BR', minimumFractionDigits = 2) {
  return valor.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits
  });
}
