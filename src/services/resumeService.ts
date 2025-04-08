import { apiClient } from './apiClient';

export interface IResumeAnalysisResult {
    general_review: string;
    strengths: string[];
    weaknesses: string[];
}

const responseResume = {
    data: '{\n  "general_review": "Michali Kholmyansky has a solid background in software engineering with over 5 years of experience, primarily within military settings. The candidate showcases technical skills, leadership roles, and an ability to work on significant projects. The emphasis on security, system architecture, and database management is notable. However, the resume could benefit from clearer organization and consistency in formatting to enhance readability.",\n  "strengths": [\n    "Over 5 years of experience in software development.",\n    "Strong military background with Mamram training.",\n    "Proficient in a diverse technology stack including JavaScript, NodeJS, and React.",\n    "Experience with large-scale systems and security applications.",\n    "Proven ability to work in high-pressure environments and lead teams."\n  ],\n  "weaknesses": [\n    "Inconsistent formatting and structure could lead to confusion.",\n    "Employment dates overlap or seem inaccurately presented.",\n    "Lack of clear metrics or outcomes to demonstrate impact in roles.",\n    "The profile section is vague and could be more specific about career goals."\n  ],\n  "word_limit": "Each response field should be limited to 500 characters"\n}',
    status: 200,
    statusText: 'OK',
    headers: {
        'content-length': '1272',
        'content-type': 'application/json; charset=utf-8',
    },
    config: {
        transitional: {
            silentJSONParsing: true,
            forcedJSONParsing: true,
            clarifyTimeoutError: false,
        },
        adapter: ['xhr', 'http', 'fetch'],
        transformRequest: [null],
        transformResponse: [null],
        timeout: 0,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        maxContentLength: -1,
        maxBodyLength: -1,
        env: {},
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization:
                'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI0ZGYzODg0ZS0wYjAyLTQyMTgtYTg5ZS1lZGI4MDhiMTdhOWQiLCJyYW5kb20iOiIwLjA5MjQyNjUwMTQwNjk4ODI3IiwiaWF0IjoxNzQ0MTI4MDA4LCJleHAiOjE3NDQxMjgzMDh9.DPdhbXndS4aKBqD2S4dUBVgQLq2_TLIIi-DdL17Nd6I',
        },
        baseURL: 'http://localhost:3000',
        withCredentials: true,
        method: 'post',
        url: '/resume/analyze-resume',
        data: '{"fileUrl":"http://localhost:3000/uploads/1744128071031-929846770-Michali_Kholmyansky_FullStuck.pdf"}',
        allowAbsoluteUrls: true,
    },
    request: {},
};

const uploadResume = async (formData: FormData) => {
    const abortController = new AbortController();

    const response = await apiClient.post('/resume/upload-resume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        signal: abortController.signal,
    });

    return { response, abort: () => abortController.abort() };
};

const analyzeResume = async (fileUrl: string) => {
    const abortController = new AbortController();
    // const response = await apiClient.post('/resume/analyze-resume', { fileUrl });
    console.log(responseResume);
    return { responseResume, abort: () => abortController.abort() };
};

const spellCheckResume = async (fileUrl: string) => {
    const abortController = new AbortController();
    const response = await apiClient.post('/resume/check-grammar', { fileUrl });
    return { response, abort: () => abortController.abort() };
};

export default {
    uploadResume,
    analyzeResume,
    spellCheckResume,
};
