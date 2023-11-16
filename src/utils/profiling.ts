export class Profiler {
	private static instance: Profiler;

	private static values: Record<string, number> = {};
	public static getInstance(): Profiler {
		if (!Profiler.instance) {
			Profiler.instance = new Profiler();
		}

		return Profiler.instance;
	}

	public withProfiling<T extends (...args: any[]) => any>(
		func: T
	): (...funcArgs: Parameters<T>) => ReturnType<T> {
		const funcName = func.name;
		// Return a new function that tracks how long the original took
		return (...args: Parameters<T>): ReturnType<T> => {
			const start = performance.now();
			const results = func(...args);
			const end = performance.now();
			const duration = end - start;
			if (Profiler.values[funcName]) {
				Profiler.values[funcName] += duration;
			} else {
				Profiler.values[funcName] = duration;
			}
			return results;
		};
	}

	public reset() {
		Profiler.values = {};
	}
	public dump() {
		console.log('>>>>>>> PROFILER_DUMP', Profiler.values);
	}
}
