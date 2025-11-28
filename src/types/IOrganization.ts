import type { IModerator } from "./IModerator";
import type { IOrganizationHead } from "./IOrganizationHead";

export interface IOrganization {
    _id: string;
    organizationName: string;
    description?: string;
    profileLink?: string;
    course: "BS Civil Engineering" | "BS Information Technology" | "BS Computer Science" | "BS Food Technology";
    members: number;
    organizationHeadID: IOrganizationHead; 
    moderators: IModerator; 
    __v: number;
}