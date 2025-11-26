import { useEffect, useState } from "react"
import { TrendingUp, AlertCircle, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { useAuthStore } from "../../../store/useAuthStore"
import { finanzasService, type Transaccion } from "../../../services/finanzasService"

export function Dashboard() {
  const { user } = useAuthStore()
  const [transactions, setTransactions] = useState<Transaccion[]>([])
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [lastClosure, setLastClosure] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.empresaId) return
      try {
        setLoading(true)
        const [txData, closuresData] = await Promise.all([
          finanzasService.getTransacciones(user.empresaId),
          finanzasService.listarCierres(user.empresaId)
        ])
        
        setTransactions(txData.transacciones)
        
        // Calculate balance
        const total = txData.transacciones.reduce((acc, curr) => {
          return curr.tipo === 'ingreso' ? acc + Number(curr.monto) : acc - Number(curr.monto)
        }, 0)
        setBalance(total)
        
        setPendingCount(txData.transacciones.length)

        if (closuresData && closuresData.length > 0) {
          setLastClosure(closuresData[0])
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.empresaId])

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
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-slate-100 rounded animate-pulse" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
              <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
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
              <div className={`text-3xl font-bold mb-2 ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                S/ {balance.toFixed(2)}
              </div>
              <p className={`text-xs flex items-center gap-1 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-4 h-4" />
                {balance >= 0 ? 'Positivo' : 'Negativo'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transacciones Totales */}
        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="border-l-4 border-l-yellow-500 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500">Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 mb-2">{pendingCount}</div>
              <p className="text-xs text-yellow-600">Registradas hoy</p>
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
              {lastClosure ? (
                <>
                  <div className="text-lg font-bold text-slate-900 mb-2">
                    {new Date(lastClosure.fecha_cierre || lastClosure.fecha_apertura).toLocaleDateString()}
                  </div>
                  <p className="text-xs text-slate-500">
                    Saldo: S/ {parseFloat(lastClosure.saldo_final_sistema).toFixed(2)}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-lg font-bold text-slate-900 mb-2">--</div>
                  <p className="text-xs text-slate-500">No registrado</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Actividad Reciente */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas transacciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((tx) => (
                <motion.div 
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      tx.tipo === 'ingreso' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {tx.tipo === 'ingreso' ? <TrendingUp className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{tx.descripcion}</p>
                      <p className="text-xs text-slate-500">{new Date(tx.fecha).toLocaleDateString()} - {tx.categoria_nombre || 'Sin categoría'}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    tx.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.tipo === 'ingreso' ? '+' : '-'} S/ {Number(tx.monto).toFixed(2)}
                  </div>
                </motion.div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No hay transacciones recientes
                </div>
              )}
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
