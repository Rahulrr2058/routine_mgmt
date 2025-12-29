"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge, Card, Loader } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { APIGetFlashSales } from "@/apis/flashSale";
import { Zap } from "lucide-react";
import {useRouter} from "next/router";

interface PricingList {
  id: number;
  minRange: number;
  maxRange: number;
  currency: string;
  price: number;
  discountPercent: number;
}

interface MenuItem {
  id: string;
  productName: string;
  slug: string;
  isNew: boolean;
  productImage: string;
  stock: number;
  pricingLists: PricingList[];
  brand: any;
}

interface FlashSaleData {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFlashSale: boolean;
  bannerImage: string;
  menuItems: MenuItem[];
}

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [flashSale, setFlashSale] = useState<FlashSaleData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch flash sale
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await APIGetFlashSales();
        if (res?.status === 200 && res.data) {
          setFlashSale(res.data);
          const endTime = new Date(res.data.endDate).getTime();
          setTimeLeft(endTime - new Date().getTime());
        }
      } catch (err) {
        console.error("Failed to fetch flash sales", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!flashSale?.endDate) return;
    const endTime = new Date(flashSale.endDate).getTime();

    const interval = setInterval(() => {
      const distance = endTime - new Date().getTime();
      setTimeLeft(distance > 0 ? distance : 0);
      if (distance <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSale?.endDate]);

  const formatTime = (ms: number) => {
    if (ms <= 0) return "Expired";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader color="red" size="lg" />
      </div>
    );
  }

  if (!flashSale || !flashSale.menuItems?.length) return null;

  // Duplicate slides if not enough for smooth looping
  const slides =
    flashSale.menuItems.length < 10
      ? [...flashSale.menuItems, ...flashSale.menuItems]
      : flashSale.menuItems;

  return (
    <div className="bg-red-900 text-white rounded-none sm:rounded-lg py-5 sm:p-6 my-0 sm:my-6 mx-0 md:mx-8 " >
      {/* Header */}
{/* Header */}
<div className="overflow-hidden w-full mb-4 px-4 sm:px-6">
  <div className="flex animate-loop whitespace-nowrap">
    {/* Original sections */}
    {[...Array(3)].map((_, i) => (
      <section key={i} className="flex items-center space-x-2 md:space-x-10">
        <h2 className="text-sm sm:text-xl font-semibold flex items-center gap-2">
          {flashSale.title}
          <span className="w-10 h-10 sm:w-12 sm:h-12 relative inline-block">
            <span className="absolute inset-0 flex items-center justify-center">
              <Zap className="text-yellow-400 w-4 h-4 sm:w-6 sm:h-6" />
            </span>
          </span>
        </h2>
        <div className="text-xs sm:text-sm font-semibold bg-black text-white px-2 py-1 rounded-md">
          Ends in: {formatTime(timeLeft)}
        </div>
      </section>
    ))}

    {/* Duplicate for seamless looping */}
    {[...Array(3)].map((_, i) => (
      <section key={`dup-${i}`} className="flex items-center space-x-2 md:space-x-10">
        <h2 className="text-sm sm:text-xl font-semibold flex items-center md:gap-2">
          {flashSale.title}
          <span className="w-10 h-10 sm:w-12 sm:h-12 relative inline-block">
            <span className="absolute inset-0 flex items-center justify-center">
              <Zap className="text-yellow-400 w-4 h-4 sm:w-6 sm:h-6" />
            </span>
          </span>
        </h2>
        <div className="text-xs sm:text-sm font-semibold bg-black text-white px-2 py-1 rounded-md">
          Ends in: {formatTime(timeLeft)}
        </div>
      </section>
    ))}
  </div>

  <style jsx>{`
    .animate-loop {
      display: flex;
      gap: 2.5rem; /* space between sections */
      animation: scroll 20s linear infinite;
    }

    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); } /* move by half content for seamless loop */
    }
  `}</style>
</div>







      {/* Carousel */}
      <Carousel
        slideSize={{ base: "90%", sm: "33.3333%", md: "20%" }}
        slideGap="md"
        align="start"
        controlsOffset="xs"
        controlSize={25}
        className="mx-4 sm:mx-8 mt-10"
        loop
        slidesToScroll={1}
      >
        {slides?.map((item: MenuItem,index:number) => {
          const pricing = item.pricingLists?.[0];
          const currentPrice = pricing ? pricing.price : 0;
          const discountPercent = pricing ? pricing.discountPercent : 0;
          const originalPrice =
            discountPercent > 0
              ? Math.round(currentPrice / (1 - discountPercent / 100))
              : currentPrice;

          return (
            <Carousel.Slide key={index}>
              <Card className={`bg-white text-black rounded-lg h-[500px] flex flex-col  cursor-pointer   `} onClick={()=>router.push(`/product/${item.slug}`)}>
                <div className="relative w-full h-[350px] ">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="rounded-t-lg object-cover bg-gray-100 hover:scale-105 transition-transform duration-300 "
                  />
                    {item.stock === 0 ?(

                            <Badge
                                color="red"
                                variant="filled"
                                className="absolute top-2 left-2 text-xs"
                            >
                                Out of Stock
                            </Badge>
                        ) :
                        (
                            <div>
                            {item.isNew && (
                        <Badge
                        color="yellow"
                        variant="filled"
                        className="absolute top-2 left-2 text-xs"
                        >
                        New Arrival
                        </Badge>
                        )}
                            </div>
                        )}

                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  {item.brand && (
                    <div className="text-xs sm:text-md text-gray-500 mb-1">
                      {item.brand.brandName}
                    </div>
                  )}

                  <h3 className="font-bold text-sm line-clamp-2">
                    {item.productName}
                  </h3>

                  <div className="flex flex-col mt-2">
                    {/* Price and Discount */}
                    {/*<div className="flex items-center gap-2">*/}
                    {/*  <span className="font-semibold text-sm text-black">*/}
                    {/*    ${currentPrice.toFixed(2)}*/}
                    {/*  </span>*/}
                    {/*  {discountPercent > 0 && (*/}
                    {/*    <>*/}
                    {/*      <span className="line-through text-gray-400 text-xs">*/}
                    {/*        ${originalPrice.toFixed(2)}*/}
                    {/*      </span>*/}
                    {/*      <span className="bg-green-100 text-green-800 text-xs px-1 rounded">*/}
                    {/*        -{discountPercent}%*/}
                    {/*      </span>*/}
                    {/*    </>*/}
                    {/*  )}*/}
                    {/*</div>*/}

                    {/* Stock */}
                    {/* <span className="font-semibold text-sm mt-1">
                      In Stock: {item.stock}
                    </span> */}
                  </div>
                </div>
              </Card>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </div>
  );
};

export default FlashSale;
