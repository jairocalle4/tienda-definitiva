const express = require('express');
const cors = require('cors');
const { sql, poolPromise } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory Cache
const cache = {
    products: { data: null, lastFetch: 0 },
    categories: { data: null, lastFetch: 0 },
    config: { data: null, lastFetch: 0 },
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Routes

// GET /api/config (WhatsApp number and Company Name)
app.get('/api/config', async (req, res) => {
    try {
        const now = Date.now();
        if (cache.config.data && (now - cache.config.lastFetch < CACHE_DURATION)) {
            return res.json(cache.config.data);
        }

        const pool = await poolPromise;
        const result = await pool.request().query('SELECT TOP 1 NombreComercial, Telefono FROM ConfiguracionEmpresa');

        let configData;
        if (result.recordset.length > 0) {
            const config = result.recordset[0];
            configData = {
                appName: config.NombreComercial,
                whatsappNumber: config.Telefono ? config.Telefono.replace(/\D/g, '') : '', // Strip non-digits
            };
        } else {
            configData = { appName: 'Safari Web', whatsappNumber: '' };
        }

        cache.config = { data: configData, lastFetch: now };
        res.json(configData);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET /api/categories
app.get('/api/categories', async (req, res) => {
    try {
        const now = Date.now();
        if (cache.categories.data && (now - cache.categories.lastFetch < CACHE_DURATION)) {
            return res.json(cache.categories.data);
        }

        const pool = await poolPromise;
        const result = await pool.request().query('SELECT DISTINCT c.Id, c.Nombre FROM Categorias c JOIN Productos p ON p.CategoriaId = c.Id WHERE c.EsActivo = 1 AND p.EsActivo = 1');

        const categories = result.recordset.map(row => ({
            id: row.Id.toString(),
            name: row.Nombre || 'Sin nombre',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=60' // Placeholder as DB doesn't have cat images
        }));

        cache.categories = { data: categories, lastFetch: now };
        res.json(categories);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET /api/products
app.get('/api/products', async (req, res) => {
    try {
        const now = Date.now();
        if (cache.products.data && (now - cache.products.lastFetch < CACHE_DURATION)) {
            console.log('Serving products from cache');
            return res.json(cache.products.data);
        }

        const pool = await poolPromise;

        // Optimized Query: Get Products and Images in parallel or combined
        // For simplicity and to avoid complex mapping, we keep two queries but use the same pool connection
        const [productsResult, imagesResult] = await Promise.all([
            pool.request().query(`
                SELECT 
                    p.Id, p.Nombre, p.Descripcion, p.Precio, p.Stock, p.CategoriaId, p.UrlVideo, p.FotoUrl,
                    c.Nombre AS CategoriaNombre,
                    s.Nombre AS SubcategoriaNombre
                FROM Productos p
                LEFT JOIN Categorias c ON p.CategoriaId = c.Id
                LEFT JOIN Subcategorias s ON p.SubcategoriaId = s.Id
                WHERE p.EsActivo = 1
            `),
            pool.request().query(`
                SELECT IdProducto, UrlImagen 
                FROM ProductoImagenes
                ORDER BY Orden
            `)
        ]);

        // Map images to products with robust null handling
        const products = productsResult.recordset.map(p => {
            const productImages = imagesResult.recordset
                .filter(img => img.IdProducto === p.Id)
                .map(img => img.UrlImagen)
                .filter(img => img); // Filter out null/empty strings from image list

            // Ensure at least the main photo is there if no gallery images
            let images = [];
            if (productImages.length > 0) {
                images = productImages;
            } else if (p.FotoUrl) {
                images = [p.FotoUrl];
            } else {
                images = ['https://via.placeholder.com/300?text=No+Image'];
            }

            return {
                id: (p.Id || '').toString(),
                name: p.Nombre || 'Sin Nombre',
                description: p.Descripcion || '',
                price: typeof p.Precio === 'number' ? p.Precio : 0,
                stock: typeof p.Stock === 'number' ? p.Stock : 0,
                categoryId: (p.CategoriaId || '').toString(),
                categoryName: p.CategoriaNombre || '',
                subCategoryName: p.SubcategoriaNombre || '',
                images: images,
                videoUrl: p.UrlVideo || null
            };
        });

        cache.products = { data: products, lastFetch: now };
        res.json(products);
    } catch (err) {
        console.error('Error in /api/products:', err);
        res.status(500).send(err.message);
    }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('Id', sql.Int, id)
            .query(`
        SELECT 
            p.Id, p.Nombre, p.Descripcion, p.Precio, p.Stock, p.CategoriaId, p.UrlVideo, p.FotoUrl,
            c.Nombre AS CategoriaNombre,
            s.Nombre AS SubcategoriaNombre
        FROM Productos p
        LEFT JOIN Categorias c ON p.CategoriaId = c.Id
        LEFT JOIN Subcategorias s ON p.SubcategoriaId = s.Id
        WHERE p.Id = @Id
      `);

        if (result.recordset.length === 0) {
            return res.status(404).send('Product not found');
        }

        const p = result.recordset[0];

        const imagesResult = await pool.request()
            .input('IdProdukt', sql.Int, id)
            .query('SELECT UrlImagen FROM ProductoImagenes WHERE IdProducto = @IdProdukt ORDER BY Orden');

        const productImages = imagesResult.recordset
            .map(img => img.UrlImagen)
            .filter(img => img);

        let images = [];
        if (productImages.length > 0) {
            images = productImages;
        } else if (p.FotoUrl) {
            images = [p.FotoUrl];
        } else {
            images = ['https://via.placeholder.com/300?text=No+Image'];
        }

        res.json({
            id: (p.Id || '').toString(),
            name: p.Nombre || 'Sin Nombre',
            description: p.Descripcion || '',
            price: typeof p.Precio === 'number' ? p.Precio : 0,
            stock: typeof p.Stock === 'number' ? p.Stock : 0,
            categoryId: (p.CategoriaId || '').toString(),
            categoryName: p.CategoriaNombre || '',
            subCategoryName: p.SubcategoriaNombre || '',
            images: images,
            videoUrl: p.UrlVideo || null
        });

    } catch (err) {
        console.error('Error in /api/products/:id:', err);
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
