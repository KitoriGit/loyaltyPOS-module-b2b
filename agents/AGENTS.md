# 🏛️ MANUAL DE ARQUITECTURA: ECOSISTEMA SAAS MULTI-TENANT

Eres un agente desarrollando un módulo que forma parte de un ecosistema B2B (Business to Business) más grande. Este proyecto NO es una aplicación aislada, es un "Micro-frontend" que comparte bases de datos y diseño con otros módulos. 

Antes de proponer soluciones o escribir código, debes seguir estrictamente estas reglas:

## 1. Stack Tecnológico (Estricto)
- **Frontend:** React + TypeScript (Vite).
- **Estilos:** Tailwind CSS puro. NO utilices CSS Modules, Styled Components ni frameworks pesados de UI (como Material UI o Ant Design).
- **Estado Global:** Zustand. (Prohibido Redux o Context API para estado global complejo).
- **Iconos:** Exclusivamente `lucide-react`.
- **Backend/Auth:** Supabase.

## 2. Arquitectura de Base de Datos (Multi-Tenant)
- Compartimos **UN SOLO proyecto de Supabase** con el resto de los módulos.
- **Aislamiento:** Todas las tablas de datos (excepto catálogos globales) DEBEN tener una columna `workspace_id` (UUID).
- **Seguridad (RLS):** Toda tabla debe tener Row Level Security. Para las políticas, utiliza las funciones de la base de datos ya existentes: `is_workspace_owner(workspace_id)` y `is_workspace_employee(workspace_id)`. **Nunca** uses `USING (true)` para operaciones `UPDATE` o `DELETE`.
- **Fuente de la Verdad:** Antes de crear consultas SQL o interactuar con la DB, debes revisar el archivo con la ruta `"C:\Users\alegr\programación\ecosistema_database\schemas"` para entender las referencias, tablas Core (`workspaces` y `employees`) y las tablas que pertenecen a un modulo en particular, si no son de tu modulo no las uses.

## 3. Autenticación y Usuarios
- No reinventes el flujo de Auth. Existe una tabla `workspaces` (dueños) y una tabla `employees` (empleados).
- La pantalla de Registro (`/register`) debe ser unificada (Email y Contraseña) usando `supabase.auth.signUp`. Hay un Trigger en la DB que maneja la creación del Workspace.
- La pantalla de Login (`/login`) es unificada. 
- Para el ruteo, utiliza siempre la función central `getSessionContext()` que verifica en qué tabla existe el usuario logueado, y redirige a `/admin` o `/employee` correspondientemente.

## 4. Design System ("Friendly Assistant POS")
- **Identidad Visual:** Orientado a la "Velocidad Calma" y "Ergonomía Empática". Es una interfaz limpia, eficiente y amigable para un entorno de alto volumen de ventas, con fuerte apoyo a un flujo de trabajo rápido orientado a atajos de teclado ("keyboard-first").
- **Esquinas Redondeadas:** Formas táctiles y amigables. Los contenedores y tarjetas base usan `rounded-2xl`. Los controles interactivos (botones, inputs) usan `rounded-xl`. Micro-elementos y badges usan `rounded-full` o `rounded-md`. Nunca usar puntas rectas.
- **Tipografía:** `Plus Jakarta Sans` para toda la lectura general, titulares y perfiles. `JetBrains Mono` es estrictamente requerida para cifras, montos, contadores numéricos, IDs y atajos de teclado (`<kbd>`).
- **Paleta de Colores Base:** 
  - Superficie/Fondo (Canvas): `#f8f9ff` (Pizarra claro)
  - Contenedores (Cartas): `#ffffff` (Blanco puro)
  - Primario/Acción (Foco visual): `#3525cd` / `#4f46e5` (Indigo/Azul-Violeta)
  - Éxito/Premios (Ingresos, Canjes): `#006c49` (Esmeralda)
  - Textos Principales: `#0b1c30` (Azul/Pizarra oscuro)
  - Textos Secundarios: `#464555` (Gris medio)
- **Profundidad:** Elementos separados por fondos tonales o sombras sutiles (`shadow-sm`, `shadow-md`). Evitar bordes o divisores fuertes y contrastantes que generen fatiga visual.

## 5. Regla de Oro sobre Dependencias
Este es un proyecto ágil y de alta performance. **No instales librerías de terceros pesadas** para cosas que podemos construir con React y Tailwind Grid/Flexbox (ej. No instalar `react-big-calendar` para grillas, ni librerías de Drag & Drop a menos que sea estrictamente indispensable y autorizado).

## 6. Actualización de base de datos
PROHIBIDO modificar la base de datos desde este proyecto. Si se requiere agregar tablas o modificar columnas, NO intentes generar scripts SQL aquí. 
Tu tarea es facilitar la transición:
1. Indícale al usuario que abra el proyecto `"C:\Users\alegr\programación\ecosistema_database"` en su IDE.
2. Redacta un "Prompt de Traspaso" claro y detallado en un bloque de código para que el usuario simplemente lo copie y se lo pegue al agente de ese nuevo workspace. Este prompt debe incluir qué tablas modificar, el tipo de datos exacto de las nuevas columnas y el contexto de negocio que origina el cambio.

---
**Tu objetivo:** Escribir código limpio, modular y que encaje perfectamente con el resto del ecosistema como una pieza de Lego, respetando la seguridad Multi-tenant.
