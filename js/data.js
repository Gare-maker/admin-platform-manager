/**
 * KOVA Admin Dashboard - Seed Relational Dataset
 * Connected Models: Users, Subscriptions, Listings, Transactions, Ratings, Reports
 * Platform Fee: 4.9% (configurable)
 * Currency: Nigerian Naira (₦)
 */

const KOVA_DATA = {
  // Platform configuration
  config: {
    platformFeeRate: 0.049, // 4.9% transaction fee
    currencySymbol: '₦',
    currencyName: 'NGN',
    currentAdmin: {
      name: 'Adebayo Johnson',
      email: 'a.johnson@kova.ng',
      role: 'Super Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    }
  },

  // 1. Users: Vendors, Agents, Customers
  users: [
    {
      id: 'USR-1001',
      name: 'Lagos Gadget Hub',
      email: 'sales@lagosgadgethub.ng',
      phone: '+234 803 123 4567',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      userType: 'vendor',
      category: 'Electronics & Gadgets',
      accountStatus: 'Active',
      subscription: 'Gold',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-01-15',
      dateJoined: '2025-11-10',
      rating: 4.9
    },
    {
      id: 'USR-1002',
      name: 'Victoria Island Realty',
      email: 'info@virealty.com.ng',
      phone: '+234 802 987 6543',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      userType: 'agent',
      category: 'Luxury Real Estate',
      accountStatus: 'Active',
      subscription: 'Gold',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-02-01',
      dateJoined: '2025-10-05',
      rating: 4.8
    },
    {
      id: 'USR-1003',
      name: 'Folake Fashion Atelier',
      email: 'contact@folakefashion.com',
      phone: '+234 814 345 6789',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      userType: 'vendor',
      category: 'Fashion & Apparel',
      accountStatus: 'Active',
      subscription: 'Gold',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-03-10',
      dateJoined: '2025-12-01',
      rating: 4.7
    },
    {
      id: 'USR-1004',
      name: 'Lekki Homes & Suites',
      email: 'reservations@lekkihomes.ng',
      phone: '+234 705 555 1234',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      userType: 'agent',
      category: 'Serviced Apartments',
      accountStatus: 'Active',
      subscription: 'Gold',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-02-18',
      dateJoined: '2025-09-12',
      rating: 4.9
    },
    {
      id: 'USR-1005',
      name: 'Chidi Auto & Parts',
      email: 'chidiauto@gmail.com',
      phone: '+234 809 888 7766',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      userType: 'vendor',
      category: 'Automobiles & Spares',
      accountStatus: 'Active',
      subscription: 'Gray',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-04-05',
      dateJoined: '2026-01-20',
      rating: 4.6
    },
    {
      id: 'USR-1006',
      name: 'Yaba Student Lodges Ltd',
      email: 'support@yabalodges.ng',
      phone: '+234 818 444 3322',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      userType: 'agent',
      category: 'Student Housing',
      accountStatus: 'Active',
      subscription: 'Gray',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-03-01',
      dateJoined: '2026-01-08',
      rating: 4.5
    },
    {
      id: 'USR-1007',
      name: 'Alaba Sound & Vision',
      email: 'orders@alabasound.ng',
      phone: '+234 806 777 9900',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      userType: 'vendor',
      category: 'Electronics & Audio',
      accountStatus: 'Active',
      subscription: 'Gray',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-05-12',
      dateJoined: '2026-02-14',
      rating: 4.4
    },
    {
      id: 'USR-1008',
      name: 'Abuja Prime Properties',
      email: 'consult@abujaprime.ng',
      phone: '+234 803 234 5678',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
      userType: 'agent',
      category: 'Residential & Commercial',
      accountStatus: 'Active',
      subscription: 'Gold',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-01-28',
      dateJoined: '2025-11-25',
      rating: 4.7
    },
    {
      id: 'USR-1009',
      name: 'Kariakoo Home Appliances',
      email: 'info@kariakoohome.ng',
      phone: '+234 813 456 7890',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      userType: 'vendor',
      category: 'Home & Kitchen',
      accountStatus: 'Active',
      subscription: 'Blue / Basic',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-06-01',
      dateJoined: '2026-03-02',
      rating: 4.2
    },
    {
      id: 'USR-1010',
      name: 'Mainland Realtors Hub',
      email: 'admin@mainlandrealtors.ng',
      phone: '+234 805 678 9012',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      userType: 'agent',
      category: 'Commercial Rentals',
      accountStatus: 'Active',
      subscription: 'Gray',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-04-15',
      dateJoined: '2026-02-28',
      rating: 4.3
    },
    {
      id: 'USR-1011',
      name: 'Tunde Bakare',
      email: 'tunde.bakare@gmail.com',
      phone: '+234 802 111 2233',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      userType: 'customer',
      category: 'Retail Buyer',
      accountStatus: 'Active',
      subscription: 'Blue / Basic',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-05-10',
      dateJoined: '2026-02-10',
      rating: 5.0
    },
    {
      id: 'USR-1012',
      name: 'Amaka Obi',
      email: 'amaka.obi@yahoo.com',
      phone: '+234 812 333 4455',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      userType: 'customer',
      category: 'Tenant & Buyer',
      accountStatus: 'Active',
      subscription: 'Blue / Basic',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-06-15',
      dateJoined: '2026-03-05',
      rating: 4.9
    },
    {
      id: 'USR-1013',
      name: 'Zainab Ahmed',
      email: 'zainab.ahmed@outlook.com',
      phone: '+234 803 777 6655',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      userType: 'customer',
      category: 'Corporate Tenant',
      accountStatus: 'Active',
      subscription: 'Gray',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-04-20',
      dateJoined: '2026-01-18',
      rating: 5.0
    },
    {
      id: 'USR-1014',
      name: 'Emeka Nwosu',
      email: 'emeka.nwosu@fastmail.com',
      phone: '+234 816 999 0011',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      userType: 'customer',
      category: 'Frequent Shopper',
      accountStatus: 'Active',
      subscription: 'Blue / Basic',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-07-01',
      dateJoined: '2026-04-12',
      rating: 4.8
    },
    {
      id: 'USR-1015',
      name: 'Babatunde Adeleke',
      email: 'badeleke@enterprise.ng',
      phone: '+234 805 222 3344',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      userType: 'customer',
      category: 'Commercial Buyer',
      accountStatus: 'Active',
      subscription: 'Gold',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-03-15',
      dateJoined: '2025-12-15',
      rating: 4.9
    },
    {
      id: 'USR-1016',
      name: 'SwiftDeliver Electronics',
      email: 'support@swiftdeliver.ng',
      phone: '+234 809 111 4477',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&auto=format&fit=crop&q=80',
      userType: 'vendor',
      category: 'Computers & Peripherals',
      accountStatus: 'Active',
      subscription: 'Blue / Basic',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-05-18',
      dateJoined: '2026-03-22',
      rating: 4.1
    },
    {
      id: 'USR-1017',
      name: 'Ikeja Apex Properties',
      email: 'deals@ikejaapex.com',
      phone: '+234 807 654 3210',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&auto=format&fit=crop&q=80',
      userType: 'agent',
      category: 'Office Spaces',
      accountStatus: 'Active',
      subscription: 'Blue / Basic',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-06-25',
      dateJoined: '2026-04-01',
      rating: 4.2
    },
    {
      id: 'USR-1018',
      name: 'PrimeStyle Shoes & Bags',
      email: 'sales@primestyle.ng',
      phone: '+234 811 234 5678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      userType: 'vendor',
      category: 'Fashion Accessories',
      accountStatus: 'Suspended',
      subscription: 'Blue / Basic',
      subscriptionStatus: 'Expired',
      subscriptionAssignedDate: '2026-02-10',
      dateJoined: '2026-01-05',
      rating: 2.1
    },
    {
      id: 'USR-1019',
      name: 'Ngozi Okafor',
      email: 'ngozi.okafor@gmail.com',
      phone: '+234 815 678 1234',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      userType: 'customer',
      category: 'Retail Buyer',
      accountStatus: 'Active',
      subscription: 'Blue / Basic',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-07-10',
      dateJoined: '2026-05-02',
      rating: 4.7
    },
    {
      id: 'USR-1020',
      name: 'Kano Textile Direct',
      email: 'kanotextiles@kanomall.ng',
      phone: '+234 802 444 8899',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      userType: 'vendor',
      category: 'Traditional Fabrics',
      accountStatus: 'Active',
      subscription: 'Gray',
      subscriptionStatus: 'Active',
      subscriptionAssignedDate: '2026-05-01',
      dateJoined: '2026-02-20',
      rating: 4.5
    }
  ],

  // 2. Subscriptions Audit History
  subscriptionLogs: [
    {
      id: 'SUB-LOG-001',
      userId: 'USR-1001',
      userName: 'Lagos Gadget Hub',
      previousSubscription: 'Gray',
      newSubscription: 'Gold',
      dateChanged: '2026-01-15 10:30',
      adminName: 'Adebayo Johnson',
      reason: 'Upgraded to Gold plan after exceeding ₦5M transaction volume.'
    },
    {
      id: 'SUB-LOG-002',
      userId: 'USR-1002',
      userName: 'Victoria Island Realty',
      previousSubscription: 'Blue / Basic',
      newSubscription: 'Gold',
      dateChanged: '2026-02-01 14:15',
      adminName: 'Adebayo Johnson',
      reason: 'Direct annual enterprise tier assignment.'
    },
    {
      id: 'SUB-LOG-003',
      userId: 'USR-1003',
      userName: 'Folake Fashion Atelier',
      previousSubscription: 'Gray',
      newSubscription: 'Gold',
      dateChanged: '2026-03-10 11:45',
      adminName: 'Adebayo Johnson',
      reason: 'VIP vendor status upgrade approved.'
    },
    {
      id: 'SUB-LOG-004',
      userId: 'USR-1005',
      userName: 'Chidi Auto & Parts',
      previousSubscription: 'Blue / Basic',
      newSubscription: 'Gray',
      dateChanged: '2026-04-05 09:20',
      adminName: 'Adebayo Johnson',
      reason: 'Upgraded from Basic to Gray plan.'
    },
    {
      id: 'SUB-LOG-005',
      userId: 'USR-1015',
      userName: 'Babatunde Adeleke',
      previousSubscription: 'Blue / Basic',
      newSubscription: 'Gold',
      dateChanged: '2026-03-15 16:50',
      adminName: 'Adebayo Johnson',
      reason: 'Corporate priority buyer subscription.'
    },
    {
      id: 'SUB-LOG-006',
      userId: 'USR-1018',
      userName: 'PrimeStyle Shoes & Bags',
      previousSubscription: 'Gray',
      newSubscription: 'Blue / Basic',
      dateChanged: '2026-06-10 13:05',
      adminName: 'Adebayo Johnson',
      reason: 'Downgraded following consumer dispute investigations.'
    }
  ],

  // 3. Listings: Products and Properties
  listings: [
    {
      id: 'LST-2001',
      userId: 'USR-1001',
      listingType: 'product',
      category: 'Electronics & Gadgets',
      name: 'iPhone 15 Pro Max (256GB, Titanium Blue)',
      price: 1850000,
      status: 'Active',
      dateCreated: '2026-01-20',
      views: 3420,
      transactionsCount: 14,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2002',
      userId: 'USR-1001',
      listingType: 'product',
      category: 'Electronics & Gadgets',
      name: 'MacBook Air M3 15-inch (16GB RAM, 512GB SSD)',
      price: 2400000,
      status: 'Active',
      dateCreated: '2026-02-11',
      views: 2890,
      transactionsCount: 9,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2003',
      userId: 'USR-1001',
      listingType: 'product',
      category: 'Electronics & Gadgets',
      name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
      price: 450000,
      status: 'Active',
      dateCreated: '2026-02-28',
      views: 1950,
      transactionsCount: 18,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2004',
      userId: 'USR-1001',
      listingType: 'product',
      category: 'Electronics & Gadgets',
      name: 'PlayStation 5 Slim Console with 2 DualSense Controllers',
      price: 880000,
      status: 'Active',
      dateCreated: '2026-03-15',
      views: 4120,
      transactionsCount: 12,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2005',
      userId: 'USR-1002',
      listingType: 'property',
      category: 'Luxury Real Estate',
      name: '3-Bedroom Waterfront Penthouse (Victoria Island)',
      price: 8500000, // Annual rental
      status: 'Active',
      dateCreated: '2026-01-10',
      views: 5200,
      transactionsCount: 3,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2006',
      userId: 'USR-1002',
      listingType: 'property',
      category: 'Luxury Real Estate',
      name: '4-Bedroom Luxury Duplex with Swimming Pool (Ikoyi)',
      price: 15000000,
      status: 'Active',
      dateCreated: '2026-02-05',
      views: 6800,
      transactionsCount: 2,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2007',
      userId: 'USR-1002',
      listingType: 'property',
      category: 'Luxury Real Estate',
      name: 'Serviced 2-Bedroom Apartment (Oniru, Victoria Island)',
      price: 5500000,
      status: 'Active',
      dateCreated: '2026-03-20',
      views: 3100,
      transactionsCount: 4,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2008',
      userId: 'USR-1003',
      listingType: 'product',
      category: 'Fashion & Apparel',
      name: 'Hand-Embroidered Silk Agbada 3-Piece Set',
      price: 380000,
      status: 'Active',
      dateCreated: '2026-02-14',
      views: 2200,
      transactionsCount: 16,
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2009',
      userId: 'USR-1003',
      listingType: 'product',
      category: 'Fashion & Apparel',
      name: 'Luxury Ankara Evening Gown with Corset Detail',
      price: 240000,
      status: 'Active',
      dateCreated: '2026-03-01',
      views: 1840,
      transactionsCount: 11,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2010',
      userId: 'USR-1004',
      listingType: 'property',
      category: 'Serviced Apartments',
      name: 'Modern Studio Apartment in Lekki Phase 1 (Shortlet & Longterm)',
      price: 3200000,
      status: 'Active',
      dateCreated: '2026-01-25',
      views: 4500,
      transactionsCount: 6,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2011',
      userId: 'USR-1004',
      listingType: 'property',
      category: 'Serviced Apartments',
      name: 'Executive 2-Bedroom Terrace with 24/7 Power (Chevron Lekki)',
      price: 4800000,
      status: 'Active',
      dateCreated: '2026-02-22',
      views: 3900,
      transactionsCount: 5,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2012',
      userId: 'USR-1005',
      listingType: 'product',
      category: 'Automobiles & Spares',
      name: 'Toyota Camry 2021 XLE OEM Brake Calipers & Rotor Kit',
      price: 520000,
      status: 'Active',
      dateCreated: '2026-03-18',
      views: 1120,
      transactionsCount: 7,
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2013',
      userId: 'USR-1005',
      listingType: 'product',
      category: 'Automobiles & Spares',
      name: 'Mercedes Benz W205 LED Headlight Assembly Pair',
      price: 950000,
      status: 'Active',
      dateCreated: '2026-04-02',
      views: 1450,
      transactionsCount: 5,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2014',
      userId: 'USR-1006',
      listingType: 'property',
      category: 'Student Housing',
      name: 'Self-Contained Student Lodge with Inverter (Akoka, Yaba)',
      price: 1200000,
      status: 'Active',
      dateCreated: '2026-01-30',
      views: 5600,
      transactionsCount: 8,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2015',
      userId: 'USR-1006',
      listingType: 'property',
      category: 'Student Housing',
      name: 'Furnished Shared 2-Room Suite for UNILAG Students',
      price: 850000,
      status: 'Active',
      dateCreated: '2026-02-15',
      views: 4200,
      transactionsCount: 6,
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2016',
      userId: 'USR-1007',
      listingType: 'product',
      category: 'Electronics & Audio',
      name: 'JBL PartyBox 710 High-Power Portable Speaker',
      price: 1100000,
      status: 'Active',
      dateCreated: '2026-03-08',
      views: 1890,
      transactionsCount: 6,
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2017',
      userId: 'USR-1008',
      listingType: 'property',
      category: 'Residential & Commercial',
      name: '5-Bedroom Ambassadorial Villa with BQ (Maitama, Abuja)',
      price: 28000000,
      status: 'Active',
      dateCreated: '2026-02-10',
      views: 3800,
      transactionsCount: 1,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2018',
      userId: 'USR-1008',
      listingType: 'property',
      category: 'Residential & Commercial',
      name: 'Modern 3-Bedroom Flat in Garki 2 (Serviced, 24h Security)',
      price: 4500000,
      status: 'Active',
      dateCreated: '2026-03-12',
      views: 2900,
      transactionsCount: 3,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2019',
      userId: 'USR-1009',
      listingType: 'product',
      category: 'Home & Kitchen',
      name: 'LG Inverter Smart Side-by-Side Refrigerator 635L',
      price: 1750000,
      status: 'Active',
      dateCreated: '2026-03-25',
      views: 1340,
      transactionsCount: 4,
      image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2020',
      userId: 'USR-1010',
      listingType: 'property',
      category: 'Commercial Rentals',
      name: 'Open Plan Commercial Office Space (Allen Avenue, Ikeja)',
      price: 6000000,
      status: 'Active',
      dateCreated: '2026-03-05',
      views: 2100,
      transactionsCount: 2,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'LST-2021',
      userId: 'USR-1018',
      listingType: 'product',
      category: 'Fashion Accessories',
      name: 'Counterfeit Designer Leather Handbag Replica',
      price: 95000,
      status: 'Inactive',
      dateCreated: '2026-02-12',
      views: 750,
      transactionsCount: 2,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80'
    }
  ],

  // 4. Transactions spanning January to September 2026
  transactions: [
    // January 2026
    {
      id: 'TRX-8001',
      buyerId: 'USR-1011', // Tunde Bakare
      sellerId: 'USR-1001', // Lagos Gadget Hub
      listingId: 'LST-2001', // iPhone 15 Pro Max
      amount: 1850000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-01-22 11:20'
    },
    {
      id: 'TRX-8002',
      buyerId: 'USR-1013', // Zainab Ahmed
      sellerId: 'USR-1002', // Victoria Island Realty
      listingId: 'LST-2005', // 3-Bedroom Penthouse
      amount: 8500000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-01-28 15:40'
    },
    {
      id: 'TRX-8003',
      buyerId: 'USR-1014', // Emeka Nwosu
      sellerId: 'USR-1001', // Lagos Gadget Hub
      listingId: 'LST-2003', // Sony Headphones
      amount: 450000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-01-30 09:15'
    },

    // February 2026
    {
      id: 'TRX-8004',
      buyerId: 'USR-1015', // Babatunde Adeleke
      sellerId: 'USR-1001', // Lagos Gadget Hub
      listingId: 'LST-2002', // MacBook Air M3
      amount: 2400000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-02-05 14:10'
    },
    {
      id: 'TRX-8005',
      buyerId: 'USR-1012', // Amaka Obi
      sellerId: 'USR-1004', // Lekki Homes & Suites
      listingId: 'LST-2010', // Studio Apartment Lekki
      amount: 3200000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-02-12 16:30'
    },
    {
      id: 'TRX-8006',
      buyerId: 'USR-1011', // Tunde Bakare
      sellerId: 'USR-1003', // Folake Fashion Atelier
      listingId: 'LST-2008', // Silk Agbada
      amount: 380000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-02-18 10:45'
    },
    {
      id: 'TRX-8007',
      buyerId: 'USR-1014', // Emeka Nwosu
      sellerId: 'USR-1006', // Yaba Lodges
      listingId: 'LST-2014', // Student Lodge Akoka
      amount: 1200000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-02-24 13:20'
    },
    {
      id: 'TRX-8008',
      buyerId: 'USR-1019', // Ngozi Okafor
      sellerId: 'USR-1001', // Lagos Gadget Hub
      listingId: 'LST-2004', // PS5
      amount: 880000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-02-27 18:05'
    },

    // March 2026
    {
      id: 'TRX-8009',
      buyerId: 'USR-1015', // Babatunde Adeleke
      sellerId: 'USR-1002', // Victoria Island Realty
      listingId: 'LST-2006', // Ikoyi 4-Bedroom Duplex
      amount: 15000000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-03-04 11:50'
    },
    {
      id: 'TRX-8010',
      buyerId: 'USR-1013', // Zainab Ahmed
      sellerId: 'USR-1003', // Folake Fashion
      listingId: 'LST-2009', // Ankara Gown
      amount: 240000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-03-10 14:20'
    },
    {
      id: 'TRX-8011',
      buyerId: 'USR-1011', // Tunde Bakare
      sellerId: 'USR-1005', // Chidi Auto
      listingId: 'LST-2012', // Toyota Brake Kit
      amount: 520000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-03-15 15:40'
    },
    {
      id: 'TRX-8012',
      buyerId: 'USR-1012', // Amaka Obi
      sellerId: 'USR-1001', // Lagos Gadget Hub
      listingId: 'LST-2001', // iPhone 15 Pro Max
      amount: 1850000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-03-22 17:10'
    },
    {
      id: 'TRX-8013',
      buyerId: 'USR-1014', // Emeka
      sellerId: 'USR-1004', // Lekki Homes
      listingId: 'LST-2011', // Executive Terrace
      amount: 4800000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-03-29 12:00'
    },

    // April 2026
    {
      id: 'TRX-8014',
      buyerId: 'USR-1015', // Babatunde
      sellerId: 'USR-1008', // Abuja Prime
      listingId: 'LST-2017', // Maitama Villa
      amount: 28000000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-04-06 10:30'
    },
    {
      id: 'TRX-8015',
      buyerId: 'USR-1011',
      sellerId: 'USR-1007', // Alaba Sound
      listingId: 'LST-2016', // JBL PartyBox
      amount: 1100000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-04-14 13:15'
    },
    {
      id: 'TRX-8016',
      buyerId: 'USR-1012',
      sellerId: 'USR-1005', // Chidi Auto
      listingId: 'LST-2013', // Benz Headlights
      amount: 950000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-04-20 16:45'
    },
    {
      id: 'TRX-8017',
      buyerId: 'USR-1019',
      sellerId: 'USR-1001',
      listingId: 'LST-2003', // Sony Headphones
      amount: 450000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-04-26 11:10'
    },

    // May 2026
    {
      id: 'TRX-8018',
      buyerId: 'USR-1013',
      sellerId: 'USR-1002', // VI Realty
      listingId: 'LST-2007', // Oniru 2-Bed
      amount: 5500000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-05-03 14:00'
    },
    {
      id: 'TRX-8019',
      buyerId: 'USR-1014',
      sellerId: 'USR-1001',
      listingId: 'LST-2002', // MacBook
      amount: 2400000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-05-11 09:30'
    },
    {
      id: 'TRX-8020',
      buyerId: 'USR-1011',
      sellerId: 'USR-1003',
      listingId: 'LST-2008', // Agbada
      amount: 380000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-05-18 15:25'
    },
    {
      id: 'TRX-8021',
      buyerId: 'USR-1015',
      sellerId: 'USR-1009', // Kariakoo
      listingId: 'LST-2019', // LG Refrigerator
      amount: 1750000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-05-25 17:50'
    },

    // June 2026
    {
      id: 'TRX-8022',
      buyerId: 'USR-1012',
      sellerId: 'USR-1006', // Yaba Lodges
      listingId: 'LST-2015', // UNILAG Suite
      amount: 850000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-06-02 10:15'
    },
    {
      id: 'TRX-8023',
      buyerId: 'USR-1013',
      sellerId: 'USR-1008', // Abuja Prime
      listingId: 'LST-2018', // Garki Flat
      amount: 4500000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-06-12 12:40'
    },
    {
      id: 'TRX-8024',
      buyerId: 'USR-1014',
      sellerId: 'USR-1001',
      listingId: 'LST-2001', // iPhone 15 Pro Max
      amount: 1850000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-06-19 14:35'
    },
    {
      id: 'TRX-8025',
      buyerId: 'USR-1019',
      sellerId: 'USR-1018', // PrimeStyle (Counterfeit)
      listingId: 'LST-2021', // Counterfeit Bag
      amount: 95000,
      status: 'Refunded',
      type: 'Product purchase',
      date: '2026-06-22 16:20'
    },

    // July 2026
    {
      id: 'TRX-8026',
      buyerId: 'USR-1011',
      sellerId: 'USR-1004', // Lekki Homes
      listingId: 'LST-2010', // Studio Apt
      amount: 3200000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-07-04 11:20'
    },
    {
      id: 'TRX-8027',
      buyerId: 'USR-1015',
      sellerId: 'USR-1001',
      listingId: 'LST-2004', // PS5
      amount: 880000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-07-15 15:10'
    },
    {
      id: 'TRX-8028',
      buyerId: 'USR-1012',
      sellerId: 'USR-1010', // Mainland Realtors
      listingId: 'LST-2020', // Office Space Allen
      amount: 6000000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-07-25 13:45'
    },

    // August 2026
    {
      id: 'TRX-8029',
      buyerId: 'USR-1014',
      sellerId: 'USR-1001',
      listingId: 'LST-2002', // MacBook
      amount: 2400000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-08-04 10:00'
    },
    {
      id: 'TRX-8030',
      buyerId: 'USR-1013',
      sellerId: 'USR-1003',
      listingId: 'LST-2008', // Agbada
      amount: 380000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-08-14 14:15'
    },
    {
      id: 'TRX-8031',
      buyerId: 'USR-1011',
      sellerId: 'USR-1002',
      listingId: 'LST-2007', // Oniru
      amount: 5500000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-08-22 17:30'
    },
    {
      id: 'TRX-8032',
      buyerId: 'USR-1019',
      sellerId: 'USR-1005',
      listingId: 'LST-2012',
      amount: 520000,
      status: 'Cancelled',
      type: 'Product purchase',
      date: '2026-08-28 09:40'
    },

    // September 2026 (Current Month)
    {
      id: 'TRX-8033',
      buyerId: 'USR-1015',
      sellerId: 'USR-1001',
      listingId: 'LST-2001', // iPhone 15 Pro Max
      amount: 1850000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-09-02 11:30'
    },
    {
      id: 'TRX-8034',
      buyerId: 'USR-1012',
      sellerId: 'USR-1004',
      listingId: 'LST-2011', // Executive Terrace
      amount: 4800000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-09-05 15:45'
    },
    {
      id: 'TRX-8035',
      buyerId: 'USR-1014',
      sellerId: 'USR-1003',
      listingId: 'LST-2009', // Ankara Gown
      amount: 240000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-09-08 14:10'
    },
    {
      id: 'TRX-8036',
      buyerId: 'USR-1013',
      sellerId: 'USR-1006',
      listingId: 'LST-2014', // Akoka Lodge
      amount: 1200000,
      status: 'Completed',
      type: 'Property rental',
      date: '2026-09-11 16:50'
    },
    {
      id: 'TRX-8037',
      buyerId: 'USR-1011',
      sellerId: 'USR-1001',
      listingId: 'LST-2003', // Sony Headphones
      amount: 450000,
      status: 'Completed',
      type: 'Product purchase',
      date: '2026-09-14 10:20'
    },
    {
      id: 'TRX-8038',
      buyerId: 'USR-1019',
      sellerId: 'USR-1001',
      listingId: 'LST-2004', // PS5
      amount: 880000,
      status: 'Pending',
      type: 'Product purchase',
      date: '2026-09-15 17:15'
    },
    {
      id: 'TRX-8039',
      buyerId: 'USR-1015',
      sellerId: 'USR-1002',
      listingId: 'LST-2005', // Penthouse
      amount: 8500000,
      status: 'Pending',
      type: 'Property rental',
      date: '2026-09-15 19:40'
    }
  ],

  // 5. Ratings & Reviews
  ratings: [
    {
      id: 'RAT-3001',
      reviewerId: 'USR-1011', // Tunde Bakare
      ratedUserId: 'USR-1001', // Lagos Gadget Hub
      score: 5,
      review: 'Exceptional service and authentic brand new iPhone 15 Pro Max delivered in original sealed pack. Highly recommended vendor!',
      date: '2026-01-23'
    },
    {
      id: 'RAT-3002',
      reviewerId: 'USR-1013', // Zainab Ahmed
      ratedUserId: 'USR-1002', // Victoria Island Realty
      score: 5,
      review: 'Smooth tenancy process for the VI waterfront penthouse. Handover was seamless with zero hidden fees.',
      date: '2026-01-29'
    },
    {
      id: 'RAT-3003',
      reviewerId: 'USR-1015', // Babatunde Adeleke
      ratedUserId: 'USR-1001', // Lagos Gadget Hub
      score: 5,
      review: 'Superb MacBook Air M3, pristine condition. Prompt logistics to Victoria Island within 3 hours of order.',
      date: '2026-02-06'
    },
    {
      id: 'RAT-3004',
      reviewerId: 'USR-1012', // Amaka Obi
      ratedUserId: 'USR-1004', // Lekki Homes & Suites
      score: 5,
      review: 'The studio flat in Lekki Phase 1 exceeded expectations! Clean, functional inverter, quiet neighborhood.',
      date: '2026-02-13'
    },
    {
      id: 'RAT-3005',
      reviewerId: 'USR-1011', // Tunde Bakare
      ratedUserId: 'USR-1003', // Folake Fashion Atelier
      score: 5,
      review: 'Top craftsmanship on the silk agbada. The embroidery detailing is regal. Folake is a maestro.',
      date: '2026-02-19'
    },
    {
      id: 'RAT-3006',
      reviewerId: 'USR-1014', // Emeka Nwosu
      ratedUserId: 'USR-1006', // Yaba Student Lodges Ltd
      score: 4,
      review: 'Decent student accommodation near UNILAG. Stable electricity and water supply. Helpful caretaker.',
      date: '2026-02-25'
    },
    {
      id: 'RAT-3007',
      reviewerId: 'USR-1015', // Babatunde Adeleke
      ratedUserId: 'USR-1002', // Victoria Island Realty
      score: 5,
      review: 'Premier tier real estate firm in Lagos. The Ikoyi property is world-class.',
      date: '2026-03-05'
    },
    {
      id: 'RAT-3008',
      reviewerId: 'USR-1019', // Ngozi Okafor
      ratedUserId: 'USR-1018', // PrimeStyle Shoes & Bags (Fraud)
      score: 1,
      review: 'FAKE BAG! Advertised as genuine designer calfskin but delivered a cheap plastic replica with peeling trim. Demanded refund immediately!',
      date: '2026-06-23'
    },
    {
      id: 'RAT-3009',
      reviewerId: 'USR-1011', // Tunde Bakare
      ratedUserId: 'USR-1018', // PrimeStyle
      score: 1,
      review: 'Poor communication and misleading description. Goods were defective and seller refused to respond for 5 days.',
      date: '2026-06-18'
    },
    {
      id: 'RAT-3010',
      reviewerId: 'USR-1013', // Zainab Ahmed
      ratedUserId: 'USR-1008', // Abuja Prime Properties
      score: 5,
      review: 'Reliable real estate consultation in Abuja. Garki apartment documents were completely verified.',
      date: '2026-06-14'
    }
  ],

  // 6. User and Listing Reports
  reports: [
    {
      id: 'REP-5001',
      reporterId: 'USR-1019', // Ngozi Okafor
      reportedUserId: 'USR-1018', // PrimeStyle Shoes & Bags
      listingId: 'LST-2021',
      category: 'Fake listing',
      content: 'Seller listed counterfeit items falsely labeled as authentic luxury leather. Delivered substandard goods and blocked buyer on phone calls.',
      status: 'Under Review',
      date: '2026-06-22 17:30'
    },
    {
      id: 'REP-5002',
      reporterId: 'USR-1011', // Tunde Bakare
      reportedUserId: 'USR-1018', // PrimeStyle Shoes & Bags
      listingId: 'LST-2021',
      category: 'Misleading information',
      content: 'Product specifications and brand origin are completely fabricated. Refused to honor return policy.',
      status: 'Under Review',
      date: '2026-06-24 10:15'
    },
    {
      id: 'REP-5003',
      reporterId: 'USR-1012', // Amaka Obi
      reportedUserId: 'USR-1005', // Chidi Auto & Parts
      listingId: 'LST-2012',
      category: 'Other',
      content: 'Delay in dispatching parts order by 10 business days without prior notification. Issue was subsequently resolved with vendor.',
      status: 'Resolved',
      date: '2026-05-14 11:20'
    },
    {
      id: 'REP-5004',
      reporterId: 'USR-1014', // Emeka Nwosu
      reportedUserId: 'USR-1016', // SwiftDeliver Electronics
      listingId: null,
      category: 'Misleading information',
      content: 'Seller quoted 2-year manufacturer warranty on display but warranty card in package only covers 90 days.',
      status: 'New',
      date: '2026-09-12 14:05'
    },
    {
      id: 'REP-5005',
      reporterId: 'USR-1013', // Zainab Ahmed
      reportedUserId: 'USR-1017', // Ikeja Apex Properties
      listingId: 'LST-2020',
      category: 'Harassment',
      content: 'Agent representative called at odd night hours repeatedly after tenancy negotiation ended.',
      status: 'New',
      date: '2026-09-14 08:45'
    },
    {
      id: 'REP-5006',
      reporterId: 'USR-1015', // Babatunde Adeleke
      reportedUserId: 'USR-1009', // Kariakoo Home
      listingId: 'LST-2019',
      category: 'Other',
      content: 'Delivery team arrived with minor dent on refrigerator side panel. Vendor provided compensatory accessory.',
      status: 'Dismissed',
      date: '2026-06-05 09:30'
    }
  ]
};
