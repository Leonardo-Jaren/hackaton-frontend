import { useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Dashboard } from "../components/Dashboard"
import { TransactionRegistry } from "../components/TransactionRegistry"
import { CashClosure } from "../components/CashClosure"
import { Reports } from "../components/Reports"
import Settings from "../components/Settings"
import { Help } from "../components/Help"

type PageType = "dashboard" | "transactions" | "closure" | "reports" | "settings" | "help"

export default function FinanzasPage() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <Sidebar currentPage={currentPage} setCurrentPage={(page) => setCurrentPage(page as PageType)} />


      <main className="flex-1 overflow-auto">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "transactions" && <TransactionRegistry />}
        {currentPage === "closure" && <CashClosure />}
        {currentPage === "reports" && <Reports />}
        {currentPage === "settings" && <Settings />}
        {currentPage === "help" && <Help />}
      </main>
    </div>
  )
}
