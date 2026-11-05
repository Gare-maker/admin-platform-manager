/**
 * KOVA Admin Dashboard - Central Reactive Store & Business Logic
 * Single Source of Truth for connected Users, Subscriptions, Listings, Transactions, Ratings, Reports
 */

class KovaStore {
  constructor() {
    this.data = KOVA_DATA;
    this.listeners = [];
    this.currentDate = new Date('2026-09-16T12:00:00'); // Simulated current platform date

    // Global Active Filters
    this.state = {
      currentPage: 'dashboard', // 'dashboard' | 'users' | 'reports'
      dashboardDateRange: 'this_year', // 'today', '7d', '30d', 'this_month', 'last_month', 'this_year', 'custom'
      customStartDate: null,
      customEndDate: null,
      chartMetric: 'value', // 'volume' | 'value' | 'revenue' | 'profit'
      
      // Users filters
      userFilters: {
        search: '',
        userType: 'all',
        category: 'all',
        subscription: 'all',
        accountStatus: 'all',
        rating: 'all'
      },

      // Reports filters
      reportFilters: {
        search: '',
        targetType: 'all',
        category: 'all',
        status: 'all'
      },

      // Admin authentication
      isAuthenticated: localStorage.getItem('kova_admin_auth') !== 'false'
    };
  }

  // Subscribe to state changes
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  // Authentication handlers
  login(email, password) {
    if (!email || !password) {
      return { success: false, message: 'Please provide administrator email and password.' };
    }
    this.state.isAuthenticated = true;
    localStorage.setItem('kova_admin_auth', 'true');
    this.notify();
    return { success: true, message: 'Authenticated successfully' };
  }

  logout() {
    this.state.isAuthenticated = false;
    localStorage.setItem('kova_admin_auth', 'false');
    this.notify();
  }

  // Currency Formatter
  formatNaira(amount, includeDecimals = false) {
    if (amount === undefined || amount === null || isNaN(amount)) return '₦0';
    const num = Number(amount);
    return '₦' + num.toLocaleString('en-NG', {
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : 0
    });
  }

  // Number Formatter (e.g. 1,420)
  formatNumber(val) {
    if (val === undefined || val === null || isNaN(val)) return '0';
    return Number(val).toLocaleString('en-NG');
  }

  // Percentage Formatter
  formatPercent(val) {
    if (isNaN(val)) return '0%';
    return (val * 100).toFixed(1) + '%';
  }

  // Date Parsing Helper
  parseDate(dateStr) {
    return new Date(dateStr.replace(' ', 'T'));
  }

