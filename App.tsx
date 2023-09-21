import React from 'react';
import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {Text, View, SafeAreaView, StyleSheet} from 'react-native';
import {log} from './src/util';
import {counterReducer} from './src/stores';
import {Counter} from './src/Counter';
import {decoratedStorage} from './src/decoratedStorage';

log('------------------------------------------------');
log('[START] Loading App.tsx file');

const persistConfig = {
  key: 'root',
  timeout: 5000,
  storage: decoratedStorage,
};

const persistedReducer = persistReducer(persistConfig, counterReducer);

const store = configureStore({
  reducer: {
    counter: persistedReducer,
  },
  middleware: [thunk],
});

const persistor = persistStore(store);

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
});
