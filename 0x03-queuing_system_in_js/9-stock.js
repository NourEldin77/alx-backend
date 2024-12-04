import express from 'express';
import Redis from 'redis';

class ProductService {
    constructor() {
        this.products = [
            { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
            { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
            { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
            { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
        ];
        this.redisClient = Redis.createClient();
        this.app = express();
        this.initRoutes();
    }

    initRoutes() {
        this.app.get('/products', (req, res) => res.json(this.products));

        this.app.get('/products/:id', async (req, res) => {
            const product = this.products.find(p => p.id === parseInt(req.params.id));
            if (!product) return res.status(404).json({ status: 'Product not found' });

            const reservedStock = await this.getReservedStock(product.id);
            res.json({ ...product, currentStock: Math.max(0, product.stock - reservedStock) });
        });

        this.app.get('/reserve/:id', async (req, res) => {
            const product = this.products.find(p => p.id === parseInt(req.params.id));
            if (!product) return res.status(404).json({ status: 'Product not found' });

            const reservedStock = await this.getReservedStock(product.id);
            if (reservedStock >= product.stock) {
                return res.status(400).json({ status: 'Not enough stock', id: product.id });
            }

            await this.redisClient.set(`product.${product.id}`, reservedStock + 1);
            res.json({ status: 'Reservation confirmed', id: product.id });
        });

        this.app.listen(1245, () => console.log('Server running on port 1245'));
    }

    getReservedStock(productId) {
        return new Promise((resolve) => {
            this.redisClient.get(`product.${productId}`, (err, reply) => {
                resolve(reply ? parseInt(reply, 10) : 0);
            });
        });
    }
}

new ProductService();