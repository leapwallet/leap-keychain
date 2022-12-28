import Container, { Token } from 'typedi';

export type StorageLayer = {
  get: <T = string>(key: string) => Promise<T>;
  set: <T = string>(key: string, value: T) => Promise<void>;
  remove: (key: string) => Promise<void>;
};

export const storageToken = new Token<StorageLayer>('storage');

export function initStorage(storageLayer: StorageLayer) {
  Container.set(storageToken, storageLayer);
}
