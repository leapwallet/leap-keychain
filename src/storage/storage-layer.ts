import Container, { Token } from 'typedi';

export type StorageLayer = {
  /**
   * @description Get the keystore from the storage
   * @param key
   */
  get: <T = string>(key: string) => Promise<T>;
  /**
   * @description Set the keystore to the storage
   * @param key
   * @param value
   */
  set: <T = string>(key: string, value: T) => Promise<void>;
  /**
   * @description Remove the keystore from the storage
   * @param key
   */
  remove: (key: string) => Promise<void>;
};

export const storageToken = new Token<StorageLayer>('storage');

/**
 * Initialize storage layer.
 * @param storageLayer
 */
export function initStorage(storageLayer: StorageLayer) {
  Container.set(storageToken, storageLayer);
}
