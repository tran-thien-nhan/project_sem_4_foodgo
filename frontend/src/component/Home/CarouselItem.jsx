import React from 'react';

const CarouselItem = ({ image, title }) => {
    return (
        <div className='flex flex-col justify-center items-center p-4'>
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
