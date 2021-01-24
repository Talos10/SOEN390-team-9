import { Router } from 'express';

// Init router and path
const router = Router();

router.get( '/', ( req, res ) => {
    res.send( 'Backend is running' );
} );

// Export the base-router
export default router;
