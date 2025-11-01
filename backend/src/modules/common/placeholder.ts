import { Router } from 'express';

export function createPlaceholderRouter(feature: string) {
  const router = Router();

  router.use((_req, res) =>
    res.status(501).json({
      error: `${feature} routes are not implemented yet`
    })
  );

  return router;
}
