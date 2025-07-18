import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    companyName: "VenueFlow Demo",
    email: "admin@venueflow.com",
    timezone: "America/New_York",
    currency: "USD",
    language: "en",
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    payment: {
      stripeEnabled: true,
      paypalEnabled: false
    }
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  const handleExportData = () => {
    toast.info("Data export initiated. You'll receive an email when ready.");
  };

  const handleTestWebhook = () => {
    toast.success("Webhook test successful!");
  };

  return (
    <Layout title="Settings" subtitle="Configure your VenueFlow preferences and integrations">
      <div className="space-y-8">
        {/* General Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-6">General Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Company Name"
              name="companyName"
              value={settings.companyName}
              onChange={handleInputChange}
            />
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={settings.email}
              onChange={handleInputChange}
            />
            <FormField
              type="select"
              label="Timezone"
              name="timezone"
              value={settings.timezone}
              onChange={handleInputChange}
              options={[
                { value: "America/New_York", label: "Eastern Time" },
                { value: "America/Chicago", label: "Central Time" },
                { value: "America/Denver", label: "Mountain Time" },
                { value: "America/Los_Angeles", label: "Pacific Time" }
              ]}
            />
            <FormField
              type="select"
              label="Currency"
              name="currency"
              value={settings.currency}
              onChange={handleInputChange}
              options={[
                { value: "USD", label: "US Dollar ($)" },
                { value: "EUR", label: "Euro (€)" },
                { value: "GBP", label: "British Pound (£)" },
                { value: "CAD", label: "Canadian Dollar (C$)" }
              ]}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="primary" onClick={handleSaveSettings}>
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Email Notifications</h4>
                <p className="text-sm text-gray-400">Receive notifications via email</p>
              </div>
              <Button
                variant={settings.notifications.email ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleNestedChange("notifications", "email", !settings.notifications.email)}
              >
                {settings.notifications.email ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-white">SMS Notifications</h4>
                <p className="text-sm text-gray-400">Receive notifications via SMS</p>
              </div>
              <Button
                variant={settings.notifications.sms ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleNestedChange("notifications", "sms", !settings.notifications.sms)}
              >
                {settings.notifications.sms ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Push Notifications</h4>
                <p className="text-sm text-gray-400">Browser push notifications</p>
              </div>
              <Button
                variant={settings.notifications.push ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleNestedChange("notifications", "push", !settings.notifications.push)}
              >
                {settings.notifications.push ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Payment Integration */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Payment Integration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CreditCard" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Stripe</h4>
                  <p className="text-sm text-gray-400">Credit card processing</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={settings.payment.stripeEnabled ? "success" : "default"}>
                  {settings.payment.stripeEnabled ? "Connected" : "Disconnected"}
                </Badge>
                <Button variant="secondary" size="sm">
                  Configure
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Wallet" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">PayPal</h4>
                  <p className="text-sm text-gray-400">Alternative payment method</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={settings.payment.paypalEnabled ? "success" : "default"}>
                  {settings.payment.paypalEnabled ? "Connected" : "Disconnected"}
                </Badge>
                <Button variant="secondary" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Advanced Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Advanced Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Webhook Test</h4>
                <p className="text-sm text-gray-400">Test your webhook endpoint</p>
              </div>
              <Button variant="secondary" onClick={handleTestWebhook}>
                <ApperIcon name="Zap" className="w-4 h-4 mr-2" />
                Test Webhook
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Export Data</h4>
                <p className="text-sm text-gray-400">Download all your data as CSV</p>
              </div>
              <Button variant="secondary" onClick={handleExportData}>
                <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-white">API Access</h4>
                <p className="text-sm text-gray-400">Manage API keys and access</p>
              </div>
              <Button variant="secondary">
                <ApperIcon name="Key" className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-400">Add extra security to your account</p>
              </div>
              <Button variant="primary" size="sm">
                Enable 2FA
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Session Management</h4>
                <p className="text-sm text-gray-400">View and manage active sessions</p>
              </div>
              <Button variant="secondary" size="sm">
                Manage Sessions
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;