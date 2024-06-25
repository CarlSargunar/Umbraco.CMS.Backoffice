import type { UserConfig } from 'vite';

interface UmbViteDefaultConfigArgs {
	dist: string;
	entry?: string[] | Record<string, string>;
}

export const getDefaultConfig = (args: UmbViteDefaultConfigArgs): UserConfig => {
	return {
		build: {
			target: 'es2022',
			lib: {
				entry: args.entry || ['index.ts', 'manifests.ts', 'umbraco-package.ts'],
				formats: ['es'],
			},
			outDir: args.dist,
			sourcemap: true,
			rollupOptions: {
				external: [/^@umbraco/],
			},
		},
	};
};