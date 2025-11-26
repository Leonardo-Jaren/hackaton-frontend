import React from "react";

const CierreCaja: React.FC = () => {
  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", padding: 0 }}>
      <div style={{ marginLeft: 300, padding: "32px 40px" }}>
        <h1 style={{ fontWeight: 700, fontSize: 40, marginBottom: 0 }}>
          Cierre de Caja - 26 Nov 2024
        </h1>
        <p style={{ color: "#6c757d", marginTop: 8, marginBottom: 32 }}>
          Completa el cierre de caja y reconcilia el efectivo
        </p>

        {/* Card principal */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 8px #0001",
            padding: 32,
            marginBottom: 32,
            maxWidth: 1100,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
            <div
              style={{
                background: "#e9f3ff",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <span style={{ fontSize: 24, color: "#2563eb" }}>✔️</span>
            </div>
            <div>
              <strong style={{ fontSize: 20 }}>Análisis de la IA</strong>
              <div style={{ color: "#6c757d", fontSize: 15 }}>
                La IA ha procesado 12 transacciones
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
            <div
              style={{
                flex: 1,
                background: "#eaffef",
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
              }}
            >
              <div style={{ color: "#3b7f4c", fontWeight: 500 }}>Total Ingresos</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#18b05b" }}>
                S/ 650.00
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: "#ffeaea",
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
              }}
            >
              <div style={{ color: "#b03b3b", fontWeight: 500 }}>Total Egresos</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#ff2d2d" }}>
                S/ 125.50
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: "#eaf3ff",
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
              }}
            >
              <div style={{ color: "#2563eb", fontWeight: 500 }}>Saldo Final (IA)</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#0a3a7e" }}>
                S/ 524.50
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fffbe6",
              border: "1px solid #ffe58f",
              borderRadius: 8,
              padding: 20,
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ color: "#faad14", fontSize: 22 }}>⚠️</span>
            <div>
              <strong>Discrepancia detectada</strong>
              <div style={{ color: "#8d6d1d", fontSize: 15 }}>
                Se encontró una diferencia de S/ 5.00 en la categoría de ingresos por tarjeta
              </div>
            </div>
          </div>
          <a
            href="#"
            style={{
              color: "#2563eb",
              fontWeight: 500,
              fontSize: 15,
              textDecoration: "underline",
              marginLeft: 8,
            }}
          >
            Ver Transacciones con Discrepancias →
          </a>
        </div>

        {/* Conteo físico */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 8px #0001",
            padding: 32,
            maxWidth: 700,
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
            Conteo Físico de Efectivo
          </h2>
          <div style={{ color: "#6c757d", marginBottom: 20 }}>
            Ingresa el monto que contaste en la caja
          </div>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Efectivo Físico en Caja</div>
          <input
            type="number"
            placeholder="S/ 0.00"
            style={{
              width: 200,
              padding: "10px 16px",
              fontSize: 18,
              borderRadius: 8,
              border: "1px solid #d9d9d9",
              marginBottom: 16,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CierreCaja;