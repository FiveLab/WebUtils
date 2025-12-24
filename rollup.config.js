import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' with {type: 'json'};

const externals = [
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...Object.keys(pkg.dependencies ?? {}),
];

export default [
    {
        input: [
            './src/behaviors/index.ts',
            './src/browser/index.ts',
            './src/core/index.ts',
            './src/dom/index.ts',
            './src/observability/index.ts',
            './src/ui/index.ts',
        ],
        preserveEntrySignatures: 'exports-only',
        output: {
            dir: 'dist',
            format: 'esm',
            preserveModules: true,
            preserveModulesRoot: 'src',
            sourcemap: true,
        },
        external: (id) => {
            return externals.some(
                (dep) => id === dep || id.startsWith(`${dep}/`)
            );
        },
        plugins: [
            resolve({
                browser: true,
                extensions: ['.ts'],
            }),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: false,
            }),
        ],
    }
];