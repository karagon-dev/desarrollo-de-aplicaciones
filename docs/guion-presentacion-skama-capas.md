# Guion para exponer — SKAMA

Léelo casi en voz alta. Cada bloque es lo que puedes decir frente al slide.
Si te trabas, basta con la frase en negrita al inicio.

---

## Antes de empezar

Hoy no vamos a leer código. Vamos a seguir una historia:
alguien hace clic en “agregar al carrito”… y eso termina en SQL Server.
Para llegar ahí pasamos por tres capas: base de datos, API y frontend.

---

## Apertura

### Slide — Portada

Bueno, les presentamos SKAMA por capas.
La pregunta que queremos responder es simple:
cuando algo pasa en la pantalla… ¿dónde se decide de verdad?

### Slide — Agenda

Vamos en este orden.
Primero la base de datos: ahí viven las reglas duras.
Después la API: cómo esa regla se vuelve un endpoint.
Luego el frontend: cómo un botón dispara todo eso.
Y al final una demo corta, para que lo vean vivo.

### Slide — Monorepo

En el repo no hay “un solo proyecto mágico”. Hay tres.

Uno se llama skama-db: tablas y stored procedures.
Otro skama-api: Controllers, Services, Repositories.
Y skama-webapp: React, hooks, servicios HTTP.

Si alguien pregunta “¿dónde arreglo esto?”,
casi siempre la respuesta es: en una de estas tres carpetas.

---

# 1. Base de datos

### Slide — Separador BD

Empezamos por abajo, por los datos.
Porque si la base está mal pensada, la API y el frontend solo maquillan el problema.

### Slide — ¿Por qué SQL Server + SPs?

Nosotros no armamos SQL suelto en C#.
Usamos stored procedures.

¿Por qué?
Porque hay reglas que no deberían depender de quién llame a la API.
Por ejemplo: no vender sin stock.
O no agregar a un carrito que ya no está activo.
O hacer un checkout completo… o no hacer nada.

El SP también nos devuelve un ResultCode.
No es un mensaje bonito todavía.
Es un número que dice: éxito, sin stock, producto inactivo, etc.
Más arriba alguien lo traduce a español.

### Slide — Estándares de nombres

Antes de las relaciones, un detalle que parece aburrido… pero ayuda mucho.

En las columnas usamos prefijos:
TID para ids,
TC para texto,
TN para números,
TB para booleanos,
TD para fechas.

Y los procedimientos se llaman igual siempre:
usp, entidad, acción.
usp_CartItem_Add.
usp_Order_CreateFromCart.

La idea es que, sin abrir el archivo, ya sepas qué hace.

### Slide — Diagrama ER

Este es el corazón del negocio.

Tenemos categorías y productos.
Un usuario tiene un carrito.
El carrito tiene líneas: CartItem.
Cuando compra, eso se vuelve Order y OrderItem.

También hay promociones, pero con una tabla de en medio,
porque promoción y producto es muchos a muchos.

Y ojo: User y Order en SQL van entre corchetes,
porque son palabras reservadas.

### Slide — 3FN

Acá viene la parte de normalización.

Separar roles, perfil, categorías, productos, líneas…
eso es tercera forma normal: un hecho, un lugar.

Pero hay una excepción… y es a propósito.
En OrderItem guardamos el nombre y el precio del momento de la compra.
¿Por qué?
Porque el pedido es historia.
Si mañana el anillo cambia de precio, la factura de ayer no puede cambiar.

Eso no es “mala normalización”.
Es un snapshot intencional.

### Slide — Pseudocódigo usp_CartItem_Add

Miren este flujo como si fuera una checklist.

Primero: ¿la cantidad es válida?
Después: ¿el carrito está activo?
Después: ¿el producto existe y está activo?
Después: ¿alcanza el stock?

Si todo bien, o actualizamos la línea que ya existía,
o insertamos una nueva.
Y al final: ResultCode cero. Éxito.

Si algo falla, no inventamos excepciones raras.
Devolvemos un código.
Y listo.

### Slide — Pseudocódigo checkout

Ahora el caso más interesante: crear la orden desde el carrito.

Esto va en una transacción.
Validamos carrito.
Validamos stock.
Creamos la orden.
Por cada ítem: escribimos OrderItem con el snapshot,
bajamos stock,
y al final marcamos el carrito como CHECKED_OUT.

Si algo falla a mitad de camino… rollback.
No queremos media orden con stock ya descontado.
Todo o nada.

---

# 2. API

### Slide — Separador API

Subimos un nivel.
La base ya sabe las reglas.
La API es quien recibe HTTP y organiza la respuesta.

### Slide — Capas ASP.NET

Piensen en cuatro pisos.

Arriba el Controller: solo HTTP.
Ruta, status code, “te salió bien o mal”.

Abajo el Service: reglas de aplicación y mensajes.
Acá se traduce el ResultCode a algo que una persona entienda.

Más abajo el Repository: Dapper y el stored procedure.
No mete lógica de negocio. Solo habla con la BD.

