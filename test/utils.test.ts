import { getHardenedPath } from '../src'
import expect from 'expect.js'

describe('getHardenedPath', () => {
  it('should return the correct path', () => {
    const path = "m/44'/118'/0'/0/0"
    const hardenedPath = getHardenedPath(path)
    expect(hardenedPath).to.equal("m/44'/118'/0'/0'/0'")
  })
})

