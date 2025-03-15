import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
async function sendInvoiceReminders() {
    const { data: merchants } = await supabase.from('merchants').select('id, settings(auto_reminders, sms_notifications, reminder_frequency)');
  
    for (const merchant of merchants) {
      if (!merchant.settings?.auto_reminders) continue; // Skip if disabled
  
      const { data: overdueInvoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('status', 'Overdue')
        .gt('due_date', new Date())
        .eq('merchant_id', merchant.id);
  
      for (const invoice of overdueInvoices) {
        const reminderFrequency = merchant.settings?.reminder_frequency;
  
        const shouldSendReminder = shouldSendBasedOnFrequency(reminderFrequency, invoice.issue_date);
        if (!shouldSendReminder) continue;
  
        // Send email reminder
        await sendEmail(invoice.customer_email, `Reminder: Invoice ${invoice.id} is overdue`, 'Please make payment...');
  
        if (merchant.settings?.sms_notifications) {
          // Send SMS reminder
          await client.messages.create({
            body: `Reminder: Invoice ${invoice.id} is overdue. Please make payment.`,
            from: TWILIO_PHONE_NUMBER,
            to: merchant.phone,
          });
        }
  
        // Log the reminder
        await supabase.from('invoice_reminders').insert([{ invoice_id: invoice.id }]);
      }
    }
  }
  
  function shouldSendBasedOnFrequency(frequency, issueDate){
    const now = new Date();
    const lastReminderDate = new Date(issueDate);
  
    switch (frequency) {
      case 'daily':
        return now.getDate() !== lastReminderDate.getDate(); // Ensure daily reminders
      case 'weekly':
        return now.getWeek() !== lastReminderDate.getWeek(); // Weekly reminders
      case 'monthly':
        return now.getMonth() !== lastReminderDate.getMonth(); // Monthly reminders
      default:
        return false;
    }
  }
  

export default supabase;
