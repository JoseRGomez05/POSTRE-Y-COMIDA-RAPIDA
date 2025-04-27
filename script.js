// Variables globales
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const cartItems = [];

// DOM Elements
const menuItems = document.querySelectorAll('.menu-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartModal = document.getElementById('cartModal');
const overlay = document.getElementById('overlay');
const cartCount = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const categoryCards = document.querySelectorAll('.category-card');

// Navegación móvil
document.getElementById('openMenu').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.add('show');
    overlay.classList.add('show');
});

document.getElementById('closeMenu').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('show');
    overlay.classList.remove('show');
});

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
        
        // Cerrar menú móvil si está abierto
        document.querySelector('.nav-links').classList.remove('show');
        overlay.classList.remove('show');
    });
});

// Slider de testimonios
function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

document.getElementById('prevBtn').addEventListener('click', () => {
    showSlide(currentSlide - 1);
});

document.getElementById('nextBtn').addEventListener('click', () => {
    showSlide(currentSlide + 1);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto slider
setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// Filtro de menú
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Activar botón
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        
        // Filtrar elementos
        menuItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                // Añadir animación
                item.style.animation = 'fadeIn 0.5s forwards';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Categorías
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        
        // Activar filtro correspondiente
        filterBtns.forEach(btn => {
            if (btn.dataset.filter === category) {
                btn.click();
            }
        });
        
        // Desplazar a la sección de menú
        document.querySelector('#menu').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    });
});

// Carrito de compras
function toggleCart() {
    cartModal.classList.toggle('show');
    overlay.classList.toggle('show');
}

document.querySelector('.cart-icon').addEventListener('click', toggleCart);
document.getElementById('closeCart').addEventListener('click', toggleCart);
overlay.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('show');
    cartModal.classList.remove('show');
    overlay.classList.remove('show');
});

// Agregar producto al carrito
function addToCart(productName, productPrice, productImage) {
    // Buscar si el producto ya está en el carrito
    const existingItem = cartItems.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    updateCart();
}

// Actualizar carrito
function updateCart() {
    // Actualizar contador
    cartCount.textContent = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    // Actualizar elementos del carrito
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartSubtotal.textContent = '$0.00';
        cartTotal.textContent = '$2.000';
        return;
    }
    
    let subtotal = 0;
    
    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn minus" data-index="${index}">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="quantity-btn plus" data-index="${index}">+</button>
                <i class="fas fa-trash remove-item" data-index="${index}"></i>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Actualizar totales
    const envio = 2;
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartTotal.textContent = `$${(subtotal + envio).toFixed(2)}`;
    
    // Agregar event listeners a botones de control de cantidad
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity--;
                updateCart();
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            cartItems[index].quantity++;
            updateCart();
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            cartItems.splice(index, 1);
            updateCart();
        });
    });
}

// Agregar productos al carrito desde menú
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.menu-item') || e.target.closest('.special-info');
        let name, price, image;
        
        if (menuItem.classList.contains('menu-item')) {
            name = menuItem.querySelector('h3').textContent;
            price = parseFloat(menuItem.querySelector('.price').textContent.replace('$', '').replace(',', ''));
            image = menuItem.querySelector('img').src;
        } else {
            name = menuItem.querySelector('h3').textContent;
            price = parseFloat(menuItem.querySelector('.new-price').textContent.replace('$', '').replace(',', ''));
            image = menuItem.previousElementSibling.querySelector('img').src;
        }
        
        addToCart(name, price, image);
        
        // Mostrar confirmación
        const confirmation = document.createElement('div');
        confirmation.classList.add('add-confirmation');
        confirmation.textContent = 'Añadido al carrito';
        document.body.appendChild(confirmation);
        
        setTimeout(() => {
            confirmation.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            confirmation.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(confirmation);
            }, 300);
        }, 2000);
    });
});

// Vaciar carrito
document.getElementById('clearCart').addEventListener('click', () => {
    cartItems.length = 0;
    updateCart();
});

// Función para abrir WhatsApp con el mensaje
function openWhatsApp(message) {
    // Número de WhatsApp (formato internacional sin el + inicial)
    const phoneNumber = "573004273787"; // Cambia este número por el tuyo (Colombia: +57)
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Crear la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp en nueva pestaña/ventana
    window.open(whatsappUrl, '_blank');
}

