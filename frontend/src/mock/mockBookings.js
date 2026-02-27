const mockBookings = [
  {
    id: 1,
    contactName: "Marcus Johnson",
    phone: "(336) 555-0192",
    email: "marcus.johnson@company.com",
    eventDate: "2026-03-15",
    location: "450 Corporate Blvd, Winston-Salem, NC",
    dropOffTime: "08:00",
    pickUpTime: "20:00",
    deliveryFee: 75,
    payAmount: 850,
    depositAmount: 200,
    paymentStatus: "DEPOSIT",
    status: "UPCOMING",
    items: [
      { inventoryItem: "60 Inch Round Table", quantity: 10, pricePerItem: 15 },
      { inventoryItem: "White Folding Chair", quantity: 80, pricePerItem: 5 }
    ]
  },
  {
    id: 2,
    contactName: "Sandra Williams",
    phone: "(336) 555-0847",
    email: "swilliams@gala2026.com",
    eventDate: "2026-03-22",
    location: "200 Event Center Dr, High Point, NC",
    dropOffTime: "09:00",
    pickUpTime: "23:00",
    deliveryFee: 100,
    payAmount: 1200,
    depositAmount: 400,
    paymentStatus: "PAID",
    status: "UPCOMING",
    items: [
      { inventoryItem: "60 Inch Round Table", quantity: 15, pricePerItem: 15 },
      { inventoryItem: "Chiavari Chair", quantity: 120, pricePerItem: 6 }
    ]
  },
  {
    id: 4,
    contactName: "Tanya Brooks",
    phone: "(336) 555-0561",
    email: "tanya.brooks@gmail.com",
    eventDate: "2026-03-08",
    location: "312 Garden Terrace, Burlington, NC",
    dropOffTime: "11:00",
    pickUpTime: "21:00",
    deliveryFee: 50,
    payAmount: 740,
    depositAmount: 0,
    paymentStatus: "UNPAID",
    status: "UPCOMING",
    items: [
      { inventoryItem: "6 Foot Rectangular Table", quantity: 6, pricePerItem: 12 },
      { inventoryItem: "White Folding Chair", quantity: 50, pricePerItem: 5 }
    ]
  },
  {
    id: 3,
    contactName: "David Reyes",
    phone: "(336) 555-0334",
    email: "david.reyes@outlook.com",
    eventDate: "2026-02-10",
    location: "88 Banquet Hall Ln, Greensboro, NC",
    dropOffTime: "10:00",
    pickUpTime: "22:00",
    deliveryFee: 60,
    payAmount: 620,
    depositAmount: 620,
    paymentStatus: "PAID",
    status: "COMPLETED",
    milesDriven: 42,
    vehicleMpg: 18,
    gasPricePerGallon: 3.25,
    gasCost: 7.58,
    maintenanceCost: 2.10,
    netProfit: 610.32,
    items: [
      { inventoryItem: "6 Foot Rectangular Table", quantity: 8, pricePerItem: 12 },
      { inventoryItem: "White Folding Chair", quantity: 60, pricePerItem: 5 }
    ]
  }
]

export default mockBookings