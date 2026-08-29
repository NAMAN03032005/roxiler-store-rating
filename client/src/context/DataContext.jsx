import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storeService } from '../services/storeService';
import { userService } from '../services/userService';
import { ratingService } from '../services/ratingService';
import { ownerService } from '../services/ownerService';
import API from '../services/api';

import { initialUsers } from '../data/mockUsers';
import { initialStores } from '../data/mockStores';
import { initialRatings } from '../data/mockRatings';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [stores, setStores] = useState(initialStores);
  const [ratings, setRatings] = useState(initialRatings);
  const [loading, setLoading] = useState(false);

  // Fetch all stores from Express backend API
  const refreshStores = useCallback(async () => {
    try {
      const res = await storeService.getAllStores();
      if (res.success && Array.isArray(res.data)) {
        setStores(res.data);
      }
    } catch (err) {
      console.warn('[DataContext] Store API fetch fallback to local seed data.');
    }
  }, []);

  // Fetch all users from Express backend API
  const refreshUsers = useCallback(async () => {
    try {
      const res = await userService.getAllUsers();
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (err) {
      console.warn('[DataContext] User API fetch fallback to local seed data.');
    }
  }, []);

  useEffect(() => {
    refreshStores();
  }, [refreshStores]);

  // Compute store average rating & total count for any store
  const getStoreStats = (storeId) => {
    const storeObj = stores.find((s) => s.id === storeId || s._id === storeId);
    const storeRatings = ratings.filter((r) => r.storeId === storeId || r.store === storeId);

    const count = storeRatings.length;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    storeRatings.forEach((r) => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating] += 1;
      }
    });

    if (storeObj && storeObj.overallRating !== undefined) {
      return {
        overallRating: storeObj.overallRating,
        ratingCount: storeObj.totalRatings || count,
        distribution,
      };
    }

    if (count === 0) {
      return { overallRating: 0, ratingCount: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const sum = storeRatings.reduce((acc, curr) => acc + curr.rating, 0);
    const overallRating = Math.round((sum / count) * 10) / 10;

    return { overallRating, ratingCount: count, distribution };
  };

  // Add User action
  const addUser = async (newUserData) => {
    try {
      const res = await userService.createUser(newUserData);
      if (res.success && res.data) {
        setUsers((prev) => [res.data, ...prev]);
        refreshUsers();
        return res.data;
      }
    } catch (err) {
      // Fallback
      const newUser = {
        id: `usr_${Date.now()}`,
        _id: `usr_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        ...newUserData,
      };
      setUsers((prev) => [newUser, ...prev]);
      return newUser;
    }
  };

  // Add Store action
  const addStore = async (newStoreData) => {
    try {
      const res = await storeService.createStore(newStoreData);
      if (res.success && res.data) {
        setStores((prev) => [res.data, ...prev]);
        refreshStores();
        return res.data;
      }
    } catch (err) {
      // Fallback
      const newStore = {
        id: `str_${Date.now()}`,
        _id: `str_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        overallRating: 0,
        totalRatings: 0,
        owner: null,
        ...newStoreData,
      };
      setStores((prev) => [newStore, ...prev]);
      return newStore;
    }
  };

  // Submit or Update Rating action
  const submitOrUpdateRating = async (storeId, ratingValue, user) => {
    if (!user) return;

    try {
      await ratingService.submitRating(storeId, ratingValue);
      refreshStores();
    } catch (err) {
      console.warn('[DataContext] Submit rating API fallback to local state mutation.');
    }

    setRatings((prevRatings) => {
      const existingIdx = prevRatings.findIndex(
        (r) => (r.storeId === storeId || r.store === storeId) && (r.userId === user.id || r.userEmail === user.email)
      );

      if (existingIdx >= 0) {
        const updated = [...prevRatings];
        updated[existingIdx] = {
          ...updated[existingIdx],
          rating: ratingValue,
          createdAt: new Date().toISOString().split('T')[0],
        };
        return updated;
      } else {
        const newRating = {
          id: `rtg_${Date.now()}`,
          userId: user.id || 'usr_current',
          userName: user.name || 'Current User',
          userEmail: user.email || 'user@example.com',
          storeId,
          rating: ratingValue,
          createdAt: new Date().toISOString().split('T')[0],
        };
        return [newRating, ...prevRatings];
      }
    });
  };

  // User Dashboard Data
  const getUserDashboardData = (currentUser) => {
    const userEmail = currentUser?.email;
    const userId = currentUser?.id || currentUser?._id;

    const userSubmittedRatings = ratings.filter(
      (r) => r.userId === userId || r.userEmail === userEmail || (r.user && (r.user._id === userId || r.user.email === userEmail))
    );

    const ratedStoreIds = new Set(userSubmittedRatings.map((r) => r.storeId || r.store?._id || r.store));
    const totalStoresCount = stores.length;
    const ratedStoresCount = ratedStoreIds.size;
    const pendingStoresCount = Math.max(0, totalStoresCount - ratedStoresCount);

    const totalRatingSum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const platformAvgRating = ratings.length > 0 ? (totalRatingSum / ratings.length).toFixed(1) : '0.0';

    const recentActivity = userSubmittedRatings.map((r) => {
      const storeObj = stores.find((s) => s.id === r.storeId || s._id === r.storeId || s.id === r.store || s._id === r.store);
      return {
        id: r.id || r._id,
        storeName: storeObj ? storeObj.name : 'Merchant Store',
        rating: r.rating,
        date: r.createdAt ? r.createdAt.toString().split('T')[0] : '2026-02-25',
      };
    });

    const unratedStores = stores.filter((s) => !ratedStoreIds.has(s.id) && !ratedStoreIds.has(s._id));

    return {
      totalStoresCount,
      ratedStoresCount,
      pendingStoresCount,
      platformAvgRating,
      recentActivity,
      unratedStores,
      userSubmittedRatingsMap: userSubmittedRatings.reduce((acc, r) => {
        const key = r.storeId || r.store?._id || r.store;
        if (key) acc[key] = r.rating;
        return acc;
      }, {}),
    };
  };

  // Admin Dashboard Stats
  const getAdminDashboardData = () => {
    const totalUsers = users.length;
    const normalUsers = users.filter((u) => u.role === 'user' || u.role === 'NORMAL_USER').length;
    const storeOwners = users.filter((u) => u.role === 'owner' || u.role === 'STORE_OWNER').length;
    const admins = users.filter((u) => u.role === 'admin' || u.role === 'ADMIN').length;

    const totalStores = stores.length;
    const totalRatings = ratings.length;

    const totalSum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = totalRatings > 0 ? (totalSum / totalRatings).toFixed(1) : '0.0';

    const recentRatingsList = ratings.slice(0, 5).map((r) => {
      const storeObj = stores.find((s) => s.id === r.storeId || s._id === r.storeId || s.id === r.store || s._id === r.store);
      return {
        id: r.id || r._id,
        userName: r.userName || (r.user ? r.user.name : 'User'),
        userEmail: r.userEmail || (r.user ? r.user.email : 'N/A'),
        storeName: storeObj ? storeObj.name : 'Merchant Store',
        rating: r.rating,
        date: r.createdAt ? r.createdAt.toString().split('T')[0] : '2026-02-25',
      };
    });

    return {
      totalUsers,
      normalUsers,
      storeOwners,
      admins,
      totalStores,
      totalRatings,
      avgRating,
      recentRatingsList,
    };
  };

  // Store Owner Dashboard Data
  const getOwnerDashboardData = (ownerStoreId = 'str_101') => {
    const ownerStore = stores.find((s) => s.id === ownerStoreId || s._id === ownerStoreId) || stores[0];
    const { overallRating, ratingCount, distribution } = getStoreStats(ownerStore ? (ownerStore.id || ownerStore._id) : 'str_101');
    const storeRatings = ratings
      .filter((r) => r.storeId === ownerStore?.id || r.store === ownerStore?._id)
      .map((r) => ({
        id: r.id || r._id,
        userName: r.userName || (r.user ? r.user.name : 'Customer'),
        userEmail: r.userEmail || (r.user ? r.user.email : 'N/A'),
        rating: r.rating,
        date: r.createdAt ? r.createdAt.toString().split('T')[0] : '2026-02-25',
      }));

    return {
      store: ownerStore,
      overallRating,
      ratingCount,
      distribution,
      storeRatings,
    };
  };

  return (
    <DataContext.Provider
      value={{
        users,
        stores,
        ratings,
        loading,
        getStoreStats,
        addUser,
        addStore,
        submitOrUpdateRating,
        getUserDashboardData,
        getAdminDashboardData,
        getOwnerDashboardData,
        refreshStores,
        refreshUsers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
