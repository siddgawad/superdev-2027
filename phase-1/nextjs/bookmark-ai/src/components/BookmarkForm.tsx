"use client"

import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSetRecoilState } from "recoil";
import { bookmarksAtom } from "@/state/bookmarks";
import type { Bookmark } from "@/state/bookmarks";



export const BookmarkForm = () => {
  const setBkmrk = useSetRecoilState(bookmarksAtom);
  const form = useForm<Bookmark>({
    defaultValues: {
      title: "",
      url: "",
      tags: [],
      description: ""
    }
  });

  const onSubmit = (data: Bookmark) => {
    setBkmrk(prev => [...prev, data]);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. My Link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
        control={form.control}
        name="url"
        render={({field})=>(
            <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                    <Input placeholder="eg:- https://youtube.com" {...field} />
                </FormControl>
            </FormItem>
        )}
        />

        <FormField
        control={form.control}
        name="tags"
        render={({field})=>(
            <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                    <Input placeholder="Entertainment, Learning"
                     value={field.value?.join(",")??""}
                     onChange={(e)=>{
                        const val = e.target.value;
                        field.onChange(val.split(",").map(tag=>tag.trim()));
                     }} />
                </FormControl>
            </FormItem>
        )} />

        <FormField
        control={form.control}
        name="description"
        render={({field})=>(
            <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Input placeholder="Youtube is an interesting app, displays videos from creators across the globe" 
                    {...field} />
                </FormControl>
            </FormItem>
        )} />

        

        {/* Repeat for URL, description, tags... */}

        <button type="submit">Add Bookmark</button>
      </form>
    </Form>
  );
};
