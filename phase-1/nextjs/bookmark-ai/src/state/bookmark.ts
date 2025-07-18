"use client";
import {atom,selector} from "recoil";

export type Bookmark = {
    id:string,
    url:string,
    title:string,
    tags:string[]
};

export const bookmarksAtom = atom<Bookmark[]>({
    key:"bookmarks",default:[],
});

export const tagFilterAtom = atom<string>({
    key:"tagFilter", default:"",
});

export const filteredBookmarksSelector = selector({
    key:"filteredBookmarks",
    get:({get})=>{
        const filter = get(tagFilterAtom).toLowerCase();
        const all = get(bookmarksAtom);
        return filter?all.filter((b)=>b.tags.some((t)=>t.toLowerCase().includes(filter)))
        :all;
    }
});
