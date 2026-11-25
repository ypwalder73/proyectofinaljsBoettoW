const productos = [
  { id: 1, nombre: "Miel de campo", categoria: "dulces", detalle: "500 g · de Esperanza, Santa Fe", precio: 6500, stock: 10, emoji: "🍯", fondo: "fondo-amarillo" },
  { id: 2, nombre: "Dulce de leche artesanal", categoria: "dulces", detalle: "450 g · receta tradicional", precio: 5200, stock: 8, emoji: "🍮", fondo: "fondo-crema" },
  { id: 3, nombre: "Yerba mate orgánica", categoria: "infusiones", detalle: "1 kg · con palo, estacionada", precio: 7800, stock: 12, emoji: "🧉", fondo: "fondo-verde" },
  { id: 4, nombre: "Té en hebras frutal", categoria: "infusiones", detalle: "100 g · frutos rojos e hibisco", precio: 4300, stock: 6, emoji: "🫖", fondo: "fondo-rosa" },
  { id: 5, nombre: "Café de especialidad", categoria: "infusiones", detalle: "250 g · tostado medio, en grano", precio: 9900, stock: 7, emoji: "☕", fondo: "fondo-marron" },
  { id: 6, nombre: "Mix energético", categoria: "frutos-secos", detalle: "300 g · maní, pasas y nueces", precio: 6900, stock: 5, emoji: "🥜", fondo: "fondo-arena" },
  { id: 7, nombre: "Almendras tostadas", categoria: "frutos-secos", detalle: "200 g · sin sal", precio: 8400, stock: 0, emoji: "🌰", fondo: "fondo-arena" },
  { id: 8, nombre: "Granola casera", categoria: "almacen", detalle: "400 g · avena, miel y semillas", precio: 5600, stock: 9, emoji: "🥣", fondo: "fondo-crema" },
  { id: 9, nombre: "Aceite de oliva extra virgen", categoria: "almacen", detalle: "500 ml · de San Juan", precio: 12500, stock: 4, emoji: "🫒", fondo: "fondo-verde" },
  { id: 10, nombre: "Mermelada de frutilla", categoria: "dulces", detalle: "390 g · de Coronda, Santa Fe", precio: 4800, stock: 11, emoji: "🍓", fondo: "fondo-rosa" },
  { id: 11, nombre: "Pasas de uva", categoria: "frutos-secos", detalle: "250 g · morochas, sin semilla", precio: 3900, stock: 3, emoji: "🍇", fondo: "fondo-arena" },
  { id: 12, nombre: "Arroz yamaní", categoria: "almacen", detalle: "1 kg · integral, de Entre Ríos", precio: 3200, stock: 15, emoji: "🍚", fondo: "fondo-crema" }
];

const etiquetasCategoria = {
  dulces: "Dulces",
  infusiones: "Infusiones",
  "frutos-secos": "Frutos secos",
  almacen: "Almacén"
};

const formatearPrecio = (precio) => `$ ${precio.toLocaleString("es-AR")}`;
let categoriaActual = "todos";
let textoBusqueda = "";
let cotizacionDolar = 0;
let carrito = cargarCarrito();

const elementos = {
  productos: document.getElementById("productos"),
  sinResultados: document.getElementById("sin-resultados"),
  buscador: document.getElementById("buscador"),
  filtros: document.getElementById("filtros"),
  listaCarrito: document.getElementById("lista-carrito"),
  carritoVacio: document.getElementById("carrito-vacio"),
  contadorCarrito: document.getElementById("contador-carrito"),
  totalCarrito: document.getElementById("total-carrito"),
  totalCheckout: document.getElementById("total-checkout"),
  carritoPanel: document.getElementById("carrito"),
  velo: document.getElementById("velo"),
  formulario: document.getElementById("form-compra"),
  compraExitosa: document.getElementById("compra-exitosa"),
  cotizacion: document.getElementById("cotizacion-dolar"),
  estadoCotizacion: document.getElementById("cotizacion-estado")
};

