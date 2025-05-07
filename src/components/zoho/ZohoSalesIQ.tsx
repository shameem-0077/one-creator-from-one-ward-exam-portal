"use client"

import { useEffect } from "react";

const ZohoSalesIQ: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).$zoho = (window as any).$zoho || {};
      (window as any).$zoho.salesiq = (window as any).$zoho.salesiq || { ready: function () {} };

      const script = document.createElement("script");
      script.src =
        "https://salesiq.zohopublic.in/widget?wc=siqa759e037e32867b8e02f059636f46fb24ece5e23cfe73fd8425328adca4ff516";
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return null; // No UI needed
};

export default ZohoSalesIQ;
