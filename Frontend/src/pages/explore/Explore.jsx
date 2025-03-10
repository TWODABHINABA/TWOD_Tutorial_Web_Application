import React from 'react';
import CustomNavbar from '../../components/navbar/Navbar';
import Foote from '../../components/footer/Footer';
import "./explore.css";
import course from '../../assets/course.jpg';
import ShuffleHero from '../../components/SuffleComp';
import CategorySection from '../../components/categories/CategorySection';
import CourseCard from '../../components/exploreComponents/CourseCard';
import { TextParallaxContents } from '../../components/exploreComponents/TextParallaxContents';

// Explore
const Explore = () => {
    return (
        <div className='w-full'>
            <CustomNavbar />
            <div className='w-full bg-[#FAF3E0] '>
                <ShuffleHero />
                <div className="bg-white p-4 h-auto md:h-[250px] flex items-center justify-center">
                    <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                        <h1 className="text-xl md:text-4xl text-gray-800">
                            We collaborate with
                        </h1>
                        <h1 className="text-orange-400 text-xl md:text-4xl md:ml-2 font-semibold">
                            350+ leading universities and companies
                        </h1>
                    </div>
                </div>

                <CategorySection />
                <div className="bg-white mt-9 pt-5">
                    <div className='mx-9'>
                        <h1 className="text-xl md:text-3xl md:ml-2 font-serif text-gray-900">
                            All the skills you need in one place
                        </h1>
                        <p className='text-gray-600 md:ml-2'>
                            From mastering essential soft skills to diving into advanced technical subjects, Tutor empowers your career growth.
                        </p>
                        <CourseCard />
                    </div>
                </div>
                <div className='pt-9 bg-white'>
                    <TextParallaxContents />
                </div>
            </div>
            <Foote />
        </div>
    );
};

export default Explore;
