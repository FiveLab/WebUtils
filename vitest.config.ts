import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        setupFiles: [
            './tests/setup.ts',
            './tests/mock/fetch.ts',
            './tests/mock/file.ts',
            './tests/mock/xhr.ts',
            './tests/mock/intersection-observer.ts'
        ],
        environment: 'jsdom',
        include: [
            'tests/**/*.test.ts'
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: './coverage',
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.d.ts',
                '**/*.test.ts',
                '**/*.spec.ts',
            ],
        },
    }
});
