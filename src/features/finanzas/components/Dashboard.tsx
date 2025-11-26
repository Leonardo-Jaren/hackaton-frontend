import { TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"

export function Dashboard() {
  const recentTransactions = [
    { id: 1, date: "2024-11-26", type: "Ingreso", description: "Venta en efectivo", amount: 150 },
    { id: 2, date: "2024-11-26", type: "Egreso", description: "Compra de insumos", amount: -45.5 },
    { id: 3, date: "2024-11-26", type: "Ingreso", description: "Pago por transferencia", amount: 300 },
    { id: 4, date: "2024-11-25", type: "Egreso", description: "Pago de servicios", amount: -80 },
    { id: 5, date: "2024-11-25", type: "Ingreso", description: "Venta en tarjeta", amount: 200 },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-500">Bienvenido a tu sistema de cierre de caja inteligente</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Saldo Actual */}
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">Saldo Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">S/ 2,450.50</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Positivo
            </p>
          </CardContent>
        </Card>

        {/* Transacciones Pendientes */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 mb-2">12</div>
            <p className="text-xs text-yellow-600">Transacciones sin procesar</p>
          </CardContent>
        </Card>

        {/* Último Cierre */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">Último Cierre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-slate-900 mb-2">26 Nov 2024</div>
            <p className="text-xs text-slate-500">S/ 2,189.75</p>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas 5 transacciones registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-0">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === "Ingreso" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {tx.type === "Ingreso" ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{tx.description}</p>
                    <p className="text-sm text-slate-500">{tx.date}</p>
                  </div>
                </div>
                <div className={`font-bold ${tx.type === "Ingreso" ? "text-green-600" : "text-red-600"}`}>
                  {tx.type === "Ingreso" ? "+" : ""} S/ {Math.abs(tx.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center text-2xl">
        +
      </button>
    </div>
  )
}
