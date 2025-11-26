import { TrendingUp, AlertCircle, CheckCircle2, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"

export function Dashboard() {
  const recentTransactions = [
    { id: 1, date: "2024-11-26", type: "Ingreso", description: "Venta en efectivo", amount: 150 },
    { id: 2, date: "2024-11-26", type: "Egreso", description: "Compra de insumos", amount: -45.5 },
    { id: 3, date: "2024-11-26", type: "Ingreso", description: "Pago por transferencia", amount: 300 },
    { id: 4, date: "2024-11-25", type: "Egreso", description: "Pago de servicios", amount: -80 },
    { id: 5, date: "2024-11-25", type: "Ingreso", description: "Venta en tarjeta", amount: 200 },
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

  return (
    <motion.div 
      className="p-8 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-500">Bienvenido a tu sistema de cierre de caja inteligente</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
        {/* Saldo Actual */}
        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="border-l-4 border-l-blue-600 h-full">
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
        </motion.div>

        {/* Transacciones Pendientes */}
        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="border-l-4 border-l-yellow-500 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 mb-2">12</div>
              <p className="text-xs text-yellow-600">Transacciones sin procesar</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Último Cierre */}
        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="border-l-4 border-l-purple-500 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500">Último Cierre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-slate-900 mb-2">26 Nov 2024</div>
              <p className="text-xs text-slate-500">S/ 2,189.75</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Actividad Reciente */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas 5 transacciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx, index) => (
                <motion.div 
                  key={tx.id} 
                  className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
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
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button 
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Plus className="w-8 h-8" />
      </motion.button>
    </motion.div>
  )
}
