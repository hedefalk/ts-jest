import { Config } from '@jest/types'
import { resolve } from 'path'

import { createCompilerInstance } from '../compiler/instance'
import { ConfigSet } from '../config/config-set'
import { BabelConfig, TsCompiler, TsJestConfig, TsJestGlobalOptions } from '../types'
import { ImportReasons } from '../util/messages'

export function filePath(relPath: string): string {
  return resolve(__dirname, '..', '..', relPath)
}

export const rootDir = filePath('')

export function tsJestConfig(options?: Partial<TsJestConfig>): TsJestConfig {
  return {
    isolatedModules: false,
    compiler: 'typescript',
    transformers: [],
    babelConfig: undefined,
    tsConfig: undefined,
    packageJson: undefined,
    stringifyContentPathRegex: undefined,
    diagnostics: { ignoreCodes: [], pretty: false, throws: true },
    experimentalEsm: false,
    ...options,
  }
}

export function getJestConfig<T extends Config.ProjectConfig>(
  options?: Partial<Config.InitialOptions | Config.ProjectConfig>,
  tsJestOptions?: TsJestGlobalOptions,
): T {
  const res = {
    globals: {},
    ...options,
  } as any
  if (tsJestOptions) {
    res.globals['ts-jest'] = tsJestOptions
  }

  return res
}

export function babelConfig<T extends BabelConfig>(options?: BabelConfig): T {
  return {
    ...options,
    presets: [...(options && options.presets)],
    plugins: [...(options && options.plugins)],
  } as any
}

export function importReason(text = '[[BECAUSE]]'): ImportReasons {
  return text as any
}

// not really unit-testing here, but it's hard to mock all those values :-D
export function makeCompiler({
  jestConfig,
  tsJestConfig,
  parentConfig,
}: {
  jestConfig?: Partial<Config.ProjectConfig>
  tsJestConfig?: TsJestGlobalOptions
  parentConfig?: TsJestGlobalOptions
} = {}): TsCompiler {
  tsJestConfig = { ...tsJestConfig }
  tsJestConfig.diagnostics = {
    ...(tsJestConfig.diagnostics as any),
    pretty: false,
  }
  const testRegex = ['^.+\\.[tj]sx?$']
  const testMatch = ['^.+\\.tsx?$']
  jestConfig = {
    ...jestConfig,
    testMatch: jestConfig?.testMatch ? [...jestConfig.testMatch, ...testMatch] : testMatch,
    testRegex: jestConfig?.testRegex ? [...testRegex, ...jestConfig.testRegex] : testRegex,
  }
  const cs = new ConfigSet(getJestConfig(jestConfig, tsJestConfig), parentConfig)

  return createCompilerInstance(cs)
}
