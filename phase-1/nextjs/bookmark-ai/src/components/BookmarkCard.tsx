"use client";

import {Card,CardHeader,CardContent, CardFooter} from "@/components/ui/card";

type BookmarkCardProps = {
    title: string;
    description: string;
    url: string;
    tags: string[];
  };
  
  export default function BookmarkCard({ title, description, url, tags }: BookmarkCardProps) {
    return (
      <Card>
        <CardHeader>
            <h2 className="text-lg font-bold">{title}</h2>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-gray-700">{description}</p>
            <a href={url} className="text-blue-500-underline" target="_blank" rel="noopener noreferrer">
                Visit Site
            </a>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
            {tags.map((tag,index)=>(
                <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded">
                    #{tag}
                </span>
            ))}
        </CardFooter>
      </Card>
    );
  }
  