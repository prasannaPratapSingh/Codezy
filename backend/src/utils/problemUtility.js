const axios = require('axios');


const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 63
  }

  return language[lang.toLowerCase()];
}

const submitBatch = async (submissions) => {
  // Base64 encode the submissions
  const encodedSubmissions = submissions.map(submission => ({
    ...submission,
    source_code: Buffer.from(submission.source_code).toString('base64'),
    stdin: submission.stdin ? Buffer.from(submission.stdin).toString('base64') : '',
    expected_output: submission.expected_output ? Buffer.from(submission.expected_output).toString('base64') : ''
  }));

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'true'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_API_KEY,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      submissions: encodedSubmissions
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return await fetchData();
}

const waiting = (timer) => {
  return new Promise(resolve => setTimeout(resolve, timer));
}

const submitToken = async (resultToken) => {
  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(","),
      fields: '*',
      base64_encoded: 'true'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_API_KEY,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  while (true) {
    const result = await fetchData();
    const IsResultObtained = result.submissions.every((r) => r.status_id > 2);
    
    if (IsResultObtained) {
      // Decode ALL base64 encoded fields
      const decodedSubmissions = result.submissions.map(submission => ({
        ...submission,
        source_code: submission.source_code ? Buffer.from(submission.source_code, 'base64').toString('utf-8') : null,
        stdin: submission.stdin ? Buffer.from(submission.stdin, 'base64').toString('utf-8') : null,
        expected_output: submission.expected_output ? Buffer.from(submission.expected_output, 'base64').toString('utf-8') : null,
        stdout: submission.stdout ? Buffer.from(submission.stdout, 'base64').toString('utf-8') : null,
        stderr: submission.stderr ? Buffer.from(submission.stderr, 'base64').toString('utf-8') : null,
        compile_output: submission.compile_output ? Buffer.from(submission.compile_output, 'base64').toString('utf-8') : null,
        message: submission.message ? Buffer.from(submission.message, 'base64').toString('utf-8') : null
      }));
      
      return decodedSubmissions;
    }

    await waiting(1000);
  }
}

module.exports = { getLanguageById, submitBatch, submitToken };