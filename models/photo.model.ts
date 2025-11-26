import { Comment } from "./comment.model";
export interface Photo {
    id: string | number;
    url?: string;
    publicUrl?: string;
    storagePath?: string;
    title?: string | null;
    description?: string | null;
    originalName?: string | null;
    createdAt?: string;
    comments?: Comment[];
}