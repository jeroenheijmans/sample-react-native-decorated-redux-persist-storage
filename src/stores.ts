import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {delay} from './util';

type CounterState = {
  value: number;
  status: string;
};

type RootState = {
  counter: CounterState;
};

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount: number) => {
    await delay(1500);
    return amount;
  },
);

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    reset: state => ({...state, value: 0}),
    increment: state => ({...state, value: state.value + 1}),
    decrement: state => ({...state, value: state.value - 1}),
  },
  extraReducers: builder => {
    builder
      .addCase(incrementAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      });
  },
});

export const counterReducer = counterSlice.reducer;
export const {increment, decrement, reset} = counterSlice.actions;
export const selectCount = (state: RootState) => state.counter.value;
export const selectStatus = (state: RootState) => state.counter.status;
