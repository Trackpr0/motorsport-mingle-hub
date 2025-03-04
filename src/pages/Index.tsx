
import React from "react";
import Header from "../components/navigation/Header";
import FooterNav from "../components/navigation/FooterNav";
import FeedContent from "../components/feed/FeedContent";
import { useFeedPosts } from "../components/feed/useFeedPosts";

const Index = () => {
  const { posts, loading } = useFeedPosts();
  
  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      <Header />
      
      <main className="max-w-md mx-auto p-4">
        <FeedContent posts={posts} loading={loading} />
      </main>

      <FooterNav />
    </div>
  );
};

export default Index;