// Finalizar compra - Enviar pedido por WhatsApp
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cartItems.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos productos primero.');
        return;
    }
    
    // Crear mensaje para WhatsApp
    let message = "*🛒 NUEVO PEDIDO - GANAMJ*\n\n";
    message += "📋 *DETALLE DEL PEDIDO:*\n";
    
    // Añadir items
    cartItems.forEach(item => {
        message += `▫️ ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    // Calcular totales
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const envio = 2000;
    const total = subtotal + envio;
    
    message += "\n*RESUMEN:*\n";
    message += `📝 Subtotal: $${subtotal.toFixed(2)}\n`;
    message += `🚚 Envío: $${envio.toFixed(2)}\n`;
    message += `💰 *TOTAL: $${total.toFixed(2)}*\n\n`;
    
    message += "💬 Por favor completa tus datos para finalizar el pedido.";
    
    // Abrir WhatsApp con el mensaje
    openWhatsApp(message);
});

// Formulario de pedido - También envía por WhatsApp
document.getElementById('orderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Crear mensaje para WhatsApp
    let whatsappMessage = "*📝 FORMULARIO DE CONTACTO - GANAMJ*\n\n";
    whatsappMessage += `👤 *Nombre:* ${name}\n`;
    whatsappMessage += `📱 *Teléfono:* ${phone}\n`;
    whatsappMessage += `📧 *Email:* ${email}\n\n`;
    whatsappMessage += `💬 *Mensaje:* ${message}\n\n`;
    
    // Si hay items en el carrito, agregarlos al mensaje
    if (cartItems.length > 0) {
        whatsappMessage += "*ITEMS EN CARRITO:*\n";
        cartItems.forEach(item => {
            whatsappMessage += `▫️ ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const envio = 2;
        const total = subtotal + envio;
        
        whatsappMessage += "\n*RESUMEN:*\n";
        whatsappMessage += `📝 Subtotal: $${subtotal.toFixed(2)}\n`;
        whatsappMessage += `🚚 Envío: $${envio.toFixed(2)}\n`;
        whatsappMessage += `💰 *TOTAL: $${total.toFixed(2)}*`;
    }
    
    // Abrir WhatsApp con el mensaje
    openWhatsApp(whatsappMessage);
    
    // Limpiar formulario
    document.getElementById('orderForm').reset();
});

// Formulario de newsletter
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Crear mensaje para WhatsApp
    let whatsappMessage = "*📩 NUEVA SUSCRIPCIÓN - GANAMJ*\n\n";
    whatsappMessage += `📧 *Email:* ${email}\n`;
    whatsappMessage += "\nNuevo cliente interesado en recibir promociones y novedades.";
    
    // Abrir WhatsApp con el mensaje
    openWhatsApp(whatsappMessage);
    
    // Limpiar formulario
    e.target.reset();
    
    // Mostrar confirmación
    alert(`¡Gracias por suscribirte con ${email}! Te enviaremos nuestras promociones pronto.`);
});

// Efecto de animación al hacer scroll
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight - 150) {
            section.classList.add('active');
        }
    });
}

// Evento de scroll para animaciones
window.addEventListener('scroll', revealOnScroll);

// Inicializaciones
document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    updateCart();
    revealOnScroll();
    
    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        section.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        .add-confirmation {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: #ff6b6b;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1100;
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
        }
        
        .add-confirmation.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        
        /* Estilos para el carrito */
        .cart-modal {
            display: none;
        }
        
        .cart-modal.show {
            display: block;
        }
        
        .overlay {
            display: none;
        }
        
        .overlay.show {
            display: block;
        }
    `;
    document.head.appendChild(style);
});

// Detectar el modo claro/oscuro del sistema
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}

// ==========================
// FINALIZAR COMPRA CON DIRECCIÓN
// ==========================

// Cuando el usuario da click en "Finalizar Compra"
document.getElementById('checkoutBtn').addEventListener('click', () => {
    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }

    // Pedir la dirección de entrega
    const address = prompt('Por favor, ingresa tu dirección de entrega:');
    if (address === null || address.trim() === '') {
        alert('Debes ingresar una dirección para continuar.');
        return;
    }

    // Construir el mensaje
    let message = 'Hola, quiero hacer un pedido:\n\n';
    
    cartItems.forEach(item => {
        const title = item.querySelector('.cart-item-title').innerText;
        const quantity = item.querySelector('.cart-item-quantity').innerText;
        const price = item.querySelector('.cart-item-price').innerText;
        message += `• ${title} x${quantity} - ${price}\n`;
    });

    const total = document.getElementById('cartTotal').innerText;
    message += `\nTotal: ${total}`;
    message += `\n\nDirección de entrega: ${address}`;

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Redireccionar a WhatsApp
    window.open(`https://wa.me/573004273787?text=${encodedMessage}`, '_blank');
});
// ==============================
// ENVIAR FORMULARIO DE CONTACTO A WHATSAPP CON CONFIRMACIÓN
// ==============================

const orderForm = document.getElementById('orderForm');
const confirmModal = document.getElementById('confirmModal');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

let finalMessage = '';

orderForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Evitar el envío normal

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const messageText = document.getElementById('message').value.trim();

    if (!name || !email || !phone || !messageText) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    let message = `Hola, soy ${name}.\n\n`;
    message += `Email: ${email}\n`;
    message += `Teléfono: ${phone}\n`;
    message += `Mensaje: ${messageText}\n\n`;

    if (cart.length > 0) {
        message += `Productos en mi carrito:\n`;
        cart.forEach(item => {
            message += `• ${item.title} x${item.quantity} - ${item.price}\n`;
        });

        const totalText = cartTotal.innerText;
        message += `\nTotal: ${totalText}\n`;
    }

    finalMessage = encodeURIComponent(message);

    // Mostrar modal de confirmación
    confirmModal.style.display = 'flex';
});

// Botón Sí, Enviar
confirmYes.addEventListener('click', () => {
    window.open(`https://wa.me/573004273787?text=${finalMessage}`, '_blank');
    confirmModal.style.display = 'none';
});

// Botón Cancelar
confirmNo.addEventListener('click', () => {
    confirmModal.style.display = 'none';
});
