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
