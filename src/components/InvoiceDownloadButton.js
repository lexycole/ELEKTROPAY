import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
});

const InvoicePDF = ({ invoice }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Invoice #{invoice.id}</Text>
        <Text>Customer: {invoice.customer_name}</Text>
        <Text>Email: {invoice.customer_email}</Text>
        <Text>Amount: ${invoice.total_amount}</Text>
        <Text>Status: {invoice.status}</Text>
      </View>
    </Page>
  </Document>
);

export default function InvoiceDownloadButton({ invoice }) {
  return (
    <PDFDownloadLink document={<InvoicePDF invoice={invoice} />} fileName={`invoice-${invoice.id}.pdf`}>
      {({ loading }) => (loading ? 'Generating PDF...' : 'Download Invoice')}
    </PDFDownloadLink>
  );
}
