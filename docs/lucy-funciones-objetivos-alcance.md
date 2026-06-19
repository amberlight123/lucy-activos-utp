# Lucy - Funciones, objetivos, alcance y reglas

## Enfoque principal

Lucy es una aplicación web para la gestión operativa de activos institucionales de la Universidad Tecnológica de Panamá.

Su función principal es mantener una ficha clara de cada activo: equipo, bien, ubicación, responsable, estado, garantía, repuestos, historial técnico y reportes externos vinculados.

Lucy debe centrarse en activos, no en incidencias.

## Separación clave

- Lucy gestiona activos.
- CUSTOUTP gestiona incidencias.
- Aura analiza reportes, patrones y riesgos.
- Lucy entrega contexto técnico del activo para apoyar otros sistemas.

Lucy no debe actuar como sistema de tickets, IA, motor de predicción ni sistema de compras.

## Funciones

Lucy permite:

- registrar activos;
- editar activos;
- consultar activos;
- buscar activos por código, serie, nombre, categoría, estado, ubicación y responsable;
- ver detalle completo del activo;
- registrar ubicación física;
- registrar unidad responsable;
- registrar responsable asignado;
- registrar estado operativo;
- registrar garantía;
- registrar proveedor;
- registrar repuestos pendientes;
- registrar historial técnico;
- registrar mantenimiento preventivo y correctivo como eventos técnicos;
- registrar traslados, bajas, cambios de estado, cambios de ubicación y cambios de responsable;
- vincular reportes externos a activos;
- mostrar dashboard de activos;
- exportar datos en CSV o JSON;
- reiniciar datos demo.

## Fuera de alcance

Lucy no debe:

- crear tickets como flujo principal;
- clasificar incidencias;
- priorizar tickets;
- escalar incidencias;
- cerrar incidencias;
- manejar SLA;
- analizar patrones;
- predecir fallas;
- usar IA;
- usar NLP;
- usar visión por computadora;
- hacer OCR;
- ejecutar compras;
- manejar pagos;
- manejar contabilidad;
- reemplazar sistemas institucionales.

## Reportes externos vinculados

Lucy puede asociar un reporte externo a un activo.

El reporte externo solo sirve para mostrar que cierto activo está relacionado con un aviso, incidencia o caso externo. Lucy debe mostrar los reportes vinculados en el detalle del activo, pero no debe gestionar el ciclo de vida del reporte.

Campos usados en el MVP:

- id;
- activo vinculado;
- identificador de reporte externo;
- origen;
- descripción resumida;
- fecha del reporte;
- estado de referencia;
- fecha de creación.

## Historial técnico

Todo cambio importante del activo debe quedar como evento técnico.

Eventos mínimos:

- mantenimiento preventivo;
- mantenimiento correctivo;
- revisión técnica;
- cambio de estado;
- cambio de ubicación;
- cambio de responsable;
- traslado;
- baja;
- repuesto pendiente;
- posible adquisición;
- garantía revisada;
- reporte externo vinculado.

## Reglas de negocio

1. Todo activo debe tener código, nombre, tipo, categoría, estado, ubicación y unidad responsable.
2. El código del activo debe ser único.
3. La serie debe ser única cuando exista.
4. Todo cambio importante debe generar un evento técnico.
5. Un activo con reportes externos vinculados no debe eliminarse directamente.
6. Los activos fuera de uso deben marcarse como “Dado de baja”.
7. Los cambios críticos deben poder validarse por supervisor.
8. La garantía vencida debe mostrarse como aviso visual.
9. La garantía próxima a vencer debe mostrarse como aviso visual.
10. Los repuestos pendientes deben aparecer en el detalle y en el dashboard.
11. Los reportes externos vinculados no deben cambiar automáticamente el estado del activo.
12. Lucy debe conservar el historial del activo de forma clara.

## Pantallas

- Dashboard.
- Inventario de activos.
- Crear activo.
- Editar activo.
- Detalle de activo.
- Historial técnico.
- Reportes externos vinculados.
- Ubicaciones.
- Responsables y unidades.
- Reportes operativos.
- Configuración demo.

## Dashboard

El dashboard muestra:

- total de activos;
- activos operativos;
- activos dañados;
- activos en mantenimiento;
- activos dados de baja;
- activos con garantía vencida;
- activos con garantía próxima a vencer;
- activos con repuestos pendientes;
- activos por categoría;
- activos por ubicación;
- activos por unidad responsable;
- cambios recientes;
- reportes externos vinculados.

## Roles demo

- Administración.
- Gestión local.
- Técnico ejecutor.
- Supervisor.
- Gestión de insumos.
- Dirección.
- Consulta.

Solo se implementa login demo. No se implementa autenticación institucional real.

## Stack del MVP

- React.
- Vite.
- TypeScript.
- Tailwind CSS.
- Context API.
- localStorage.
- Datos mock en archivos TypeScript.
- Proveedor de datos separado para futura migración a API o base remota.

No se implementa Supabase real todavía.

## Objetivo de esta etapa

Dejar una demo funcional y coherente de Lucy como sistema de gestión operativa de activos institucionales.

El resultado permite mostrar que Lucy responde rápido:

- qué activo es;
- dónde está;
- quién lo tiene asignado;
- en qué estado se encuentra;
- qué garantía tiene;
- qué repuestos tiene pendientes;
- qué historial técnico posee;
- qué reportes externos están relacionados.
