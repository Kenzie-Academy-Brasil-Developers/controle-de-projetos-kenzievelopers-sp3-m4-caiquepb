type TDevelopers = {
    id: number;
    name: string;
    email: string;
};

type TDevelopersRequest = Omit<TDevelopers, "id">;

type TDevelopersInfo = {
    id: number;
    developerSince: Date;
    preferedOS: "Windows" | "Linux" | "MacOS";
    developerId: number;
};

type TDevelopersInfoRequest = Omit<TDevelopersInfo, "id">;

export { TDevelopers, TDevelopersRequest, TDevelopersInfo, TDevelopersInfoRequest };
