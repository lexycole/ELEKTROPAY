// pages/admin/dashboard.tsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const AdminDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [merchantData, setMerchantData] = useState<any[]>([]);

  useEffect(() => {
    const fetchMerchants = async () => {
      const { data, error } = await supabase
        .from('merchants')
        .select('*');

      if (error) console.error(error);
      else setMerchantData(data || []);
    };

    if (user) fetchMerchants();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Super Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      
      <h2>Merchants Overview</h2>
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

export default AdminDashboard;


// import { useEffect, useState } from "react";
// import supabase from "../../utils/supabase";
// import { Table, Button } from "@shadcn/ui";

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [sales, setSales] = useState({});

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const { data, error } = await supabase
//         .from("users")
//         .select("id, email, role");

//       if (!error) setUsers(data);
//     };

//     const fetchSalesData = async () => {
//       const { data, error } = await supabase
//         .from("sales_by_payment_method")
//         .select("user_id, payment_method, total_sales");

//       if (!error) {
//         const salesData = data.reduce((acc, sale) => {
//           if (!acc[sale.user_id]) acc[sale.user_id] = [];
//           acc[sale.user_id].push(sale);
//           return acc;
//         }, {});
//         setSales(salesData);
//       }
//     };

//     fetchUsers();
//     fetchSalesData();
//   }, []);

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
//       <Table>
//         <thead>
//           <tr>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Total Sales (by Payment Method)</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.email}</td>
//               <td>{user.role}</td>
//               <td>
//                 {sales[user.id]
//                   ? sales[user.id].map((s) => (
//                       <div key={s.payment_method}>
//                         {s.payment_method}: ${s.total_sales}
//                       </div>
//                     ))
//                   : "No Sales"}
//               </td>
//               <td>
//                 <Button>View Details</Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

// export default AdminDashboard;
