import React from 'react';
import {Button, Text, View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  decrement,
  increment,
  incrementAsync,
  reset,
  selectCount,
  selectStatus,
} from './stores';
import {log} from './util';

export const Counter = () => {
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

const styles = StyleSheet.create({
  buttonsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    margin: 8,
    marginTop: 16,
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
