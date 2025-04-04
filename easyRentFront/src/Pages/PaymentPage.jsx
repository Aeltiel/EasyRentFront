import { useState } from "react";
import Nav from "../components/Nav";
import PaymentForm from "../components/PaymentForm";
import PaymentList from "../components/PaymentList";

function PaymentPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handlePaymentAdded = () => {
    // Trigger a refresh of the payment list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="w-full">
      <div className="bg-white mb-2 shadow-lg rounded-lg">
        <Nav />
      </div>
      
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Gestion des paiements</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <PaymentForm onPaymentAdded={handlePaymentAdded} />
          </div>
          
          <div className="md:col-span-2">
            <PaymentList onRefresh={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
