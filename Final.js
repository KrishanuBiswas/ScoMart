document.addEventListener("DOMContentLoaded", function() {

    // Sample cart object to keep track of products added
    let cart = [];

    // Add event listeners to all "Add to Cart" buttons
    const buttons = document.querySelectorAll('.product button');
    buttons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            addToCart(event.target.parentElement);
            showNotification(event.target.parentElement);
            updateCartCount();
        });
    });

    function addToCart(productElement) {
        const product = {
            title: productElement.querySelector('h3').textContent,
            price: parseFloat(productElement.querySelector('p').textContent.replace('Price: $', '')),
            id: Math.random() // In a real-world scenario, each product should have a unique ID from the database
        };

        cart.push(product);
    }

    function showNotification(productElement) {
        const notification = document.createElement('div');
        notification.textContent = `${productElement.querySelector('h3').textContent} added to cart!`;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = '#3498db';
        notification.style.color = '#fff';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.1)';

        document.body.appendChild(notification);

        setTimeout(function() {
            document.body.removeChild(notification);
        }, 3000);
    }

    function updateCartCount() {
        // For simplicity, just displaying the count of products in cart on the page
        const cartCountElement = document.getElementById('cart-count');
        if (!cartCountElement) {
            const count = document.createElement('div');
            count.id = 'cart-count';
            count.textContent = `Cart: ${cart.length} items`;
            count.style.position = 'fixed';
            count.style.top = '20px';
            count.style.right = '20px';
            count.style.padding = '10px 20px';
            count.style.backgroundColor = '#fff';
            count.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.1)';
            document.body.appendChild(count);
        } else {
            cartCountElement.textContent = `Cart: ${cart.length} items`;
        }
        const buyButtons = document.querySelectorAll('.buy-btn');
buyButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        // Handle the buy action, e.g., redirect to a payment page
        window.location.href = "path-to-payment-page.html";
    });
});

    }
    

});
const bargainButtons = document.querySelectorAll('.bargain-btn');
bargainButtons.forEach(button => {
    button.addEventListener('click', function() {
    });
});
// Add click event to each button
bargainButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        // Prompt the user for their offer
        let userOffer = parseFloat(prompt("Enter your desired price:"));

        if(isNaN(userOffer)) { 
            alert("Please enter a valid price.");
            return;
        }

        // Check the offer amount
        if(userOffer < 100) {  // example threshold
            alert("Sorry, your offer is too low.");
        } else if(userOffer < 2000) {  // another example threshold
            alert("We will consider your offer. Thank you!");
        } else {
            alert("Your offer has been accepted!");
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', function() {
        searchProducts(searchBar.value.toLowerCase()); // Convert the search term to lowercase for case-insensitive search
    });

    function searchProducts(searchTerm) {
        const products = document.querySelectorAll('.product');
        
        products.forEach(function(product) {
            const title = product.querySelector('h3').textContent.toLowerCase(); // Convert product title to lowercase

            // Check if product title includes the search term
            if (title.includes(searchTerm)) {
                product.style.display = 'block'; // Show the product
            } else {
                product.style.display = 'none'; // Hide the product
            }
        });
    }
});
function showmodel(){

    document.querySelector('.loginfrom').classList.add('showloginfrom')
}
