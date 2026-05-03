import { Request, Response } from "express";
import { config } from "../config";

export const SystemController = {
  getHealth: (req: Request, res: Response) => {
    res.json({ status: "operational", node: "sovereign_01" });
  },

  getConfig: (req: Request, res: Response) => {
    res.json({ 
      supabaseUrl: config.supabaseUrl, 
      supabaseAnonKey: config.supabaseAnonKey 
    });
  }
};
