// middleware/auth.ts
import { supabase } from "../lib/supabaseClient";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export const withAuth = (handler: NextApiHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);

  if (error || !user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user;
  return handler(req, res);
};
