import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ShuffleHero = () => {
  return (
    <section className="w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
      <div>
        <span className="block mb-4 text-xs md:text-sm text-gray-700 font-medium">
          Better every day
        </span>
        <h3 className="text-4xl md:text-6xl font-semibold text-orange-400">
          Learn Without Limits
        </h3>
        <p className="text-base md:text-lg  my-4 md:my-6">
          Your Journey to Infinite Possibilities Begins Here.
        </p>
        <button className=" font-medium py-2 px-4 rounded transition-all border border-orange-500 text-orange-500  duration-300 hover:bg-orange-500 hover:text-white active:scale-95"
        onClick={() => window.location.href = `/category/}`}>
          Find a class
        </button>
      </div>
      <ShuffleGrid />
    </section>
  );
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: "https://plus.unsplash.com/premium_photo-1685086785054-d047cdc0e525?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    src: "https://plus.unsplash.com/premium_photo-1682002135678-87b8a2fdde50?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1562577308-9e66f0c65ce5?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    src: "https://img.freepik.com/free-photo/website-html-code-browser-view-printed-white-paper-closeup-view_211682-164.jpg?t=st=1739090683~exp=1739094283~hmac=3bfc065b242d72af3fe8463323a35a4e4ead079e9753f13a69ada44c0a3873ae&w=1800",
  },
  {
    id: 8,
    src: "https://img.freepik.com/free-photo/saas-concept-collage_23-2149399282.jpg?t=st=1739090892~exp=1739094492~hmac=ab1705ee84b16811d50a5d547720e5d9255ee85d3fe2d66549a4a126d9e164a8&w=1800",
  },
  {
    id: 9,
    src: "https://img.freepik.com/free-photo/operation-process-performance-development-icon_53876-16541.jpg?t=st=1739091096~exp=1739094696~hmac=c16b9c3fb16ed081ea390f86e0878d1c6e794bd8ee6617e7cf8ba35c6f05fdc2&w=1800",
  },
  {
    id: 10,
    src: "https://img.freepik.com/free-photo/ai-nuclear-energy-future-innovation-disruptive-technology_53876-129784.jpg?t=st=1739091149~exp=1739094749~hmac=1209ad3eb77863c26e75c44cfa4144714be5a54c6942bea9883b2189c3d4a5f3&w=826",
  },
  {
    id: 11,
    src: "https://img.freepik.com/free-photo/collaborative-process-indian-business-mans-brainstorming-meeting-officediverse-team-young-people-dressed-suits-cooperating-developing-common-project_627829-13765.jpg?t=st=1739091221~exp=1739094821~hmac=7e7c06615ba0b62d0019b6aba1ee61a78af5d1a2f620b1696317431ea5436978&w=1800",
  },
  {
    id: 12,
    src: "https://img.freepik.com/free-photo/cardboard-boxes-with-cyber-monday-inscription-hands-young-man_155003-10078.jpg?t=st=1739091274~exp=1739094874~hmac=348546d2093a7a8b435c5e7f68cb419bb68fc79f3c810b6923bc03095a2ef478&w=996",
  },
  {
    id: 13,
    src: "https://img.freepik.com/free-photo/programming-background-collage_23-2149901782.jpg?t=st=1739091000~exp=1739094600~hmac=7a859a0cb2d08cea8110d06561ce69cd239a306be1e046f28e29e4aa7eea346f&w=1800",
  },
  {
    id: 14,
    src: "https://img.freepik.com/free-photo/man-suit-standing-office-with-clipboard-pointing-poster-with-words_1098-17121.jpg?t=st=1739091427~exp=1739095027~hmac=755290a1bbc068e679f003387f1f1b39ef3f96519573cb429e99a2510a366558&w=1800",
  },
  {
    id: 15,
    src: "https://img.freepik.com/free-photo/saas-concept-collage_23-2149399285.jpg?t=st=1739091525~exp=1739095125~hmac=313c2720d3cb96473a2a977792e8344b65e3d3f17ef1571c52c7c78e8e671cdc&w=1800",
  },
  {
    id: 16,
    src: "https://img.freepik.com/free-photo/hologram-projector-screen-with-cloud-system-technology_53876-108502.jpg?t=st=1739091585~exp=1739095185~hmac=939b359ad4fe0fc6b17e29d769679270a4a69f78c263934d9705617f13d0dfce&w=1800",
  },
];

const generateSquares = () => {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());
    timeoutRef.current = setTimeout(shuffleSquares, 8000);
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default ShuffleHero;