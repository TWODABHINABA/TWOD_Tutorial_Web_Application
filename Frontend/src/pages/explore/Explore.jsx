import React from 'react';
import CustomNavbar from '../../components/navbar/Navbar';
import Foote from '../../components/footer/Footer';
import "./explore.css";
import course from '../../assets/course.jpg';
import ShuffleHero from '../../components/SuffleComp';
import CategorySection from '../../components/categories/CategorySection';
//Explore
const Explore = () => {
    return (
        <div className='w-full'>
            <CustomNavbar />
            <div className='w-full'>
                <ShuffleHero />
                <div className="bg-gray-100 p-4 h-auto md:h-[250px] flex items-center justify-center">
                    <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                        <h1 className="text-xl md:text-4xl">
                            We collaborate with
                        </h1>
                        <h1 className="text-blue-500 text-xl md:text-4xl md:ml-2">
                            350+ leading universities and companies
                        </h1>
                    </div>
                </div>
                <div className="">
                    <div className=''>

                        <CategorySection />
                        <h1 className="text-xl md:text-3xl md:ml-2 font-serif">
                            All the skills you need in one place
                        </h1>
                        <p className='text-gray-600 ml-2'>From mastering essential soft skills to diving into advanced technical subjects, Tutor empowers your career growth.</p>
                    </div>


                </div>
            </div>
            <Foote />
        </div>
    );
};

export default Explore;
