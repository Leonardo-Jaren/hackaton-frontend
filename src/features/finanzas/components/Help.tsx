import { HelpCircle, Book, MessageCircle, FileText, ShieldCheck, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/Button"

export function Help() {
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

  const guides = [
    {
      title: "Dashboard General",
      icon: TrendingUp,
      description: "Tu centro de control. Visualiza el saldo actual, transacciones pendientes y el estado de tu caja en tiempo real.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Registro de Transacciones",
      icon: FileText,
      description: "Registra ingresos y egresos. Puedes usar la cámara para escanear boletas o subir archivos Excel para carga masiva.",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Cierre de Caja",
      icon: ShieldCheck,
      description: "Realiza el cuadre diario. Compara el cálculo de la IA con tu conteo físico para detectar discrepancias.",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Reportes e Historial",
      icon: Book,
      description: "Accede al histórico de cierres, exporta reportes en PDF/Excel y analiza la evolución de tus finanzas.",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ]

  const faqs = [
    {
      q: "¿Cómo funciona la IA en el cierre de caja?",
      a: "La IA analiza todas las transacciones registradas durante el día y calcula automáticamente cuánto dinero debería haber en caja, categorizándolo por método de pago."
    },
    {
      q: "¿Qué hago si tengo una diferencia en el cierre?",
      a: "El sistema te alertará. Puedes revisar el detalle de transacciones para encontrar el error o registrar la diferencia como un ajuste de caja con una justificación."
    },
    {
      q: "¿Puedo editar una transacción después de cerrarla?",
      a: "Por seguridad, las transacciones de días cerrados no se pueden editar. Si necesitas corregir algo, debes crear una nota de ajuste en el día actual."
    }
  ]

  return (
    <motion.div 
      className="p-8 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-blue-600" />
          Centro de Ayuda
        </h1>
        <p className="text-slate-500">Guías y recursos para aprovechar al máximo tu Caja Inteligente</p>
      </motion.div>

      {/* Guías Rápidas */}
      <motion.div variants={itemVariants} className="mb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Módulos del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4"
            >
              <div className={`w-12 h-12 rounded-lg ${guide.bgColor} flex items-center justify-center flex-shrink-0`}>
                <guide.icon className={`w-6 h-6 ${guide.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{guide.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{guide.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                Preguntas Frecuentes
              </CardTitle>
              <CardDescription>Respuestas a las dudas más comunes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-100"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                >
                  <h4 className="font-medium text-slate-900 mb-2">{faq.q}</h4>
                  <p className="text-sm text-slate-600">{faq.a}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <div>
          <Card className="bg-blue-600 text-white border-none">
            <CardHeader>
              <CardTitle className="text-white">¿Necesitas más ayuda?</CardTitle>
              <CardDescription className="text-blue-100">
                Nuestro equipo de soporte está disponible 24/7 para asistirte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-700/50 rounded-lg backdrop-blur-sm">
                <p className="text-sm font-medium mb-1">Soporte Técnico</p>
                <p className="text-xs text-blue-100">soporte@cajainteligente.com</p>
              </div>
              <div className="p-4 bg-blue-700/50 rounded-lg backdrop-blur-sm">
                <p className="text-sm font-medium mb-1">Línea Directa</p>
                <p className="text-xs text-blue-100">+51 999 999 999</p>
              </div>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold mt-2">
                Contactar Soporte
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  )
}
