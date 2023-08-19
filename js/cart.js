// Escuchar el evento de clic en el botón de inicio de sesión
document.getElementById("loginButton").addEventListener("click", () => {
  // Usar SweetAlert para solicitar el nombre y el correo electrónico del usuario
  Swal.fire({
    title: "Iniciar Sesión",
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Ingrese su nombre">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Ingrese su correo electrónico">',
    showCancelButton: true,
    confirmButtonText: "Iniciar Sesión",
  }).then((result) => {
    if (result.isConfirmed) {
      const username = document.getElementById("swal-input1").value;
      const email = document.getElementById("swal-input2").value;

      if (username && email) {
        // Guardar el nombre y el correo electrónico en sessionStorage
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("email", email);

        // Mostrar el nombre y el correo electrónico en el DOM
        displayUserInfo(username, email);
      }
    }
  });
});

// Función para mostrar el nombre y el correo electrónico en el DOM
function displayUserInfo(username, email) {
  const userInfoDisplay = document.getElementById("userInfoDisplay");
  userInfoDisplay.innerHTML = `¡Bienvenido, ${username}!<br>Correo electrónico: ${email}`;
}

// Comprobar si ya hay un nombre de usuario y un correo electrónico almacenados en sessionStorage al cargar la página
const storedUsername = sessionStorage.getItem("username");
const storedEmail = sessionStorage.getItem("email");
if (storedUsername && storedEmail) {
  displayUserInfo(storedUsername, storedEmail);
}

// Función para verificar si el usuario está loggeado
const usuarioLoggeado = () => {
  const storedUsername = sessionStorage.getItem("username");
  const storedEmail = sessionStorage.getItem("email");
  return storedUsername && storedEmail;
}

let carrito = []

const productoContenedor = document.getElementById("producto-contenedor");
// escucho el evento click para agregar un producto
productoContenedor.addEventListener('click', (e) => {
  if (e.target.classList.contains('agregar')) {
    if (usuarioLoggeado()) { // Verificar si el usuario está loggeado
      validarProductoEnCarrito(e.target.id);
    } else {
      Toastify({
        text: "Debes iniciar sesión para agregar al carrito.",
        duration: 3000,
        close: true,
        gravity: "bottom", // Cambiar la posición del toast según tu preferencia
        backgroundColor: "linear-gradient(to right, #ff9800, #ff5722)"
      }).showToast();
    }
  }
})

// valido que el producto agregado esté o no en el carrito. Si está, agrego cantidad
const validarProductoEnCarrito = (id) => {
  const productoEnCarrito = carrito.find(producto => producto.id == id);

  if (!productoEnCarrito) {
    const producto = productos.find(producto => producto.id == id);
    producto.cantidad = 1; // Establecer la cantidad a 1 cuando se agrega por primera vez
    carrito.push(producto);
    pintarProductoCarrito(producto);
    actualizarTotalesCarrito(carrito);
    Toastify({
      text: "Producto agregado al carrito.",
      duration: 3000,
      close: true,
      gravity: "bottom",
      backgroundColor: "#4caf50"
    }).showToast();
  } else {
    productoEnCarrito.cantidad++; // Incrementar la cantidad si el producto ya está en el carrito
    const cantidadElement = document.getElementById(`cantidad${productoEnCarrito.id}`);
    cantidadElement.innerText = `Cantidad: ${productoEnCarrito.cantidad}`;
    actualizarTotalesCarrito(carrito);
    Toastify({
      text: "Agrego una unidad adicional",
      duration: 3000,
      close: true,
      gravity: "bottom",
      backgroundColor: "#4caf50"
    }).showToast();
  }
}