  // Date Filter Predicate
  isDateInFilter(dateStr, rangeKey, customStart, customEnd) {
    if (!dateStr) return false;
    const date = this.parseDate(dateStr);
    const now = this.currentDate;

    switch (rangeKey) {
      case 'today': {
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth() &&
          date.getDate() === now.getDate()
        );
      }
      case '7d': {
        const past7 = new Date(now);
        past7.setDate(now.getDate() - 7);
        return date >= past7 && date <= now;
      }
      case '30d': {
        const past30 = new Date(now);
        past30.setDate(now.getDate() - 30);
        return date >= past30 && date <= now;
      }
      case 'this_month': {
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth()
        );
      }
      case 'last_month': {
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return (
          date.getFullYear() === lastMonthDate.getFullYear() &&
          date.getMonth() === lastMonthDate.getMonth()
        );
      }
      case 'this_year': {
        return date.getFullYear() === now.getFullYear();
      }
      case 'custom': {
        if (customStart && date < new Date(customStart)) return false;
        if (customEnd && date > new Date(customEnd + 'T23:59:59')) return false;
        return true;
      }
      case 'all':
      default:
        return true;
    }
  }

  // ==========================================
  // DASHBOARD COMPUTED STATISTICS
  // ==========================================
  getSummaryStats(dateRange = this.state.dashboardDateRange) {
    const feeRate = this.data.config.platformFeeRate;
    const allUsers = this.data.users;
    const allListings = this.data.listings;
    const allTx = this.data.transactions;

    // Filter transactions by the selected date range
    const filteredTx = allTx.filter(t => 
      this.isDateInFilter(t.date, dateRange, this.state.customStartDate, this.state.customEndDate)
    );

    // Completed transactions only for financial metrics
    const completedTx = filteredTx.filter(t => t.status === 'Completed');
    const allCompletedTx = allTx.filter(t => t.status === 'Completed');

    // Total Users
    const totalUsers = allUsers.length;

    // Total Products
    const totalProducts = allListings.filter(l => l.listingType === 'product').length;

    // Total Property Listings
    const totalProperties = allListings.filter(l => l.listingType === 'property').length;

    // Active Listings (Products + Properties)
    const activeListings = allListings.filter(l => l.status === 'Active').length;

    // Total Transactions (All completed in history)
    const totalTransactions = allCompletedTx.length;

    // Total Money Transacted (Sum of completed in dateRange, or all completed)
    const totalMoneyTransacted = completedTx.reduce((sum, t) => sum + t.amount, 0);
    const lifetimeMoneyTransacted = allCompletedTx.reduce((sum, t) => sum + t.amount, 0);

    // Monthly Transaction Value (Transactions processed in current month: Sep 2026)
    const thisMonthTx = allCompletedTx.filter(t => 
      this.isDateInFilter(t.date, 'this_month')
    );
    const monthlyTransactionValue = thisMonthTx.reduce((sum, t) => sum + t.amount, 0);

    // Monthly Revenue (Money earned by Kova during selected month = Monthly Value * feeRate)
    const monthlyRevenue = Math.round(monthlyTransactionValue * feeRate);

    // Kova Profit (Platform fee based on 4.9% transaction fee for selected dateRange)
    // Note PRD requirement: clearly distinguish between Total transaction value, Kova revenue, Kova profit
    const kovaProfit = Math.round(totalMoneyTransacted * feeRate);
    const lifetimeKovaProfit = Math.round(lifetimeMoneyTransacted * feeRate);

    // Active Subscriptions
    const activeSubUsers = allUsers.filter(u => u.subscriptionStatus === 'Active');
    const totalSubscribed = activeSubUsers.length;

    const goldCount = activeSubUsers.filter(u => u.subscription === 'Gold').length;
    const grayCount = activeSubUsers.filter(u => u.subscription === 'Gray').length;
    const blueCount = activeSubUsers.filter(u => u.subscription === 'Blue / Basic').length;

    return {
      totalUsers,
      totalProducts,
      totalProperties,
      activeListings,
      totalTransactions,
      filteredTransactionsCount: completedTx.length,
      totalMoneyTransacted,
      lifetimeMoneyTransacted,
      monthlyTransactionValue,
      monthlyRevenue,
      kovaProfit,
      lifetimeKovaProfit,
      platformFeePercent: (feeRate * 100).toFixed(1) + '%',
      activeSubscriptions: {
        total: totalSubscribed,
        gold: {
          count: goldCount,
          percent: totalSubscribed > 0 ? (goldCount / totalSubscribed) * 100 : 0
        },
        gray: {
          count: grayCount,
          percent: totalSubscribed > 0 ? (grayCount / totalSubscribed) * 100 : 0
        },
        blue: {
          count: blueCount,
          percent: totalSubscribed > 0 ? (blueCount / totalSubscribed) * 100 : 0
        }
      }
    };
  }

  // ==========================================
  // TRANSACTION GRAPH DATA
  // ==========================================
  getTransactionChartData(metric = this.state.chartMetric) {
    const feeRate = this.data.config.platformFeeRate;
    const months = [
      { key: '2026-01', label: 'Jan' },
      { key: '2026-02', label: 'Feb' },
      { key: '2026-03', label: 'Mar' },
      { key: '2026-04', label: 'Apr' },
      { key: '2026-05', label: 'May' },
      { key: '2026-06', label: 'Jun' },
      { key: '2026-07', label: 'Jul' },
      { key: '2026-08', label: 'Aug' },
      { key: '2026-09', label: 'Sep' }
    ];

    const completedTx = this.data.transactions.filter(t => t.status === 'Completed');

    return months.map(m => {
      const monthTx = completedTx.filter(t => t.date.startsWith(m.key));
      const volume = monthTx.length;
      const value = monthTx.reduce((sum, t) => sum + t.amount, 0);
      const revenue = Math.round(value * feeRate);
      const profit = revenue; // Platform net fee earnings

      let selectedMetricValue = value;
      if (metric === 'volume') selectedMetricValue = volume;
      else if (metric === 'revenue') selectedMetricValue = revenue;
      else if (metric === 'profit') selectedMetricValue = profit;

      return {
        monthKey: m.key,
        label: m.label,
        volume,
        value,
        revenue,
        profit,
        metricValue: selectedMetricValue
      };
    });
  }

  // ==========================================
  // BEST-PERFORMING MARKETPLACE CATEGORIES (Products, Groceries, Gadgets, etc.)
  // ==========================================
  getBestCategories(limit = 5) {
    const productListings = this.data.listings.filter(l => l.listingType === 'product');
    const completedTx = this.data.transactions.filter(t => t.status === 'Completed');

    // Get unique marketplace categories
    const categoriesSet = new Set(productListings.map(l => l.category));
    const categories = Array.from(categoriesSet);

    const categoryStats = categories.map(cat => {
      const catListings = productListings.filter(l => l.category === cat);
      const activeListings = catListings.filter(l => l.status === 'Active').length;
      const catListingIds = new Set(catListings.map(l => l.id));

      const catTx = completedTx.filter(t => catListingIds.has(t.listingId));
      const transactionsCount = catTx.length;
      const totalTxValue = catTx.reduce((sum, t) => sum + t.amount, 0);
      const feePercent = this.data.config.platformFeeRate;
      const platformRevenue = totalTxValue * feePercent;

      return {
        category: cat,
        type: 'Marketplace',
        typeBadge: 'product',
        activeListings,
        transactionsCount,
        totalTxValue,
        platformRevenue
      };
    });

    categoryStats.sort((a, b) => b.totalTxValue - a.totalTxValue || b.transactionsCount - a.transactionsCount);
    return categoryStats.slice(0, limit);
  }

  // ==========================================
  // BEST-PERFORMING PROPERTIES
  // ==========================================
  getBestProperties(limit = 5) {
    const propertyListings = this.data.listings.filter(l => l.listingType === 'property');
    const completedTx = this.data.transactions.filter(t => t.status === 'Completed');

    const propertiesWithStats = propertyListings.map(p => {
      const agent = this.data.users.find(u => u.id === p.userId);
      const propTx = completedTx.filter(t => t.listingId === p.id);
      const rentalsCount = propTx.length || p.transactionsCount;
      const totalTxValue = propTx.reduce((sum, t) => sum + t.amount, 0) || (rentalsCount * p.price);

      return {
        ...p,
        agentName: agent ? agent.name : 'Verified Agent',
        agentAvatar: agent ? agent.avatar : '',
        agentId: p.userId,
        rentalsCount,
        totalTxValue
      };
    });

    propertiesWithStats.sort((a, b) => b.totalTxValue - a.totalTxValue);
    return propertiesWithStats.slice(0, limit);
  }

  // Legacy fallback if referenced anywhere
  getBestProducts(limit = 5) {
    return this.getBestCategories(limit);
  }

  // ==========================================
  // TOP 5 VENDORS
  // ==========================================
  getTopVendors(limit = 5) {
    const vendors = this.data.users.filter(u => u.userType === 'vendor');
    const completedTx = this.data.transactions.filter(t => t.status === 'Completed');
    const listings = this.data.listings;

    const vendorStats = vendors.map(v => {
      const userListings = listings.filter(l => l.userId === v.id);
      const activeListings = userListings.filter(l => l.status === 'Active').length;
      const userTx = completedTx.filter(t => t.sellerId === v.id);
      const transactionsCount = userTx.length;
      const totalTxValue = userTx.reduce((sum, t) => sum + t.amount, 0);

      return {
        ...v,
        listingsCount: userListings.length,
        activeListingsCount: activeListings,
        transactionsCount,
        totalTxValue
      };
    });

    // Rank by transaction value then transactions count
    vendorStats.sort((a, b) => b.totalTxValue - a.totalTxValue || b.transactionsCount - a.transactionsCount);
    return vendorStats.slice(0, limit);
  }

  // ==========================================
  // TOP 5 AGENTS
  // ==========================================
  getTopAgents(limit = 5) {
    const agents = this.data.users.filter(u => u.userType === 'agent');
    const completedTx = this.data.transactions.filter(t => t.status === 'Completed');
    const listings = this.data.listings;

    const agentStats = agents.map(a => {
      const propertyListings = listings.filter(l => l.userId === a.id && l.listingType === 'property');
      const activeListings = propertyListings.filter(l => l.status === 'Active').length;
      const userTx = completedTx.filter(t => t.sellerId === a.id);
      const transactionsCount = userTx.length;
      const totalTxValue = userTx.reduce((sum, t) => sum + t.amount, 0);

      return {
        ...a,
        propertyListingsCount: propertyListings.length,
        activeListingsCount: activeListings,
        transactionsCount,
        totalTxValue
      };
    });

    // Rank by total transaction value then rentals count
    agentStats.sort((a, b) => b.totalTxValue - a.totalTxValue || b.transactionsCount - a.transactionsCount);
    return agentStats.slice(0, limit);
  }

  // ==========================================
  // RECENT PLATFORM ACTIVITY
  // ==========================================
  getRecentActivities(limit = 10) {
    const activities = [];

    // 1. Transactions completed
    this.data.transactions.forEach(t => {
      const buyer = this.data.users.find(u => u.id === t.buyerId);
      const seller = this.data.users.find(u => u.id === t.sellerId);
      const listing = this.data.listings.find(l => l.id === t.listingId);
      const fee = Math.round(t.amount * this.data.config.platformFeeRate);

      activities.push({
        id: 'ACT-' + t.id,
        type: 'transaction',
        title: `Transaction ${t.status}`,
        description: `${buyer ? buyer.name : 'Buyer'} paid ${this.formatNaira(t.amount)} for "${listing ? listing.name : 'Item'}" (Kova Fee: ${this.formatNaira(fee)})`,
        date: t.date,
        status: t.status,
        targetId: t.id,
        icon: 'credit-card',
        iconBg: '#DCFCE7',
        iconColor: '#16A34A'
      });
    });

    // 2. User Signups
    this.data.users.forEach(u => {
      activities.push({
        id: 'ACT-USR-' + u.id,
        type: 'user_registered',
        title: `New ${u.userType.toUpperCase()} Registered`,
        description: `${u.name} joined as a verified ${u.userType} (${u.category})`,
        date: u.dateJoined + ' 09:00',
        status: u.accountStatus,
        targetId: u.id,
        icon: 'user-plus',
        iconBg: '#DBEAFE',
        iconColor: '#2563EB'
      });
    });

    // 3. Subscription changes
    this.data.subscriptionLogs.forEach(sub => {
      activities.push({
        id: 'ACT-' + sub.id,
        type: 'subscription_change',
        title: 'Subscription Plan Updated',
        description: `${sub.userName} subscription changed from ${sub.previousSubscription} to ${sub.newSubscription}`,
        date: sub.dateChanged,
        status: 'Active',
        targetId: sub.userId,
        icon: 'award',
        iconBg: '#FEF3C7',
        iconColor: '#D97706'
      });
    });

    // 4. Reports filed
    this.data.reports.forEach(r => {
      const reporter = this.data.users.find(u => u.id === r.reporterId);
      const reported = this.data.users.find(u => u.id === r.reportedUserId);

      activities.push({
        id: 'ACT-' + r.id,
        type: 'report_filed',
        title: `Report Submitted: ${r.category}`,
        description: `${reporter ? reporter.name : 'User'} reported ${reported ? reported.name : 'User'} for "${r.category}"`,
        date: r.date,
        status: r.status,
        targetId: r.id,
        icon: 'alert-triangle',
        iconBg: '#FEE2E2',
        iconColor: '#DC2626'
      });
    });

    // Sort by date descending
    activities.sort((a, b) => new Date(b.date.replace(' ', 'T')) - new Date(a.date.replace(' ', 'T')));
    return activities.slice(0, limit);
  }

  // ==========================================
  // USERS MANAGEMENT & FILTERING
  // ==========================================
  getFilteredUsers(customFilters = {}) {
    const f = { ...this.state.userFilters, ...customFilters };
    const completedTx = this.data.transactions.filter(t => t.status === 'Completed');
    const allListings = this.data.listings;
    const allReports = this.data.reports;

    return this.data.users
      .map(u => {
        const userListings = allListings.filter(l => l.userId === u.id);
        const activeListings = userListings.filter(l => l.status === 'Active').length;
        const userTx = completedTx.filter(t => t.sellerId === u.id || t.buyerId === u.id);
        const totalTxValue = userTx.reduce((sum, t) => sum + t.amount, 0);
        const reportsCount = allReports.filter(r => r.reportedUserId === u.id).length;

        return {
          ...u,
          listingsCount: userListings.length,
          activeListingsCount: activeListings,
          transactionsCount: userTx.length,
          totalTxValue,
          reportsCount
        };
      })
      .filter(u => {
        // Search filter: Name, Email, Phone, ID
        if (f.search) {
          const q = f.search.toLowerCase().trim();
          const match =
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.phone.toLowerCase().includes(q) ||
            u.id.toLowerCase().includes(q);
          if (!match) return false;
        }

        // User Type filter
        if (f.userType !== 'all' && u.userType.toLowerCase() !== f.userType.toLowerCase()) {
          return false;
        }

        // Subscription filter
        if (f.subscription !== 'all') {
          if (f.subscription === 'None' && u.subscription) return false;
          if (f.subscription !== 'None' && u.subscription !== f.subscription) return false;
        }

        // Account Status filter
        if (f.accountStatus !== 'all' && u.accountStatus.toLowerCase() !== f.accountStatus.toLowerCase()) {
          return false;
        }

        // Category filter
        if (f.category !== 'all' && !u.category.toLowerCase().includes(f.category.toLowerCase())) {
          return false;
        }

        // Rating filter
        if (f.rating !== 'all') {
          const minRating = parseFloat(f.rating);
          if (u.rating < minRating) return false;
        }

        return true;
      });
  }

  // ==========================================
  // DETAILED USER PROFILE
  // ==========================================
  getUserDetails(userId) {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return null;

    const feeRate = this.data.config.platformFeeRate;
    const userListings = this.data.listings.filter(l => l.userId === userId);
    const activeListings = userListings.filter(l => l.status === 'Active');

    // Transactions as seller or buyer
    const allUserTx = this.data.transactions.filter(t => t.sellerId === userId || t.buyerId === userId);
    const completedTx = allUserTx.filter(t => t.status === 'Completed');
    const cancelledTx = allUserTx.filter(t => t.status === 'Cancelled' || t.status === 'Failed');
    const totalMoneyTransacted = completedTx.reduce((sum, t) => sum + t.amount, 0);

    // Enriched transactions with listing details
    const enrichedTx = allUserTx.map(t => {
      const listing = this.data.listings.find(l => l.id === t.listingId);
      const buyer = this.data.users.find(u => u.id === t.buyerId);
      const seller = this.data.users.find(u => u.id === t.sellerId);
      const fee = Math.round(t.amount * feeRate);

      return {
        ...t,
        listingName: listing ? listing.name : 'Unknown Item',
        buyerName: buyer ? buyer.name : 'Unknown Buyer',
        sellerName: seller ? seller.name : 'Unknown Seller',
        fee
      };
    });

    // Ratings received by this user
    const receivedRatings = this.data.ratings
      .filter(r => r.ratedUserId === userId)
      .map(r => {
        const reviewer = this.data.users.find(u => u.id === r.reviewerId);
        return {
          ...r,
          reviewerName: reviewer ? reviewer.name : 'Verified Customer',
          reviewerAvatar: reviewer ? reviewer.avatar : null,
          reviewerType: reviewer ? reviewer.userType : 'customer'
        };
      });

    // Reports filed against this user
    const reportsAgainstUser = this.data.reports
      .filter(r => r.reportedUserId === userId)
      .map(r => {
        const reporter = this.data.users.find(u => u.id === r.reporterId);
        return {
          ...r,
          reporterName: reporter ? reporter.name : 'Anonymous Reporter',
          reporterAvatar: reporter ? reporter.avatar : null,
          reporterType: reporter ? reporter.userType : 'customer',
          reporterSubscription: reporter ? reporter.subscription : 'Blue / Basic'
        };
      });

    // Subscription audit logs for this user
    const subscriptionHistory = this.data.subscriptionLogs
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.dateChanged) - new Date(a.dateChanged));

    return {
      user,
      stats: {
        totalListings: userListings.length,
        activeListings: activeListings.length,
        totalTransactions: allUserTx.length,
        completedTransactions: completedTx.length,
        cancelledTransactions: cancelledTx.length,
        totalMoneyTransacted,
        rating: user.rating,
        ratingsCount: receivedRatings.length,
        reportsCount: reportsAgainstUser.length
      },
      listings: userListings,
      transactions: enrichedTx,
      ratings: receivedRatings,
      reports: reportsAgainstUser,
      subscriptionHistory
    };
  }

  // ==========================================
  // SUBSCRIPTION ASSIGNMENT & LOGGING
  // ==========================================
  changeUserSubscription(userId, newSubscription, reason = 'Admin plan update') {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return { success: false, message: 'User not found' };

    const previousSubscription = user.subscription;
    if (previousSubscription === newSubscription) {
      return { success: false, message: 'User already has this subscription plan.' };
    }

    const now = new Date();
    const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Update user record
    user.subscription = newSubscription;
    user.subscriptionStatus = 'Active';
    user.subscriptionAssignedDate = dateFormatted.split(' ')[0];

    // Log to audit history
    const logEntry = {
      id: 'SUB-LOG-' + String(this.data.subscriptionLogs.length + 1).padStart(3, '0'),
      userId: user.id,
      userName: user.name,
      previousSubscription,
      newSubscription,
      dateChanged: dateFormatted,
      adminName: this.data.config.currentAdmin.name,
      reason
    };
    this.data.subscriptionLogs.unshift(logEntry);

    // Notify listeners so UI re-renders immediately
    this.notify();

    return {
      success: true,
      message: `Successfully updated ${user.name}'s subscription to ${newSubscription}`,
      logEntry
    };
  }

  // ==========================================
  // USER ACCOUNT STATUS MODERATION (Active / Suspended / Blocked)
  // ==========================================
  updateUserAccountStatus(userId, newStatus) {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return { success: false, message: 'User not found' };

    const validStatuses = ['Active', 'Suspended', 'Blocked'];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, message: 'Invalid account status' };
    }

    if (user.accountStatus === newStatus) {
      return { success: false, message: `${user.name} is already ${newStatus}.` };
    }

    user.accountStatus = newStatus;

    // Automatically deactivate or reactivate user's marketplace listings
    const userListings = this.data.listings.filter(l => l.userId === userId);
    if (newStatus === 'Suspended' || newStatus === 'Blocked') {
      userListings.forEach(l => {
        l.status = 'Inactive';
      });
    } else if (newStatus === 'Active') {
      userListings.forEach(l => {
        l.status = 'Active';
      });
    }

    this.notify();

    let actionLabel = 'activated';
    if (newStatus === 'Suspended') actionLabel = 'suspended';
    else if (newStatus === 'Blocked') actionLabel = 'blocked';

    return {
      success: true,
      message: `${user.name} (${user.id}) has been ${actionLabel}.`
    };
  }

  // ==========================================
  // REPORTS MANAGEMENT & FILTERING
  // ==========================================
  getFilteredReports(customFilters = {}) {
    const f = { ...this.state.reportFilters, ...customFilters };

    return this.data.reports
      .map(r => {
        const reporter = this.data.users.find(u => u.id === r.reporterId);
        const reportedUser = this.data.users.find(u => u.id === r.reportedUserId);
        const listing = r.listingId ? this.data.listings.find(l => l.id === r.listingId) : null;
        const transaction = r.transactionId
          ? this.data.transactions.find(t => t.id === r.transactionId)
          : this.data.transactions.find(t =>
              (t.buyerId === r.reporterId && t.sellerId === r.reportedUserId) ||
              (r.listingId && t.listingId === r.listingId && t.buyerId === r.reporterId)
            );
        const targetType = r.targetType || (listing ? listing.listingType : 'user');
        const reportType = r.reportType || r.category;
        const description = r.description || r.content;

        return {
          ...r,
          targetType,
          reportType,
          description,
          reporter,
          reportedUser,
          listing,
          transaction
        };
      })
      .filter(r => {
        // Search query
        if (f.search) {
          const q = f.search.toLowerCase().trim();
          const match =
            r.id.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q) ||
            (r.reportType && r.reportType.toLowerCase().includes(q)) ||
            (r.description && r.description.toLowerCase().includes(q)) ||
            r.content.toLowerCase().includes(q) ||
            (r.reporter && r.reporter.name.toLowerCase().includes(q)) ||
            (r.reportedUser && r.reportedUser.name.toLowerCase().includes(q)) ||
            (r.listing && r.listing.name.toLowerCase().includes(q));
          if (!match) return false;
        }

        // Target Type filter ('all' | 'user' | 'product' | 'property' | 'listing')
        if (f.targetType && f.targetType !== 'all') {
          if (f.targetType === 'listing') {
            if (r.targetType !== 'product' && r.targetType !== 'property') return false;
          } else if (r.targetType.toLowerCase() !== f.targetType.toLowerCase()) {
            return false;
          }
        }

        // Category / Report Type filter
        if (f.category !== 'all' && r.category.toLowerCase() !== f.category.toLowerCase() && (!r.reportType || !r.reportType.toLowerCase().includes(f.category.toLowerCase()))) {
          return false;
        }

        // Status filter
        if (f.status !== 'all' && r.status.toLowerCase() !== f.status.toLowerCase()) {
          return false;
        }

        return true;
      });
  }

  getReportDetails(reportId) {
    const report = this.data.reports.find(r => r.id === reportId);
    if (!report) return null;

    const reporter = this.data.users.find(u => u.id === report.reporterId);
    const reportedUser = this.data.users.find(u => u.id === report.reportedUserId);
    const listing = report.listingId ? this.data.listings.find(l => l.id === report.listingId) : null;
    const transaction = report.transactionId
      ? this.data.transactions.find(t => t.id === report.transactionId)
      : this.data.transactions.find(t =>
          (t.buyerId === report.reporterId && t.sellerId === report.reportedUserId) ||
          (report.listingId && t.listingId === report.listingId && t.buyerId === report.reporterId)
        );
    const targetType = report.targetType || (listing ? listing.listingType : 'user');
    const reportType = report.reportType || report.category;
    const description = report.description || report.content;

    // Reports count against reported user
    const totalReportsAgainstUser = this.data.reports.filter(r => r.reportedUserId === report.reportedUserId).length;

    return {
      report: {
        ...report,
        targetType,
        reportType,
        description
      },
      reporter,
      reportedUser: {
        ...reportedUser,
        totalReportsCount: totalReportsAgainstUser
      },
      listing,
      transaction
    };
  }

  updateListingStatus(listingId, newStatus) {
    const listing = this.data.listings.find(l => l.id === listingId);
    if (!listing) return { success: false, message: 'Listing not found' };

    listing.status = newStatus;
    this.notify();
    return {
      success: true,
      message: `Listing "${listing.name}" (${listing.id}) status updated to ${newStatus}.`
    };
  }

  updateReportStatus(reportId, newStatus) {
    const report = this.data.reports.find(r => r.id === reportId);
    if (!report) return { success: false, message: 'Report not found' };

    report.status = newStatus;
    this.notify();
    return {
      success: true,
      message: `Report ${reportId} status updated to ${newStatus}`
    };
  }

  // ==========================================
  // TRANSACTION DETAILS
  // ==========================================
  getTransactionDetails(txId) {
    const tx = this.data.transactions.find(t => t.id === txId);
    if (!tx) return null;

    const buyer = this.data.users.find(u => u.id === tx.buyerId);
    const seller = this.data.users.find(u => u.id === tx.sellerId);
    const listing = this.data.listings.find(l => l.id === tx.listingId);
    const feeRate = this.data.config.platformFeeRate;
    const kovaFee = Math.round(tx.amount * feeRate);

    return {
      ...tx,
      buyer,
      seller,
      listing,
      kovaFee,
      platformFeeRate: feeRate
    };
  }

  // ==========================================
  // PLATFORM FEE SETTING
  // ==========================================
  setPlatformFeeRate(newRate) {
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate < 0 || rate > 1) {
      return { success: false, message: 'Invalid fee rate. Must be between 0.00 and 1.00 (e.g. 0.049 for 4.9%)' };
    }
    this.data.config.platformFeeRate = rate;
    this.notify();
    return {
      success: true,
      message: `Kova platform transaction fee updated to ${(rate * 100).toFixed(1)}%`
    };
  }

  // ==========================================
  // GLOBAL SEARCH (Users, Products, Properties, Transactions, Reports)
  // ==========================================
  globalSearch(query) {
    if (!query || !query.trim()) {
      return { users: [], listings: [], transactions: [], reports: [] };
    }

    const q = query.toLowerCase().trim();

    // 1. Users
    const users = this.data.users
      .filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.category.toLowerCase().includes(q)
      )
      .slice(0, 5);

    // 2. Listings
    const listings = this.data.listings
      .filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
      )
      .map(l => {
        const owner = this.data.users.find(u => u.id === l.userId);
        return { ...l, ownerName: owner ? owner.name : 'Unknown' };
      })
      .slice(0, 5);

    // 3. Transactions
    const transactions = this.data.transactions
      .filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
      )
      .map(t => {
        const listing = this.data.listings.find(l => l.id === t.listingId);
        return { ...t, listingName: listing ? listing.name : 'Item' };
      })
      .slice(0, 5);

    // 4. Reports
    const reports = this.data.reports
      .filter(r =>
        r.id.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q)
      )
      .slice(0, 5);

    return { users, listings, transactions, reports };
  }

  // ==========================================
  // STATE SETTERS & CONVENIENCE HELPERS
  // ==========================================
  setDashboardDateRange(rangeKey, customStart = null, customEnd = null) {
    this.state.dashboardDateRange = rangeKey;
    this.state.customStartDate = customStart;
    this.state.customEndDate = customEnd;
    this.notify();
  }

  setChartMetric(metric) {
    this.state.chartMetric = metric;
    this.notify();
  }

  setUserFilters(filters) {
    this.state.userFilters = { ...this.state.userFilters, ...filters };
    this.notify();
  }

  resetUserFilters() {
    this.state.userFilters = {
      search: '',
      userType: 'all',
      category: 'all',
      subscription: 'all',
      accountStatus: 'all',
      rating: 'all'
    };
    this.notify();
  }

  setReportFilters(filters) {
    this.state.reportFilters = { ...this.state.reportFilters, ...filters };
    this.notify();
  }

  resetReportFilters() {
    this.state.reportFilters = {
      search: '',
      targetType: 'all',
      category: 'all',
      status: 'all'
    };
    this.notify();
  }

  getAllCategories() {
    const cats = new Set();
    this.data.users.forEach(u => u.category && cats.add(u.category));
    this.data.listings.forEach(l => l.category && cats.add(l.category));
    return Array.from(cats).sort();
  }

  getRecentTransactions(limit = 10, dateRange = this.state.dashboardDateRange) {
    const allTx = this.data.transactions;
    const feeRate = this.data.config.platformFeeRate;
    
    // Filter by date range if applicable
    const filtered = allTx.filter(t => 
      this.isDateInFilter(t.date, dateRange, this.state.customStartDate, this.state.customEndDate)
    );
    
    // Sort transactions by date descending
    const sorted = [...(filtered.length ? filtered : allTx)].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return sorted.slice(0, limit).map(t => {
      const buyer = this.data.users.find(u => u.id === t.buyerId);
      const seller = this.data.users.find(u => u.id === t.sellerId);
      const listing = this.data.listings.find(l => l.id === t.listingId);
      const fee = Math.round(t.amount * feeRate);

      return {
        ...t,
        buyerName: buyer ? buyer.name : 'Verified Customer',
        buyerAvatar: buyer ? buyer.avatar : null,
        sellerName: seller ? seller.name : 'Verified Vendor',
        sellerAvatar: seller ? seller.avatar : null,
        sellerType: seller ? seller.userType : 'vendor',
        sellerSubscription: seller ? seller.subscription : 'Blue / Basic',
        listingName: listing ? listing.name : 'Marketplace Item',
        listingType: listing ? listing.listingType : 'product',
        fee
      };
    });
  }
}

// Global Singleton Store Instance
window.kovaStore = new KovaStore();
