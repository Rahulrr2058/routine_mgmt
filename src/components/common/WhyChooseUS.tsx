import { Sun } from "lucide-react";

interface WhyChooseUsProps {
    title: string;
    subtitle: string;
    data: {
        icon: any;
        title: string;
        description: string;
    }[];
}

const WhyChooseUS = ({ title, subtitle, data }: WhyChooseUsProps) => {
    return (
        <div className="font-lexend md:my-10  my-8  px-2 sm:px-8 lg:px-16 ">
            {/* Heading and subtitle, hidden on small screens in original code */}
            <div className="text-center mb-4 md:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
                <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
            </div>

            {/* Grid layout: 2x2 for small screens, 4x1 for medium and above */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 place-items-center text-center mt-5 h-full w-full">
                {data?.map((item, index) => (
                    <div
                        key={index}
                        className="shadow-md space-y-2 p-4 md:space-y-2.5 xl:p-5 rounded-lg bg-white h-36  lg:w-full  md:w-40 sm:h-full w-full "
                    >
                        {/* Icon centered */}
                        <div className="flex items-center justify-center w-full">
                            {item.icon}
                        </div>

                        {/* Title */}
                        <p className="font-bold text-base sm:text-lg xl:text-lg">{item.title}</p>

                        {/* Description, hidden on small screens as per image */}
                        <div className="hidden md:flex">
                            <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default WhyChooseUS;