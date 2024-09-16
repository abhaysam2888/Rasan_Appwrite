import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    rasanArray: [],
    updateRasanArray: [],
    queryLimit: 5,
    extraqueryLimit: 10,
    getExtraRassanArray: [],
    getMonthlyExpenses: 0,
    updateContri: 0,
}

const getDataSlice = createSlice({
    name: 'getDataSlice',
    initialState: initialState,

    reducers: {
      getData: (state, action) => {
        state.rasanArray = action.payload
      },
      updateData: (state, action) => {
        state.updateRasanArray = action.payload
      },
      setQueryLimit: (state) => {
        state.queryLimit = state.queryLimit + 10
      },
      setExtraQueryLimit: (state) => {
        state.extraqueryLimit = state.extraqueryLimit + 10
      },
      setExtraRasanArray: (state, action) => {
        state.getExtraRassanArray = action.payload
      },
      setMonthlyExp: (state, action) => {
        state.getMonthlyExpenses = action.payload
      },
      setgetContri: (state) => {
        state.updateContri = state.updateContri + 1
      },
    },
  });
  
  export const { getData, updateData, setQueryLimit, setExtraQueryLimit, setExtraRasanArray, setMonthlyExp, setgetContri} = getDataSlice.actions;
  
  export default getDataSlice.reducer;