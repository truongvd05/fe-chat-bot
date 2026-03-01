import { setupListeners } from "@reduxjs/toolkit/query";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import { userApi } from "@/feature/User/userApi";
import userReducer from "@/feature/User/userSlice";
import storage from "redux-persist/lib/storage";
import { authApi } from "@/feature/Auth/authApi";
import { conversationApi } from "@/feature/Conversation/conversationApi";
import { messageApi } from "@/feature/Message/messageApi";
import onlineReducer from "@/feature/onlineUsers/onlineUsersSlice";

const userPersistConfig = {
  key: "user",
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [conversationApi.reducerPath]: conversationApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    user: persistedUserReducer,
    online: onlineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      userApi.middleware,
      authApi.middleware,
      conversationApi.middleware,
      messageApi.middleware,
    ),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
