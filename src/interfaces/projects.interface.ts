type TProjects = {
    id: number;
    name: string;
    description: string;
    estimatedTime: string;
    repository: string;
    startDate: Date;
    endDate: Date;
    developerId: number;
};

type TProjectsRequest = Omit<TProjects, "id">;

type TTech = {
    projectId: number;
    technologyId: number;
    addedIn: Date;
};

type TTechRequest = {
    name: string
};

export { TProjects, TProjectsRequest, TTech, TTechRequest };
