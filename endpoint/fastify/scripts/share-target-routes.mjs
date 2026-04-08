/**
 * Share Target Routes Module
 *
 * Handles PWA share target functionality for receiving shared content
 */

export async function registerShareTargetRoutes(fastify, options = {}) {
    // ========================================================================
    // SHARE TARGET ROUTES (PWA share handling)
    // ========================================================================

    // Share target POST handler (when service worker isn't available)
    // This provides fallback handling for share target when SW is not loaded
    fastify.post('/share-target', async (req, reply) => {
        console.log('[ShareTarget] POST received at server level');

        try {
            // Extract data from multipart form or body
            let shareData = { title: '', text: '', url: '', files: [], timestamp: Date.now() };

            if (req.isMultipart?.()) {
                // Handle multipart form data
                const parts = req.parts?.();
                if (parts) {
                    for await (const part of parts) {
                        if (part.type === 'file') {
                            // Store file info (actual processing done client-side)
                            shareData.files.push({
                                filename: part.filename,
                                mimetype: part.mimetype,
                                size: part.file?.bytesRead || 0
                            });
                        } else if (part.type === 'field') {
                            if (part.fieldname === 'title') shareData.title = part.value || '';
                            if (part.fieldname === 'text') shareData.text = part.value || '';
                            if (part.fieldname === 'url') shareData.url = part.value || '';
                        }
                    }
                }
            } else if (req.body) {
                // Handle JSON or form-urlencoded body
                const body = req.body;
                shareData.title = body.title || '';
                shareData.text = body.text || '';
                shareData.url = body.url || '';
            }

            console.log('[ShareTarget] Processed data:', {
                title: shareData.title,
                text: shareData.text?.substring?.(0, 50),
                url: shareData.url,
                filesCount: shareData.files?.length || 0
            });

            // Encode share data for query string
            const params = new URLSearchParams();
            params.set('shared', '1');
            if (shareData.title) params.set('title', shareData.title);
            if (shareData.text) params.set('text', shareData.text);
            if (shareData.url) params.set('sharedUrl', shareData.url);

            // Redirect to app with share data in query
            return reply.redirect(`/?${params.toString()}`);
        } catch (err) {
            console.error('[ShareTarget] Error handling share:', err);
            return reply.redirect('/?error=share_failed');
        }
    });

    // Share target with underscore (alternative URL)
    fastify.post('/share_target', async (req, reply) => {
        // Redirect to canonical share-target handler
        return reply.redirect(307, '/share-target');
    });

    // Share target GET handlers (for direct navigation)
    fastify.get('/share-target', async (req, reply) => {
        console.log('[ShareTarget] GET request - serving SPA');
        // Import the SPA serving function dynamically to avoid circular imports
        const { serveIndexHtml } = await import('./spa-routing.mjs');
        return serveIndexHtml(req, reply);
    });

    fastify.get('/share_target', async (req, reply) => {
        return reply.redirect('/?shared=test');
    });
}