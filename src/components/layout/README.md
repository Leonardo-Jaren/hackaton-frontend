# Layouts

Sistema de layouts para el proyecto PAISI 2025 Frontend.

## Componentes

### AuthLayout

Layout de dos columnas (50/50) para páginas de autenticación.

**Características:**
- Columna izquierda: contenido del formulario (children)
- Columna derecha: ilustración animada con gradientes personalizables
- Animaciones con Framer Motion
- Responsive: en móvil se apila en una sola columna
- Scroll interno si el contenido es alto

**Uso:**

```tsx
import { AuthLayout } from '@/components/layout'

<AuthLayout
  illustration={{
    icon: <YourIcon />,
    title: 'Título',
    description: 'Descripción',
    gradientFrom: 'from-blue-500',
    gradientVia: 'via-purple-600',
    gradientTo: 'to-pink-600'
  }}
>
  {/* Tu formulario o contenido */}
</AuthLayout>
```

### MainLayout

Layout principal para páginas autenticadas.

**Características:**
- Navbar fijo en la parte superior
- Contenido principal debajo
- Fondo oscuro consistente

**Uso:**

```tsx
import { MainLayout } from '@/components/layout'

<MainLayout>
  {/* Contenido de tu página */}
</MainLayout>
```

### Navbar

Barra de navegación responsive para páginas autenticadas.

**Características:**
- Logo y título del proyecto
- Links de navegación (Juego, Ranking)
- Información del usuario actual
- Botón de logout
- Menú hamburguesa para móvil
- Sticky en la parte superior

**Uso:**

```tsx
import { Navbar } from '@/components/layout'

<Navbar />
```

El Navbar se integra automáticamente en el `MainLayout`, no necesitas usarlo por separado.

## Estructura de archivos

```
src/components/layout/
├── AuthLayout.tsx      # Layout para login/register
├── MainLayout.tsx      # Layout para páginas autenticadas
├── Navbar.tsx          # Barra de navegación
├── index.ts            # Barrel export
└── README.md           # Esta documentación
```

## Ejemplo de uso completo

### Página de autenticación

```tsx
// src/pages/InicioSesion.tsx
import { AuthLayout } from '@/components/layout'
import { LoginForm } from '@/features/auth/components/LoginForm'

export default function InicioSesion() {
  return (
    <AuthLayout>
      <LoginForm {...props} />
    </AuthLayout>
  )
}
```

### Página autenticada

```tsx
// src/pages/JuegoPrincipal.tsx
import { MainLayout } from '@/components/layout'

export default function JuegoPrincipal() {
  return (
    <MainLayout>
      <div className="container mx-auto p-8">
        {/* Contenido del juego */}
      </div>
    </MainLayout>
  )
}
```
