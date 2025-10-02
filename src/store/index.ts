import { configureStore } from "@reduxjs/toolkit";
// Import các slice ở đây
// import exampleReducer from './slices/exampleSlice';

export const store = configureStore({
  reducer: {
    // example: exampleReducer,
    // Thêm các slice khác tại đây
  },
  // middleware, devTools, ... có thể cấu hình thêm nếu cần
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
