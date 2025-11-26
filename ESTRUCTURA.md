# Estructura del Proyecto - PAISI-2025-frontend

## 📂 Organización de Carpetas

### `/src/components/`
Componentes **reutilizables** que se usan en todo el proyecto.

#### `/components/ui/`
Componentes de UI básicos sin lógica de negocio:
- `Button.tsx` - Botón con variantes
- `Modal.tsx` - Modal genérico
- `Badge.tsx` - Etiquetas/badges
- `AvatarCircle.tsx` - Avatar circular

#### `/components/layout/`
Layouts y estructuras de página:
- `AuthLayout.tsx` - Layout para páginas de autenticación

---

### `/src/features/`
Módulos organizados por **características** del negocio.
Cada feature contiene su propia lógica, componentes y hooks.

#### `/features/auth/`
Todo lo relacionado con autenticación:

```
features/auth/
├── components/
│   ├── LoginForm.tsx      # Componente visual del formulario
│   └── RegisterForm.tsx   # Componente visual del registro
├── hooks/
│   └── useAuth.ts         # Hook con lógica de autenticación
└── index.ts               # Barrel export
```

**Separación de responsabilidades:**
- **`components/`** → Solo UI y validación de formularios
- **`hooks/`** → Lógica de negocio y conexión con backend
- Los componentes NO llaman directamente a servicios
- Los hooks conectan el store con los servicios

#### `/features/personajes/`
Selección y gestión de personajes:
- `PersonajeCard.tsx` - Tarjeta de personaje
- `PersonajeSelectionModal.tsx` - Modal de selección

#### `/features/preguntas/`
Sistema de trivia:
- `TriviaCard.tsx` - Tarjeta de pregunta
- `types.ts` - Tipos TypeScript

#### `/features/ranking/`
Sistema de ranking:
- `LeaderBoardTable.tsx` - Tabla de clasificación
- `Podium.tsx` - Podio top 3

#### `/features/tablero/`
Tablero de juego:
- `DadoRoller.tsx` - Componente del dado
- `GameBoard.tsx` - Tablero principal
- `PlayerToken.tsx` - Ficha del jugador
- `Logic/boardRules.ts` - Reglas del tablero

---

### `/src/pages/`
Páginas principales que **orquestan** componentes de features.

Las páginas:
- ✅ Importan componentes de `features/`
- ✅ Importan hooks de `features/`
- ✅ Manejan la navegación
- ❌ NO contienen lógica de negocio
- ❌ NO llaman directamente a servicios

Ejemplo: `InicioSesion.tsx`
```tsx
import { LoginForm, RegisterForm, useAuth } from '../features/auth'

export default function InicioSesion() {
  const { login, register } = useAuth()
  // Solo orquesta los componentes
}
```

---

### `/src/services/`
Servicios para comunicación con el backend (Axios).

```
services/
├── api.ts                  # Cliente Axios configurado
├── authService.ts          # Endpoints de autenticación
├── preguntasService.ts     # Endpoints de preguntas
├── personajesService.ts    # Endpoints de personajes
├── rankingService.ts       # Endpoints de ranking
└── index.ts                # Barrel export
```

**Los servicios:**
- Se usan SOLO desde hooks
- No se llaman directamente desde componentes
- Manejan la comunicación HTTP
- Retornan datos tipados

---

### `/src/store/`
Estado global con Zustand.

```
store/
├── useAuthStore.ts    # Estado de autenticación
├── useJuegoStore.ts   # Estado del juego
└── useUIStore.ts      # Estado de UI (modales, notificaciones)
```

**Los stores:**
- Contienen el estado global
- Se acceden desde hooks
- Pueden ser usados directamente en páginas simples
- Usan Zustand con TypeScript

---

### `/src/utils/`
Funciones utilitarias y helpers.

---

## 🔄 Flujo de Datos

### Flujo correcto:
```
Página → Hook → Service → API Backend
         ↓
    Store (Zustand)
         ↓
    Componente
```

### Ejemplo: Login
```tsx
// 1. Página orquesta
InicioSesion.tsx
  ↓
// 2. Hook maneja lógica
useAuth.ts
  ↓ usa
// 3. Service llama API
authService.login()
  ↓ actualiza
// 4. Store guarda estado
useAuthStore
  ↓ consume
// 5. Componente muestra UI
LoginForm.tsx
```

---

## 📋 Principios de Organización

### 1. **Colocación (Colocation)**
Mantén juntos archivos relacionados:
```
features/auth/
  components/  # Componentes de auth
  hooks/       # Hooks de auth
  types.ts     # Tipos de auth (si es necesario)
```

### 2. **Separación de Responsabilidades**
- **Componentes**: Solo UI y eventos
- **Hooks**: Lógica y orquestación
- **Services**: Comunicación HTTP
- **Store**: Estado global
- **Pages**: Composición y navegación

### 3. **Imports Limpios**
Usa barrel exports (`index.ts`):
```tsx
// ✅ Bien
import { LoginForm, useAuth } from '../features/auth'

// ❌ Mal
import { LoginForm } from '../features/auth/components/LoginForm'
import { useAuth } from '../features/auth/hooks/useAuth'
```

### 4. **Evita Imports Circulares**
- Pages → Features ✅
- Features → Services ✅
- Features → Store ✅
- Services → Features ❌
- Store → Pages ❌

---

## 🚀 Cómo Agregar Nueva Funcionalidad

### Ejemplo: Agregar sistema de Chat

1. **Crear feature**
```
features/chat/
├── components/
│   ├── ChatBox.tsx
│   └── MessageList.tsx
├── hooks/
│   └── useChat.ts
└── index.ts
```

2. **Crear service (si necesita backend)**
```tsx
// services/chatService.ts
export const chatService = {
  sendMessage: async (message: string) => { ... },
  getMessages: async () => { ... }
}
```

3. **Crear store (si necesita estado global)**
```tsx
// store/useChatStore.ts
export const useChatStore = create<ChatState>((set) => ({ ... }))
```

4. **Usar en página**
```tsx
// pages/Chat.tsx
import { ChatBox, useChat } from '../features/chat'

export default function Chat() {
  const { messages, sendMessage } = useChat()
  return <ChatBox messages={messages} onSend={sendMessage} />
}
```

---

## 📝 Checklist para Desarrollar

Antes de empezar a programar una feature:

- [ ] ¿Necesita componentes visuales? → `features/[nombre]/components/`
- [ ] ¿Necesita lógica compleja? → `features/[nombre]/hooks/`
- [ ] ¿Necesita llamar al backend? → `services/[nombre]Service.ts`
- [ ] ¿Necesita estado global? → `store/use[Nombre]Store.ts`
- [ ] ¿Es una página nueva? → `pages/[Nombre].tsx`
- [ ] ¿Es un componente reutilizable? → `components/ui/[Nombre].tsx`

---

## ✅ Estado Actual del Proyecto

### Completado:
- ✅ Estructura de carpetas
- ✅ Sistema de rutas (React Router)
- ✅ Stores de Zustand (Auth, Juego, UI)
- ✅ Componentes UI base (Button, Modal, Badge, AvatarCircle)
- ✅ Feature de Auth (LoginForm, RegisterForm, useAuth)
- ✅ Servicios de API configurados
- ✅ Páginas principales creadas

### Por implementar:
- ⏳ Conectar con backend real
- ⏳ Implementar lógica completa del juego
- ⏳ Agregar assets (imágenes, sonidos)
- ⏳ Features de personajes, preguntas, ranking
- ⏳ Animaciones y efectos visuales
