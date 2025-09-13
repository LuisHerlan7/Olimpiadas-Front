// Servicio de exportación para el Sistema de Olimpiadas Oh! SanSi
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Configuración de exportación
const EXPORT_CONFIG = {
  excel: {
    defaultSheetName: 'Resultados',
    dateFormat: 'DD/MM/YYYY'
  },
  pdf: {
    pageSize: 'A4',
    orientation: 'landscape',
    fontSize: 10,
    headerFontSize: 12
  }
};

// Función para exportar a Excel
export const exportToExcel = (data, filename = 'resultados', sheetName = 'Datos') => {
  try {
    // Crear un nuevo workbook
    const workbook = XLSX.utils.book_new();
    
    // Convertir datos a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Ajustar ancho de columnas
    const columnWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    worksheet['!cols'] = columnWidths;
    
    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generar archivo Excel
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    return { success: true, message: 'Archivo Excel generado exitosamente' };
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    return { success: false, message: 'Error al generar archivo Excel' };
  }
};

// Función para exportar a PDF
export const exportToPDF = (data, filename = 'resultados', title = 'Resultados de Olimpiadas') => {
  try {
    const doc = new jsPDF({
      orientation: EXPORT_CONFIG.pdf.orientation,
      unit: 'mm',
      format: EXPORT_CONFIG.pdf.pageSize
    });
    
    // Configurar fuente
    doc.setFontSize(EXPORT_CONFIG.pdf.headerFontSize);
    doc.setFont('helvetica', 'bold');
    
    // Título
    doc.text(title, 14, 20);
    
    // Fecha de generación
    doc.setFontSize(EXPORT_CONFIG.pdf.fontSize);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);
    
    // Preparar datos para la tabla
    const tableData = data.map(item => Object.values(item));
    const headers = Object.keys(data[0] || {});
    
    // Generar tabla
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: EXPORT_CONFIG.pdf.fontSize,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [29, 53, 87], // Color secundario azul
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // Color gris claro
      }
    });
    
    // Guardar archivo
    doc.save(`${filename}.pdf`);
    
    return { success: true, message: 'Archivo PDF generado exitosamente' };
  } catch (error) {
    console.error('Error al exportar a PDF:', error);
    return { success: false, message: 'Error al generar archivo PDF' };
  }
};

// Función para exportar participantes
export const exportParticipantes = (participantes, format = 'excel') => {
  const data = participantes.map(participante => ({
    'Código': participante.codigo || '',
    'Nombre Completo': participante.nombreCompleto,
    'Documento': participante.documento,
    'Contacto': participante.contacto,
    'Unidad Educativa': participante.unidadEducativa,
    'Departamento': participante.departamento,
    'Grado': participante.grado,
    'Área de Competencia': participante.areaCompetencia,
    'Nivel de Competencia': participante.nivelCompetencia,
    'Tutor Académico': participante.tutorAcademico || '',
    'Fecha de Registro': participante.fechaRegistro,
    'Estado': participante.estado
  }));
  
  if (format === 'excel') {
    return exportToExcel(data, 'participantes_olimpiadas', 'Participantes');
  } else if (format === 'pdf') {
    return exportToPDF(data, 'participantes_olimpiadas', 'Lista de Participantes - Olimpiadas Oh! SanSi');
  }
  
  return { success: false, message: 'Formato no soportado' };
};

// Función para exportar resultados
export const exportResultados = (resultados, format = 'excel') => {
  const data = resultados.map(resultado => ({
    'Posición': resultado.posicion > 0 ? `#${resultado.posicion}` : '-',
    'Nombre': resultado.nombre,
    'Documento': resultado.documento,
    'Unidad Educativa': resultado.unidadEducativa,
    'Área': resultado.area,
    'Nivel': resultado.nivel,
    'Nota': resultado.nota.toFixed(1),
    'Clasificación': resultado.clasificacion,
    'Medalla': resultado.medalla || '-',
    'Evaluador': resultado.evaluador,
    'Observaciones': resultado.observaciones || ''
  }));
  
  if (format === 'excel') {
    return exportToExcel(data, 'resultados_olimpiadas', 'Resultados');
  } else if (format === 'pdf') {
    return exportToPDF(data, 'resultados_olimpiadas', 'Resultados de Olimpiadas Oh! SanSi');
  }
  
  return { success: false, message: 'Formato no soportado' };
};

