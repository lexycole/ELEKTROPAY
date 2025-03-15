import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { invoiceId, message } = req.body;

    // Process sending notification logic
    res.status(200).json({ message: `Reminder sent for invoice ${invoiceId}` });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
