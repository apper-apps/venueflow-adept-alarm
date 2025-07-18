import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Seat from "@/components/molecules/Seat";
import { toast } from "react-toastify";

const TicketPurchaseFlow = ({ event, seatMap, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [processing, setProcessing] = useState(false);

  const handleSeatSelect = (seat) => {
    if (seat.status === "occupied") return;

    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else if (prev.length < 8) { // Max 8 seats per purchase
        return [...prev, seat];
      } else {
        toast.warning("Maximum 8 seats per purchase");
        return prev;
      }
    });
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const handlePurchase = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate tickets
      const tickets = selectedSeats.map(seat => ({
        id: Date.now() + Math.random(),
        eventId: event.Id,
        seatId: seat.id,
        qrCode: `QR_${Date.now()}_${seat.id}`,
        customerInfo,
        purchaseDate: new Date().toISOString(),
        price: seat.price
      }));

      toast.success("Tickets purchased successfully!");
      onComplete?.(tickets);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const isFormValid = () => {
    return customerInfo.firstName && customerInfo.lastName && customerInfo.email && selectedSeats.length > 0;
  };

  if (step === 1) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Select Your Seats</h2>
          <p className="text-gray-400 mb-6">Choose up to 8 seats for {event.name}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative w-full h-96 bg-gray-900 border border-gray-600 rounded-lg overflow-auto">
                {seatMap?.seats?.map((seat) => (
                  <div
                    key={seat.id}
                    className="absolute"
                    style={{ left: seat.x, top: seat.y }}
                  >
                    <Seat
                      seat={seat}
                      isSelected={selectedSeats.find(s => s.id === seat.id)}
                      onSelect={handleSeatSelect}
                      disabled={seat.status === "occupied"}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Card className="p-4">
                <h3 className="font-semibold text-white mb-4">Selected Seats</h3>
                {selectedSeats.length === 0 ? (
                  <p className="text-gray-400 text-sm">No seats selected</p>
                ) : (
                  <div className="space-y-2">
                    {selectedSeats.map((seat) => (
                      <div key={seat.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{seat.row}-{seat.number}</span>
                        <span className="text-accent-400">${seat.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-600 pt-2 mt-4">
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-white">Total:</span>
                        <span className="text-accent-400">${calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button
                  variant="primary"
                  className="w-full mt-4"
                  onClick={() => setStep(2)}
                  disabled={selectedSeats.length === 0}
                >
                  Continue to Checkout
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(1)}
            className="mr-4"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold text-white">Checkout</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={customerInfo.firstName}
                  onChange={(e) => handleCustomerInfoChange("firstName", e.target.value)}
                  placeholder="John"
                />
                <Input
                  label="Last Name"
                  value={customerInfo.lastName}
                  onChange={(e) => handleCustomerInfoChange("lastName", e.target.value)}
                  placeholder="Doe"
                />
              </div>
              <Input
                label="Email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleCustomerInfoChange("email", e.target.value)}
                placeholder="john.doe@example.com"
              />
              <Input
                label="Phone"
                value={customerInfo.phone}
                onChange={(e) => handleCustomerInfoChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
            <Card className="p-4 bg-gray-800">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Event:</span>
                  <span className="text-white">{event.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Seats:</span>
                  <span className="text-white">{selectedSeats.length}</span>
                </div>
                {selectedSeats.map((seat) => (
                  <div key={seat.id} className="flex justify-between text-sm">
                    <span className="text-gray-400">{seat.row}-{seat.number}</span>
                    <span className="text-white">${seat.price}</span>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total:</span>
                    <span className="text-accent-400">${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="accent"
                className="w-full mt-6"
                onClick={handlePurchase}
                disabled={!isFormValid() || processing}
              >
                {processing ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="CreditCard" className="w-4 h-4 mr-2" />
                    Complete Purchase
                  </>
                )}
              </Button>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TicketPurchaseFlow;