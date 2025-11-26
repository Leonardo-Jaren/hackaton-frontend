import { useState } from "react"
import { Upload, Camera, Plus, Trash2, Edit2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"

export function TransactionRegistry() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2024-11-26",
      type: "Ingreso",
      description: "Venta en efectivo",
      amount: 150,
      method: "Efectivo",
      status: "Verificado",
    },
    {
      id: 2,
      date: "2024-11-26",
      type: "Egreso",
      description: "Compra",
      amount: 45.5,
      method: "Efectivo",
      status: "Pendiente",
    },
  ])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Registro de Transacciones</h1>
        <p className="text-slate-500">Carga y gestiona todas tus transacciones del día</p>
      </div>

      {/* Opciones de Carga */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Button className="h-32 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center gap-3 text-lg font-semibold">
          <Upload className="w-8 h-8" />
          Subir desde Excel
        </Button>
        <Button className="h-32 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center gap-3 text-lg font-semibold">
          <Camera className="w-8 h-8" />
          Subir desde Foto
        </Button>
      </div>

      {/* Tabla de Transacciones */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Transacciones Cargadas</CardTitle>
          <CardDescription>Verifica y edita tus transacciones antes del cierre</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Fecha</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Tipo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Descripción</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Monto</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Método</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Estado</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">{tx.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.type === "Ingreso" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{tx.description}</td>
                    <td className="px-4 py-3 font-medium">S/ {tx.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">{tx.method}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.status === "Verificado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Agregar Fila */}
          <button className="mt-4 w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-blue-600 hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Añadir Transacción Manual
          </button>
        </CardContent>
      </Card>

      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Total Ingresos</p>
              <p className="text-2xl font-bold text-green-600">S/ 150.00</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Total Egresos</p>
              <p className="text-2xl font-bold text-red-600">S/ 45.50</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Saldo Parcial</p>
              <p className="text-2xl font-bold text-blue-600">S/ 104.50</p>
            </div>
          </div>
          <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white h-12">
            Procesar con IA
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
