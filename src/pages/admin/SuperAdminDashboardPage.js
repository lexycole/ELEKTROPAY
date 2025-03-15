import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { Table, Input, Select, Button, Card, CardHeader, CardContent, CardFooter } from "@shadcn/ui";

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const paymentMethods = ["All", "Credit Card", "PayPal", "Bank Transfer"]; // Add available methods as needed

  useEffect(() => {
    const fetchUsersAndSales = async () => {
      const { data, error } = await supabase.from("users").select("id, name, role, email");

      if (!error) setUsers(data);
    };

    fetchUsersAndSales();
  }, [selectedPaymentMethod]);

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
          <p className="text-gray-600">View all users and their sales</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              placeholder="Filter by Payment Method"
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </Select>
          </div>
          <Table className="table-fixed w-full">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Total Sales (by Payment Method)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {/* Assume each user has a sales breakdown by payment method */}
                    {user.salesData?.map((sale) => (
                      <div key={sale.payment_method} className="text-sm">
                        {sale.payment_method}: ${sale.total_sales}
                      </div>
                    )) || "No Sales"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Export Sales to CSV</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
