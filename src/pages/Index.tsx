import Header from "../components/navigation/Header";
import FooterNav from "../components/navigation/FooterNav";
import BusinessPost from "../components/posts/BusinessPost";
import PersonalPost from "../components/posts/PersonalPost";

const Index = () => {
  const posts = [
    {
      type: "business",
      name: "Business Name",
      location: "122 Sample Street, GA, US, 12311",
      rating: 4.5,
      imageUrl: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
      hasEvent: true,
    },
    {
      type: "personal",
      name: "Persons Name",
      imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80",
      description: "Check out my new ride! Ready for the track day 🏎️",
      hasEvent: false,
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      <Header />
      
      <main className="max-w-md mx-auto p-4 space-y-6">
        {posts.map((post, index) => (
          post.type === "business" ? (
            <BusinessPost
              key={index}
              name={post.name}
              location={post.location}
              rating={post.rating}
              imageUrl={post.imageUrl}
              description={post.description}
              hasEvent={post.hasEvent}
            />
          ) : (
            <PersonalPost
              key={index}
              name={post.name}
              imageUrl={post.imageUrl}
              description={post.description}
            />
          )
        ))}
      </main>

      <FooterNav />
    </div>
  );
};

export default Index;