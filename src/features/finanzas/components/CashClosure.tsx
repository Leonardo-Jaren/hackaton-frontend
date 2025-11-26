import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/Button"
import { useState, useEffect } from "react"
import { finanzasService } from "../../../services"
// import { useAuthStore } from "../../../store/useAuthStore" // Para futuro uso

export function CashClosure() {
  // const { user } = useAuthStore() // Para futuro uso
  const [efectivoFisico, setEfectivoFisico] = useState<string>('')
  const [calculating, setCalculating] = useState(false)
  const [cierreData, setCierreData] = useState<any>(null)
  const [diferencia, setDiferencia] = useState<number | null>(null)
  
  useEffect(() => {
    // TODO: Cargar datos del cierre actual si existe
    fetchCierreActual()
  }, [])
  
  const fetchCierreActual = async () => {
    // Por ahora datos de ejemplo, luego conectar con el backend
    // try {
    //   const data = await finanzasService.obtenerResumenCierre(cierreId)
    //   setCierreData(data)
    // } catch (error) {
    //   console.error('Error cargando cierre:', error)
    // }
  }
  
  const handleCalcularDiferencia = async () => {
    if (!efectivoFisico || parseFloat(efectivoFisico) <= 0) {
      alert('Por favor ingresa un monto válido')
      return
    }
    
    try {
      setCalculating(true)
      
      // TODO: Obtener el ID del cierre actual desde el backend
      const cierreId = 2 // Esto debería venir del estado o del backend
      
      const response = await finanzasService.registrarEfectivoFisico(
        cierreId,
        parseFloat(efectivoFisico)
      )
      
      console.log('✅ Diferencia calculada:', response)
      console.log('📊 Diferencia efectivo:', response.diferencia_efectivo)
      console.log('💰 Ventas sistema:', response.ventas_efectivo_sistema)
      console.log('💵 Efectivo contado:', response.efectivo_contado_fisico)
      
      // Actualizar la diferencia
      if (response.diferencia_efectivo !== undefined) {
        setDiferencia(response.diferencia_efectivo)
        console.log('✅ Estado diferencia actualizado a:', response.diferencia_efectivo)
      }
      
      // Actualizar los datos del cierre
      setCierreData(response)
      
    } catch (error: any) {
      console.error('❌ Error calculando diferencia:', error)
      console.error('📋 Response data:', error.response?.data)
      
      const errorMsg = error.response?.data?.error || error.response?.data?.detalles || error.message || 'Error desconocido'
      const detalles = error.response?.data?.detalles 
        ? '\n\nDetalles:\n' + JSON.stringify(error.response.data.detalles, null, 2)
        : ''
      
      alert(`❌ Error al calcular diferencia:\n${errorMsg}${detalles}`)
    } finally {
      setCalculating(false)
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
                    placeholder="0.00"
                    value={efectivoFisico}
                    onChange={(e) => setEfectivoFisico(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                  onClick={handleCalcularDiferencia}
                  disabled={calculating || !efectivoFisico}
                >
                  {calculating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Calculando...
                    </>
                  ) : (
                    'Calcular Diferencia'
                  )}
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
                <span className="text-2xl font-bold">
                  {efectivoFisico ? `S/ ${parseFloat(efectivoFisico).toFixed(2)}` : '-'}
                </span>
              </div>
              <div className={`flex justify-between py-3 px-4 py-3 rounded-lg border ${
                diferencia === null 
                  ? 'bg-slate-50 border-slate-200'
                  : diferencia === 0
                  ? 'bg-green-50 border-green-200'
                  : diferencia > 0
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <span className="font-bold text-slate-900">Diferencia</span>
                <span className={`text-2xl font-bold ${
                  diferencia === null
                    ? 'text-slate-400'
                    : diferencia === 0
                    ? 'text-green-600'
                    : diferencia > 0
                    ? 'text-blue-600'
                    : 'text-red-600'
                }`}>
                  {diferencia !== null ? `S/ ${diferencia.toFixed(2)}` : '-'}
                </span>
              </div>
              {diferencia !== null && diferencia !== 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg ${
                    diferencia > 0 ? 'bg-blue-50' : 'bg-red-50'
                  }`}
                >
                  <p className={`text-sm font-medium ${
                    diferencia > 0 ? 'text-blue-900' : 'text-red-900'
                  }`}>
                    {diferencia > 0 
                      ? `✅ Sobrante de S/ ${diferencia.toFixed(2)}`
                      : `⚠️ Faltante de S/ ${Math.abs(diferencia).toFixed(2)}`
                    }
                  </p>
                  <p className={`text-xs mt-1 ${
                    diferencia > 0 ? 'text-blue-700' : 'text-red-700'
                  }`}>
                    {diferencia > 0
                      ? 'Hay más efectivo del esperado en caja'
                      : 'Falta efectivo en caja, verifica las transacciones'
                    }
                  </p>
                </motion.div>
              )}
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

