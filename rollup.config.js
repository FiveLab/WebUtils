import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
    {
        input: [
            './src/dom/index.ts',
            './src/behaviors/index.ts',
            './src/browser/index.ts'
        ],
        output: {
            dir: 'dist',
            format: 'esm',
            preserveModules: true,
            preserveModulesRoot: 'src',
            sourcemap: true,
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