// Función para exportar medallero
export const exportMedallero = (medalleroData, format = 'excel') => {
  const data = [];
  
  medalleroData.forEach(area => {
    // Agregar encabezado del área
    data.push({
      'Área': `${area.area} - ${area.nivel}`,
      'Medalla': '',
      'Participante': '',
      'Unidad Educativa': '',
      'Nota': ''
    });
    
    // Agregar medallas de oro
    area.oro.forEach(participante => {
      data.push({
        'Área': '',
        'Medalla': 'Oro',
        'Participante': participante.nombre,
        'Unidad Educativa': participante.unidad,
        'Nota': participante.nota.toFixed(1)
      });
    });
    
    // Agregar medallas de plata
    area.plata.forEach(participante => {
      data.push({
        'Área': '',
        'Medalla': 'Plata',
        'Participante': participante.nombre,
        'Unidad Educativa': participante.unidad,
        'Nota': participante.nota.toFixed(1)
      });
    });
    
    // Agregar medallas de bronce
    area.bronce.forEach(participante => {
      data.push({
        'Área': '',
        'Medalla': 'Bronce',
        'Participante': participante.nombre,
        'Unidad Educativa': participante.unidad,
        'Nota': participante.nota.toFixed(1)
      });
    });
    
    // Agregar menciones
    area.mencion.forEach(participante => {
      data.push({
        'Área': '',
        'Medalla': 'Mención',
        'Participante': participante.nombre,
        'Unidad Educativa': participante.unidad,
        'Nota': participante.nota.toFixed(1)
      });
    });
    
    // Agregar línea en blanco
    data.push({
      'Área': '',
      'Medalla': '',
      'Participante': '',
      'Unidad Educativa': '',
      'Nota': ''
    });
  });
  
  if (format === 'excel') {
    return exportToExcel(data, 'medallero_olimpiadas', 'Medallero');
  } else if (format === 'pdf') {
    return exportToPDF(data, 'medallero_olimpiadas', 'Medallero Oficial - Olimpiadas Oh! SanSi');
  }
  
  return { success: false, message: 'Formato no soportado' };
};

// Función para generar certificado
export const generarCertificado = (participante, resultado) => {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'A4'
    });
    
    // Configurar colores
    const primaryColor = [29, 53, 87]; // Azul institucional
    const secondaryColor = [230, 57, 70]; // Rojo institucional
    
    // Fondo con gradiente (simulado)
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Borde decorativo
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(2);
    doc.rect(20, 20, 257, 170);
    
    // Logo/Encabezado
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('UNIVERSIDAD MAYOR DE SAN SIMÓN', 148.5, 40, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(...secondaryColor);
    doc.text('FACULTAD DE CIENCIAS Y TECNOLOGÍA', 148.5, 50, { align: 'center' });
    
    // Título del certificado
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('CERTIFICADO DE PARTICIPACIÓN', 148.5, 70, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('OLIMPIADAS ACADÉMICAS "OH! SANSI"', 148.5, 80, { align: 'center' });
    
    // Texto del certificado
    doc.setFontSize(12);
    doc.text('Se certifica que:', 148.5, 100, { align: 'center' });
    
    // Nombre del participante
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(participante.nombreCompleto, 148.5, 115, { align: 'center' });
    
    // Detalles
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`de la Unidad Educativa ${participante.unidadEducativa}`, 148.5, 125, { align: 'center' });
    doc.text(`participó en el área de ${participante.areaCompetencia}`, 148.5, 135, { align: 'center' });
    doc.text(`nivel ${participante.nivelCompetencia}`, 148.5, 145, { align: 'center' });
    
    if (resultado && resultado.clasificacion === 'Clasificado') {
      doc.text(`obteniendo una calificación de ${resultado.nota.toFixed(1)} puntos`, 148.5, 155, { align: 'center' });
      if (resultado.medalla) {
        doc.text(`y la medalla de ${resultado.medalla}`, 148.5, 165, { align: 'center' });
      }
    }
    
    // Fecha y lugar
    doc.setFontSize(10);
    doc.text(`Cochabamba, ${new Date().toLocaleDateString('es-ES')}`, 148.5, 180, { align: 'center' });
    
    // Guardar certificado
    const filename = `certificado_${participante.nombreCompleto.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
    
    return { success: true, message: 'Certificado generado exitosamente' };
  } catch (error) {
    console.error('Error al generar certificado:', error);
    return { success: false, message: 'Error al generar certificado' };
  }
};

// Función para generar reporte de premiación
export const generarReportePremiacion = (resultados, format = 'pdf') => {
  const data = resultados
    .filter(r => r.clasificacion === 'Clasificado')
    .sort((a, b) => b.nota - a.nota)
    .map((resultado, index) => ({
      'Posición': index + 1,
      'Nombre': resultado.nombre,
      'Unidad Educativa': resultado.unidadEducativa,
      'Área': resultado.area,
      'Nivel': resultado.nivel,
      'Nota': resultado.nota.toFixed(1),
      'Medalla': resultado.medalla || 'Mención',
      'Evaluador': resultado.evaluador
    }));
  
  if (format === 'excel') {
    return exportToExcel(data, 'reporte_premiacion', 'Lista de Premiación');
  } else if (format === 'pdf') {
    return exportToPDF(data, 'reporte_premiacion', 'Lista de Premiación - Olimpiadas Oh! SanSi');
  }
  
  return { success: false, message: 'Formato no soportado' };
};

export default {
  exportToExcel,
  exportToPDF,
  exportParticipantes,
  exportResultados,
  exportMedallero,
  generarCertificado,
  generarReportePremiacion
};


