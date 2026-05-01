import { publicSupabase } from "../../lib/supabase";

/**
 * Institutional Notification Engine (v1.24)
 * Queue-Driven Architecture for external scale.
 * Admissions are strictly audited.
 */

export type NotifyPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type NotifyChannel = 'WHATSAPP' | 'TELEGRAM' | 'EMAIL';

interface NotifyPayload {
  recipient: string;
  channel?: NotifyChannel;
  priority?: NotifyPriority;
  content: {
    message: string;
    user_name: string;
    lead_score?: number;
    action_link?: string;
  };
}

export const notificationEngine = {
  /**
   * Enqueues a notification for asynchronous background sending.
   * Logic: Never send directly. Always enqueue first (CEO Rule).
   */
  enqueue: async (payload: NotifyPayload) => {
    const priority = payload.priority || 'MEDIUM';
    const channel = payload.channel || 'WHATSAPP';

    const queueRecord = {
      recipient: payload.recipient,
      channel,
      priority,
      payload: payload.content,
      status: 'PENDING'
    };

    const { data, error } = await publicSupabase
      .from('notification_queue')
      .insert([queueRecord])
      .select()
      .single();

    if (error) {
      console.warn(`[CRM] Notification Queue Drop:`, error.message);
      return;
    }

    // Processing trigger: for CRITICAL/HIGH notifications, we attempt immediate pulse.
    if (priority === 'CRITICAL' || priority === 'HIGH') {
      notificationEngine.process(data.id).catch();
    }
  },

  /**
   * Process a queued notification.
   */
  process: async (queueId: string) => {
    const { data: item } = await publicSupabase
      .from('notification_queue')
      .select('id, recipient, channel, payload, status, attempts')
      .eq('id', queueId)
      .single();

    if (item?.status !== 'PENDING') return;

    try {
      // Channel-specific logic (currently deep-link generation for WhatsApp)
      if (item.channel === 'WHATSAPP') {
        const payload = item.payload;
        // const msg = encodeURIComponent(
        //   `*IFX TRADES ALERT*: ${payload.message}\n\n` +
        //   `User: ${payload.user_name}\n` +
        //   `Score: ${payload.lead_score || 'N/A'}\n` +
        //   `Action: ${payload.action_link}`
        // );
        // WhatsApp API Trigger or Deep-link (Admin view)
        // console.log(`[WHATSAPP_PULSE]: https://wa.me/${item.recipient}?text=${msg}`);
      }

      await publicSupabase
        .from('notification_queue')
        .update({ status: 'SENT', sent_at: new Date().toISOString() })
        .eq('id', queueId);
        
    } catch (err) {
      console.error(`[CRM] Notification Failure (${queueId}):`, err);
      await publicSupabase
        .from('notification_queue')
        .update({ status: 'FAILED', attempts: (item.attempts || 0) + 1 })
        .eq('id', queueId);
    }
  }
};
