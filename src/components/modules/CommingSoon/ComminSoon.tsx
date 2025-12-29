import { Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

const CommingSoon = () => {
    const isMobile = useMediaQuery("(max-width: 425px)");

    return (
        <div className="relative w-full h-screen">
            <Image
                src={isMobile ? "/finalbannermobile.png" : "/finalbannner.png"}
                alt="Damipasal"
                className="w-full h-full object-cover"
            />

            {/* Social Media Section - Fixed at 80vh */}
            <div
                className="absolute w-full flex flex-col sm:flex-row justify-center items-center sm:gap-5 text-white"
                style={

                {
                    top:  isMobile? '77vh':'90vh',
                    transform: 'translateY(-50%)' }
            }
            >
                <p className="font-bold text-white text-lg md:text-2xl lg:text-3xl xl:text-4xl lg:mb-0 sm:mb-0 mb-2">
                    Follow @
                </p>
                <div className="flex gap-4">
                    <Link
                        href="https://www.facebook.com/damipasaldotcom/"
                        target="_blank"
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300"
                    >
                        <Facebook
                            size={isMobile ? 24 : 32}
                            className="text-white"
                        />
                    </Link>

                    <Link
                        href="https://www.instagram.com/damipasaldotcom"
                        target="_blank"
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300"
                    >
                        <Instagram
                            size={isMobile ? 24 : 32}
                            className="text-white"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CommingSoon;