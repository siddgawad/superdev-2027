import { Bookmark } from "lucide-react";
import {atom} from "recoil";

export type Bookmark = {
    title: string;
    description: string;
    url: string;
    tags: string[];
}

export const bookmarksAtom = atom<Bookmark[]>({
    key:"bookmarksAtom",
    default:[]
})