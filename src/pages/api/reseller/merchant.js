// pages/api/reseller/merchant.js
import supabase from "../../../utils/supabase";

export default async function handler(req, res) {
  const { merchantId } = req.body;

  // Only allow reseller role
  const { user } = req.user; // Assuming you have middleware that attaches `user` to the request
  if (user.role !== "reseller") {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Example action: Delete a merchant
  if (req.method === "DELETE") {
    const { error } = await supabase
      .from("merchants")
      .delete()
      .eq("id", merchantId)
      .eq("reseller_id", user.id);

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: "Merchant deleted successfully" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
