import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface CierreData {
  date: string
  aiBalance: number
  physicalBalance: number
  difference: number
  status: string
}

/**
 * Exporta los datos de cierres a un archivo Excel (.xlsx)
 */
export const exportToExcel = (data: CierreData[], filename: string = 'historial-cierres') => {
  try {
    // Preparar los datos para el Excel
    const excelData = data.map(item => ({
      'Fecha': item.date,
      'Saldo IA': `S/ ${item.aiBalance}`,
      'Saldo Físico': `S/ ${item.physicalBalance}`,
      'Diferencia': `${item.difference > 0 ? '+' : ''} S/ ${item.difference}`,
      'Estado': item.status
    }))

    // Crear el workbook y worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    
    // Añadir estilos a las columnas (ancho fijo)
    worksheet['!cols'] = [
      { wch: 12 }, // Fecha
      { wch: 12 }, // Saldo IA
      { wch: 15 }, // Saldo Físico
      { wch: 12 }, // Diferencia
      { wch: 15 }  // Estado
    ]

    // Añadir el worksheet al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historial de Cierres')

    // Generar el archivo
    const date = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `${filename}-${date}.xlsx`)
    
    console.log('✅ Excel generado exitosamente')
    return true
  } catch (error) {
    console.error('❌ Error generando Excel:', error)
    throw error
  }
}

/**
 * Genera un PDF con los datos de cierres
 */
export const exportToPDF = (data: CierreData[], filename: string = 'historial-cierres') => {
  try {
    // Crear nuevo documento PDF
    const doc = new jsPDF()

    // Título
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Historial de Cierres de Caja', 14, 20)

    // Fecha de generación
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generado: ${new Date().toLocaleString('es-PE')}`, 14, 28)

    // Preparar datos para la tabla
    const tableData = data.map(item => [
      item.date,
      `S/ ${item.aiBalance}`,
      `S/ ${item.physicalBalance}`,
      `${item.difference > 0 ? '+' : ''} S/ ${item.difference}`,
      item.status
    ])

    // Generar tabla
    autoTable(doc, {
      head: [['Fecha', 'Saldo IA', 'Saldo Físico', 'Diferencia', 'Estado']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      headStyles: {
        fillColor: [37, 99, 235], // Blue-600
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Fecha
        1: { cellWidth: 30 }, // Saldo IA
        2: { cellWidth: 35 }, // Saldo Físico
        3: { cellWidth: 30 }, // Diferencia
        4: { cellWidth: 35 }  // Estado
      },
      didParseCell: function(data) {
        // Colorear la columna de diferencia
        if (data.column.index === 3 && data.section === 'body' && data.cell.raw) {
          const difference = parseFloat(data.cell.raw.toString().replace(/[^\d.-]/g, ''))
          if (difference === 0) {
            data.cell.styles.textColor = [34, 197, 94] // Green-600
            data.cell.styles.fontStyle = 'bold'
          } else if (difference > 0) {
            data.cell.styles.textColor = [59, 130, 246] // Blue-600
            data.cell.styles.fontStyle = 'bold'
          } else {
            data.cell.styles.textColor = [239, 68, 68] // Red-600
            data.cell.styles.fontStyle = 'bold'
          }
        }
        
        // Colorear la columna de estado
        if (data.column.index === 4 && data.section === 'body') {
          if (data.cell.raw === 'Cerrado') {
            data.cell.styles.fillColor = [220, 252, 231] // Green-100
            data.cell.styles.textColor = [21, 128, 61] // Green-700
          } else if (data.cell.raw === 'Con Errores') {
            data.cell.styles.fillColor = [254, 243, 199] // Orange-100
            data.cell.styles.textColor = [194, 65, 12] // Orange-700
          }
        }
      }
    })

    // Agregar resumen al final
    const finalY = (doc as any).lastAutoTable.finalY || 35
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Resumen:', 14, finalY + 15)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const totalCierres = data.length
    const cierresSinError = data.filter(c => c.difference === 0).length
    const cierresConError = totalCierres - cierresSinError
    
    doc.text(`Total de cierres: ${totalCierres}`, 14, finalY + 22)
    doc.text(`Cierres sin diferencia: ${cierresSinError}`, 14, finalY + 28)
    doc.text(`Cierres con diferencia: ${cierresConError}`, 14, finalY + 34)

    // Guardar el PDF
    const date = new Date().toISOString().split('T')[0]
    doc.save(`${filename}-${date}.pdf`)
    
    console.log('✅ PDF generado exitosamente')
    return true
  } catch (error) {
    console.error('❌ Error generando PDF:', error)
    throw error
  }
}

/**
 * Exporta un cierre individual a PDF
 */
export const exportCierreToPDF = (cierre: CierreData) => {
  try {
    const doc = new jsPDF()

    // Título
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Cierre de Caja', 105, 20, { align: 'center' })

    // Fecha
    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha: ${cierre.date}`, 105, 30, { align: 'center' })

    // Línea divisoria
    doc.setLineWidth(0.5)
    doc.line(20, 35, 190, 35)

    // Información del cierre
    let yPos = 50

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Información del Cierre:', 20, yPos)

    yPos += 10
    doc.setFont('helvetica', 'normal')
    
    // Saldo IA
    doc.text('Saldo según IA:', 20, yPos)
    doc.text(`S/ ${cierre.aiBalance.toFixed(2)}`, 150, yPos, { align: 'right' })
    
    // Saldo Físico
    yPos += 10
    doc.text('Saldo Físico Contado:', 20, yPos)
    doc.text(`S/ ${cierre.physicalBalance.toFixed(2)}`, 150, yPos, { align: 'right' })
    
    // Línea divisoria
    yPos += 5
    doc.setLineWidth(0.2)
    doc.line(20, yPos, 150, yPos)
    
    // Diferencia
    yPos += 10
    doc.setFont('helvetica', 'bold')
    doc.text('Diferencia:', 20, yPos)
    
    const diffColor: [number, number, number] = cierre.difference === 0 ? [34, 197, 94] : cierre.difference > 0 ? [59, 130, 246] : [239, 68, 68]
    doc.setTextColor(diffColor[0], diffColor[1], diffColor[2])
    doc.text(`${cierre.difference > 0 ? '+' : ''} S/ ${cierre.difference.toFixed(2)}`, 150, yPos, { align: 'right' })
    doc.setTextColor(0, 0, 0)
    
    // Estado
    yPos += 15
    doc.setFont('helvetica', 'bold')
    doc.text('Estado:', 20, yPos)
    
    const statusColor: [number, number, number] = cierre.status === 'Cerrado' ? [21, 128, 61] : [194, 65, 12]
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
    doc.text(cierre.status, 150, yPos, { align: 'right' })
    doc.setTextColor(0, 0, 0)

    // Pie de página
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text(`Generado: ${new Date().toLocaleString('es-PE')}`, 105, 280, { align: 'center' })

    // Guardar
    doc.save(`cierre-${cierre.date}.pdf`)
    
    console.log('✅ PDF individual generado exitosamente')
    return true
  } catch (error) {
    console.error('❌ Error generando PDF individual:', error)
    throw error
  }
}
