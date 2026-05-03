import { supabaseAdmin, safeQuery } from "../utils/supabase";
import { logger } from "../config";

export const LicenseService = {
  /**
   * Validates an MT5 bot license.
   * Hardens the binding to account_id and hardware_id.
   */
  validate: async (key: string, accountId: string, hwid: string) => {
    const context = `LicenseService.validate(${key})`;
    
    try {
      const license = await safeQuery<any>(
        () => supabaseAdmin
          .from('bot_licenses')
          .select('*')
          .eq('license_key', key)
          .eq('is_active', true)
          .single(),
        context
      );

      if (!license) {
        return { valid: false, error: "Invalid or inactive license" };
      }

      // First time activation logic
      if (!license.account_id) {
        logger.info({ key, accountId, hwid }, "Binding license to account and hardware");
        await safeQuery(
          () => supabaseAdmin
            .from('bot_licenses')
            .update({ 
              account_id: accountId, 
              hardware_id: hwid, 
              last_validated_at: new Date().toISOString() 
            })
            .eq('id', license.id),
          `${context}:activation`
        );
        return { valid: true, expires_at: license.expires_at };
      }

      // Enforcement of existing binding
      if (license.account_id !== accountId || license.hardware_id !== hwid) {
        logger.warn({ key, accountId, hwid, expected: license.account_id }, "License binding mismatch detected");
        return { valid: false, error: "License bound to another device/account" };
      }

      // Heartbeat update
      await safeQuery(
        () => supabaseAdmin
          .from('bot_licenses')
          .update({ last_validated_at: new Date().toISOString() })
          .eq('id', license.id),
        `${context}:heartbeat`
      );

      return { valid: true, expires_at: license.expires_at };
    } catch (err: any) {
      logger.error({ err: err.message, key }, "License validation service exception");
      return { valid: false, error: "Infrastructure verification failed" };
    }
  }
};
