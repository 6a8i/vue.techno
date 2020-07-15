const vm = new Vue(
    {
        el: "#app",
        data: {
            products: [],
            product: false,
            cart: [],
            cartActive: false,
            mensageAlert: "Item add to the cart!",
            alertActive: false
        },
        filters: {
            priceFormat(value) {
                return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
            }
        },
        computed: {
            totalPriceInCart() {
                let total = 0;
                if (this.cart.length) {
                    this.cart.forEach(item => {
                        total += item.price;
                    })
                }
                return total;
            }
        },
        methods: {
            fetchProducts() {
                fetch("./api/produtos.json")
                    .then(r => r.json())
                    .then(r => {
                        this.products = r;
                    });
            },
            fetchProduct(type) {
                fetch(`./api/produtos/${type}/dados.json`)
                    .then(r => r.json())
                    .then(r => {
                        this.product = r;
                    });
            },
            openModal(type) {
                this.fetchProduct(type);
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            },
            closeModal({ target, currentTarget }) {
                if (target == currentTarget) {
                    this.product = false;
                }
            },
            closeCart({ target, currentTarget }) {
                if (target == currentTarget) {
                    this.cartActive = false;
                }
            },
            addToCart() {
                this.product.stock--;
                const { id, name, price } = this.product;
                this.cart.push({ id, name, price });
                this.alert(`${name} added to the cart!`);
            },
            removeFromCart(index) {
                this.cart.splice(index, 1);
            },
            checkLocalStorage() {
                if (window.localStorage.cart)
                    this.cart = JSON.parse(window.localStorage.cart);
            },
            alert(mensage) {
                this.mensageAlert = mensage;
                this.alertActive = true;
                setTimeout(() => {
                    this.alertActive = false;
                }, 1500)
            },
            router() {
                const hash = document.location.hash;
                if (hash)
                    this.fetchProduct(hash.replace("#", ""));
            },
            checkStock() {
                const itens = this.cart.filter(({ id }) => id === this.product.id);
                this.product.stock -= itens.length;
            }
        },
        watch: {
            product() {
                document.title = this.product.name || "Techno";
                const hash = this.product.type || "";
                history.pushState(null, null, `#${hash}`);
                this.checkStock();
            },
            cart() {
                window.localStorage.cart = JSON.stringify(this.cart);
            }
        },
        created() {
            this.fetchProducts();
            this.router();
            this.checkLocalStorage();
        }
    }
)