import './pre-start'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';


// Start the server
const port = Number(process.env.PORT || 7000);
app.listen(port, () => {
    logger.info('Listening on http://localhost:' + port);
});
