import { useState, useEffect, useRef } from "react"
import { Upload, Camera, Plus, Trash2, Edit2, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import { useAuthStore } from "../../../store/useAuthStore"
import { finanzasService, type Transaccion, type Categoria, type MetodoPago, type ResultadoIA } from "../../../services/finanzasService"

export function TransactionRegistry() {
  const { user, setUser } = useAuthStore()
  const [transactions, setTransactions] = useState<Transaccion[]>([])
  const [resultadosIA, setResultadosIA] = useState<ResultadoIA[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [processingIA, setProcessingIA] = useState(false)
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    tipo: 'ingreso' as 'ingreso' | 'egreso',
    monto: '',
    descripcion: '',
    categoria: '',
    metodo_pago: ''
  })

  // Data for selects
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Si el usuario no tiene empresaId, asignar empresa por defecto (ID 1)
    if (user && !user.empresaId) {
      console.warn('⚠️ Usuario sin empresa asignada, asignando empresa ID 1')
      setUser({ 
        ...user, 
        empresaId: 1,
        empresaNombre: 'Mi Empresa Test S.A.C.'
      })
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!user?.empresaId) return
    try {
      setLoading(true)
      const [cats, methods, txData] = await Promise.all([
        finanzasService.getCategorias(),
        finanzasService.getMetodosPago(),
        finanzasService.getTransacciones(user.empresaId)
      ])
      
      setCategorias(cats)
      setMetodosPago(methods)
      setTransactions(txData.transacciones)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    console.log('🔍 Debug - file:', file)
    console.log('🔍 Debug - user:', user)
    console.log('🔍 Debug - empresaId:', user?.empresaId)
    
    if (!file) {
      console.warn('⚠️ No se seleccionó ningún archivo')
      return
    }
    
    if (!user?.empresaId) {
      console.error('❌ No hay empresaId en el usuario')
      alert('Error: No se encontró la empresa asociada al usuario. Por favor, inicia sesión nuevamente.')
      return
    }

    try {
      setUploading(true)
      
      console.log('📤 Subiendo archivo:', file.name)
      
      // Subir archivo y procesar con IA
      const response = await finanzasService.subirArchivoIA(user.empresaId, file)
      
      console.log('✅ Respuesta del backend:', response)
      
      // Obtener los resultados procesados por la IA
      const resultadosResponse = await finanzasService.getResultadosIA(user.empresaId)
      
      console.log('📊 Resultados de IA obtenidos:', resultadosResponse)
      
      setResultadosIA(resultadosResponse.resultados || [])
      
      const resultados = resultadosResponse.resultados || []
      
      // Convertir automáticamente los resultados a transacciones
      if (resultados.length > 0) {
        setProcessingIA(true)
        
        console.log(`🤖 Procesando ${resultados.length} resultados...`)
        
        let convertidos = 0
        
        for (const resultado of resultados) {
          // Verificar que no esté ya convertido y tenga buena confianza
          if (!resultado.convertido_transaccion && resultado.confianza >= 70) {
            try {
              console.log(`   ✓ Convirtiendo resultado #${resultado.id} (${resultado.confianza}% confianza)`)
              await finanzasService.convertirResultadoIA(resultado.id)
              convertidos++
            } catch (error) {
              console.error(`   ✗ Error convirtiendo resultado #${resultado.id}:`, error)
            }
          } else {
            console.log(`   ⊘ Saltando resultado #${resultado.id} (ya convertido o baja confianza: ${resultado.confianza}%)`)
          }
        }
        
        setProcessingIA(false)
        
        console.log(`✨ Proceso completo: ${convertidos}/${resultados.length} convertidos`)
      }
      
      // Refrescar lista de transacciones
      await fetchData()
      
      const mensaje = resultados.length > 0 
        ? `✅ Archivo procesado exitosamente!\n📊 Se detectaron ${resultados.length} transacciones`
        : '⚠️ Archivo procesado pero no se detectaron transacciones'
      
      alert(mensaje)
      
    } catch (error: any) {
      console.error("❌ Error uploading file:", error)
      const errorMsg = error.response?.data?.error || error.message || "Error desconocido"
      alert(`❌ Error al procesar el archivo:\n${errorMsg}\n\nVerifica que sea un Excel (.xlsx) o imagen (.jpg, .png)`)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.empresaId) return

    try {
      const data = {
        empresa: user.empresaId,
        tipo: formData.tipo,
        monto: parseFloat(formData.monto),
        descripcion: formData.descripcion,
        categoria: parseInt(formData.categoria),
        metodo_pago: parseInt(formData.metodo_pago)
      }

      if (editingId) {
        await finanzasService.updateTransaccion(editingId, data)
      } else {
        await finanzasService.registrarTransaccion(data)
      }
      
      setIsModalOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      console.error("Error saving transaction:", error)
      alert("Error al guardar la transacción")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta transacción?")) {
      try {
        await finanzasService.deleteTransaccion(id)
        fetchData()
      } catch (error) {
        console.error("Error deleting transaction:", error)
        alert("Error al eliminar la transacción")
      }
    }
  }

  const openEditModal = (tx: Transaccion) => {
    setEditingId(tx.id)
    setFormData({
      tipo: tx.tipo,
      monto: tx.monto.toString(),
      descripcion: tx.descripcion,
      categoria: tx.categoria?.toString() || '',
      metodo_pago: tx.metodo_pago?.toString() || ''
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      tipo: 'ingreso',
      monto: '',
      descripcion: '',
      categoria: '',
      metodo_pago: ''
    })
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

  return (
    <motion.div 
      className="p-8 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".xlsx,.xls,.jpg,.jpeg,.png"
        onChange={handleFileUpload}
      />

      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Registro de Transacciones</h1>
        <p className="text-slate-500">Carga y gestiona todas tus transacciones del día</p>
      </motion.div>

      {/* Opciones de Carga */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" variants={itemVariants}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-32 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center gap-3 text-lg font-semibold"
          >
            {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
            {uploading ? "Subiendo..." : "Subir desde Excel"}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-32 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center gap-3 text-lg font-semibold"
          >
            {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Camera className="w-8 h-8" />}
            {uploading ? "Subiendo..." : "Subir desde Foto"}
          </Button>
        </motion.div>
      </motion.div>

      {/* Tabla de Transacciones */}
      <motion.div variants={itemVariants}>
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
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500">Cargando transacciones...</td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500">No hay transacciones registradas hoy</td>
                    </tr>
                  ) : (
                    transactions.map((tx, index) => (
                      <motion.tr 
                        key={tx.id} 
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="px-4 py-3">{tx.fecha}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              tx.tipo === "ingreso" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {tx.tipo.charAt(0).toUpperCase() + tx.tipo.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {tx.descripcion}
                            {tx.procesado_ia && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                IA
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="font-medium">S/ {Number(tx.monto).toFixed(2)}</span>
                            {tx.procesado_ia && tx.confianza_ia && (
                              <div className="text-xs text-slate-500">
                                Confianza: {tx.confianza_ia}%
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">{tx.metodo_pago_nombre || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            tx.procesado_ia 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {tx.procesado_ia ? 'Procesado IA' : 'Manual'}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex justify-center gap-2">
                          <button 
                            onClick={() => openEditModal(tx)}
                            className="p-2 hover:bg-slate-100 rounded"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button 
                            onClick={() => handleDelete(tx.id)}
                            className="p-2 hover:bg-slate-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Agregar Fila */}
            <motion.button 
              onClick={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="mt-4 w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-blue-600 hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Añadir Transacción Manual
            </motion.button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal de Registro */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Editar Transacción" : "Nueva Transacción"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value as 'ingreso' | 'egreso'})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monto</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.monto}
                onChange={(e) => setFormData({...formData, monto: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <input
              type="text"
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Detalle de la transacción"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select
                required
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                {categorias
                  .filter(c => c.tipo === formData.tipo)
                  .map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))
                }
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Método de Pago</label>
              <select
                required
                value={formData.metodo_pago}
                onChange={(e) => setFormData({...formData, metodo_pago: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                {metodosPago.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {editingId ? "Guardar Cambios" : "Registrar Transacción"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Resumen */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Resumen Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <motion.div whileHover={{ y: -5 }} className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Total Ingresos</p>
                <p className="text-2xl font-bold text-green-600">
                  S/ {transactions
                    .filter(t => t.tipo === 'ingreso')
                    .reduce((acc, curr) => acc + Number(curr.monto), 0)
                    .toFixed(2)}
                </p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Total Egresos</p>
                <p className="text-2xl font-bold text-red-600">
                  S/ {transactions
                    .filter(t => t.tipo === 'egreso')
                    .reduce((acc, curr) => acc + Number(curr.monto), 0)
                    .toFixed(2)}
                </p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Saldo Parcial</p>
                <p className="text-2xl font-bold text-blue-600">
                  S/ {transactions
                    .reduce((acc, curr) => acc + (curr.tipo === 'ingreso' ? Number(curr.monto) : -Number(curr.monto)), 0)
                    .toFixed(2)}
                </p>
              </motion.div>
            </div>
            
            {/* Indicador de transacciones procesadas por IA */}
            {transactions.some(t => t.procesado_ia) && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 text-purple-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {transactions.filter(t => t.procesado_ia).length} transacciones procesadas automáticamente por IA
                  </span>
                </div>
              </div>
            )}
            
            {processingIA && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">
                    Procesando resultados de IA...
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
