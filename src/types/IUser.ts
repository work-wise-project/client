import { UserCareer } from './UserCareer';
import { UserEducation } from './UserEducation';
import { UserSkill } from './UserSkill';

export interface IUser {
    id: string;
    email: string;
    name: string;
    education?: UserEducation[];
    career?: UserCareer[];
    skills?: UserSkill[];
}
