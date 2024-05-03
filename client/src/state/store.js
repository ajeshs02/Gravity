import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import userReducer from './slices/userSlice'
import formReducer from './slices/formSlice.js'
import storeReducer from './slices/storeSlice.js'
import cartReducer from './slices/cartSlice.js'
import adminReducer from './slices/adminSlice.js'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedUserReducer = persistReducer(persistConfig, userReducer)
const persistedStoreReducer = persistReducer(persistConfig, storeReducer)
const persistedAdminReducer = persistReducer(persistConfig, adminReducer)

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    form: formReducer,
    store: persistedStoreReducer,
    cart: cartReducer,
    admin: persistedAdminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)
