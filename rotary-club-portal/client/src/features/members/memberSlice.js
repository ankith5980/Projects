import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  members: [],
  currentMember: null,
  isLoading: false,
  error: null,
};

const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    setCurrentMember: (state, action) => {
      state.currentMember = action.payload;
    },
  },
});

export const { setMembers, setCurrentMember } = memberSlice.actions;
export default memberSlice.reducer;
