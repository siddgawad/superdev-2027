type BookmarkCardProps = {
    title: string;
    url: string;
    description: string;
    tags: string[];
  };
  
  export default function BookmarkCard({ title, url, description, tags }: BookmarkCardProps) {
    return (
      <div className="p-4 border rounded-md shadow-sm">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <a href={url} target="_blank" className="text-blue-500 underline">Visit</a>
        <div className="mt-2">
          {tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded mr-1">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    );
  }
  