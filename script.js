document.addEventListener('DOMContentLoaded', function () {

    // ===== 1. Resaltar página activa en menú =====
    const enlaces = document.querySelectorAll('nav a');
    const rutaActual = window.location.pathname.split('/').pop();

    enlaces.forEach(enlace => {
        enlace.classList.remove('activo');
        const destino = enlace.getAttribute('href');
        if (destino === rutaActual || (rutaActual === '' && destino === 'index.html')) {
            enlace.classList.add('activo');
        }
    });

    // ===== 2. Saludo dinámico en Inicio =====
    if (document.title.includes('Inicio')) {
        const hora = new Date().getHours();
        let saludo, emoji;

        if (hora >= 5 && hora < 12) {
            saludo = '¡Buenos días! Disfruta tu película ☀️';
            emoji = '🌅';
        } else if (hora >= 12 && hora < 19) {
            saludo = '¡Buenas tardes! Disfruta la función 🎬';
            emoji = '🌇';
        } else {
            saludo = '¡Buenas noches! Prepara las palomitas 🍿';
            emoji = '🌙';
        }

        const encabezado = document.querySelector('main');
        if (encabezado) {
            const cajaSaludo = document.createElement('div');
            cajaSaludo.style.cssText = `
                background: linear-gradient(90deg, #e94560, #ff6b6b);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                margin: 15px 0;
                text-align: center;
                font-weight: bold;
            `;
            cajaSaludo.innerHTML = `${emoji} ${saludo}`;
            encabezado.insertBefore(cajaSaludo, encabezado.firstChild);
        }
    }

    // ===== 3. Filtro de películas en Cartelera =====
    const botonesFiltro = document.querySelectorAll('.botones-filtro button');
    const peliculas = document.querySelectorAll('.lista-peliculas .pelicula');

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', function () {
            // Quitar clase activa a todos
            botonesFiltro.forEach(b => b.classList.remove('filtro-activo'));
            this.classList.add('filtro-activo');

            const genero = this.getAttribute('data-genero');

            peliculas.forEach(peli => {
                const peliGenero = peli.getAttribute('data-genero');
                if (genero === 'todas' || peliGenero === genero) {
                    peli.style.display = 'block';
                } else {
                    peli.style.display = 'none';
                }
            });
        });
    });

    // ===== 4. Formulario de Contacto =====
    const formulario = document.querySelector('form');
    if (formulario) {
        // Teléfono: solo números y máximo 9 dígitos (también al pegar texto)
        const campoTelefono = document.getElementById('telefono');
        if (campoTelefono) {
            campoTelefono.addEventListener('input', function () {
                this.value = this.value.replace(/\D/g, '').slice(0, 9);
            });
        }

        formulario.addEventListener('submit', function (e) {
            e.preventDefault(); // ⚠️ Esto es clave: evita que recargue la página

            // Obtener valores
            const nombre = document.getElementById('nombre')?.value.trim();
            const correo = document.getElementById('correo')?.value.trim();
            const asunto = document.getElementById('asunto')?.value;
            const mensaje = document.getElementById('mensaje')?.value.trim();

            // Validaciones
            if (!nombre || !correo || !mensaje) {
                alert('⚠️ Completa todos los campos obligatorios por favor.');
                return;
            }

            if (!correo.includes('@') || !correo.includes('.')) {
                alert('⚠️ Escribe un correo válido (ej: nombre@dominio.com)');
                return;
            }

            // El teléfono es opcional, pero si lo escriben debe tener 9 dígitos
            const telefono = document.getElementById('telefono')?.value.trim();
            if (telefono && !/^\d{9}$/.test(telefono)) {
                alert('⚠️ El teléfono debe tener exactamente 9 dígitos (ej: 987654321)');
                return;
            }

            // Mensaje según el asunto
            let mensajeExito = '';
            switch (asunto) {
                case 'reclamo':
                    mensajeExito = `✅ Estimado/a ${nombre},\nHemos recibido tu reclamo. Lo revisaremos con atención y te responderemos en un máximo de 48 horas. Gracias por ayudarnos a mejorar.`;
                    break;
                case 'sugerencia':
                    mensajeExito = `✅ ¡Gracias ${nombre} por tu sugerencia! 🎉 La tomaremos en cuenta para seguir mejorando nuestro servicio.`;
                    break;
                default:
                    mensajeExito = `✅ ¡Mensaje enviado, ${nombre}!\nHemos recibido tu ${asunto}. Te responderemos pronto a ${correo}`;
            }

            // Mostrar mensaje
            alert(mensajeExito);

            // Limpiar formulario
            formulario.reset();
        });
    }

    // ===== 5. Botón "Volver arriba" =====
    const botonArriba = document.createElement('button');
    botonArriba.textContent = '⬆️ Subir';
    botonArriba.style.cssText = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        background: #e94560;
        color: white;
        border: none;
        padding: 10px 18px;
        border-radius: 50px;
        cursor: pointer;
        font-weight: bold;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
    `;
    document.body.appendChild(botonArriba);

    window.addEventListener('scroll', function () {
        botonArriba.style.opacity = window.scrollY > 300 ? '1' : '0';
    });

    botonArriba.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
(function () {
    const carrusel = document.querySelector('.carrusel');
    if (!carrusel) return; // en las otras paginas no hay carrusel

    const pista = carrusel.querySelector('.pista');
    const total = pista.children.length;
    const contIndicadores = carrusel.querySelector('.indicadores');
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let actual = 0;
    let timer;

    // Un indicador por cada slide
    for (let i = 0; i < total; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Ir al banner ' + (i + 1));
        b.addEventListener('click', function () { irA(i); reiniciar(); });
        contIndicadores.appendChild(b);
    }
    const indicadores = contIndicadores.children;

    function irA(n) {
        actual = (n + total) % total; // al pasar el ultimo vuelve al primero
        pista.style.transform = 'translateX(-' + (actual * 100) + '%)';
        for (let i = 0; i < total; i++) {
            indicadores[i].classList.toggle('activo', i === actual);
        }
    }

    function iniciar() {
        if (reducirMovimiento) return;
        timer = setInterval(function () { irA(actual + 1); }, 4000); // 4000 ms = 4 segundos
    }
    function detener() { clearInterval(timer); }
    function reiniciar() { detener(); iniciar(); }

    carrusel.querySelector('.next').addEventListener('click', function () { irA(actual + 1); reiniciar(); });
    carrusel.querySelector('.prev').addEventListener('click', function () { irA(actual - 1); reiniciar(); });

    // Pausa cuando el mouse esta encima o el teclado tiene el foco dentro
    carrusel.addEventListener('mouseenter', detener);
    carrusel.addEventListener('mouseleave', iniciar);
    carrusel.addEventListener('focusin', detener);
    carrusel.addEventListener('focusout', iniciar);

    // Deslizar con el dedo en el celular
    let inicioX = 0;
    carrusel.addEventListener('touchstart', function (e) {
        inicioX = e.touches[0].clientX;
        detener();
    }, { passive: true });
    carrusel.addEventListener('touchend', function (e) {
        const diferencia = e.changedTouches[0].clientX - inicioX;
        if (Math.abs(diferencia) > 40) {
            irA(actual + (diferencia < 0 ? 1 : -1));
        }
        reiniciar();
    }, { passive: true });

    irA(0);
    iniciar();
})();