//renderizo en el carrito todo los productos con su imagen
const pintarProductoCarrito = (producto) => {
  const contenedor = document.getElementById('carrito-contenedor')
  const div = document.createElement('div')
  div.classList.add('productoEnCarrito')

  div.innerHTML = `
    <img src=${producto.imagen}>
    <p>${producto.nombre}</p>
    <p><strong>$ ${producto.precio}</strong></p>
    <p id=cantidad${producto.id}>Cantidad: ${producto.cantidad}</p>
    <button class="btn waves-effect waves-ligth boton-eliminar" value="${producto.id}">X</button>
  `
  contenedor.appendChild(div)
}
// Pinta los productos seleccionados en el carrito
const pintarCarrito = (carrito) => {
  const contenedor = document.getElementById('carrito-contenedor')

  contenedor.innerHTML = ''

  carrito.forEach(producto => {
    const div = document.createElement('div')
    div.classList.add('productoEnCarrito')

    div.innerHTML = `
      <img src=${producto.imagen}>
      <p>${producto.nombre}</p>
      <p>$ ${producto.precio}</p>
      <p id=cantidad${producto.id}>Cantidad: ${producto.cantidad}</p>
      <button class="btn waves-effect waves-ligth boton-eliminar" value="${producto.id}">X</button>
    `
    contenedor.appendChild(div)
  });
}
// eliminar productos del carro
const eliminarProductoCarrito = (id) => {
  const productoIndex = carrito.findIndex(producto => producto.id == id)
  carrito.splice(productoIndex, 1)
  pintarCarrito(carrito)
  actualizarTotalesCarrito(carrito)
  Toastify({
    text: "Producto eliminado del carrito.",
    duration: 3000,
    close: true,
    gravity: "bottom",
    backgroundColor: "#f44336"
  }).showToast();
}
//actualiza las cantidades totales y el costo total
const actualizarTotalesCarrito = (carrito) => {
  const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0)
  const totalCompra = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)

  pintarTotalesCarrito(totalCantidad, totalCompra)
  guardarCarritoStorage(carrito)
}

const pintarTotalesCarrito = (totalCantidad, totalCompra) => {
  const contadorCarrito = document.getElementById('contador-carrito')
  const precioTotal = document.getElementById('precio-total')

  contadorCarrito.innerText = totalCantidad
  precioTotal.innerText = totalCompra
}

const guardarCarritoStorage = (carrito) => {
  localStorage.setItem('carrito', JSON.stringify(carrito))
}
//guardo 
const obtenerCarritoStorage = () => {
  const carritoStorage = JSON.parse(localStorage.getItem('carrito'))
  return carritoStorage
}
// funcion cargar carrito guardado en el storage
const cargarCarrito = () => {
  if (localStorage.getItem('carrito')) {
    carrito = obtenerCarritoStorage()
    pintarCarrito(carrito)
    actualizarTotalesCarrito(carrito)
  }
}
// Después de cargar el carrito desde el almacenamiento y pintarlo
cargarCarrito();

// Agregar evento clic al botón "Vaciar Carrito"
const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');
btnVaciarCarrito.addEventListener('click', () => {
  // reemplazo la ventana Confirm con un sweetAlert 
  swal.fire({
    title: "¿Está seguro de que quiere vaciar el carrito?",
    icon: "warning",
    buttons: ["Cancelar", "Vaciar"],
    dangerMode: true,
  })
  .then((willVaciar) => {
    if (willVaciar) {
      // Vaciar el carrito y actualizar la interfaz
      carrito.forEach(producto => producto.cantidad = 1);
      carrito = [];
      pintarCarrito(carrito);
      actualizarTotalesCarrito(carrito);
      localStorage.removeItem('carrito'); // Limpiar el almacenamiento local también
    }
  });
});

// Escuchar el evento de clic en el botón "Finalizar Compra"
document.getElementById("finalizarCompra").addEventListener("click", () => {
  swal.fire({
    title: "Finalizar Compra",
    text: "¿Está seguro de que desea finalizar la compra?",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Aceptar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Obtener información del usuario y del carrito
      const storedUsername = sessionStorage.getItem("username");
      const storedEmail = sessionStorage.getItem("email")
      const cartItems = carrito.map(producto => `${producto.nombre} (Cantidad: ${producto.cantidad})`);
      const cartItemsText = cartItems.join("\n");
      const totalCompra = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)

      // Lógica para enviar la información a través de EmailJS
      const templateParams = {
        username: storedUsername,
        cartItems: cartItemsText,
        precioTotal: totalCompra,
        email: storedEmail,
      };

      // Envío del correo electrónico a través de EmailJS
      emailjs.send("default_service", "template_j55ha1j", templateParams)
        .then((response) => {
          // Vaciar el carrito y actualizar la interfaz
          carrito = [];
          pintarCarrito(carrito);
          actualizarTotalesCarrito(carrito);
          localStorage.removeItem('carrito'); // Limpiar el almacenamiento local

          swal.fire("Compra Finalizada", "Se ha enviado la información de la compra por correo electrónico.", "success");
        })
        .catch((error) => {
          swal.fire("Error", "Hubo un problema al enviar el correo electrónico.", "error");
        });
    }
  });
});


