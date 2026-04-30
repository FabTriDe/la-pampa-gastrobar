# 📋 Servicios de La Pampa App

## Resumen

Los servicios forman la **Capa de Negocio** de la aplicación. Contienen toda la lógica para interactuar con Firebase.

---

## 🔐 AuthService

**Gestión de autenticación y usuarios**

### Métodos principales:

```javascript
// Registrar nuevo usuario
AuthService.registrarUsuario(email, password, nombre, rol);
// rol: 'admin' | 'mesero' | 'cliente'

// Iniciar sesión
AuthService.iniciarSesion(email, password);

// Cerrar sesión
AuthService.cerrarSesion();

// Obtener usuario actual
AuthService.obtenerUsuarioActual();

// Obtener usuarios por rol
AuthService.obtenerUsuariosPorRol("mesero");
```

### Ejemplo de uso:

```javascript
import { AuthService } from "../services";

const resultado = await AuthService.iniciarSesion(
  "admin@lapampa.com",
  "123456",
);
if (resultado.exito) {
  console.log("Bienvenido:", resultado.nombre);
}
```

---

## 🍽️ PedidoService

**Gestión de pedidos en mesa**

### Métodos principales:

```javascript
// Crear pedido
PedidoService.crearPedido({
  mesaId: "mesa-1",
  usuarioId: "uid-mesero",
  productos: [{ productoId, nombre, precio, cantidad }],
  notas: "Sin picante",
});

// Obtener pedidos por mesa
PedidoService.obtenerPedidosPorMesa("mesa-1");

// Obtener pedidos activos
PedidoService.obtenerPedidosActivos();

// Actualizar estado
PedidoService.actualizarEstadoPedido(pedidoId, "listo");
```

---

## 🚗 DomicilioService

**Gestión de domicilios**

### Métodos principales:

```javascript
// Crear domicilio
DomicilioService.crearDomicilio({
  clienteId: 'uid-cliente',
  direccion: 'Cra 5 #18-40',
  telefono: '300 123 4567',
  productos: [{...}],
  total: 72000
})

// Obtener domicilios pendientes
DomicilioService.obtenerDomiciliosPendientes()

// Actualizar estado
DomicilioService.actualizarEstadoDomicilio(domicilioId, 'en_ruta')
```

---

## 💰 PropinaService

**Gestión de propinas**

### Métodos principales:

```javascript
// Crear propina
PropinaService.crearPropina({
  meseroId: "uid-mesero",
  montoTotal: 50000,
  distribucion: [{ meseroId, monto }],
  adminId: "uid-admin",
});

// Obtener propinas de mesero
PropinaService.obtenerPropinasMesero("uid-mesero");

// Calcular propina automática (10%)
const propina = PropinaService.calcularPropinaAutomatica(100000);
```

---

## 📊 ReporteService

**Generación de reportes**

### Métodos principales:

```javascript
// Reporte diario
ReporteService.obtenerReporteDiario(new Date());

// Reporte semanal
ReporteService.obtenerReporteSemanal(new Date());

// Reporte mensual
ReporteService.obtenerReporteMensual(4, 2026); // Abril 2026
```

---

## 📖 MenuService

**Gestión del menú digital**

### Métodos principales:

```javascript
// Obtener todos los productos
MenuService.obtenerProductos();

// Obtener por categoría
MenuService.obtenerProductosPorCategoria("cocina");

// Menú organizado por categoría
MenuService.obtenerMenuOrganizado();

// Buscar productos
MenuService.buscarProductos("ajiaco");

// Crear producto
MenuService.crearProducto({
  nombre: "Patacón",
  descripcion: "Plátano frito",
  precio: 14000,
  categoria: "cocina",
  disponible: true,
});
```

---

## 📦 Estructura de Firestore Collections

### usuarios

```
{
  id: 'uid-firebase',
  email: 'admin@lapampa.com',
  nombre: 'Fabian Triviño',
  rol: 'admin' | 'mesero' | 'cliente',
  fechaCreacion: timestamp,
  activo: true
}
```

### pedidos

```
{
  mesaId: 'mesa-1',
  usuarioId: 'uid-mesero',
  productos: [{productoId, nombre, precio, cantidad}],
  estado: 'pendiente' | 'preparando' | 'listo' | 'entregado',
  total: 117000,
  notas: 'Sin picante',
  fechaCreacion: timestamp
}
```

### domicilios

```
{
  clienteId: 'uid-cliente',
  direccion: 'Cra 5 #18-40',
  telefono: '300 123 4567',
  productos: [{...}],
  estado: 'pendiente' | 'confirmado' | 'en_ruta' | 'entregado',
  total: 72000,
  fechaCreacion: timestamp
}
```

### productos

```
{
  nombre: 'Patacón',
  descripcion: 'Plátano frito con guacamole',
  precio: 14000,
  categoria: 'cocina' | 'bar' | 'bebidas' | 'postres',
  disponible: true,
  fechaCreacion: timestamp
}
```

### propinas

```
{
  meseroId: 'uid-mesero',
  montoTotal: 50000,
  distribucion: [{meseroId, monto}],
  adminId: 'uid-admin',
  fecha: timestamp
}
```

### mesas

```
{
  numero: 4,
  estado: 'libre' | 'ocupada' | 'pendiente',
  capacidad: 4
}
```

### reportes

```
{
  fecha: '2026-04-30',
  ventasTotal: 487500,
  gastosTotal: 132000,
  gananciaNeta: 355500,
  totalPedidos: 12
}
```

---

## ✅ Próximos Pasos

1. **Configurar Firebase**: Reemplaza valores en `.env.local`
2. **Crear componentes de UI**: Screens, Forms, Cards
3. **Configurar navegación**: React Navigation
4. **Integrar servicios en pantallas**: Usar los servicios en los componentes

---

## 🚀 Tips de Uso

- Todos los servicios retornan `{ exito: boolean, ... }`
- Usa `async/await` para llamar servicios
- Siempre maneja errores con try/catch
- Los servicios son **Singleton** (instancia única)
