import { useState, useEffect } from "react"
import { Download, Eye, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/Button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { exportToExcel, exportToPDF, exportCierreToPDF } from "../../../lib/exportUtils"
import { useState } from "react"

export function Reports() {
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null)
  const closuresData = [
    { date: "2024-11-26", aiBalance: 650, physicalBalance: 650, difference: 0, status: "Cerrado" },
    { date: "2024-11-25", aiBalance: 580, physicalBalance: 575, difference: -5, status: "Cerrado" },
    { date: "2024-11-24", aiBalance: 720, physicalBalance: 720, difference: 0, status: "Cerrado" },
    { date: "2024-11-23", aiBalance: 490, physicalBalance: 495, difference: 5, status: "Con Errores" },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!user?.empresaId) return
    try {
      setLoading(true)
      const data = await finanzasService.listarCierres(user.empresaId)
      setClosures(data)
      
      // Prepare chart data from closures (last 7)
      const last7 = data.slice(0, 7).reverse()
      const chart = last7.map((c: any) => ({
        name: new Date(c.fecha_cierre || c.fecha_apertura).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        ingresos: parseFloat(c.total_ingresos),
        egresos: parseFloat(c.total_egresos)
      }))
      setChartData(chart)

    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const expensesData = [
    { name: "Insumos", value: 35, color: "#3b82f6" },
    { name: "Servicios", value: 25, color: "#22c55e" },
    { name: "Otros", value: 40, color: "#eab308" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  // Funciones de exportación
  const handleExportExcel = async () => {
    try {
      setExporting('excel')
      await exportToExcel(closuresData, 'historial-cierres')
      alert('✅ Excel exportado exitosamente')
    } catch (error) {
      console.error('Error exportando Excel:', error)
      alert('❌ Error al exportar Excel')
    } finally {
      setExporting(null)
    }
  }

  const handleExportPDF = async () => {
    try {
      setExporting('pdf')
      await exportToPDF(closuresData, 'historial-cierres')
      alert('✅ PDF generado exitosamente')
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('❌ Error al generar PDF')
    } finally {
      setExporting(null)
    }
  }

  const handleExportCierrePDF = async (cierre: typeof closuresData[0]) => {
    try {
      await exportCierreToPDF(cierre)
      alert('✅ PDF del cierre generado exitosamente')
    } catch (error) {
      console.error('Error generando PDF del cierre:', error)
      alert('❌ Error al generar PDF del cierre')
    }
  }

  return (
    <motion.div 
      className="p-8 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reportes e Historial</h1>
        <p className="text-slate-500">Consulta y analiza tus cierres de caja anteriores</p>
      </motion.div>

      {/* Filtros */}
      <motion.div variants={itemVariants}>
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Desde</label>
                <input type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Hasta</label>
                <input type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Estado</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                  <option>Todos</option>
                  <option>Cerrado</option>
                  <option>Con Errores</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Filtrar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gráficos */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8" variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Ingresos vs Egresos (Últimos Cierres)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ingresos" fill="#22c55e" radius={[8, 8, 0, 0]} name="Ingresos" />
                <Bar dataKey="egresos" fill="#ef4444" radius={[8, 8, 0, 0]} name="Egresos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {expensesData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-slate-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabla Historial */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Historial de Cierres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Fecha</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Saldo Sistema</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Saldo Físico</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Diferencia</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Estado</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {closuresData.map((closure, idx) => (
                    <motion.tr 
                      key={idx} 
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <td className="px-4 py-3 font-medium">{closure.date}</td>
                      <td className="px-4 py-3">S/ {closure.aiBalance}</td>
                      <td className="px-4 py-3">S/ {closure.physicalBalance}</td>
                      <td
                        className={`px-4 py-3 font-semibold ${
                          closure.difference === 0 ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {closure.difference > 0 ? "+" : ""} S/ {closure.difference}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            closure.status === "Cerrado" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {closure.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex justify-center gap-2">
                        <button 
                          className="p-2 hover:bg-slate-100 rounded"
                          onClick={() => console.log('Ver detalle:', closure)}
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button 
                          className="p-2 hover:bg-slate-100 rounded"
                          onClick={() => handleExportCierrePDF(closure)}
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4 text-blue-600" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 mt-6">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent"
                  onClick={handleExportExcel}
                  disabled={exporting === 'excel'}
                >
                  {exporting === 'excel' ? 'Exportando...' : 'Exportar a Excel'}
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleExportPDF}
                  disabled={exporting === 'pdf'}
                >
                  {exporting === 'pdf' ? 'Generando...' : 'Generar PDF'}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}