function mostrarProductos(lista) {
  elementos.productos.innerHTML = "";

  lista.forEach((producto) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("producto");
    if (producto.stock === 0) tarjeta.classList.add("agotado");

    const precioUsd = cotizacionDolar
      ? `≈ US$ ${(producto.precio / cotizacionDolar).toFixed(2).replace(".", ",")}`
      : "≈ US$ —";

    tarjeta.innerHTML = `
      <div class="producto-imagen ${producto.fondo}">${producto.emoji}</div>
      <div class="producto-info">
        <span class="producto-categoria">${etiquetasCategoria[producto.categoria]}</span>
        <h3 class="producto-nombre">${producto.nombre}</h3>
        <p class="producto-detalle">${producto.detalle}</p>
        <p class="producto-precio">${formatearPrecio(producto.precio)}<span class="precio-usd">${precioUsd}</span></p>
        <button class="btn-agregar" type="button" data-accion="agregar" data-id="${producto.id}" ${producto.stock === 0 ? "disabled" : ""}>
          ${producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>`;

    elementos.productos.appendChild(tarjeta);
  });

  elementos.sinResultados.classList.toggle("oculto", lista.length > 0);
}

function aplicarFiltros() {
  const lista = productos.filter((producto) => {
    const coincideCategoria = categoriaActual === "todos" || producto.categoria === categoriaActual;
    const coincideNombre = producto.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
    return coincideCategoria && coincideNombre;
  });

  mostrarProductos(lista);
}

function guardarCarrito() {
  localStorage.setItem("carrito-las-acacias", JSON.stringify(carrito));
}

function cargarCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem("carrito-las-acacias")) || [];
    if (!Array.isArray(guardado)) return [];
    return guardado.filter((item) => {
      return productos.some((producto) => producto.id === item.id && Number.isInteger(item.cantidad) && item.cantidad > 0);
    });
  } catch (error) {
    return [];
  }
}

function dibujarCarrito() {
  elementos.listaCarrito.innerHTML = "";

  carrito.forEach((item) => {
    const producto = productos.find((actual) => actual.id === item.id);
    if (!producto) return;

    const fila = document.createElement("li");
    fila.classList.add("carrito-item");
    fila.dataset.id = producto.id;
    fila.innerHTML = `
      <span class="carrito-item-emoji">${producto.emoji}</span>
      <div class="carrito-item-info">
        <p class="carrito-item-nombre">${producto.nombre}</p>
        <p class="carrito-item-precio">${formatearPrecio(producto.precio)} c/u</p>
      </div>
      <div class="cantidad">
        <button type="button" data-accion="restar" aria-label="Restar uno">−</button>
        <span>${item.cantidad}</span>
        <button type="button" data-accion="sumar" aria-label="Sumar uno">+</button>
      </div>
      <button class="btn-quitar" type="button" data-accion="quitar" aria-label="Quitar producto">🗑</button>`;
    elementos.listaCarrito.appendChild(fila);
  });

  const unidades = carrito.reduce((total, item) => total + item.cantidad, 0);
  const total = carrito.reduce((suma, item) => {
    const producto = productos.find((actual) => actual.id === item.id);
    return suma + (producto ? producto.precio * item.cantidad : 0);
  }, 0);

  elementos.contadorCarrito.textContent = unidades;
  elementos.totalCarrito.textContent = formatearPrecio(total);
  elementos.totalCheckout.textContent = formatearPrecio(total);
  elementos.carritoVacio.classList.toggle("oculto", carrito.length > 0);
  elementos.contadorCarrito.classList.remove("salto");
  void elementos.contadorCarrito.offsetWidth;
  elementos.contadorCarrito.classList.add("salto");
  guardarCarrito();
}

function agregarAlCarrito(id) {
  const producto = productos.find((actual) => actual.id === id);
  if (!producto || producto.stock === 0) return;

  const item = carrito.find((actual) => actual.id === id);
  if (item) {
    if (item.cantidad < producto.stock) item.cantidad += 1;
  } else {
    carrito.push({ id, cantidad: 1 });
  }
  dibujarCarrito();
}

function cambiarCantidad(id, accion) {
  const item = carrito.find((actual) => actual.id === id);
  const producto = productos.find((actual) => actual.id === id);
  if (!item || !producto) return;

  if (accion === "sumar" && item.cantidad < producto.stock) item.cantidad += 1;
  if (accion === "restar") item.cantidad -= 1;
  if (accion === "quitar" || item.cantidad <= 0) {
    carrito = carrito.filter((actual) => actual.id !== id);
  }
  dibujarCarrito();
}

function abrirCarrito() {
  elementos.carritoPanel.classList.add("abierto");
  elementos.velo.classList.add("visible");
}

function cerrarCarrito() {
  elementos.carritoPanel.classList.remove("abierto");
  elementos.velo.classList.remove("visible");
}

