import { useState, useEffect } from "react"
import { Download, Eye, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/Button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useAuthStore } from "../../../store/useAuthStore"
import { finanzasService } from "../../../services/finanzasService"

export function Reports() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [closures, setClosures] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])

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

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
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
                  {closures.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">No hay cierres registrados</td>
                    </tr>
                  ) : (
                    closures.map((closure, index) => (
                      <tr key={closure.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3">{new Date(closure.fecha_cierre || closure.fecha_apertura).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-medium">S/ {parseFloat(closure.saldo_final_sistema).toFixed(2)}</td>
                        <td className="px-4 py-3">S/ {closure.saldo_final_real ? parseFloat(closure.saldo_final_real).toFixed(2) : '-'}</td>
                        <td className={`px-4 py-3 font-medium ${parseFloat(closure.diferencia_total) !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {parseFloat(closure.diferencia_total) > 0 ? '+' : ''}{parseFloat(closure.diferencia_total).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            closure.estado === 'cerrado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {closure.estado.charAt(0).toUpperCase() + closure.estado.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button className="p-2 hover:bg-slate-200 rounded-full text-slate-600">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}