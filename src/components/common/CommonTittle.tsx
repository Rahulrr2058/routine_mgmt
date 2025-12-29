import React from 'react';

export default function CommonTitle({ title, description }: { title: string; description: string }) {
    return (
        <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:pt-6 pt-0">
            <p className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">{title}</p>
            <p className="text-[#6C757D] text-xs sm:text-sm md:text-base lg:text-lg">{description}</p>
        </div>
    );
}