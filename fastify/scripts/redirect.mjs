import Fastify from 'fastify';

//
const startRedirectServer = async () => {
    const fastify = Fastify();
    fastify.all('*', (request, reply) => {
        const httpsUrl = `https://${request.headers.host}${request.url}`;
        reply
            .status(301)
            .header('Location', httpsUrl)
            .type('text/html')
            .send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0; url=${httpsUrl}" />
    <script type="text/javascript">window.location.href = "${httpsUrl}"</script>
    <title>Redirecting...</title>
</head>
<body>
    <p>Redirecting to <a href="${httpsUrl}">${httpsUrl}</a></p>
</body>
</html>`);
    });

    //
    try {
        await fastify.listen({ port: 80, host: '0.0.0.0' });
        console.log('HTTP to HTTPS redirect server is running on port 80');
    } catch (err) {
        console.error('Error starting redirect server:', err);
        process.exit(1);
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    startRedirectServer();
}

export default startRedirectServer;
