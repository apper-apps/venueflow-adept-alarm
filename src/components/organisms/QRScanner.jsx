import React, { useState, useRef, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const videoRef = useRef(null);

  const mockTickets = [
    { qrCode: "QR_1234567890_1", eventName: "Rock Concert", seatInfo: "A-12", status: "valid" },
    { qrCode: "QR_1234567890_2", eventName: "Jazz Night", seatInfo: "B-5", status: "used" },
    { qrCode: "QR_1234567890_3", eventName: "Comedy Show", seatInfo: "C-8", status: "valid" }
  ];

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setScanResult(null);
      
      // Simulate camera access (in real app, use getUserMedia)
      toast.info("Camera activated - Scan QR code");
      
      // Simulate scanning after 3 seconds
      setTimeout(() => {
        simulateScan();
      }, 3000);
    } catch (error) {
      toast.error("Failed to access camera");
      setIsScanning(false);
    }
  };

  const simulateScan = () => {
    // Simulate scanning a random QR code
    const randomTicket = mockTickets[Math.floor(Math.random() * mockTickets.length)];
    const scanTime = new Date().toISOString();
    
    const result = {
      qrCode: randomTicket.qrCode,
      ticket: randomTicket,
      scannedAt: scanTime,
      scanId: Date.now()
    };

    setScanResult(result);
    setScanHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 scans
    setIsScanning(false);

    // Show toast based on result
    if (randomTicket.status === "valid") {
      toast.success("Valid ticket - Entry granted");
    } else if (randomTicket.status === "used") {
      toast.error("Ticket already used");
    } else {
      toast.error("Invalid ticket");
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanResult(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "valid": return "success";
      case "used": return "warning";
      case "invalid": return "danger";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "valid": return "CheckCircle";
      case "used": return "AlertCircle";
      case "invalid": return "XCircle";
      default: return "Circle";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">QR Code Scanner</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative">
              <div className="w-full h-64 bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                {isScanning ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white">Scanning for QR code...</p>
                    <div className="absolute inset-4 border-2 border-primary-500 rounded-lg">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary-500"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary-500"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary-500"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary-500"></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ApperIcon name="QrCode" className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Position QR code within the frame</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4 mt-4">
              <Button
                variant="primary"
                onClick={startScanning}
                disabled={isScanning}
                className="flex-1"
              >
                {isScanning ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Camera" className="w-4 h-4 mr-2" />
                    Start Scan
                  </>
                )}
              </Button>
              
              {isScanning && (
                <Button variant="secondary" onClick={stopScanning}>
                  <ApperIcon name="Square" className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              )}
            </div>
          </div>

          <div>
            {scanResult && (
              <Card className="p-4 bg-gray-800">
                <h3 className="font-semibold text-white mb-4 flex items-center">
                  <ApperIcon name={getStatusIcon(scanResult.ticket.status)} className="w-5 h-5 mr-2" />
                  Scan Result
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status:</span>
                    <Badge variant={getStatusColor(scanResult.ticket.status)}>
                      {scanResult.ticket.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Event:</span>
                    <span className="text-white">{scanResult.ticket.eventName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Seat:</span>
                    <span className="text-white">{scanResult.ticket.seatInfo}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">QR Code:</span>
                    <span className="text-white text-xs font-mono">{scanResult.qrCode}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Scanned:</span>
                    <span className="text-white text-xs">{new Date(scanResult.scannedAt).toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Scans</h3>
        
        {scanHistory.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="History" className="w-12 h-12 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">No scans yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scanHistory.map((scan) => (
              <div key={scan.scanId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ApperIcon name={getStatusIcon(scan.ticket.status)} className="w-5 h-5" />
                  <div>
                    <p className="text-white font-medium">{scan.ticket.eventName}</p>
                    <p className="text-gray-400 text-sm">Seat {scan.ticket.seatInfo}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant={getStatusColor(scan.ticket.status)} className="mb-1">
                    {scan.ticket.status}
                  </Badge>
                  <p className="text-gray-400 text-xs">{new Date(scan.scannedAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default QRScanner;