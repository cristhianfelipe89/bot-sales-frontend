export const formatDateCol = (dateInput) => {
    if (!dateInput) return "—";
    return new Date(dateInput).toLocaleString("es-CO", {
        timeZone: "America/Bogota",
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true
    });
};