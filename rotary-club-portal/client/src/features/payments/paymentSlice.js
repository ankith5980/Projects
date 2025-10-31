import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [],
  currentPayment: null,
  isLoading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments: (state, action) => {
      state.payments = action.payload;
    },
    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
    },
  },
});

export const { setPayments, setCurrentPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
