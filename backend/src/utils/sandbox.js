import vm from 'vm';

/**
 * Safely evaluate student JavaScript against mission test cases.
 * @param {string} code - Student submitted code
 * @param {Array<{ input: Array, expected: any, functionName: string }>} testCases
 * @returns {{ correct: boolean, error?: string, results?: Array }}
 */
export function evaluateJS(code, testCases = []) {
  if (!code || typeof code !== 'string') {
    return { correct: false, error: 'No code provided' };
  }

  if (!Array.isArray(testCases) || testCases.length === 0) {
    return { correct: false, error: 'No test cases defined for this mission' };
  }

  const sandbox = Object.create(null);
  sandbox.console = { log: () => {} };

  try {
    vm.runInNewContext(code, sandbox, {
      timeout: 1000,
      displayErrors: true,
    });
  } catch (err) {
    return { correct: false, error: err.message || 'Code execution failed' };
  }

  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const { input = [], expected, functionName } = testCases[i];

    if (!functionName || typeof sandbox[functionName] !== 'function') {
      return {
        correct: false,
        error: `Function "${functionName || 'unknown'}" not found in submitted code`,
        results,
      };
    }

    try {
      const actual = sandbox[functionName](...input);
      const passed = deepEqual(actual, expected);
      results.push({ testCase: i + 1, passed, expected, actual });

      if (!passed) {
        return { correct: false, error: 'Test case failed', results };
      }
    } catch (err) {
      results.push({ testCase: i + 1, passed: false, error: err.message });
      return { correct: false, error: 'Test case failed', results };
    }
  }

  return { correct: true, results };
}

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEqual(val, b[idx]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(a[key], b[key]));
  }
  return false;
}

export default { evaluateJS };
