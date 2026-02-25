const mockAnalytics = {
  summary: {
    totalRevenue: 12450,
    totalExpenses: 1876,
    netProfit: 10574
  },
  monthlyRevenue: [
    { month: "Sep", revenue: 980 },
    { month: "Oct", revenue: 1450 },
    { month: "Nov", revenue: 2100 },
    { month: "Dec", revenue: 3200 },
    { month: "Jan", revenue: 1800 },
    { month: "Feb", revenue: 2920 }
  ],
  expenses: [
    { id: 1, date: "2026-02-01", category: "Fuel", amount: 85.40, description: "Gas for February deliveries" },
    { id: 2, date: "2026-02-08", category: "Maintenance", amount: 120.00, description: "Chair repair" },
    { id: 3, date: "2026-01-15", category: "Supplies", amount: 45.00, description: "Cleaning supplies" },
    { id: 4, date: "2026-01-22", category: "Fuel", amount: 92.30, description: "Gas for January deliveries" }
  ]
}

export default mockAnalytics