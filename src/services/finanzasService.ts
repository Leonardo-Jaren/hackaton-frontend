import { apiClient } from './api'

// --- Interfaces ---

export interface Categoria {
  id: number
  nombre: string
  tipo: 'ingreso' | 'egreso'
  descripcion?: string
}

export interface MetodoPago {
  id: number
  nombre: string
  descripcion?: string
}

export interface FondoCaja {
  id: number
  monto: number
  fecha_creacion: string
  observaciones?: string
}

export interface Transaccion {
  id: number
  tipo: 'ingreso' | 'egreso'
  monto: number
  descripcion: string
  fecha: string
  categoria?: number
  categoria_nombre?: string
  metodo_pago?: number
  metodo_pago_nombre?: string
  estado?: string
}

export interface CreateTransaccionDTO {
  empresa: number
  categoria: number
  metodo_pago: number
  tipo: 'ingreso' | 'egreso'
  monto: number
  descripcion: string
  numero_comprobante?: string
}

export interface CreateFondoCajaDTO {
  empresa: number
  monto: number
  observaciones?: string
}

export interface CierreCajaResumen {
  total_ingresos_sistema: number
  total_egresos_sistema: number
  saldo_sistema: number
  detalles_metodo_pago: any[]
}

// --- Service ---

export const finanzasService = {
  // --- Core ---
  getCategorias: async () => {
    const response = await apiClient.get<{ categorias: Categoria[] }>('/core/categorias/')
    return response.data.categorias
  },

  getMetodosPago: async () => {
    const response = await apiClient.get<{ metodos_pago: MetodoPago[] }>('/core/metodos-pago/')
    return response.data.metodos_pago
  },

  inicializarDatos: async () => {
    const response = await apiClient.post('/core/inicializar/')
    return response.data
  },

  // --- Transacciones ---
  crearFondoCaja: async (data: CreateFondoCajaDTO) => {
    const response = await apiClient.post('/transacciones/fondo-caja/', data)
    return response.data
  },

  registrarTransaccion: async (data: CreateTransaccionDTO) => {
    const response = await apiClient.post('/transacciones/registro/', data)
    return response.data
  },

  updateTransaccion: async (id: number, data: CreateTransaccionDTO) => {
    const response = await apiClient.put(`/transacciones/registro/${id}/`, data)
    return response.data
  },

  deleteTransaccion: async (id: number) => {
    await apiClient.delete(`/transacciones/registro/${id}/`)
  },

  getTransacciones: async (empresaId: number, fecha?: string) => {
    const params = new URLSearchParams()
    params.append('empresa_id', empresaId.toString())
    if (fecha) params.append('fecha', fecha)
    
    const response = await apiClient.get<{ transacciones: Transaccion[], resumen: any }>('/transacciones/registro/', { params })
    return response.data
  },

  subirArchivoIA: async (empresaId: number, archivo: File) => {
    const formData = new FormData()
    formData.append('empresa', empresaId.toString())
    formData.append('archivo', archivo)
    
    const response = await apiClient.post('/transacciones/carga-data/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // --- Cierre de Caja ---
  iniciarCierre: async (fondoCajaId: number) => {
    const response = await apiClient.post('/iniciar/', { fondo_caja_id: fondoCajaId })
    return response.data
  },

  obtenerResumenCierre: async (cierreId: number) => {
    const response = await apiClient.get<CierreCajaResumen>(`/resumen/${cierreId}/`)
    return response.data
  },

  registrarEfectivoFisico: async (cierreId: number, monto: number) => {
    const response = await apiClient.patch(`/efectivo/${cierreId}/`, { efectivo_fisico: monto })
    return response.data
  },

  finalizarCierre: async (cierreId: number) => {
    const response = await apiClient.post(`/finalizar/${cierreId}/`)
    return response.data
  },
  
  getDetalleCierre: async (cierreId: number) => {
    const response = await apiClient.get(`/detalle/${cierreId}/`)
    return response.data
  }
}
