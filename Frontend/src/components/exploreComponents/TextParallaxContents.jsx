
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
export const TextParallaxContents = () => {
  // const navigate = useNavigate();
  // const handleClick = () => {
  //   // Navigate to the desired route (e.g., '/courses')
  //   navigate("/about");
  // };
  return (
    <div className="bg-white">
      <TextParallaxContent
        imgUrl="https://images.pexels.com/photos/6266990/pexels-photo-6266990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        subheading="Learn from Experts"
        heading="Top Instructors & Industry Leaders."
      >
        <Content2 />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.pexels.com/photos/15401447/pexels-photo-15401447/free-photo-of-learn-text-on-dice.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        subheading="Flexible Learning"
        heading="Learn Anytime, Anywhere"
      >
        <Content3 />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.pexels.com/photos/4443191/pexels-photo-4443191.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        subheading="Certifications"
        heading="Get Certified & Advance Your Career"
      >
        <Content1 />
      </TextParallaxContent>
    </div>
  );
};

const IMG_PADDING = 12;

const TextParallaxContent = ({ imgUrl, subheading, heading, children }) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">
        {subheading}
      </p>
      <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
    </motion.div>
  );
};

const Content1 = () => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12 ">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4 text-indigo-500">
      Earn Industry-Recognized Certifications
    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-neutral-600 md:text-2xl text-justify">
        Enhance your career prospects with certifications that are valued by top employers.
        Our courses equip you with in-demand skills and validate your expertise in the industry.
      </p>
      <p className="mb-8 text-xl text-neutral-600 md:text-2xl text-justify">
        Join thousands of professionals who have boosted their resumes and advanced their careers by earning these credentials.
      </p>
      <button className="w-full rounded bg-indigo-600 px-9 py-4 text-xl text-white transition-colors hover:bg-indigo-700 md:w-fit"
      onClick={() => window.location.href = `/category/}`}>
        Get Certified <FiArrowUpRight className="inline" />
      </button>
    </div>
  </div>
);

const Content2 = () => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12 ">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4 text-indigo-500">
      Learn from Industry Leaders
    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-neutral-600 md:text-2xl text-justify">
        Our courses are crafted and delivered by top experts with real-world experience.
        Gain valuable insights, practical tips, and industry knowledge directly from professionals.
      </p>
      <p className="mb-8 text-xl text-neutral-600 md:text-2xl text-justify">
        Experience interactive lessons and projects that prepare you for success in today’s competitive market.
      </p>
      <button className="w-full rounded bg-indigo-600 px-9 py-4 text-xl text-white transition-colors hover:bg-indigo-700 md:w-fit"
      onClick={() => window.location.href = `/category/}`}>
        Learn More <FiArrowUpRight className="inline" />
      </button>
    </div>
  </div>
);

const Content3 = () => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4 text-indigo-500">
      Flexible Learning, Anytime
    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-neutral-600 md:text-2xl text-justify">
        Study on your own schedule with our flexible learning platform.
        Whether you’re balancing work, family, or other commitments, our courses are designed to fit seamlessly into your life.
      </p>
      <p className="mb-8 text-xl text-neutral-600 md:text-2xl text-justify">
        Access course materials on-demand, learn at your own pace, and join a community of learners from around the world.
      </p>
      <button className="w-full rounded bg-indigo-600 px-9 py-4 text-xl text-white transition-colors hover:bg-indigo-700 md:w-fit"
      onClick={() => window.location.href = `/category/}`}>
        Start Learning <FiArrowUpRight className="inline" />
      </button>
    </div>
  </div>
);
