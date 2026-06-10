import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { LicenseService } from "../services/licenseService";
import { config, logger } from "../config";

export const LicenseController = {
  /**
   * Validates and binds MT5 bot licenses to specific accounts and hardware.
   */
  validateLicense: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { license_key, account_id, hardware_id } = req.body;
      
      if (!license_key || !account_id || !hardware_id) {
        return res.status(400).json({ error: "Missing mandatory validation parameters" });
      }

      const result = await LicenseService.validate(license_key, account_id, hardware_id);
      
      if (!result.valid) {
        return res.status(403).json({ 
          valid: false, 
          error: result.error || "License verification denied" 
        });
      }
      
      const token = jwt.sign(
        { key: license_key, account_id }, 
        config.jwtSecret, 
        { expiresIn: "1h" }
      );
      
      res.json({ 
        validation_token: token, 
        valid_until: result.expires_at,
        status: "authenticated"
      });
    } catch (err: any) {
      logger.error({ err: err.message }, "LicenseController.validateLicense Failure");
      next(err);
    }
  }
};
