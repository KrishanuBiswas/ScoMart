document.addEventListener("DOMContentLoaded", function() {
    let cart = [];

    initAddToCart();
    initBuyButtons();
    initBargainButtons();
    initSearch();

    function initAddToCart() {
        const allProductButtons = Array.from(document.querySelectorAll('.product button'));
        const addToCartButtons = allProductButtons.filter(function(button) {
            return button.textContent.trim().toLowerCase() === 'add to cart';
        });

        addToCartButtons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                const productElement = event.target.closest('.product');
                addToCart(productElement);
                showNotification(productElement.querySelector('h3').textContent + ' added to cart!');
                updateCartCount();
            });
        });
    }

    function initBuyButtons() {
        const buyButtons = document.querySelectorAll('.buy-btn');
        buyButtons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                const productElement = event.target.closest('.product');
                const title = productElement.querySelector('h3').textContent.trim();
                const price = getEffectivePrice(productElement);
                // In a real app, you would navigate to checkout with this data
                // For demo purposes, we just show a notification
                showNotification('Proceeding to buy: ' + title + ' at ' + price);
                window.location.href = "path-to-payment-page.html";
            });
        });
    }

    function initBargainButtons() {
        const bargainButtons = document.querySelectorAll('.bargain-btn');
        bargainButtons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                const productElement = event.target.closest('.product');
                openBargainModal(productElement);
            });
        });
    }

    function addToCart(productElement) {
        const product = {
            title: productElement.querySelector('h3').textContent.trim(),
            price: getEffectivePrice(productElement),
            id: Math.random().toString(36).slice(2)
        };
        cart.push(product);
    }

    function getPriceElement(productElement) {
        const paragraphs = Array.from(productElement.querySelectorAll('p'));
        return paragraphs.find(function(p) {
            return p.textContent.trim().toLowerCase().startsWith('price:');
        });
    }

    function getListPrice(productElement) {
        const priceElement = getPriceElement(productElement);
        if (!priceElement) {
            return 0;
        }
        const numeric = parseFloat(priceElement.textContent.replace(/[^\d.]/g, ''));
        return isNaN(numeric) ? 0 : numeric;
    }

    function getEffectivePrice(productElement) {
        const negotiated = parseFloat(productElement.dataset.negotiatedPrice || 'NaN');
        if (!isNaN(negotiated)) {
            return negotiated;
        }
        return getListPrice(productElement);
    }

    function setNegotiatedPrice(productElement, newPrice) {
        const priceElement = getPriceElement(productElement);
        if (!priceElement) {
            return;
        }
        const originalPrice = getListPrice(productElement);
        priceElement.innerHTML = 'Price: ' + '<span class="price-old">' + originalPrice + '</span>' + ' ' + '<span class="price-new">' + newPrice + '</span>';
        productElement.dataset.negotiatedPrice = String(newPrice);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = '#3498db';
        notification.style.color = '#fff';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2500);
    }

    function updateCartCount() {
        let cartCountElement = document.getElementById('cart-count');
        if (!cartCountElement) {
            cartCountElement = document.createElement('div');
            cartCountElement.id = 'cart-count';
            cartCountElement.textContent = 'Cart: ' + cart.length + ' items';
            cartCountElement.style.position = 'fixed';
            cartCountElement.style.top = '20px';
            cartCountElement.style.right = '20px';
            cartCountElement.style.padding = '10px 20px';
            cartCountElement.style.backgroundColor = '#fff';
            cartCountElement.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.1)';
            document.body.appendChild(cartCountElement);
        } else {
            cartCountElement.textContent = 'Cart: ' + cart.length + ' items';
        }
    }

    function initSearch() {
        const searchBar = document.getElementById('search-bar');
        const searchBtn = document.getElementById('search-btn');
        if (!searchBar || !searchBtn) {
            return;
        }
        searchBtn.addEventListener('click', function() {
            searchProducts((searchBar.value || '').toLowerCase());
        });
    }

    function searchProducts(searchTerm) {
        const products = document.querySelectorAll('.product');
        products.forEach(function(product) {
            const title = product.querySelector('h3').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Bargain modal implementation
    let bargainUi = null;
    let bargainState = null;

    function ensureBargainUi() {
        if (bargainUi) {
            return bargainUi;
        }
        const overlay = document.createElement('div');
        overlay.className = 'bargain-overlay';

        const modal = document.createElement('div');
        modal.className = 'bargain-modal';
        modal.innerHTML = '' +
            '<h3>Negotiate Price</h3>' +
            '<div class="price-info"></div>' +
            '<label>Enter your offer:</label>' +
            '<input class="offer-input" type="number" min="1" step="1" placeholder="Your price" />' +
            '<div class="message"></div>' +
            '<div class="actions">' +
                '<button class="cancel">Cancel</button>' +
                '<button class="accept-counter bargain-hidden">Accept Counter</button>' +
                '<button class="submit-offer">Submit Offer</button>' +
            '</div>';

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const ui = {
            overlay: overlay,
            modal: modal,
            priceInfoEl: modal.querySelector('.price-info'),
            offerInput: modal.querySelector('.offer-input'),
            messageEl: modal.querySelector('.message'),
            cancelBtn: modal.querySelector('.cancel'),
            acceptBtn: modal.querySelector('.accept-counter'),
            submitBtn: modal.querySelector('.submit-offer')
        };

        ui.cancelBtn.addEventListener('click', function() {
            closeBargainUi();
        });
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                closeBargainUi();
            }
        });
        ui.acceptBtn.addEventListener('click', function() {
            if (!bargainState || !bargainState.lastCounter) {
                return;
            }
            setNegotiatedPrice(bargainState.productElement, bargainState.lastCounter);
            showNotification('Deal accepted at ' + bargainState.lastCounter);
            closeBargainUi();
        });
        ui.submitBtn.addEventListener('click', function() {
            if (!bargainState) {
                return;
            }
            const offer = parseFloat(ui.offerInput.value);
            if (isNaN(offer) || offer <= 0) {
                ui.messageEl.textContent = 'Please enter a valid price.';
                return;
            }
            const outcome = evaluateOffer(offer, bargainState.listPrice, bargainState.floorPrice, bargainState.round);
            if (outcome.decision === 'accept') {
                setNegotiatedPrice(bargainState.productElement, outcome.acceptedPrice);
                showNotification('Offer accepted at ' + outcome.acceptedPrice);
                closeBargainUi();
                return;
            }
            if (outcome.decision === 'counter' || outcome.decision === 'final-counter') {
                bargainState.round += 1;
                bargainState.lastCounter = outcome.counterPrice;
                if (outcome.decision === 'final-counter') {
                    ui.messageEl.textContent = 'Seller\'s final counter-offer: ' + outcome.counterPrice;
                } else {
                    ui.messageEl.textContent = 'Seller counter-offers: ' + outcome.counterPrice;
                }
                ui.acceptBtn.classList.remove('bargain-hidden');
                return;
            }
            ui.messageEl.textContent = 'Sorry, your offer is too low.';
        });

        bargainUi = ui;
        return bargainUi;
    }

    function openBargainModal(productElement) {
        const ui = ensureBargainUi();
        const listPrice = getListPrice(productElement);
        const floorPrice = Math.max(Math.round(listPrice * 0.8), 1);
        bargainState = {
            productElement: productElement,
            listPrice: listPrice,
            floorPrice: floorPrice,
            round: 0,
            lastCounter: null
        };
        ui.priceInfoEl.textContent = 'Listed price: ' + listPrice;
        ui.offerInput.value = '';
        ui.messageEl.textContent = '';
        ui.acceptBtn.classList.add('bargain-hidden');
        ui.overlay.style.display = 'flex';
    }

    function closeBargainUi() {
        const ui = ensureBargainUi();
        ui.overlay.style.display = 'none';
        bargainState = null;
    }

    function evaluateOffer(offer, listPrice, floorPrice, round) {
        // Accept if offer >= list price
        if (offer >= listPrice) {
            return { decision: 'accept', acceptedPrice: listPrice };
        }
        // Accept if offer >= floor price
        if (offer >= floorPrice) {
            return { decision: 'accept', acceptedPrice: offer };
        }
        const maxRounds = 3; // total offer attempts allowed before final counter
        // If rounds remaining, propose a counter between offer and list price, but not below floor
        const counter = Math.max(floorPrice, Math.round((offer + listPrice) / 2));
        if (round < maxRounds - 1) {
            return { decision: 'counter', counterPrice: counter };
        }
        // Final counter at the seller's floor price
        return { decision: 'final-counter', counterPrice: floorPrice };
    }
});

// Retain existing function for potential login modal usage
function showmodel(){
    document.querySelector('.loginfrom').classList.add('showloginfrom');
}
