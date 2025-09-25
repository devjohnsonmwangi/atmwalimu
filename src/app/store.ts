// src/app/store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// All API slices
import { usersAPI } from "../features/users/usersAPI";
import { caseAndPaymentAPI } from "../features/case/caseAPI";
import { paymentAPI } from "../features/payment/paymentAPI";
import { logAPI } from "../features/log/logsapi";
import { feedbackAPI } from "../features/feedback/feedbackapi";
import { TicketAPI } from "../features/Tickets/AllTickets";
import { eventAndReminderAPI } from "../features/events/events";
import { eventReminderAPI } from "../features/events/eventreminder";
import { locationBranchAPI } from "../features/branchlocation/branchlocationapi";
import { documentsApi } from "../features/documents/docmentsApi";
import { appointmentAPI } from "../features/appointment/appointmentapi";
import { authApi } from "../features/login/loginAPI";
import { teamApi } from "../features/team/teamApi";
import { chatsAPI } from "../features/chats/chatsAPI";
import { notificationsAPI } from "../features/notifications/notificationAPI";
import { newsApi } from "../features/news/newsAPI";

// Regular Redux Slices
import userReducer from "../features/users/userSlice";
import onlineStatusReducer from "../features/online/online";
import cartReducer from "../features/cart/cartSlice"; // <--- 1. IMPORT the new cart reducer

// --- Persist Configuration ---
const persistConfig = {
    key: "root",
    storage,
    version: 1,
    
    // Whitelist: The slices of state you WANT to save to storage.
    whitelist: [
        "user", // Persist user auth info
        "cart", // <--- 2. ADD 'cart' to the whitelist to save it in local storage
        usersAPI.reducerPath,
        caseAndPaymentAPI.reducerPath,
        paymentAPI.reducerPath,
        logAPI.reducerPath,
        feedbackAPI.reducerPath,
        TicketAPI.reducerPath,
        eventAndReminderAPI.reducerPath,
        eventReminderAPI.reducerPath,
        locationBranchAPI.reducerPath,
        documentsApi.reducerPath,
        appointmentAPI.reducerPath,
        authApi.reducerPath,
        teamApi.reducerPath,
        chatsAPI.reducerPath,
        notificationsAPI.reducerPath,
        newsApi.reducerPath,
    ],
    
    // Blacklist: The slices of state you DON'T want to save.
    blacklist: ["onlineStatus"],
};

// Combine all reducers
const rootReducer = combineReducers({
    // API Reducers
    [teamApi.reducerPath]: teamApi.reducer,
    [usersAPI.reducerPath]: usersAPI.reducer,
    [caseAndPaymentAPI.reducerPath]: caseAndPaymentAPI.reducer,
    [paymentAPI.reducerPath]: paymentAPI.reducer,
    [logAPI.reducerPath]: logAPI.reducer,
    [feedbackAPI.reducerPath]: feedbackAPI.reducer,
    [TicketAPI.reducerPath]: TicketAPI.reducer,
    [eventAndReminderAPI.reducerPath]: eventAndReminderAPI.reducer,
    [eventReminderAPI.reducerPath]: eventReminderAPI.reducer,
    [locationBranchAPI.reducerPath]: locationBranchAPI.reducer,
    [documentsApi.reducerPath]: documentsApi.reducer,
    [appointmentAPI.reducerPath]: appointmentAPI.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [chatsAPI.reducerPath]: chatsAPI.reducer,
    [notificationsAPI.reducerPath]: notificationsAPI.reducer,
    [newsApi.reducerPath]: newsApi.reducer,

    // Regular Reducers
    user: userReducer,
    onlineStatus: onlineStatusReducer,
    cart: cartReducer, // <--- 3. ADD the cart reducer to the root reducer
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(
            // Concatenate all API middlewares
            usersAPI.middleware,
            caseAndPaymentAPI.middleware,
            paymentAPI.middleware,
            logAPI.middleware,
            feedbackAPI.middleware,
            TicketAPI.middleware,
            eventAndReminderAPI.middleware,
            eventReminderAPI.middleware,
            locationBranchAPI.middleware,
            documentsApi.middleware,
            appointmentAPI.middleware,
            authApi.middleware,
            teamApi.middleware,
            chatsAPI.middleware,
            notificationsAPI.middleware,
            newsApi.middleware
        ),
});

// Create the persistor
export const persistor = persistStore(store);

// Define RootState and AppDispatch types
// IMPORTANT: The RootState should be derived from the rootReducer BEFORE it's persisted.
// This ensures TypeScript knows the correct shape of the combined state.
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;