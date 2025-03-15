// pages/merchant/invoice-dashboard.js

import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { Table, Button, Input, Card, CardHeader, CardContent, Badge, DatePicker } from "@shadcn/ui";

const InvoiceDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [issueDate, setIssueDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([{ description: "", quantity: 1, unit_price: 0 }]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("id, customer_name, total_amount, issue_date, due_date, status");

      if (!error) setInvoices(data);
    };

    fetchInvoices();
  }, []);

  const handleAddInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { description: "", quantity: 1, unit_price: 0 }]);
  };

  const handleCreateInvoice = async () => {
    const totalAmount = invoiceItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const { data, error } = await supabase
      .from("invoices")
      .insert([{ customer_name: customerName, customer_email: customerEmail, issue_date: issueDate, due_date: dueDate, status: "Pending", total_amount: totalAmount }]);

    if (!error) {
      setInvoices([...invoices, data[0]]);
      setCustomerName("");
      setCustomerEmail("");
      setIssueDate(null);
      setDueDate(null);
      setInvoiceItems([{ description: "", quantity: 1, unit_price: 0 }]);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Invoice Dashboard</h1>
          <p className="text-gray-600">Create and manage your invoices</p>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold my-4">Recent Invoices</h2>
          <Table className="w-full">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Total Amount</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.customer_name}</td>
                  <td>${invoice.total_amount.toFixed(2)}</td>
                  <td>{invoice.issue_date}</td>
                  <td>{invoice.due_date}</td>
                  <td>
                    <Badge variant={invoice.status === "Paid" ? "success" : invoice.status === "Overdue" ? "danger" : "warning"}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="link">View</Button>
                    <Button variant="link">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Create New Invoice</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              placeholder="Customer Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <DatePicker
              selected={issueDate}
              onChange={(date) => setIssueDate(date)}
              placeholderText="Issue Date"
            />
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              placeholderText="Due Date"
            />
          </div>
          <h3 className="font-semibold mb-2">Invoice Items</h3>
          {invoiceItems.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-2">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => {
                  const newItems = [...invoiceItems];
                  newItems[index].description = e.target.value;
                  setInvoiceItems(newItems);
                }}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => {
                  const newItems = [...invoiceItems];
                  newItems[index].quantity = e.target.value;
                  setInvoiceItems(newItems);
                }}
              />
              <Input
                type="number"
                placeholder="Unit Price"
                value={item.unit_price}
                onChange={(e) => {
                  const newItems = [...invoiceItems];
                  newItems[index].unit_price = e.target.value;
                  setInvoiceItems(newItems);
                }}
              />
            </div>
          ))}
          <Button onClick={handleAddInvoiceItem} variant="outline" className="mb-4">
            Add Item
          </Button>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateInvoice} variant="primary">
            Create Invoice
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvoiceDashboard;
