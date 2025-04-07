import { apiClient } from './apiClient';

export interface ISkill {
    id: string;
    name: string;
    isDeleted: boolean;
}

const getAllSkills = async () => {
    const abortController = new AbortController();

    const response = await apiClient.get('/skills', {
        signal: abortController.signal,
    });
    return { response, abort: () => abortController.abort() };
};

export default { getAllSkills };
