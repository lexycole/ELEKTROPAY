// pages/reseller/dashboard.tsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const ResellerDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [merchantData, setMerchantData] = useState<any[]>([]);

  useEffect(() => {
    const fetchMerchants = async () => {
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('reseller_id', user?.id); // Filter by reseller ID

      if (error) console.error(error);
      else setMerchantData(data || []);
    };

    if (user) fetchMerchants();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Reseller Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      
      <h2>Your Merchants</h2>
      <table>
        <thead>
          <tr>
            <th>Merchant Name</th>
            <th>Total Sales</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {merchantData.map((merchant) => (
            <tr key={merchant.id}>
              <td>{merchant.name}</td>
              <td>{merchant.total_sales}</td>
              <td>{merchant.payment_method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResellerDashboard;


// import { useEffect, useState } from "react";
// import supabase from "../../utils/supabase";
// import { Table, Button, Input, Card, CardHeader, CardContent, CardFooter, DatePicker } from "@shadcn/ui";
// import Link from "next/link";

// const ResellerDashboard = () => {
//   const [merchants, setMerchants] = useState([]);
//   const [sales, setSales] = useState({});
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   const generateCSVData = () => {
//     let csvData = [["Merchant Name", "Payment Method", "Total Sales"]];

//     merchants.forEach((merchant) => {
//       const merchantSales = sales[merchant.id] || [];
//       merchantSales.forEach((sale) => {
//         csvData.push([
//           merchant.name,
//           sale.payment_method,
//           sale.total_sales,
//         ]);
//       });
//     });

//     return csvData;
//   };

//   useEffect(() => {
//     const fetchSalesData = async () => {
//       let query = supabase
//         .from("merchant_sales")
//         .select("merchant_id, payment_method, SUM(amount) AS total_sales")
//         .group("merchant_id, payment_method");

//       if (startDate) {
//         query = query.gte("sale_date", startDate);
//       }
//       if (endDate) {
//         query = query.lte("sale_date", endDate);
//       }

//       const { data, error } = await query;

//       if (!error) {
//         const salesData = data.reduce((acc, sale) => {
//           if (!acc[sale.merchant_id]) acc[sale.merchant_id] = [];
//           acc[sale.merchant_id].push(sale);
//           return acc;
//         }, {});
//         setSales(salesData);
//       }
//     };

//     fetchSalesData();
//   }, [startDate, endDate]);

//   useEffect(() => {
//     const fetchMerchants = async () => {
//       const { data, error } = await supabase.from("merchants").select("id, name, email");

//       if (!error) setMerchants(data);
//     };

//     fetchMerchants();
//   }, [startDate, endDate]);

//   const handleAddMerchant = async () => {
//     const { data, error } = await supabase
//       .from("merchants")
//       .insert([{ name: merchantName, email: merchantEmail }]);

//     if (!error) {
//       setMerchants([...merchants, data[0]]);
//       setMerchantName("");
//       setMerchantEmail("");
//     }
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">Reseller Dashboard</h1>

//       {/* Date Filters */}
//       <div className="my-4 flex space-x-4">
//         <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} placeholderText="Start Date" />
//         <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} placeholderText="End Date" />
//         <Button onClick={() => fetchSalesData()}>Filter Sales</Button>
//       </div>

//       {/* Sales Table */}
//       <Table>
//         <thead>
//           <tr>
//             <th>Merchant Name</th>
//             <th>Total Sales (by Payment Method)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {merchants.map((merchant) => (
//             <tr key={merchant.id}>
//               <td>{merchant.name}</td>
//               <td>
//                 {sales[merchant.id]
//                   ? sales[merchant.id].map((s) => (
//                       <div key={s.payment_method}>
//                         {s.payment_method}: ${s.total_sales}
//                       </div>
//                     ))
//                   : "No Sales"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
         
//         <CSVLink data={generateCSVData()} filename="sales-data.csv">
//             <Button>Export Sales to CSV</Button>
//         </CSVLink>

//       <Table>
//       <tbody>
//         {merchants.map((merchant) => (
//           <tr key={merchant.id}>
//             <td>{merchant.name}</td>
//             <td>
//               <Link href={`/reseller/merchant/${merchant.id}`}>
//                 <Button>View Details</Button>
//               </Link>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </Table>


//     <div className="p-8 space-y-6">
//       <Card>
//         <CardHeader>
//           <h1 className="text-2xl font-bold">Reseller Dashboard</h1>
//           <p className="text-gray-600">Manage your merchants and view sales data</p>
//         </CardHeader>
//         <CardContent>
//           <div className="my-4 space-y-4">
//             <h2 className="text-xl font-semibold">Add New Merchant</h2>
//             <div className="flex space-x-4">
//               <Input
//                 placeholder="Merchant Name"
//                 value={merchantName}
//                 onChange={(e) => setMerchantName(e.target.value)}
//               />
//               <Input
//                 placeholder="Merchant Email"
//                 value={merchantEmail}
//                 onChange={(e) => setMerchantEmail(e.target.value)}
//               />
//               <Button onClick={handleAddMerchant}>Add Merchant</Button>
//             </div>
//           </div>
//           <div className="flex space-x-4 my-4">
//             <DatePicker
//               selected={startDate}
//               onChange={(date) => setStartDate(date)}
//               placeholderText="Start Date"
//             />
//             <DatePicker
//               selected={endDate}
//               onChange={(date) => setEndDate(date)}
//               placeholderText="End Date"
//             />
//             <Button onClick={() => fetchMerchants()}>Filter Sales</Button>
//           </div>
//           <Table className="w-full">
//             <thead>
//               <tr>
//                 <th>Merchant Name</th>
//                 <th>Email</th>
//                 <th>Total Sales (by Payment Method)</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {merchants.map((merchant) => (
//                 <tr key={merchant.id}>
//                   <td>{merchant.name}</td>
//                   <td>{merchant.email}</td>
//                   <td>
//                     {merchant.salesData
//                       ? merchant.salesData.map((s) => (
//                           <div key={s.payment_method} className="text-sm">
//                             {s.payment_method}: ${s.total_sales}
//                           </div>
//                         ))
//                       : "No Sales"}
//                   </td>
//                   <td>
//                     <Link href={`/reseller/merchant/${merchant.id}`}>
//                       <Button variant="link">View Details</Button>
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </CardContent>
//         <CardFooter>
//           <Button variant="outline">Export Sales to CSV</Button>
//         </CardFooter>
//       </Card>
//     </div>

//     </div>
//   );
// };

// export default ResellerDashboard;
