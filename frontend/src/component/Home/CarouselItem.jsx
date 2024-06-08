import React from 'react';

const CarouselItem = ({ image, title }) => {
    return (
        <div className='flex flex-col justify-center items-center p-4'>
            <img
                className='w-[20vw] h-[20vw] max-w-[14rem] max-h-[14rem] rounded-full object-cover object-center mb-4'
                src={image}
                alt={title}
            />
            <span className='text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-400'>{title}</span>
        </div>
    );
};

export default CarouselItem;
