import EncryptedStorage from 'react-native-encrypted-storage';
import {delay, log} from './util';

export const decoratedStorage = {
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