function mostrarError(campo, mensaje) {
  const entrada = document.getElementById(campo);
  const error = document.getElementById(`error-${campo}`);
  entrada.classList.toggle("invalido", Boolean(mensaje));
  error.textContent = mensaje;
}

function validarCompra() {
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.replace(/\s/g, "");
  const entrega = document.getElementById("entrega").value;
  const direccion = document.getElementById("direccion").value.trim();
  const terminos = document.getElementById("terminos").checked;
  let valido = true;

  const errores = {
    nombre: nombre.length < 3 ? "Escribí al menos 3 letras." : "",
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Ingresá un email válido." : "",
    telefono: !/^\d{8,}$/.test(telefono) ? "Ingresá al menos 8 números." : "",
    entrega: !entrega ? "Elegí cómo querés recibir el pedido." : "",
    direccion: entrega === "envio" && !direccion ? "Ingresá la dirección de entrega." : "",
    terminos: !terminos ? "Tenés que aceptar que te contactemos." : ""
  };

  Object.entries(errores).forEach(([campo, mensaje]) => {
    mostrarError(campo, mensaje);
    if (mensaje) valido = false;
  });

  if (carrito.length === 0) {
    valido = false;
    abrirCarrito();
  }

  return valido;
}

async function cargarCotizacion() {
  elementos.cotizacion.textContent = "Cargando…";
  elementos.cotizacion.classList.add("cargando");
  elementos.estadoCotizacion.textContent = "Consultando cotización";

  try {
    const respuesta = await fetch("https://dolarapi.com/v1/dolares/oficial");
    if (!respuesta.ok) throw new Error("No se pudo consultar la cotización");
    const datos = await respuesta.json();
    if (typeof datos.venta !== "number") throw new Error("La respuesta no incluye el valor de venta");

    cotizacionDolar = datos.venta;
    elementos.cotizacion.textContent = formatearPrecio(cotizacionDolar);
    elementos.estadoCotizacion.textContent = "Precio de venta · se actualiza solo";
    elementos.cotizacion.classList.remove("cargando", "error");
    aplicarFiltros();
  } catch (error) {
    elementos.cotizacion.textContent = "No disponible";
    elementos.estadoCotizacion.textContent = "No se pudo cargar la cotización";
    elementos.cotizacion.classList.remove("cargando");
    elementos.cotizacion.classList.add("error");
  }
}

elementos.filtros.addEventListener("click", (event) => {
  const boton = event.target.closest("button[data-categoria]");
  if (!boton) return;

  elementos.filtros.querySelectorAll("button").forEach((filtro) => filtro.classList.remove("activo"));
  boton.classList.add("activo");
  categoriaActual = boton.dataset.categoria;
  aplicarFiltros();
});

elementos.buscador.addEventListener("input", (event) => {
  textoBusqueda = event.target.value.trim();
  aplicarFiltros();
});

elementos.productos.addEventListener("click", (event) => {
  const boton = event.target.closest("button[data-accion='agregar']");
  if (boton) agregarAlCarrito(Number(boton.dataset.id));
});

elementos.listaCarrito.addEventListener("click", (event) => {
  const boton = event.target.closest("button[data-accion]");
  if (!boton) return;
  const fila = boton.closest(".carrito-item");
  cambiarCantidad(Number(fila.dataset.id), boton.dataset.accion);
});

document.getElementById("btn-carrito").addEventListener("click", abrirCarrito);
document.getElementById("btn-cerrar-carrito").addEventListener("click", cerrarCarrito);
elementos.velo.addEventListener("click", cerrarCarrito);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") cerrarCarrito();
});
document.getElementById("btn-vaciar").addEventListener("click", () => {
  carrito = [];
  dibujarCarrito();
});
document.getElementById("btn-finalizar").addEventListener("click", cerrarCarrito);

elementos.formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validarCompra()) return;

  const nombre = document.getElementById("nombre").value.trim().split(/\s+/)[0];
  const total = carrito.reduce((suma, item) => {
    const producto = productos.find((actual) => actual.id === item.id);
    return suma + producto.precio * item.cantidad;
  }, 0);

  document.getElementById("compra-exitosa-detalle").textContent = `¡Gracias, ${nombre}! Tu pedido de ${formatearPrecio(total)} está confirmado.`;
  elementos.formulario.classList.add("oculto");
  elementos.compraExitosa.classList.remove("oculto");
  carrito = [];
  dibujarCarrito();
});

mostrarProductos(productos);
dibujarCarrito();
cargarCotizacion();
