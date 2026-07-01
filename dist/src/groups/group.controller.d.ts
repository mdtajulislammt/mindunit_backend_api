import { GroupService } from './group.service';
export declare class GroupController {
    private groupService;
    constructor(groupService: GroupService);
    getGroups(req: any): Promise<{
        isJoined: boolean;
        id: string;
        avatarUrl: string;
        createdAt: Date;
        name: string;
        category: string;
        membersCount: number;
    }[]>;
    toggleJoin(groupId: string, req: any): Promise<{
        isJoined: boolean;
    }>;
}
