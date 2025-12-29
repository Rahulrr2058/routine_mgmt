import React from 'react';


export default function CommonHeader({title,description}:{title:string,description:any}     ) {



    return (
        <header className="bg-secondary text-white py-8 text-center">
            <div className="max-w-6xl mx-auto md:py-14  px-4">
                <h1 className="xl:text-5xl md:text-3xl text-2xl font-bold mb-2 tracking-wide">{title}</h1>
                <p className="xl:text-xl md:text-md text-sm opacity-2 ">
                    {description.map((line:any, index:any) => (
                        <React.Fragment key={index}>
                            {line}
                            {index < description.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </p>
            </div>
        </header>
    );
}