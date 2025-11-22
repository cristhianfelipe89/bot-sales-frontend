export default function formatCurrency(value = 0, locale = "es-CO", currency = "COP") {
    try { return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value); }
    catch { return `$${value}`; }
}
