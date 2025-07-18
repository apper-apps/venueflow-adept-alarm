import React from "react";
import Layout from "@/components/organisms/Layout";
import QRScanner from "@/components/organisms/QRScanner";

const ScannerPage = () => {
  return (
    <Layout title="QR Scanner" subtitle="Scan tickets for event entry validation">
      <QRScanner />
    </Layout>
  );
};

export default ScannerPage;