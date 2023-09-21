import React from 'react';
import {configureStore, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import thunk from 'redux-thunk';
import {useSelector, useDispatch, Provider} from 'react-redux';
import {Text, Button, View, SafeAreaView, StyleSheet} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

type CounterState = {
  value: number;
  status: string;
};

type RootState = {
  counter: CounterState;
};

function log(...args: unknown[]) {
  console.log(`[${new Date().toISOString().substring(11)}]`, ...args);
}

async function delay(ms?: number) {
  log(`[DELAY] ${ms || 0}ms started`);
  await new Promise(r => setTimeout(r, ms));
  log(`[DELAY] ${ms || 0}ms finished`);
}

log('------------------------------------------------');
log('[START] Loading App.tsx file');

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

const incrementAsync = createAsyncThunk(
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

const {increment, decrement, reset} = counterSlice.actions;
const selectCount = (state: RootState) => state.counter.value;
const selectStatus = (state: RootState) => state.counter.status;

const decoratedStorage = {
  async getItem(key: string) {
    log(`[^ - GET] starting for key '${key}'`);
    await delay(250);
    const raw = await EncryptedStorage.getItem(key);
    log(`[^ - GET] resolved for key '${key}'`);
    return raw;
  },
  async setItem(key: string, value: string) {
    log(`[v - SET] starting for key '${key}'. Value = `, value);
    await delay(250);
    await EncryptedStorage.setItem(key, value);
    log(`[v - SET] resolved for key '${key}'. Value = `, value);
  },
  async removeItem(key: string) {
    log(`[x - DEL] starting for key '${key}`);
    await delay(250);
    await EncryptedStorage.removeItem(key);
    log(`[x - DEL] resolved for key '${key}`);
  },
};

const persistConfig = {
  key: 'root',
  timeout: 5000,
  storage: decoratedStorage,
};

const persistedReducer = persistReducer(persistConfig, counterSlice.reducer);

const store = configureStore({
  reducer: {
    counter: persistedReducer,
  },
  middleware: [thunk],
});

const persistor = persistStore(store);

const Counter = () => {
  log('[RENDER - Counter]');

  const count = useSelector(selectCount);
  const status = useSelector(selectStatus);
  const dispatch = useDispatch<any>(); // TODO: Get rid of the 'any' type
  const disabled = status === 'loading';

  return (
    <>
      <Text style={styles.number}>{count}</Text>
      <Text
        style={[
          styles.paragraph,
          status === 'loading' ? styles.active : styles.inactive,
        ]}>
        {status}
      </Text>
      <View style={styles.buttonsContainer}>
        <Button
          title="Decrement (-1)"
          onPress={() => dispatch(decrement())}
          color="firebrick"
        />
        <Button
          title="Increment (+1)"
          onPress={() => dispatch(increment())}
          color="seagreen"
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          disabled={disabled}
          title="Delayed increment (+10)"
          onPress={() => dispatch(incrementAsync(10))}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          disabled={disabled}
          title="Log empty line"
          onPress={() => console.log('')}
          color="gray"
        />
        <Button
          disabled={disabled}
          title="Reset counter to 0"
          onPress={() => dispatch(reset())}
          color="gray"
        />
      </View>
    </>
  );
};

export default function App(): JSX.Element {
  log('[RENDER - App]');
  const loader = (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Loading...</Text>
    </View>
  );
  return (
    <Provider store={store}>
      <PersistGate loading={loader} persistor={persistor}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.paragraph}>Counter example</Text>
          <Counter />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    margin: 8,
    marginTop: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    fontSize: 26,
    textAlign: 'center',
  },
  number: {
    margin: 8,
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  active: {
    color: 'dodgerblue',
  },
  inactive: {
    color: 'silver',
  },
});
