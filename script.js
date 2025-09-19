const form = document.getElementById('registroForm');
const inputs = document.querySelectorAll('.form-input, .form-select');

// Función para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para mostrar errores
function mostrarError(campo, mensaje) {
    const input = document.getElementById(campo);
    const errorDiv = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
    
    input.classList.add('error');
    input.classList.remove('success');
    
    errorDiv.textContent = mensaje;
    errorDiv.classList.add('show');
    
    // Efecto de vibración
    input.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

// Función para limpiar errores
function limpiarError(campo) {
    const input = document.getElementById(campo);
    const errorDiv = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
    
    input.classList.remove('error');
    input.classList.add('success');
    errorDiv.classList.remove('show');
}

// Función para validar nombre
function validarNombre(nombre) {
    if (nombre === '') {
        return 'El nombre es obligatorio';
    } else if (nombre.length < 2) {
        return 'El nombre debe tener al menos 2 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        return 'El nombre solo puede contener letras y espacios';
    }
    return null;
}

// Función para validar edad
function validarEdad(edad) {
    if (edad === '') {
        return 'La edad es obligatoria';
    } else if (edad < 1 || edad > 120) {
        return 'Ingresa una edad válida (1-120)';
    }
    return null;
}

// Función para validar correo
function validarCorreo(correo) {
    if (correo === '') {
        return 'El correo es obligatorio';
    } else if (!validarEmail(correo)) {
        return 'Ingresa un correo válido (ejemplo@correo.com)';
    }
    return null;
}

// Función para validar sexo
function validarSexo(sexo) {
    if (sexo === '') {
        return 'Selecciona una opción';
    }
    return null;
}

// Validaciones en tiempo real cuando el usuario sale del campo
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        const campo = this.id;
        const valor = this.value.trim();
        let error = null;

        switch(campo) {
            case 'nombre':
                error = validarNombre(valor);
                break;
            case 'correo':
                error = validarCorreo(valor);
                break;
            case 'contrasena':
                error = validarContrasena(valor);
                break;
        }

        if (error) {
            mostrarError(campo, error);
        } else {
            limpiarError(campo);
        }
    });

    // Efectos visuales adicionales
    input.addEventListener('focus', function() {
        this.style.transform = 'translateY(-3px) scale(1.02)';
    });

    input.addEventListener('blur', function() {
        if (!this.classList.contains('error')) {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });

    // Validación mientras escribe (para email principalmente)
    input.addEventListener('input', function() {
        const campo = this.id;
        const valor = this.value.trim();
        
        if (campo === 'correo' && valor.length > 0) {
            if (validarEmail(valor)) {
                limpiarError(campo);
            }
        }
        
        if (campo === 'nombre' && valor.length >= 2) {
            if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
                limpiarError(campo);
            }
        }
    });
});

// Validación principal al enviar el formulario
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    
    let esValido = true;
    const errores = [];

    // Validar todos los campos
    const errorNombre = validarNombre(nombre);
    const errorCorreo = validarCorreo(correo);
    const errorContrasena = validarContrasena(contrasena);

    if (errorNombre) {
        mostrarError('nombre', errorNombre);
        errores.push('nombre');
        esValido = false;
    } else {
        limpiarError('nombre');
    }

    if (errorCorreo) {
        mostrarError('correo', errorCorreo);
        errores.push('correo');
        esValido = false;
    } else {
        limpiarError('correo');
    }

    if (errorContrasena) {
        mostrarError('contrasena', errorContrasena);
        errores.push('contrasena');
        esValido = false;
    } else {
        limpiarError('contrasena');
    }

    // Si hay errores, hacer focus en el primer campo con error
    if (!esValido) {
        const primerError = errores[0];
        document.getElementById(primerError).focus();
        
        // Efecto visual para el botón cuando hay errores
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            submitBtn.style.animation = '';
        }, 500);
        
        return;
    }

    // Si todo es válido, mostrar mensaje de éxito
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    successMessage.style.animation = 'pulse 0.5s ease-in-out';
    
    // Efecto de confirmación en el botón
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '✅ ¡Registrado!';
    submitBtn.style.background = 'linear-gradient(135deg, #00d2d3, #54a0ff)';
    
    // Mostrar datos en consola (para desarrollo)
    console.log('Registro exitoso:', {
        nombre: nombre,
        correo: correo,
        contrasena: '***oculta***'
    });
    
    // Resetear formulario después de 3 segundos
    setTimeout(() => {
        form.reset();
        
        // Limpiar todos los estilos de validación
        inputs.forEach(input => {
            input.classList.remove('success', 'error');
            input.style.transform = 'translateY(0) scale(1)';
            const campo = input.id;
            const errorDiv = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
            if (errorDiv) errorDiv.classList.remove('show');
        });
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1)';
        
        // Ocultar mensaje de éxito
        successMessage.style.display = 'none';
    }, 3000);
});

// Efectos adicionales para botones
const submitBtn = document.querySelector('.submit-btn');
const resetBtn = document.querySelector('.reset-btn');

// Efectos del botón de envío
submitBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px) scale(1.05)';
    this.style.filter = 'brightness(1.1) saturate(1.2)';
});

submitBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.filter = 'brightness(1) saturate(1)';
});

// Efectos del botón de reset
resetBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-3px) scale(1.02)';
    this.style.filter = 'brightness(1.1)';
});

resetBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.filter = 'brightness(1)';
});

// Funcionalidad del botón reset
resetBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Animación del botón
    this.style.animation = 'pulse 0.3s ease-in-out';
    setTimeout(() => {
        this.style.animation = '';
    }, 300);
    
    // Limpiar formulario y estilos
    form.reset();
    inputs.forEach(input => {
        input.classList.remove('success', 'error');
        input.style.transform = 'translateY(0) scale(1)';
        const campo = input.id;
        const errorDiv = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
        if (errorDiv) errorDiv.classList.remove('show');
    });
    
    // Ocultar mensaje de éxito
    document.getElementById('successMessage').style.display = 'none';
    
    // Restaurar botón de envío si estaba modificado
    submitBtn.innerHTML = '🚀 Registrarse 🚀';
    submitBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1)';
});

// Efectos adicionales cuando la página carga
window.addEventListener('load', function() {
    const container = document.querySelector('.form-container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(50px) scale(0.9)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.8s ease-out';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0) scale(1)';
    }, 100);
});

// Función para detectar cuando el usuario empieza a escribir
let isFirstInteraction = true;
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        if (isFirstInteraction) {
            // Pequeña animación de bienvenida
            const title = document.querySelector('.form-title');
            title.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                title.style.animation = '';
            }, 500);
            isFirstInteraction = false;
        }
    });
});