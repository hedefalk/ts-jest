import { allPackageSetsWithPreset, allValidPackageSets } from '../__helpers__/templates'
import { configureTestCase } from '../__helpers__/test-case'

describe('using babel-jest for js files', () => {
  const testCase = configureTestCase('allow-js/with-outDir', {
    jestConfig: { testMatch: null, testRegex: '(foo|bar)\\.spec\\.[jt]s$' },
  })

  testCase.runWithTemplates(allValidPackageSets, 0, (runTest, { testLabel }) => {
    it(testLabel, () => {
      const result = runTest()
      expect(result.status).toBe(0)
      expect(result).toMatchSnapshot()
    })
  })
})

describe('using ts-jest for js files with outDir', () => {
  const testCase = configureTestCase('allow-js/with-outDir', {
    jestConfig: {
      preset: 'ts-jest/presets/js-with-ts',
      testMatch: null,
      testRegex: 'esm\\.spec\\.[jt]s$',
    },
  })

  testCase.runWithTemplates(allPackageSetsWithPreset, 0, (runTest, { testLabel }) => {
    it(testLabel, () => {
      const result = runTest()
      expect(result.status).toBe(0)
      expect(result).toMatchSnapshot()
    })
  })
})

describe('using ts-jest for js files without outDir', () => {
  const testCase = configureTestCase('allow-js/without-outDir', {
    jestConfig: {
      preset: 'ts-jest/presets/js-with-ts',
      testMatch: null,
      testRegex: 'esm\\.spec\\.[jt]s$',
    },
  })

  testCase.runWithTemplates(allPackageSetsWithPreset, 0, (runTest, { testLabel }) => {
    it(testLabel, () => {
      const result = runTest()
      expect(result.status).toBe(0)
      expect(result).toMatchSnapshot()
    })
  })
})
