# Loyalty POS Module B2B

Este proyecto es un sistema integral de fidelización de clientes diseñado especialmente para comercios. Se trata de una web app que brinda a los negocios la capacidad de implementar su propio programa de recompensas basado en puntos o sellos. 

El objetivo principal es incentivar la recurrencia de los clientes: cada compra o visita les permite acumular beneficios canjeables por recompensas, motivándolos a volver al local en lugar de buscar alternativas en la competencia. Además de la gestión de recompensas, la plataforma funciona como un potente CRM que permite hacer un seguimiento profundo de los clientes activos y analizar estadísticas clave de las campañas. Esta información resulta invaluable para tomar decisiones estratégicas, optimizar promociones y mejorar la retención general del público.

## 📂 Estructura del Proyecto

A continuación se detalla la estructura principal de carpetas y su función dentro del proyecto:

```text
src/
├── assets/        # Archivos estáticos como imágenes, íconos o recursos multimedia.
├── components/    # Componentes de React reutilizables en toda la aplicación (ej. Layout principal).
├── screens/       # Vistas o pantallas principales de la aplicación:
│   ├── CRM.tsx               # Gestión y seguimiento de clientes.
│   ├── Dashboard.tsx         # Panel principal de métricas y resumen.
│   ├── DashboardPuntos.tsx   # Configuración y estadísticas del sistema por puntos.
│   ├── DashboardSellos.tsx   # Configuración y estadísticas del sistema por sellos.
│   ├── ProgramConfig.tsx     # Configuración general del programa de lealtad.
│   └── TerminalPOS.tsx       # Interfaz de punto de venta para asignar/canjear beneficios.
└── store/         # Manejo del estado global de la aplicación.
    └── useLoyaltyStore.ts    # Lógica de estado usando Zustand para los datos del programa.
```

## 🔄 Flujo de Trabajo y Operación del Sistema

El módulo opera a través de un ciclo continuo entre la administración del programa, la atención en caja y el análisis de métricas:

```text
[ 1. Configuración de Reglas ] ──► [ 2. Operación en Caja (POS) ]
               ▲                                    │
               │                                    ▼
[ 4. Analítica & Retención ]   ◄── [ 3. Auditoría & CRM ]
```

### 1. Configuración del Programa (`/config`)
- **Selección de Modalidad:** El comercio elige entre el **Programa de Puntos** (acumulación proporcional al gasto) o la **Tarjeta de Sellos Digital** (1 sello por visita/consumo).
- **Reglas de Conversión:** Definición del ratio de compra (ej. 1 punto cada AR$ 100).
- **Catálogo de Recompensas:** Creación de premios intermedios y metas finales con sus respectivos costos en puntos o sellos.

### 2. Operación en la Terminal de Caja (`/`)
- **Identificación Ágil:** El cajero ingresa el DNI del cliente (atajo `/`) para cargar su perfil y saldo en pantalla.
- **Visualización de Progreso:** Muestra el avance hacia la próxima meta, sellos acumulados y fecha de última visita.
- **Acreditación:** Se introduce el monto del ticket y se procesa la transacción (<kbd>Enter</kbd>), acreditando puntos o sellos automáticamente.
- **Canje de Beneficios:** Si el cliente cumple con los requisitos, se habilitan las recompensas:
  - *En Puntos:* Se descuenta el valor del premio del balance del cliente.
  - *En Sellos:* Permite canjear metas intermedias sin perder sellos acumulados, o el premio final, el cual reinicia la tarjeta a cero para iniciar un nuevo ciclo de fidelización.

### 3. CRM y Auditoría de Movimientos (`/crm`)
- **Trazabilidad Total:** Registro cronológico de todas las compras, canjes y ajustes, cada uno identificado con su hash de seguridad.
- **Búsqueda Indexada:** Búsqueda rápida por nombre o DNI (<kbd>Ctrl + K</kbd>) y filtros por rango de fechas y cajas.
- **Ajustes Manuales de Saldo:** Herramienta administrativa para compensar demoras o bonificar clientes con motivo obligatorio y registro en auditoría.

### 4. Inteligencia de Negocio y Dashboards (`/dashboard`)
- **Métricas de Fidelización:** Cálculo de la tasa de retención (% de clientes recurrentes) y ticket promedio.
- **Salud Económica del Programa:** Supervisión del *Burn Rate* (ratio de puntos emitidos vs. canjeados) y embudo de conversión de sellos.
- **Pasivo Latente y Control de Churn:** Identificación de premios acumulados pendientes de entrega y alertas preventivas de clientes inactivos (>45 días) para accionar campañas de reactivación.

## 🛠️ Tecnologías Utilizadas

El proyecto está construido con un stack moderno enfocado en la rapidez y una excelente experiencia de usuario y desarrollador:

