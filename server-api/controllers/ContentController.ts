import { Request, Response, NextFunction } from "express";
import { ContentService } from "../services/contentService";
import { logger } from "../config";

export const ContentController = {
  /**
   * Fetches published institutional research or blogs.
   */
  getPosts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, page, limit, search } = req.query;
      const posts = await ContentService.getPosts(
        type as string || 'blog',
        Number(page || 1),
        Number(limit || 9),
        search as string || ""
      );
      res.json(posts);
    } catch (err: any) {
      logger.error({ err: err.message, query: req.query }, "ContentController.getPosts Failure");
      next(err);
    }
  },

  /**
   * Fetches a single research post by its unique sovereign slug.
   */
  getPostBySlug: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const post = await ContentService.getPostBySlug(slug);
      if (!post) return res.status(404).json({ error: "Intelligence post not found" });
      res.json(post);
    } catch (err: any) {
      logger.error({ err: err.message, slug: req.params.slug }, "ContentController.getPostBySlug Failure");
      next(err);
    }
  },

  /**
   * Fetches upcoming and past institutional webinars.
   */
  getWebinars: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const webinars = await ContentService.getWebinars();
      res.json(webinars);
    } catch (err: any) {
      logger.error({ err: err.message }, "ContentController.getWebinars Failure");
      next(err);
    }
  },

  /**
   * Registers a user for a webinar.
   */
  registerWebinar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { webinar_id, name, email } = req.body;
      const result = await ContentService.registerForWebinar(webinar_id, name, email);
      res.json(result);
    } catch (err: any) {
      logger.error({ err: err.message, body: req.body }, "ContentController.registerWebinar Failure");
      next(err);
    }
  },

  /**
   * Fetches the institutional product catalog.
   */
  getProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await ContentService.getProducts();
      res.json(products);
    } catch (err: any) {
      logger.error({ err: err.message }, "ContentController.getProducts Failure");
      next(err);
    }
  }
};
