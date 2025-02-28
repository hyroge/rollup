const assert = require('assert');
const path = require('path');

const ID_MAIN = path.join(__dirname, 'main.js');
const ID_LIB = path.join(__dirname, 'lib.js');
const ID_DEP = path.join(__dirname, 'dep.js');

module.exports = {
	description: 'supports implicit dependencies when emitting files',
	options: {
		preserveEntrySignatures: 'allow-extension',
		plugins: {
			name: 'test-plugin',
			buildStart() {
				this.emitFile({
					type: 'chunk',
					id: 'dep.js',
					implicitlyLoadedAfterOneOf: [ID_MAIN]
				});
			},
			buildEnd() {
				assert.deepStrictEqual(JSON.parse(JSON.stringify(this.getModuleInfo(ID_MAIN))), {
					ast: {
						type: 'Program',
						start: 0,
						end: 51,
						body: [
							{
								type: 'ImportDeclaration',
								start: 0,
								end: 30,
								specifiers: [
									{
										type: 'ImportSpecifier',
										start: 9,
										end: 14,
										imported: { type: 'Identifier', start: 9, end: 14, name: 'value' },
										local: { type: 'Identifier', start: 9, end: 14, name: 'value' }
									}
								],
								source: { type: 'Literal', start: 22, end: 29, value: './lib', raw: "'./lib'" }
							},
							{
								type: 'ExpressionStatement',
								start: 31,
								end: 50,
								expression: {
									type: 'CallExpression',
									start: 31,
									end: 49,
									callee: {
										type: 'MemberExpression',
										start: 31,
										end: 42,
										object: { type: 'Identifier', start: 31, end: 38, name: 'console' },
										property: { type: 'Identifier', start: 39, end: 42, name: 'log' },
										computed: false,
										optional: false
									},
									arguments: [{ type: 'Identifier', start: 43, end: 48, name: 'value' }],
									optional: false
								}
							}
						],
						sourceType: 'module'
					},
					code: "import { value } from './lib';\nconsole.log(value);\n",
					dynamicallyImportedIdResolutions: [],
					dynamicallyImportedIds: [],
					dynamicImporters: [],
					hasDefaultExport: false,
					hasModuleSideEffects: true,
					id: ID_MAIN,
					implicitlyLoadedAfterOneOf: [],
					implicitlyLoadedBefore: [ID_DEP],
					importedIdResolutions: [
						{
							external: false,
							id: ID_LIB,
							meta: {},
							moduleSideEffects: true,
							syntheticNamedExports: false
						}
					],
					importedIds: [ID_LIB],
					importers: [],
					isEntry: true,
					isExternal: false,
					isIncluded: true,
					meta: {},
					syntheticNamedExports: false
				});
				assert.deepStrictEqual(JSON.parse(JSON.stringify(this.getModuleInfo(ID_DEP))), {
					ast: {
						type: 'Program',
						start: 0,
						end: 51,
						body: [
							{
								type: 'ImportDeclaration',
								start: 0,
								end: 30,
								specifiers: [
									{
										type: 'ImportSpecifier',
										start: 9,
										end: 14,
										imported: { type: 'Identifier', start: 9, end: 14, name: 'value' },
										local: { type: 'Identifier', start: 9, end: 14, name: 'value' }
									}
								],
								source: { type: 'Literal', start: 22, end: 29, value: './lib', raw: "'./lib'" }
							},
							{
								type: 'ExpressionStatement',
								start: 31,
								end: 50,
								expression: {
									type: 'CallExpression',
									start: 31,
									end: 49,
									callee: {
										type: 'MemberExpression',
										start: 31,
										end: 42,
										object: { type: 'Identifier', start: 31, end: 38, name: 'console' },
										property: { type: 'Identifier', start: 39, end: 42, name: 'log' },
										computed: false,
										optional: false
									},
									arguments: [{ type: 'Identifier', start: 43, end: 48, name: 'value' }],
									optional: false
								}
							}
						],
						sourceType: 'module'
					},
					code: "import { value } from './lib';\nconsole.log(value);\n",
					dynamicallyImportedIdResolutions: [],
					dynamicallyImportedIds: [],
					dynamicImporters: [],
					hasDefaultExport: false,
					hasModuleSideEffects: true,
					id: ID_DEP,
					implicitlyLoadedAfterOneOf: [ID_MAIN],
					implicitlyLoadedBefore: [],
					importedIdResolutions: [
						{
							external: false,
							id: ID_LIB,
							meta: {},
							moduleSideEffects: true,
							syntheticNamedExports: false
						}
					],
					importedIds: [ID_LIB],
					importers: [],
					isEntry: false,
					isExternal: false,
					isIncluded: true,
					meta: {},
					syntheticNamedExports: false
				});
			},
			generateBundle(options, bundle) {
				const main = bundle['main.js'];
				assert.deepStrictEqual(
					main.implicitlyLoadedBefore,
					['generated-dep.js'],
					'main.implicitlyLoadedBefore'
				);
				assert.strictEqual(main.isEntry, true, 'main.isEntry');
				assert.strictEqual(main.isDynamicEntry, false, 'main.isDynamicEntry');
				assert.strictEqual(main.isImplicitEntry, false, 'main.isImplicitEntry');
				const dep = bundle['generated-dep.js'];
				assert.deepStrictEqual(dep.implicitlyLoadedBefore, [], 'dep.implicitlyLoadedBefore');
				assert.strictEqual(dep.isEntry, false, 'dep.isEntry');
				assert.strictEqual(dep.isDynamicEntry, false, 'dep.isDynamicEntry');
				assert.strictEqual(dep.isImplicitEntry, true, 'dep.isImplicitEntry');
			}
		}
	}
};