- **React**: Biblioteca principal para construir la interfaz de usuario de forma modular.
- **Vite**: Entorno de desarrollo y herramienta de compilación extremadamente rápida.
- **Zustand**: Gestor de estado global, ligero y sencillo para manejar los datos en tiempo real.
- **Tailwind CSS**: Framework de CSS basado en utilidades para maquetar de forma rápida, moderna y responsiva.
- **Lucide React**: Biblioteca de íconos vectoriales personalizables.
- **React Hot Toast**: Sistema para mostrar notificaciones o alertas en pantalla (toasts) de manera elegante.
- **React Router DOM**: Gestión de rutas y navegación dentro de la aplicación.
- **Supabase**: Plataforma Backend-as-a-Service para base de datos y autenticación (cliente integrado).

## 🚀 Instalación y Ejecución

Sigue estos pasos para ejecutar el proyecto de forma local en tu máquina:

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd modulo_loyalty_pos
   ```

2. **Instalar las dependencias:**
   Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Luego, ejecuta:
   ```bash
   npm install
   ```

3. **Ejecutar en entorno de desarrollo:**
   Para iniciar el servidor local y ver la aplicación en tu navegador:
   ```bash
   npm run dev
   ```

4. **Compilación para producción:**
   Si deseas generar la versión optimizada para desplegar a producción:
   ```bash
   npm run build
   ```

## 👨‍💻 Guía para Desarrolladores

Si te integras al desarrollo de este proyecto, ten en cuenta los siguientes lineamientos técnicos y de negocio:

### 1. Gestión de Estado Global (Zustand)
El store principal se encuentra en `src/store/useLoyaltyStore.ts`.
- **Uso obligatorio de selectores:** Para evitar re-renderizados innecesarios y caídas de rendimiento, **nunca** desestructures todo el store en un componente (`const { customers, ... } = useLoyaltyStore()`). Consume únicamente las propiedades y acciones que necesitas usando selectores finos:
  ```tsx
  const customers = useLoyaltyStore((state) => state.customers);
  const processPurchase = useLoyaltyStore((state) => state.processPurchase);
  ```
- **Inmutabilidad:** Las actualizaciones de estado sobre colecciones de clientes y transacciones deben realizarse de forma inmutable usando `.map()`, `filter()` o nuevos arrays clonados.

### 2. Reglas de Negocio Críticas
- **Modalidad Exclusiva:** El sistema es bimodal (`config.type`). En un momento dado opera con el programa de **Puntos** o con la **Tarjeta de Sellos**, nunca ambos en simultáneo.
- **Mecánica de Sellos (`redeemStamps`):**
  - *Premios Intermedios:* Canjear un premio que requiere menos sellos que el máximo no descuenta sellos de la tarjeta del cliente; únicamente se anota en `claimedRewards`.
  - *Premio Mayor:* Al alcanzar y canjear el premio final (costo máximo de sellos), se descuentan los sellos y se vacía `claimedRewards`, simulando el inicio de una tarjeta nueva.
- **División segura en Puntos:** Al calcular puntos generados a partir del ticket (`Math.floor(ticketAmount / config.pointsPerArs)`), verifica siempre que `pointsPerArs > 0` para prevenir divisiones por cero (`Infinity` o `NaN`).

### 3. Rendimiento en Tablas y Listas
- **Cruce de Datos $O(1)$:** En vistas con alto volumen de transacciones (como `CRM.tsx`), evita realizar `customers.find(...)` dentro de cada fila o ciclo de filtrado. Indexa previamente los clientes en un `Map<string, Customer>` con `useMemo` para resolver búsquedas en tiempo constante $O(1)$.

### 4. Atajos de Teclado del Punto de Venta (POS)
La terminal POS está preparada para operar rápidamente mediante teclado:
- `/` : Enfoca automáticamente el campo de ingreso de DNI.
- <kbd>Enter</kbd> : Procesa la compra con el monto ingresado o confirma el modal de canje.
- <kbd>Esc</kbd> : Cancela y cierra los modales abiertos.
- <kbd>Ctrl + K</kbd> : Enfoca el buscador universal en el CRM.

### 5. Estilos y Tokens de Diseño
- El proyecto utiliza **Tailwind CSS v4** mediante directivas `@theme` centralizadas en `src/index.css` (no existe archivo `tailwind.config.js`).
- Emplea los tokens semánticos definidos (`bg-surface`, `bg-surface-container`, `text-on-surface`, `bg-primary`, `bg-secondary`) para garantizar consistencia visual y compatibilidad futura con temas oscuros.

### 6. Persistencia y Backend
Actualmente el estado inicial se hidrata con datos simulados en memoria (`MOCK_CUSTOMERS`, `MOCK_TRANSACTIONS`). El cliente de Supabase (`@supabase/supabase-js`) ya está integrado para sincronizar estas colecciones con tablas remotas en una siguiente fase.
