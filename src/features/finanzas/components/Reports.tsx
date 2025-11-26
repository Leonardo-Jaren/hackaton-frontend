import { Download, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export function Reports() {
  const closuresData = [
    { date: "2024-11-26", aiBalance: 650, physicalBalance: 650, difference: 0, status: "Cerrado" },
    { date: "2024-11-25", aiBalance: 580, physicalBalance: 575, difference: -5, status: "Cerrado" },
    { date: "2024-11-24", aiBalance: 720, physicalBalance: 720, difference: 0, status: "Cerrado" },
    { date: "2024-11-23", aiBalance: 490, physicalBalance: 495, difference: 5, status: "Con Errores" },
  ]

  const monthlyData = [
    { name: "Nov 1", ingresos: 450, egresos: 120 },
    { name: "Nov 8", ingresos: 680, egresos: 200 },
    { name: "Nov 15", ingresos: 620, egresos: 180 },
    { name: "Nov 22", ingresos: 750, egresos: 250 },
  ]

  const expensesData = [
    { name: "Insumos", value: 35, color: "#3b82f6" },
    { name: "Servicios", value: 25, color: "#22c55e" },
    { name: "Otros", value: 40, color: "#eab308" },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reportes e Historial</h1>
        <p className="text-slate-500">Consulta y analiza tus cierres de caja anteriores</p>
      </div>

      {/* Filtros */}
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

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos vs Egresos (Mensual)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ingresos" fill="#22c55e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="egresos" fill="#ef4444" radius={[8, 8, 0, 0]} />
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
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Cierres */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Cierres</CardTitle>
          <CardDescription>Últimos 4 cierres de caja</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                  <th className="px-4 py-3 text-left font-semibold">Saldo IA</th>
                  <th className="px-4 py-3 text-left font-semibold">Saldo Físico</th>
                  <th className="px-4 py-3 text-left font-semibold">Diferencia</th>
                  <th className="px-4 py-3 text-left font-semibold">Estado</th>
                  <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {closuresData.map((closure, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
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
                      <button className="p-2 hover:bg-slate-100 rounded">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded">
                        <Download className="w-4 h-4 text-blue-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-4 mt-6">
            <Button variant="outline" className="flex-1 bg-transparent">
              Exportar a Excel
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Generar PDF</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
