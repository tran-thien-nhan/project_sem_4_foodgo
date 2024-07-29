import React from 'react';
import { useNavigate } from 'react-router-dom';

const CarouselItem = ({ image, title }) => {
    const navigate = useNavigate();

    const handleItemClick = () => {
        navigate('/search', { state: { keyword: title } });
    };
    return (
        <div onClick={handleItemClick} className='flex flex-col justify-center items-center p-4 cursor-pointer'>
            <img
                className='w-[15vw] h-[15vw] max-w-[10rem] max-h-[10rem] rounded-full object-cover object-center mb-4'
                src={image}
                alt={title}
            />
            <span className='text-base sm:text-lg md:text-xl lg:text-xl font-semibold text-gray-400'>{title}</span>
        </div>
    );
};

export default CarouselItem;
