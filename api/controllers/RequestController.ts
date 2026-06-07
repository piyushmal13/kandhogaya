import { Request, Response, NextFunction } from "express";
import { RequestService } from "../services/requestService";
import { logger } from "../config";

export const RequestController = {
  /**
   * Handles custom engineering requests from the Deep Coding Terminal.
   */
  submitDeepCoding: async (req: any, res: Response, next: NextFunction) => {
    try {
      const result = await RequestService.submitDeepCodingRequest({
        ...req.body,
        user_id: req.user?.id
      });
      res.json(result);
    } catch (err: any) {
      logger.error({ err: err.message, body: req.body }, "RequestController.submitDeepCoding Failure");
      next(err);
    }
  },

  /**
   * Handles AI CEO & SEO advisor chat sessions.
   */
  askAiAdvisor: async (req: any, res: Response, next: NextFunction) => {
    try {
      const { message, history } = req.body;
      const result = await RequestService.askAiAdvisor(message, history);
      res.json(result);
    } catch (err: any) {
      logger.error({ err: err.message, body: req.body }, "RequestController.askAiAdvisor Failure");
      next(err);
    }
  }
};

