import { useState, useEffect, useRef } from "react"
import { Upload, Camera, Plus, Trash2, Edit2, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import { useAuthStore } from "../../../store/useAuthStore"
import { finanzasService, type Transaccion, type Categoria, type MetodoPago } from "../../../services/finanzasService"

export function TransactionRegistry() {
  const { user } = useAuthStore()
  const [transactions, setTransactions] = useState<Transaccion[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [activeFondo, setActiveFondo] = useState<any>(null)
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFondoModalOpen, setIsFondoModalOpen] = useState(false)
  const [fondoMonto, setFondoMonto] = useState('')
  
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    tipo: 'ingreso' as 'ingreso' | 'gasto',
    monto: '',
    descripcion: '',
    categoria: '',
    metodo_pago: ''
  })

  // Data for selects
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    if (!user?.empresaId) return

    try {
      setLoading(true)
      const [transactionsRes, fondoRes, categoriasRes, metodosRes] = await Promise.all([
        finanzasService.getTransacciones(user.empresaId),
        finanzasService.getFondoCajaActivo(user.empresaId),
        finanzasService.getCategorias(),
        finanzasService.getMetodosPago()
      ])
      
      console.log('Fondo Activo:', fondoRes)
      console.log('Transacciones:', transactionsRes)

      setTransactions(transactionsRes.transacciones)
      // Ensure activeFondo is null if empty
      setActiveFondo(fondoRes && Object.keys(fondoRes).length > 0 ? fondoRes : null)
      setCategorias(categoriasRes)
      setMetodosPago(metodosRes)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.empresaId) {
      fetchData()
    }
  }, [user?.empresaId])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.empresaId) return

    try {
      setUploading(true)
      await finanzasService.subirArchivoIA(user.empresaId, file)
      // Refresh transactions after upload (assuming backend processes it or we poll)
      // For now just refresh list
      await fetchData()
      alert("Archivo subido exitosamente. La IA está procesando los datos.")
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Error al subir el archivo")
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

  const handleCreateFondo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.empresaId) return

    try {
      const montoInicial = fondoMonto ? parseFloat(fondoMonto) : 0
      await finanzasService.crearFondoCaja({
        empresa: user.empresaId,
        monto: montoInicial
      })
      setIsFondoModalOpen(false)
      setFondoMonto('')
      fetchData()
    } catch (error) {
      console.error('Error creating fondo:', error)
      alert('Error al abrir la caja')
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

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 bg-slate-100 rounded-xl animate-pulse border border-slate-200" />
            <div className="h-32 bg-slate-100 rounded-xl animate-pulse border border-slate-200" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 w-full bg-slate-50 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      ) : !activeFondo ? (
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-orange-900 mb-2">Caja Cerrada</h3>
              <p className="text-orange-700 mb-6 max-w-md">
                No hay una caja abierta actualmente. Debes aperturar la caja para comenzar a registrar transacciones.
              </p>
              <Button 
                onClick={() => setIsFondoModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Aperturar Caja
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Opciones de Carga */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Tabla de Transacciones */}
          <div>
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
                      {transactions.length === 0 ? (
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
                                {tx.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                              </span>
                            </td>
                            <td className="px-4 py-3">{tx.descripcion}</td>
                            <td className="px-4 py-3 font-medium">S/ {Number(tx.monto).toFixed(2)}</td>
                            <td className="px-4 py-3">{tx.metodo_pago_nombre || '-'}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                Registrado
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
          </div>

          {/* Resumen */}
          <div>
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
                        .filter(t => t.tipo === 'gasto')
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
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white h-12">
                    Procesar con IA
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

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
                onChange={(e) => setFormData({...formData, tipo: e.target.value as 'ingreso' | 'gasto'})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="ingreso">Ingreso</option>
                <option value="gasto">Egreso</option>
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

      {/* Modal Apertura Caja */}
      <Modal
        isOpen={isFondoModalOpen}
        onClose={() => setIsFondoModalOpen(false)}
        title="Aperturar Caja"
      >
        <form onSubmit={handleCreateFondo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Monto Inicial <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={fondoMonto}
              onChange={(e) => setFondoMonto(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
            <p className="text-xs text-slate-500 mt-1">Si se deja vacío, se iniciará con S/ 0.00</p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFondoModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Aperturar Caja
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
