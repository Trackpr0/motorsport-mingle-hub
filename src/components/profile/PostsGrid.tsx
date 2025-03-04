
import { toast } from "sonner";

interface PostsGridProps {
  posts: any[];
  loading: boolean;
}

const PostsGrid = ({ posts, loading }: PostsGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500 font-medium">
        No posts yet. Go to the Track!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="aspect-square overflow-hidden bg-gray-100"
          onClick={() => {
            toast.info("Post view feature will be implemented soon");
          }}
        >
          <img 
            src={post.image_url} 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default PostsGrid;
