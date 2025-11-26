import { AlertCircle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"

export function CashClosure() {
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
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Cierre de Caja - 26 Nov 2024</h1>
        <p className="text-slate-500">Completa el cierre de caja y reconcilia el efectivo</p>
      </motion.div>

      {/* Análisis de IA */}
      <motion.div variants={itemVariants}>
        <Card className="mb-8 border-l-4 border-l-blue-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              Análisis de la IA
            </CardTitle>
            <CardDescription>La IA ha procesado 12 transacciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <motion.div whileHover={{ y: -5 }} className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-slate-500 mb-1">Total Ingresos</p>
                <p className="text-3xl font-bold text-green-600">S/ 650.00</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-slate-500 mb-1">Total Egresos</p>
                <p className="text-3xl font-bold text-red-600">S/ 125.50</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-500 mb-1">Saldo Final (IA)</p>
                <p className="text-3xl font-bold text-blue-600">S/ 524.50</p>
              </motion.div>
            </div>

            {/* Alertas */}
            <div className="space-y-3">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Discrepancia detectada</p>
                  <p className="text-sm text-yellow-800">
                    Se encontró una diferencia de S/ 5.00 en la categoría de ingresos por tarjeta
                  </p>
                </div>
              </motion.div>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                Ver Transacciones con Discrepancias →
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Conteo Físico */}
      <motion.div variants={itemVariants}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Conteo Físico de Efectivo</CardTitle>
            <CardDescription>Ingresa el monto que contaste en la caja</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Efectivo Físico en Caja</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-900 font-semibold">S/</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12">
                  Calcular Diferencia
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabla Detallada */}
      <motion.div variants={itemVariants}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resumen Detallado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-900">Saldo Inicial de Caja</span>
                <span className="font-semibold">S/ 100.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-900">+ Ingresos por Efectivo</span>
                <span className="font-semibold text-green-600">S/ 450.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-900">+ Ingresos por Tarjeta</span>
                <span className="font-semibold text-green-600">S/ 200.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-900">- Egresos por Efectivo</span>
                <span className="font-semibold text-red-600">-S/ 75.50</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-900">- Retiros de Propietario</span>
                <span className="font-semibold text-red-600">-S/ 50.00</span>
              </div>
              <div className="flex justify-between py-3 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                <span className="font-bold text-slate-900">Saldo Esperado (IA)</span>
                <span className="text-2xl font-bold text-blue-600">S/ 624.50</span>
              </div>
              <div className="flex justify-between py-3 bg-slate-100 px-4 py-3 rounded-lg">
                <span className="font-bold text-slate-900">Saldo Físico Contado</span>
                <span className="text-2xl font-bold">-</span>
              </div>
              <div className="flex justify-between py-3 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
                <span className="font-bold text-slate-900">Diferencia</span>
                <span className="text-2xl font-bold text-red-600">-</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Botones de Acción */}
      <motion.div variants={itemVariants} className="flex gap-4">
        <Button variant="outline" className="flex-1 h-12 bg-transparent">
          Guardar Borrador
        </Button>
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">
            Confirmar Cierre de Caja
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
