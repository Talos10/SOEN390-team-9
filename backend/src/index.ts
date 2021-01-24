import app from '@server';
import logger from '@shared/Logger';


// Start the server
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
    logger.info('Listening on http://localhost:' + port);
});