Y al fondo: SQL.

Si el Controller empieza a preguntar por stock…
alguien puso la regla en el piso equivocado.

### Slide — ¿Qué hace cada capa?

Con un ejemplo concreto queda más claro.

El Controller se llama CartController.AddItem.
El Service toma el ResultCode y arma el mensaje.
El Repository ejecuta usp_CartItem_Add.
El Model es la forma interna: Product, Cart, Order.
El DTO es lo que sale o entra por la API:
AddCartItemRequest, CartDetailDto…

Cada uno tiene un trabajo.
Y ojalá solo uno.

### Slide — Models vs DTOs

Esto a veces confunde.

El Model mira hacia adentro: hacia la base.
El DTO mira hacia afuera: hacia el cliente.

No queremos exponer la tabla cruda.
A veces el DTO trae CategoryName porque a la UI le sirve.
A veces el request trae validaciones: required, range…

Y quién convierte uno en otro es el Service.

### Slide — Flujo POST del carrito

Sigamos un request de verdad.

Llega un POST a /api/cart/{cartId}/items.
El Controller revisa el body.
Llama al Service.
El Service llama al Repository.
El Repository llama al SP.

Vuelve un ResultCode.
Si es cero: 201 Created.
Si es veintidós: “no hay stock”.
Si es treinta y uno: “el carrito no está activo”.

Fíjense la división del trabajo:
el SP decide el código,
el Service habla humano,
el Controller elige el status HTTP.

### Slide — Secuencia

Esta slide es la misma historia, pero en flechas.

Controller habla con Service.
Service con Repository.
Repository con el SP.
Y la respuesta sube otra vez.

No hace falta abrir Visual Studio para entenderlo.
El camino ya está dibujado.

---

# 3. Frontend

### Slide — Separador Frontend

Ahora sí: lo que ve el usuario.
Pero ojo… el frontend no inventa las reglas.
Las pide.

### Slide — Capas React

También hay capas.

La página arma la pantalla: catálogo, carrito…
El Provider o el hook guarda el estado: useCart.
El service hace el HTTP: cartService, productService.
Y Vite, en local, hace de proxy: /api se reenvía a la API .NET.

La página no debería llamar Axios directo.
Si lo hace, mañana cada pantalla habla distinto con el backend.

### Slide — Reutilización

Acá hay una idea de diseño, no solo de código.

La misma ProductCard sirve en varios lados.
El CartProvider es una sola fuente de verdad del carrito.
Loading, Error, Empty… mismos estados, misma cara.
apiClient y apiPaths… una sola forma de hablar con la API.

Queremos armar páginas con piezas,
no copiar y pegar el mismo JSX en cada pantalla.

### Slide — Viaje completo UI → BD

Esta es la slide que une todo.

Uno: el usuario toca Agregar en ProductCard.
Dos: useCart pide el carrito y luego addItem.
Tres: Axios manda el POST, pasando por el proxy.
Cuatro: la API baja Controller, Service, Repository, SP.
Cinco: SQL valida, escribe, devuelve ResultCode.
Seis: el frontend refresca y se ve el carrito actualizado.

Si se les olvida todo lo demás,
quédense con este viaje.
Es SKAMA de punta a punta.

### Slide — Proxy Vite

Solo un detalle práctico para la demo.

En local el navegador habla con el puerto 5173.
Vite ve /api y lo manda a la API en 7157.
Por eso en Network ven rutas limpias
y no pelean con CORS en medio de la exposición.

---

## Demo

### Slide — Separador Demo

Ahora lo mostramos. Corto. Sin abrir veinte archivos.

### Demo 1 — Agregar al carrito

Abrimos el catálogo.
Abrimos Network antes de hacer clic… importante: antes.
Agregamos un producto.
Señalen el POST.
Miren si volvió 201… o un 400 con mensaje.

Si falla, mejor.
Porque ahí podemos decir:
esto no es “se rompió el frontend”.
Es un ResultCode que nació en el SP
y subió hasta la pantalla.

### Demo 2 — Checkout

Abrimos el carrito.
Ahí se ve el detalle que armó la API.
Hacemos checkout.
Y conectamos con la idea de la transacción:
orden, stock y carrito CHECKED_OUT…
juntos, o nada.

---

## Cierre

### Slide — Resumen

Si se llevan una sola frase, que sea esta:
cada capa tiene un trabajo.

La base decide las reglas duras.
La API las expone bien.
El frontend las consume y las muestra.

Y el carrito es el hilo que atraviesa las tres.

### Slide — Preguntas

¿Dudas?
Una buena pregunta para dejarles pensando:
si mañana llega una regla nueva…
¿va en el SP, en el Service, o en el componente?

---

## Si se te acaba el tiempo

Di solo esto, en este orden:

1. El SP valida stock y devuelve ResultCode.  
2. La API traduce eso a HTTP + mensaje.  
3. El frontend dispara el POST y refresca la UI.  
4. Demo: un clic, Network, respuesta.

Eso ya cuenta la arquitectura.
