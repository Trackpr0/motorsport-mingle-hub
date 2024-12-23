import Navigation from "@/components/Navigation";
import Post from "@/components/Post";

const Index = () => {
  const posts = [
    {
      username: "maxv33",
      imageUrl: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80",
      caption: "Perfect qualifying lap at Silverstone! 🏎️ #F1 #BritishGP",
      likes: 1234,
      comments: 89,
    },
    {
      username: "racingfanatic",
      imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80",
      caption: "My new track day setup! What do you think? 🏁",
      likes: 856,
      comments: 43,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-motorsport-blue to-motorsport-purple p-4 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-md mx-auto flex items-center">
          <img src="/lovable-uploads/8ed0179e-f29e-4513-9687-64ba5f3d1fa2.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold ml-2">MotorSport</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4">
        {posts.map((post, index) => (
          <Post key={index} {...post} />
        ))}
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Index;