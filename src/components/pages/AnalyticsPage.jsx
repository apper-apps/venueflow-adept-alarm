import React, { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import ReactApexChart from "react-apexcharts";
import eventService from "@/services/api/eventService";

const AnalyticsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError("");
      const eventsData = await eventService.getAll();
      setEvents(eventsData);
    } catch (err) {
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  if (loading) return <Layout title="Analytics"><Loading type="analytics" /></Layout>;
  if (error) return <Layout title="Analytics"><Error message={error} onRetry={loadAnalyticsData} /></Layout>;

  const totalRevenue = events.reduce((sum, event) => sum + (event.revenue || 0), 0);
  const totalTicketsSold = events.reduce((sum, event) => sum + (event.ticketsSold || 0), 0);
  const totalCapacity = events.reduce((sum, event) => sum + (event.capacity || 0), 0);
  const averageOccupancy = totalCapacity > 0 ? ((totalTicketsSold / totalCapacity) * 100).toFixed(1) : 0;

  // Revenue Chart Data
  const revenueChartOptions = {
    chart: {
      type: "area",
      background: "transparent",
      toolbar: { show: false }
    },
    theme: { mode: "dark" },
    colors: ["#8b5cf6", "#f59e0b"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: events.slice(0, 6).map(e => e.name.split(" ").slice(0, 2).join(" ")),
      labels: { style: { colors: "#9ca3af" } }
    },
    yaxis: {
      labels: { 
        style: { colors: "#9ca3af" },
        formatter: (value) => `$${value}`
      }
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3
    },
    tooltip: {
      theme: "dark",
      y: { formatter: (value) => `$${value}` }
    }
  };

  const revenueChartSeries = [{
    name: "Revenue",
    data: events.slice(0, 6).map(e => e.revenue || 0)
  }];

  // Occupancy Chart Data
  const occupancyChartOptions = {
    chart: {
      type: "donut",
      background: "transparent"
    },
    theme: { mode: "dark" },
    colors: ["#10b981", "#ef4444", "#6b7280"],
    labels: ["Sold", "Available", "Reserved"],
    dataLabels: {
      enabled: true,
      style: { colors: ["#fff"] }
    },
    legend: {
      labels: { colors: "#9ca3af" },
      position: "bottom"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              color: "#fff",
              formatter: () => `${averageOccupancy}%`
            }
          }
        }
      }
    }
  };

  const occupancyChartSeries = [
    totalTicketsSold,
    Math.max(0, totalCapacity - totalTicketsSold),
    Math.floor(totalCapacity * 0.05) // Mock reserved seats
  ];

  const topEvents = events
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5);

  return (
    <Layout title="Analytics" subtitle="Performance insights and event statistics">
      <div className="space-y-8">
        {/* Period Filter */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Performance Overview</h2>
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-48"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change="+15.3%"
            icon="DollarSign"
            trend="up"
            gradient={true}
          />
          <MetricCard
            title="Tickets Sold"
            value={totalTicketsSold.toLocaleString()}
            change="+8.7%"
            icon="Ticket"
            trend="up"
          />
          <MetricCard
            title="Average Occupancy"
            value={`${averageOccupancy}%`}
            change="+5.2%"
            icon="TrendingUp"
            trend="up"
          />
          <MetricCard
            title="Active Events"
            value={events.filter(e => e.status === "published").length}
            change="+2"
            icon="Calendar"
            trend="up"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Revenue by Event</h3>
            <ReactApexChart
              options={revenueChartOptions}
              series={revenueChartSeries}
              type="area"
              height={300}
            />
          </Card>

          {/* Occupancy Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Overall Occupancy</h3>
            <ReactApexChart
              options={occupancyChartOptions}
              series={occupancyChartSeries}
              type="donut"
              height={300}
            />
          </Card>
        </div>

        {/* Top Events */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Top Performing Events</h3>
          <div className="space-y-4">
            {topEvents.map((event, index) => (
              <div key={event.Id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{event.name}</h4>
                    <p className="text-sm text-gray-400">{event.venueName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent-400">${(event.revenue || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-400">{event.ticketsSold || 0} tickets</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <ApperIcon name="Users" className="w-8 h-8 text-primary-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white mb-1">
              {Math.round(totalTicketsSold / Math.max(events.length, 1))}
            </p>
            <p className="text-sm text-gray-400">Avg. Tickets per Event</p>
          </Card>

          <Card className="p-6 text-center">
            <ApperIcon name="TrendingUp" className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white mb-1">
              ${Math.round(totalRevenue / Math.max(totalTicketsSold, 1))}
            </p>
            <p className="text-sm text-gray-400">Avg. Ticket Price</p>
          </Card>

          <Card className="p-6 text-center">
            <ApperIcon name="Calendar" className="w-8 h-8 text-accent-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white mb-1">
              {events.filter(e => new Date(e.date) > new Date()).length}
            </p>
            <p className="text-sm text-gray-400">Upcoming Events</p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;