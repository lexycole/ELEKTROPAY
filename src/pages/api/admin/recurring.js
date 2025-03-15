// pages/api/recurring.js
import supabase from "../../utils/supabase";

export default async function handler(req, res) {
  const { user_id, plan, amount, currency } = req.body;

  const { data, error } = await supabase
    .from("subscriptions")
    .insert([{ user_id, plan, status: "active", renewal_date: new Date() }]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ data });
}
