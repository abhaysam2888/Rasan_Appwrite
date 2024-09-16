// store.js
import { configureStore } from '@reduxjs/toolkit';
import getDataSlice from './getDataSlice';
import getUserData from './getUserData';

const store = configureStore({
  reducer: {
    data: getDataSlice,
    userData: getUserData,
  },
});

export default store;
