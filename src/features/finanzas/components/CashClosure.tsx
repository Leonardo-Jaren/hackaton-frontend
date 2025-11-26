import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/Button"
import { useAuthStore } from "../../../store/useAuthStore"
import { finanzasService, type CierreCajaResumen } from "../../../services/finanzasService"

export function CashClosure() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [activeClosure, setActiveClosure] = useState<any>(null)
  const [activeFondo, setActiveFondo] = useState<any>(null)
  const [summary, setSummary] = useState<CierreCajaResumen | null>(null)
  const [physicalCash, setPhysicalCash] = useState("")
  const [difference, setDifference] = useState<number | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!user?.empresaId) return
    try {
      setLoading(true)
      // 1. Check for active closure
      const closure = await finanzasService.getCierreActivo()
      if (closure) {
        setActiveClosure(closure)
        // Fetch summary
        const sum = await finanzasService.obtenerResumenCierre(closure.id)
        setSummary(sum)
        // If physical cash was already registered, set it
        if (closure.resumenes_efectivo && closure.resumenes_efectivo.length > 0) {
            setPhysicalCash(closure.resumenes_efectivo[0].efectivo_contado_fisico)
            // Calculate difference if we have both
            // But difference is also in closure object or summary?
            // summary has saldo_sistema. closure has saldo_final_real if closed?
            // Let's rely on local calculation for now or fetch updated summary
        }
      } else {
        // 2. If no active closure, check for active Fondo Caja
        const fondo = await finanzasService.getFondoCajaActivo(user.empresaId)
        setActiveFondo(fondo)
      }
    } catch (error) {
      console.error("Error fetching closure data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleIniciarCierre = async () => {
    if (!activeFondo) return
    try {
      setProcessing(true)
      const newClosure = await finanzasService.iniciarCierre(activeFondo.id)
      setActiveClosure(newClosure)
      const sum = await finanzasService.obtenerResumenCierre(newClosure.id)
      setSummary(sum)
    } catch (error) {
      console.error("Error initiating closure:", error)
      alert("Error al iniciar el cierre")
    } finally {
      setProcessing(false)
    }
  }

  const handleCalcularDiferencia = async () => {
    if (!activeClosure || !physicalCash) return
    try {
      setProcessing(true)
      const monto = parseFloat(physicalCash)
      await finanzasService.registrarEfectivoFisico(activeClosure.id, monto)
      
      // Refresh summary/closure to get updated difference
      // Or calculate locally:
      if (summary) {
        const diff = monto - summary.saldo_sistema
        setDifference(diff)
      }
      alert("Efectivo registrado correctamente")
    } catch (error) {
      console.error("Error registering cash:", error)
      alert("Error al registrar efectivo")
    } finally {
      setProcessing(false)
    }
  }

  const handleFinalizarCierre = async () => {
    if (!activeClosure) return
    if (!confirm("¿Estás seguro de finalizar el cierre de caja? No podrás realizar más cambios.")) return

    try {
      setProcessing(true)
      await finanzasService.finalizarCierre(activeClosure.id)
      alert("Cierre de caja finalizado exitosamente")
      setActiveClosure(null)
      setActiveFondo(null)
      setSummary(null)
      setPhysicalCash("")
      setDifference(null)
      // Maybe redirect or refresh
      fetchData()
    } catch (error) {
      console.error("Error finalizing closure:", error)
      alert("Error al finalizar el cierre")
    } finally {
      setProcessing(false)
    }
  }

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

  if (!activeClosure) {
    return (
      <motion.div 
        className="p-8 max-w-7xl mx-auto text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Cierre de Caja</h1>
        {activeFondo ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Iniciar Cierre del Día</CardTitle>
              <CardDescription>Se utilizará el fondo de caja actual (ID: {activeFondo.id})</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleIniciarCierre} 
                disabled={processing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Iniciar Cierre
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No hay caja aperturada ahora mismo</CardTitle>
              <CardDescription>Debes crear un fondo de caja para el día antes de poder realizar un cierre.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-500">Ve a "Registro de Transacciones" o crea un fondo inicial.</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="p-8 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Cierre de Caja - {new Date().toLocaleDateString()}</h1>
        <p className="text-slate-500">Completa el cierre de caja y reconcilia el efectivo</p>
      </motion.div>

      {/* Análisis de IA / Sistema */}
      <motion.div variants={itemVariants}>
        <Card className="mb-8 border-l-4 border-l-blue-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              Resumen del Sistema
            </CardTitle>
            <CardDescription>Calculado en base a las transacciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <motion.div whileHover={{ y: -5 }} className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-slate-500 mb-1">Total Ingresos</p>
                <p className="text-3xl font-bold text-green-600">S/ {summary?.total_ingresos_sistema?.toFixed(2) || '0.00'}</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-slate-500 mb-1">Total Egresos</p>
                <p className="text-3xl font-bold text-red-600">S/ {summary?.total_egresos_sistema?.toFixed(2) || '0.00'}</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-500 mb-1">Saldo Esperado</p>
                <p className="text-3xl font-bold text-blue-600">S/ {summary?.saldo_sistema?.toFixed(2) || '0.00'}</p>
              </motion.div>
            </div>

            {/* Alertas de Diferencia */}
            {difference !== null && Math.abs(difference) > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Discrepancia detectada</p>
                  <p className="text-sm text-yellow-800">
                    Se encontró una diferencia de S/ {Math.abs(difference).toFixed(2)} ({difference > 0 ? 'Sobrante' : 'Faltante'})
                  </p>
                </div>
              </motion.div>
            )}
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
                    step="0.01"
                    value={physicalCash}
                    onChange={(e) => setPhysicalCash(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button 
                    onClick={handleCalcularDiferencia}
                    disabled={processing || !physicalCash}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Registrar y Calcular Diferencia
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
              <div className="flex justify-between py-3 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                <span className="font-bold text-slate-900">Saldo Esperado (Sistema)</span>
                <span className="text-2xl font-bold text-blue-600">S/ {summary?.saldo_sistema?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between py-3 bg-slate-100 px-4 py-3 rounded-lg">
                <span className="font-bold text-slate-900">Saldo Físico Contado</span>
                <span className="text-2xl font-bold">S/ {physicalCash ? parseFloat(physicalCash).toFixed(2) : '-'}</span>
              </div>
              <div className={`flex justify-between py-3 px-4 py-3 rounded-lg border ${difference !== null && difference !== 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <span className="font-bold text-slate-900">Diferencia</span>
                <span className={`text-2xl font-bold ${difference !== null && difference !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {difference !== null ? `S/ ${difference.toFixed(2)}` : '-'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Botones de Acción */}
      <motion.div variants={itemVariants} className="flex gap-4">
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={handleFinalizarCierre}
            disabled={processing || !physicalCash}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
          >
            Confirmar Cierre de Caja
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

