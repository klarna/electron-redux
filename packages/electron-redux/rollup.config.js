import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
	input: "src/index.ts",
	plugins: [typescript()],
	output: {
		format: "cjs",
		file: "dist/index.js",
		sourcemap: true,
	},
};
