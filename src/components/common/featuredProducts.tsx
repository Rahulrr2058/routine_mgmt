"use client";

import { Carousel } from "@mantine/carousel";
import { IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import CommonTitle from "@/components/common/CommonTittle";

// Define the Product interface with required and optional fields
interface Product {
  id: string;
  url: string;
  type: string;
  title: string;
  name: string;
  price: number;
  stock?: number;
  slug?: string;
  discountPercent: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  colors: { name: string; hexCode: string }[];
}

// Define the raw product data type from the API
interface RawProduct {
  id: string;
  productImage?: string;
  categories?: { categoryName: string }[];
  productName: string;
  slug?: string;
  pricingLists?: { price: number; discountPercent?: number }[];
  rating?: number;
  reviews?: number;
  stock?: number;
  isNew?: boolean;
  productColors?: { name: string; hexCode: string }[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/product/${product.slug || ""}`}>
      <div className="group bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden cursor-pointer transition-shadow duration-300">
        {/* Image */}
        <div className="relative sm:w-full h-[400px] w-[350px] overflow-hidden">
          <Image
            src={product.url || "/fallback-image.jpg"} // Fallback image if url is missing
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges */}
            {product?.stock == 0 ? (
                    <div className="absolute top-2 left-2 flex flex-col space-y-1">

                        {product.isNew && (
                            <span className="px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                Out of Stock
              </span>
                        )}
                    </div>

            ) : (
          <div className="absolute top-2 left-2 flex flex-col space-y-1">

            {product.isNew && (
              <span className="px-2 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full">
                New
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                -{product.discountPercent}%
              </span>
            )}
          </div>
            )}
          {/* Quick View */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-full bg-black text-white text-sm py-1 rounded-md hover:bg-gray-800 transition-colors">
              Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-2 flex flex-col space-y-1 text-sm">
          <p className="text-gray-500 uppercase truncate">{product.title}</p>
         <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 line-clamp-1">
  {product.name}
</h3>


          {/*<div className="flex items-center space-x-2 ">*/}
          {/*      <span className="font-semibold text-gray-900">*/}
          {/*        ${(product.price * (1 - product.discountPercent / 100)).toFixed(2)}*/}
          {/*      </span>*/}
          {/*      {product.discountPercent > 0 && (*/}
          {/*        <span className="text-gray-500 line-through">*/}
          {/*          ${product.price.toFixed(2)}*/}
          {/*        </span>*/}
          {/*      )}*/}
          {/*</div>*/}

            {product.colors[0]?.name == "Pattern" ? (
                <div className="relative w-3 h-3 rounded-full overflow-hidden mt-2">
                    <Image
                        src={product?.url}
                        alt={product.name}
                        height={1024}
                        width={1024}
                        className=" object-cover object-center scale-[8]"
                    />
                </div>
            ) : (

          <div className="flex items-center space-x-1 mt-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: color.hexCode }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-gray-500 text-xs">
                +{product.colors.length - 4} more
              </span>
            )}
          </div>
            )}

        </div>
      </div>
    </Link>
  );
};

interface FeaturedProductsProps {
  products: RawProduct[];
  title: string;
  description: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, title, description }) => {
  const router = useRouter();

  const transformedProducts: Product[] = products.map((item) => ({
    id: item.id,
    url: item.productImage || "/fallback-image.jpg",
    type: item.categories?.[0]?.categoryName || "Unknown",
    title: item.categories?.[0]?.categoryName || "Unknown",
    name: item.productName || "Unnamed Product",
    slug: item.slug || "",
    price: item.pricingLists?.[0]?.price || 0,
    discountPercent: item.pricingLists?.[0]?.discountPercent || 0,
    rating: item.rating || 4.5,
      stock: item.stock || 0,
    reviews: item.reviews || 10,
    isNew: item.isNew || false,
    colors: item.productColors || [],
  }));

  return (
    <div className="px-4 sm:px-8 py-8 md:py-16 bg-gray-50">
      {/* Title Section */}
      <CommonTitle title={title} description={description} />

      {/* Carousel for small screens */}
      <div className="block md:hidden">
        <Carousel
        //   withIndicators // Uncommented to enable indicators
          nextControlIcon={<IconArrowRight size={20} />}
          previousControlIcon={<IconArrowLeft size={20} />}
          classNames={{
            control: "bg-white/90 hover:bg-white shadow-md rounded-full p-1 transition",
            indicator: "bg-gray-300 data-[active=true]:bg-gray-900 w-2 h-2 rounded-full",
          }}
          slideSize="90%"
          slideGap="sm"
          align="start"
          slidesToScroll={1}
          loop
          dragFree
        >
          {transformedProducts.map((product) => (
            <Carousel.Slide key={product.id}>
              <div className="p-1">
                <ProductCard product={product} />
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      {/* Grid for md+ screens */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-6 lg:gap-8">
        {transformedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="flex flex-col items-center gap-4 mt-6">
        <div
          onClick={() => router.push("/marketplace")}
          className="px-6 py-2 bg-[#424741] text-white rounded shadow cursor-pointer text-center hover:bg-[#f5f0e1] hover:text-black transition"
        >
          View All
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;