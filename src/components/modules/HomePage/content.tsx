"use client";

import { useRouter } from "next/router";
import { BackgroundImage, Button, Image as MantineImage, Loader, Modal, Skeleton } from "@mantine/core";
import { ShoppingBag } from "lucide-react";
import FeaturedProducts from "@/components/common/featuredProducts";
import { useEffect, useState } from "react";
import { APIGetIndividualProduct, } from "@/apis/product";
import { Carousel } from "@mantine/carousel";
import { getImageSliderAPI } from "@/apis/imageSlider";
import showNotify from "@/utils/notify";
import FlashSale from "@/components/common/FlashSale";
import { useMediaQuery } from "@mantine/hooks";
import {ApiGetAllActiveBrands} from "@/apis/brand";

const CollectionGrid = ({ collection, loading }: any) => {
    const router = useRouter();
    const handleCategoryClick = (id: any) => {
        router.push({ pathname: "/marketplace", query: { id } });
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 mx-4 lg:mt-10">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} height={180} radius="lg" className="w-full" />
                ))}
            </div>
        );
    }

    if (!collection || collection.length === 0) return null;

    if (collection.length > 4) {
        return (
            <Carousel
                slideSize={{ base: "50%", sm: "33.3333%", md: "20%" }}
                slideGap="md"
                align="start"
                controlsOffset="xs"
                controlSize={"25"}
                className="mx-4 sm:mx-8 mt-10"
                loop
            >
                {collection.map((item: any, i: number) => (
                    <Carousel.Slide key={i}>
                        <div
                            className="flex flex-col items-end cursor-pointer transition-transform duration-300 hover:scale-105"
                            onClick={() => handleCategoryClick(item?.id)}
                        >
                            <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                                <BackgroundImage
                                    radius="lg"
                                    src={item.url}
                                    h={{ base: "8rem", sm: "10rem", md: "12rem", lg: "14rem" }}
                                    w="100%"
                                    className="transition-opacity duration-300 hover:opacity-90"
                                >
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent rounded-b-lg p-3 sm:p-4 text-white">
                                        <p className="font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-tight">
                                            {item.title}
                                        </p>
                                        <p className="text-xs sm:text-sm md:text-base hidden sm:block">
                                            {item.number} Products
                                        </p>
                                    </div>
                                </BackgroundImage>
                            </div>
                        </div>
                    </Carousel.Slide>
                ))}
            </Carousel>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-36 mt-10">
            {collection.map((item: any, i: number) => (
                <div
                    key={i}
                    className="flex flex-col items-end cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={() => handleCategoryClick(item?.id)}
                >
                    <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                        <BackgroundImage
                            radius="lg"
                            src={item.url}
                            h={{ base: "8rem", sm: "10rem", md: "12rem", lg: "14rem" }}
                            w="100%"
                            className="transition-opacity duration-300 hover:opacity-90"
                        >
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent rounded-b-lg p-3 sm:p-4 text-white">
                                <p className="font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-tight">
                                    {item.title}
                                </p>
                                <p className="text-xs sm:text-sm md:text-base hidden sm:block">
                                    {item.number} Products
                                </p>
                            </div>
                        </BackgroundImage>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function Content() {
    const [products, setProducts] = useState<any[]>([]);
    const [heroSection, setHeroSection] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [popupSlides, setPopupSlides] = useState<any[]>([]);
    const [showPopups, setShowPopups] = useState(false);
    const [limit, setLimit] = useState(5);
    const page = 1;
    const isMobile = useMediaQuery("(max-width: 425px)");

  useEffect(() => {
  const updateLimit = () => {
    const width = window.innerWidth;
console.log(width)
    if (width >= 1280) {
      setLimit(5); // ✅ applies to 1024px and bigger
        } else if (width >= 1024) {
      setLimit(5);  } 
      else if (width >= 768) {
      setLimit(3);
    } else if (width >= 768) {
      setLimit(3);
    } else if (width >= 640) {
      setLimit(2);
    } 
  };

  updateLimit();
  window.addEventListener("resize", updateLimit);
  return () => window.removeEventListener("resize", updateLimit);
}, []);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);
                const res = await APIGetIndividualProduct(page, limit);
                setProducts(res?.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingProducts(false);
            }
        };

        const fetchBrands = async () => {
            try {
                setLoadingBrands(true);
                const res = await ApiGetAllActiveBrands();
                setBrands(res?.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingBrands(false);
            }
        };

        const fetchHeroSection = async () => {
            try {
                const res = await getImageSliderAPI();
                setHeroSection(res.data || []);
                const popups = res.data.filter((item: any) => item.isPopup === true);
                if (!sessionStorage.getItem("popupShown")) {
                    setTimeout(() => {
                        setPopupSlides(popups);
                        setShowPopups(true);
                        sessionStorage.setItem("popupShown", "true");
                    }, 1000);
                }
            } catch (error) {
                showNotify("error", "Product not found");
            }
        };

        // Preload popup images using native HTMLImageElement
        const preloadImages = (popups: any[]) => {
            popups.forEach((popup) => {
                const imgWeb = new window.Image();
                imgWeb.src = popup.webImageUrl;
                const imgMobile = new window.Image();
                imgMobile.src = popup.mobileImageUrl;
            });
        };

        const initialize = async () => {
            const res = await getImageSliderAPI();
            const popups = res.data.filter((item: any) => item.isPopup === true);
            preloadImages(popups);
            fetchProducts();
            fetchBrands();
            fetchHeroSection();
        };

        initialize();
    }, [limit]);

    const mappedCollection = brands.map((brand: any) => ({
        id: brand?.id,
        url: brand.imageUrl,
        title: brand.brandName,
        number: brand.menuItemCount ?? 0,
    }));

    return (
        <div className="min-h-screen">
            {/* Hero Carousel */}
            {heroSection.length === 0 ? (
                <Skeleton height={600} className="w-full" />
            ) : (


                <Carousel slideSize="100%" height={isMobile? "350":"auto"}  align="start" withIndicators loop className="w-full ">

                    {heroSection.filter((slide) => slide.isPopup === false).map((slide, idx) => (
                        <Carousel.Slide key={idx}>
                            <div className="relative w-full">
                                <MantineImage
                                    src={isMobile ? slide.mobileImageUrl : slide.webImageUrl}
                                    alt={slide.title}
                                    className="w-full h-[500px] sm:h-[600px] mx-auto object-contain"
                                />
                                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40 text-white text-center p-4 sm:p-8">
                                    <h2 className="font-bold text-lg sm:text-2xl md:text-3xl lg:text-4xl">{slide.title}</h2>
                                    <p className="mt-2 text-xs sm:text-sm md:text-base lg:text-lg">{slide.subTitle}</p>
                                    <Button
                                        radius="xl"
                                        color="black"
                                        leftSection={<ShoppingBag size={16} />}
                                        className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base"
                                        onClick={() => (window.location.href = "/marketplace")}
                                    >
                                        Shop Now
                                    </Button>
                                </div>
                            </div>
                        </Carousel.Slide>
                    ))}
                </Carousel>
            )}

            {/* Popups */}
            {showPopups &&
                popupSlides.map((popup, index) => (
                    <Modal
                        key={index}
                        opened={true}
                        onClose={() => setPopupSlides((prev) => prev.filter((_, i) => i !== index))}
                        centered
                        size="lg"
                        withCloseButton={false}
                        classNames={{
                            content: "bg-transparent shadow-none",
                            body: "p-0",
                        }}
                        overlayProps={{
                            backgroundOpacity: 0.5,
                            blur: 3,
                        }}
                        styles={{
                            content: { zIndex: 1000 },
                            inner: { zIndex: 1000 },
                        }}
                        transitionProps={{ transition: "fade", duration: 300 }}
                    >
                        <div className="relative w-full h-[350px] sm:h-[500px] md:h-[600px] rounded-lg overflow-hidden">
                            <div
                                className="cursor-pointer w-full h-full"
                                onClick={() => (window.location.href = popup.productUrl)}
                            >
                                <MantineImage
                                    src={isMobile ? popup.mobileImageUrl : popup.mobileImageUrl}
                                    alt={popup.title}
                                    className="w-full h-full object-cover rounded-lg"
                                    // placeholder={<Skeleton height="100%" width="100%" />}
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                                    <h3 className="font-bold text-sm sm:text-lg md:text-xl">{popup.title}</h3>
                                    <p className="text-xs sm:text-sm md:text-base">{popup.subTitle}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPopupSlides((prev) => prev.filter((_, i) => i !== index));
                                }}
                                className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 px-3 py-1 rounded-full shadow-md transition text-sm sm:text-base"
                            >
                                ✕
                            </button>
                        </div>
                    </Modal>
                ))}

            <FlashSale />

            {/* Collection */}
            <div className="pt-10">
                <div className="text-center">
                    <p className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">Explore Our Collection</p>
                    <p className="text-[#6C757D] mb-4 md:mb-8 text-xs sm:text-sm md:text-base lg:text-lg">
                        Browse through our carefully curated categories of authentic Nepalese cultural products
                    </p>
                </div>
                <CollectionGrid collection={mappedCollection} loading={loadingBrands} />
            </div>

            {/* Featured Products */}
            {loadingProducts ? (
                <div className="flex flex-wrap justify-center gap-4  z-10 py-60">
                    <Loader />
                </div>
            ) : (
                <FeaturedProducts
                    products={products}
                    title="Featured Products"
                    description="Discover our most popular handcrafted Nepalese products, made with love by local artisans"
                />
            )}
        </div>
    );
}