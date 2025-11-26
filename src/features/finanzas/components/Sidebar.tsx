import { Home, ListTodo, Lock, BarChart3, Settings, HelpCircle } from "lucide-react"

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Inicio", icon: Home },
    { id: "transactions", label: "Registro de Transacciones", icon: ListTodo },
    { id: "closure", label: "Cierre de Caja", icon: Lock },
    { id: "reports", label: "Reportes", icon: BarChart3 },
    { id: "settings", label: "Configuración", icon: Settings },
    { id: "help", label: "Ayuda", icon: HelpCircle },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Lock className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground text-sm">Caja</h1>
            <p className="text-xs text-muted-foreground">Inteligente</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-sidebar-foreground">Usuario</p>
          <p>empresa@example.com</p>
        </div>
      </div>
    </aside>
  )
}
