const axios = require('axios');

const isDev = process.env.NODE_ENV !== 'production';

// 👇 CHANGE THIS IF YOUR VPS IP CHANGES

const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 63
  };

  return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
  // Base64 encode submissions
  const encodedSubmissions = submissions.map(submission => ({
    ...submission,
    source_code: Buffer.from(submission.source_code).toString('base64'),
    stdin: submission.stdin
      ? Buffer.from(submission.stdin).toString('base64')
      : '',
    expected_output: submission.expected_output
      ? Buffer.from(submission.expected_output).toString('base64')
      : ''
  }));

  try {
    const response = await axios.post(
      `${process.env.JUDGE0_VPS_URL}/submissions/batch`,
      { submissions: encodedSubmissions },
      {
        params: { base64_encoded: 'true' },
        headers: { 'Content-Type': 'application/json' }
      }
    );

    return response.data;

  } catch (error) {
    if (isDev) console.error(error.response?.data || error.message);
    throw error;
  }
};

const waiting = (timer) => {
  return new Promise(resolve => setTimeout(resolve, timer));
};

const submitToken = async (resultToken) => {
  while (true) {
    try {
      const response = await axios.get(
        `${process.env.JUDGE0_VPS_URL}/submissions/batch`,
        {
          params: {
            tokens: resultToken.join(","),
            fields: '*',
            base64_encoded: 'true'
          }
        }
      );

      const result = response.data;

      const isResultObtained = result.submissions.every(
        (r) => r.status.id > 2
      );

      if (isResultObtained) {
        const decodedSubmissions = result.submissions.map(submission => ({
          ...submission,
          source_code: submission.source_code
            ? Buffer.from(submission.source_code, 'base64').toString('utf-8')
            : null,
          stdin: submission.stdin
            ? Buffer.from(submission.stdin, 'base64').toString('utf-8')
            : null,
          expected_output: submission.expected_output
            ? Buffer.from(submission.expected_output, 'base64').toString('utf-8')
            : null,
          stdout: submission.stdout
            ? Buffer.from(submission.stdout, 'base64').toString('utf-8')
            : null,
          stderr: submission.stderr
            ? Buffer.from(submission.stderr, 'base64').toString('utf-8')
            : null,
          compile_output: submission.compile_output
            ? Buffer.from(submission.compile_output, 'base64').toString('utf-8')
            : null,
          message: submission.message
            ? Buffer.from(submission.message, 'base64').toString('utf-8')
            : null
        }));

        return decodedSubmissions;
      }

      await waiting(1000);

    } catch (error) {
      if (isDev) console.error(error.response?.data || error.message);
      throw error;
    }
  }
};

module.exports = { getLanguageById, submitBatch, submitToken };
