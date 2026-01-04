export const obtenerProximaFecha = (diaNombre) => {
    if (!diaNombre) return 'Por definir';

    const diasSemana = {
        'domingo': 0, 'lunes': 1, 'martes': 2, 'miércoles': 3,
        'jueves': 4, 'viernes': 5, 'sábado': 6
    };

    const hoy = new Date();
    const diaActual = hoy.getDay(); // 0 (Domingo) a 6 (Sábado)
    
    // Convertir input a minúsculas y quitar acentos si es necesario
    const target = diaNombre.toLowerCase().trim();
    const diaObjetivo = diasSemana[target];

    if (diaObjetivo === undefined) return diaNombre; // Si no coincide, devuelve el texto original

    // Calcular cuántos días faltan
    let diasFaltantes = (diaObjetivo - diaActual + 7) % 7;

    // Si es hoy (0 días), devolvemos "Hoy"
    if (diasFaltantes === 0) return 'Hoy';
    
    // Si es mañana (1 día), devolvemos "Mañana"
    if (diasFaltantes === 1) return 'Mañana';

    // Si no, calculamos la fecha
    const proximaFecha = new Date(hoy);
    proximaFecha.setDate(hoy.getDate() + diasFaltantes);

    // Formatear: "Jueves 12 Ene"
    const diaStr = target.charAt(0).toUpperCase() + target.slice(1);
    const diaNumero = proximaFecha.getDate();
    // Obtener mes abreviado
    const mes = proximaFecha.toLocaleDateString('es-ES', { month: 'short' });

    return `${diaStr} ${diaNumero} ${mes}`;
};