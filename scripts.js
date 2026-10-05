// scripts.js - Escuela de Conducción Profesional

document.addEventListener('DOMContentLoaded', function() {
    const encabezado = document.querySelector('header');
    const botonMenu = document.querySelector('.menu-toggle');
    const menu = document.getElementById('primary-nav');
    const consultaMovil = window.matchMedia('(max-width: 760px)');
    const crearUrlWhatsApp = function(texto) {
        const enlaceWhatsApp = document.querySelector('.whatsapp-btn');
        if (!enlaceWhatsApp) {
            console.error('No se encontró el enlace de WhatsApp para generar el mensaje.');
            return null;
        }

        const url = new URL(enlaceWhatsApp.href);
        url.searchParams.set('text', texto);
        return url.toString();
    };

    if (encabezado && botonMenu && menu) {
        const cerrarMenu = function(devolverFoco) {
            encabezado.classList.remove('menu-open');
            botonMenu.setAttribute('aria-expanded', 'false');
            botonMenu.setAttribute('aria-label', 'Menu openen');
            menu.inert = consultaMovil.matches;
            if (devolverFoco) botonMenu.focus();
        };

        const abrirMenu = function() {
            encabezado.classList.add('menu-open');
            botonMenu.setAttribute('aria-expanded', 'true');
            botonMenu.setAttribute('aria-label', 'Menu sluiten');
            menu.inert = false;
        };

        menu.inert = consultaMovil.matches;

        botonMenu.addEventListener('click', function() {
            const abierto = botonMenu.getAttribute('aria-expanded') === 'true';
            if (abierto) {
                cerrarMenu(false);
            } else {
                abrirMenu();
            }
        });

        document.addEventListener('click', function(event) {
            if (consultaMovil.matches && encabezado.classList.contains('menu-open') &&
                !encabezado.contains(event.target)) {
                cerrarMenu(false);
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && encabezado.classList.contains('menu-open')) {
                cerrarMenu(true);
            }
        });

        window.addEventListener('resize', function() {
            if (consultaMovil.matches) {
                menu.inert = !encabezado.classList.contains('menu-open');
            } else {
                cerrarMenu(false);
            }
        });
    }

    const form = document.getElementById('form-contacto');
    const mensajeEstado = document.getElementById('mensaje-exito');

    if (form && mensajeEstado) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const datos = new FormData(form);
            const nombre = String(datos.get('nombre') || '').trim();
            const email = String(datos.get('email') || '').trim();
            const mensaje = String(datos.get('mensaje') || '').trim();
            const textoWhatsApp = [
                'Nieuw contactverzoek via de website',
                '',
                `Naam: ${nombre}`,
                `E-mail: ${email}`,
                `Bericht: ${mensaje}`
            ].join('\n');
            const urlWhatsApp = crearUrlWhatsApp(textoWhatsApp);
            if (!urlWhatsApp) {
                mensajeEstado.textContent = 'WhatsApp is momenteel niet beschikbaar. Neem telefonisch contact met ons op.';
                mensajeEstado.hidden = false;
                return;
            }
            const pestana = window.open(urlWhatsApp, '_blank');

            if (pestana) {
                pestana.opener = null;
            }

            mensajeEstado.replaceChildren();
            mensajeEstado.append(
                document.createTextNode(
                    pestana
                        ? 'WhatsApp is geopend met uw gegevens. Controleer het bericht en druk op Verzenden om het te versturen.'
                        : 'WhatsApp kon niet automatisch worden geopend. Gebruik de knop hieronder om uw bericht te openen.'
                )
            );

            const enlaceWhatsApp = document.createElement('a');
            enlaceWhatsApp.href = urlWhatsApp;
            enlaceWhatsApp.target = '_blank';
            enlaceWhatsApp.rel = 'noopener noreferrer';
            enlaceWhatsApp.className = 'whatsapp-form-link';
            enlaceWhatsApp.textContent = 'Open WhatsApp';
            mensajeEstado.append(enlaceWhatsApp);
            mensajeEstado.hidden = false;
        });
    }

    document.querySelectorAll('nav a[href^="#"]').forEach(function(enlace) {
        enlace.addEventListener('click', function(event) {
            const destino = document.getElementById(enlace.hash.slice(1));
            if (destino) {
                event.preventDefault();
                if (encabezado && encabezado.classList.contains('menu-open')) {
                    encabezado.classList.remove('menu-open');
                    botonMenu.setAttribute('aria-expanded', 'false');
                    botonMenu.setAttribute('aria-label', 'Menu openen');
                    menu.inert = consultaMovil.matches;
                }
                destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    document.querySelectorAll('.flip-card').forEach(function(card) {
        const botonSolicitar = card.querySelector('.solicitar-btn');
        const caraTrasera = card.querySelector('.flip-card-back');
        const tituloPaquete = card.querySelector('.flip-card-front h4');
        const alternarTarjeta = function() {
            const girada = card.classList.toggle('girada');
            card.setAttribute('aria-expanded', String(girada));
            if (botonSolicitar) {
                botonSolicitar.tabIndex = girada ? 0 : -1;
            }
            if (caraTrasera) {
                caraTrasera.inert = !girada;
            }
        };

        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');
        card.setAttribute('aria-label', `${tituloPaquete ? tituloPaquete.textContent.trim() : 'Pakket'} omdraaien`);
        if (botonSolicitar) {
            botonSolicitar.tabIndex = -1;
        }
        if (caraTrasera) {
            caraTrasera.inert = true;
        }

        card.addEventListener('click', function(event) {
            if (event.target.closest('.solicitar-btn')) return;
            alternarTarjeta();
        });

        card.addEventListener('keydown', function(event) {
            if (event.target !== card || (event.key !== 'Enter' && event.key !== ' ')) return;
            event.preventDefault();
            alternarTarjeta();
        });
    });

    document.querySelectorAll('.solicitar-btn').forEach(function(boton) {
        boton.addEventListener('click', function(event) {
            event.preventDefault();
            const tarjeta = boton.closest('.flip-card');
            const tituloPaquete = tarjeta.querySelector('.flip-card-front h4');
            if (!tituloPaquete) return;

            const mensaje = `Ik heb interesse in ${tituloPaquete.textContent.trim()}.`;
            const url = crearUrlWhatsApp(mensaje);
            if (url) window.open(url, '_blank', 'noopener,noreferrer');
        });
    });

    const galeria = document.querySelector('.galeria-imagenes');
    if (galeria) {
        const cajaLuz = document.createElement('dialog');
        cajaLuz.className = 'image-lightbox';
        cajaLuz.setAttribute('aria-label', 'Vergrote afbeelding');

        const cerrarImagen = document.createElement('button');
        cerrarImagen.className = 'lightbox-close';
        cerrarImagen.type = 'button';
        cerrarImagen.setAttribute('aria-label', 'Afbeelding sluiten');
        cerrarImagen.textContent = '×';

        const figura = document.createElement('figure');
        const imagenAmpliada = document.createElement('img');
        const descripcion = document.createElement('figcaption');
        figura.append(imagenAmpliada, descripcion);
        cajaLuz.append(cerrarImagen, figura);
        document.body.append(cajaLuz);

        galeria.querySelectorAll('img').forEach(function(imagen) {
            const botonImagen = document.createElement('button');
            botonImagen.className = 'galeria-item';
            botonImagen.type = 'button';
            botonImagen.setAttribute('aria-label', `Afbeelding vergroten: ${imagen.alt}`);
            imagen.parentNode.insertBefore(botonImagen, imagen);
            botonImagen.append(imagen);

            botonImagen.addEventListener('click', function() {
                if (typeof cajaLuz.showModal !== 'function') {
                    const pestana = window.open(imagen.src, '_blank', 'noopener,noreferrer');
                    if (pestana) pestana.opener = null;
                    return;
                }

                imagenAmpliada.src = imagen.currentSrc || imagen.src;
                imagenAmpliada.alt = imagen.alt;
                descripcion.textContent = imagen.alt;
                cajaLuz.showModal();
                cerrarImagen.focus();
            });
        });

        cerrarImagen.addEventListener('click', function() {
            cajaLuz.close();
        });

        cajaLuz.addEventListener('click', function(event) {
            if (event.target === cajaLuz) cajaLuz.close();
        });
    }

    const elementosAnimados = document.querySelectorAll(
        '.hero-content > *, section > .container > h3, .servicios-lista > *, ' +
        '.informacion-lista > *, .precios-lista > *, .galeria-imagenes .galeria-item, ' +
        '#contacto form, footer .footer-logo, footer .footer-info'
    );

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if ('IntersectionObserver' in window) {
            document.documentElement.classList.add('has-scroll-reveal');
            const observador = new IntersectionObserver(function(entradas, observer) {
                entradas.forEach(function(entrada) {
                    if (!entrada.isIntersecting) return;
                    entrada.target.classList.add('reveal-visible');
                    observer.unobserve(entrada.target);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

            elementosAnimados.forEach(function(elemento, indice) {
                elemento.classList.add('reveal-on-scroll');
                elemento.style.setProperty('--reveal-delay', `${(indice % 4) * 70}ms`);
                observador.observe(elemento);
            });
        } else {
            elementosAnimados.forEach(function(elemento) {
                elemento.classList.add('reveal-visible');
            });
        }
    }
});
