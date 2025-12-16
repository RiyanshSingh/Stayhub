import app from '../server/index.js';

export default function handler(req, res) {
    // Vercel/Webpack sometimes wraps the default export in another default property
    const expressApp = app.default || app;

    if (typeof expressApp === 'function') {
        return expressApp(req, res);
    }

    console.error("Express App is not a function:", typeof expressApp, expressApp);
    res.status(500).json({ error: "Server Initialization Failed" });
}
