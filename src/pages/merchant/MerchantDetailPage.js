import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";

const MerchantDetails = () => {
  const router = useRouter();
  const { merchantId } = router.query;
  const [salesByMonth, setSalesByMonth] = useState([]);
  const [salesByMethod, setSalesByMethod] = useState([]);

  useEffect(() => {
    const fetchMerchantSales = async () => {
      if (!merchantId) return;

      // Monthly sales
      const { data: monthlySales } = await supabase
        .from("merchant_sales")
        .select("SUM(amount) AS total_sales, EXTRACT(MONTH FROM sale_date) AS month")
        .eq("merchant_id", merchantId)
        .group("month");

      setSalesByMonth(monthlySales);

      // Sales by payment method
      const { data: methodSales } = await supabase
        .from("merchant_sales")
        .select("SUM(amount) AS total_sales, payment_method")
        .eq("merchant_id", merchantId)
        .group("payment_method");

      setSalesByMethod(methodSales);
    };

    fetchMerchantSales();
  }, [merchantId]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Merchant Details</h1>

      <h2 className="text-xl mt-4">Monthly Sales</h2>
      <Table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {salesByMonth.map((sale, index) => (
            <tr key={index}>
              <td>{sale.month}</td>
              <td>${sale.total_sales}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="text-xl mt-4">Sales by Payment Method</h2>
      <Table>
        <thead>
          <tr>
            <th>Payment Method</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {salesByMethod.map((sale, index) => (
            <tr key={index}>
              <td>{sale.payment_method}</td>
              <td>${sale.total_sales}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MerchantDetails;
