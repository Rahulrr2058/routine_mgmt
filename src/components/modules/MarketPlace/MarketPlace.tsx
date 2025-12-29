// import { useState, useEffect } from "react";
// import {
//   Checkbox,
//   RangeSlider,
//   Select,
//   Button,
//   BackgroundImage,
// } from "@mantine/core";
// import { HandHeart, Shield, Star, SunIcon, Truck } from "lucide-react";
// import { useRouter } from "next/router";
// import CommonHeader from "@/components/common/CommonHeader";
// import FeaturedProducts from "@/components/common/featuredProducts";
// import WhyChooseUS from "@/components/common/WhyChooseUS";
// import { useDispatch } from "react-redux";
// import { addToCart } from "@/redux/slice/cartSlice"; // adjust path as needed
// import CommonButton from "@/components/common/CommonButton";
// interface Product {
//   url: string;
//   type: string;
//   title: string;
//   name: string;
//   price: number;
//   discountPercent: number;
//   rating: number;
//   reviews: number;
//   availability: string;
// }
//
// const Marketplace = () => {
//   const router = useRouter();
//   const { category } = router.query; // Get category from query parameter
//
//   const marketplaceData = {
//     categories: [
//       "Thangka Art",
//       "Handicrafts",
//       "Pashmina Shawls",
//       "Himalayan Jewelry",
//       "Singing Bowls",
//       "Tea & Spices",
//     ],
//     availability: ["In Stock", "Out of Stock"],
//   };
//
//   const whyChooseUsData = {
//     title: "Why Choose Us",
//     subtitle:
//       "We pride ourselves on bringing you the finest Nepalese cultural products",
//     data: [
//       {
//         icon: <SunIcon size={40} fill="black" />,
//         title: "Authentic Products",
//         description:
//           "All our products are 100% authentic, sourced directly from skilled Nepalese artisans.",
//       },
//       {
//         icon: <Truck size={40} fill="black" />,
//         title: "Cultural Heritage",
//         description:
//           "We preserve Nepal’s rich traditions by showcasing handcrafted cultural treasures.",
//       },
//       {
//         icon: <HandHeart size={40} />,
//         title: "Sustainable Practices",
//         description:
//           "Our products are made with eco-friendly materials and ethical craftsmanship.",
//       },
//       {
//         icon: <Shield size={40} fill="black" />,
//         title: "Fast Delivery",
//         description:
//           "Enjoy quick and reliable shipping to bring Nepal’s finest to your doorstep.",
//       },
//     ],
//   };
//
//   const products: Product[] = [
//     {
//       url: "/sample/sample1.jpg",
//       type: "Handmade",
//       title: "Thangka Art",
//       name: "Traditional Thangka Painting",
//       price: 189.99,
//       discountPercent: 15,
//       rating: 4.8,
//       reviews: 24,
//       availability: "In Stock",
//     },
//     {
//       url: "/sample/sample2.jpg",
//       type: "Textile",
//       title: "Pashmina Shawls",
//       name: "Pure Pashmina Shawl",
//       price: 129.99,
//       discountPercent: 10,
//       rating: 4.5,
//       reviews: 18,
//       availability: "In Stock",
//     },
//     {
//       url: "/sample/sample3.png",
//       type: "Musical Instrument",
//       title: "Singing Bowls",
//       name: "Hand hammered Singing Bowl",
//       price: 79.99,
//       discountPercent: 5,
//       rating: 4.7,
//       reviews: 32,
//       availability: "Out of Stock",
//     },
//     {
//       url: "/sample/sample4.jpg",
//       type: "Decor",
//       title: "Handicrafts",
//       name: "Traditional Wooden Mask",
//       price: 49.99,
//       discountPercent: 0,
//       rating: 4.2,
//       reviews: 15,
//       availability: "In Stock",
//     },
//     {
//       url: "/sample/sample5.jpg",
//       type: "Stationery",
//       title: "Handicrafts",
//       name: "Eco-friendly Paper Notebook",
//       price: 19.99,
//       discountPercent: 20,
//       rating: 4.9,
//       reviews: 40,
//       availability: "In Stock",
//     },
//     {
//       url: "/sample/sample6.jpg",
//       type: "Footwear",
//       title: "Handicrafts",
//       name: "Woolen Felt Slippers",
//       price: 29.99,
//       discountPercent: 10,
//       rating: 4.3,
//       reviews: 22,
//       availability: "Out of Stock",
//     },
//     {
//       url: "/sample/sample7.jpg",
//       type: "Jewelry",
//       title: "Himalayan Jewelry",
//       name: "Handcrafted Silver Necklace",
//       price: 99.99,
//       discountPercent: 25,
//       rating: 4.6,
//       reviews: 28,
//       availability: "In Stock",
//     },
//     {
//       url: "/sample/sample8.jpg",
//       type: "Kitchenware",
//       title: "Tea & Spices",
//       name: "Ceramic Tea Set",
//       price: 59.99,
//       discountPercent: 15,
//       rating: 4.4,
//       reviews: 20,
//       availability: "In Stock",
//     },
//   ];
//
//   // Simulate FeaturedProducts logic (products with rating >= 4.5 or discount > 10%)
//   const featuredProducts = products.filter(
//     (product) => product.rating >= 4.5 || product.discountPercent > 10
//   );
//
//   // Filter states
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
//   const [availability, setAvailability] = useState<string[]>([]);
//   const [sortOption, setSortOption] = useState<string>("Newest");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//
//   const dispatch = useDispatch();
//
//   const handleAddToCart = (product: Product, id: number) => {
//     dispatch(
//       addToCart({
//         id,
//         name: product.name,
//         price: product.price,
//         discountedPrice: product.price * (1 - product.discountPercent / 100),
//         quantity: 1,
//         image: product.url,
//       })
//     );
//     router.push("/checkout");
//   };
//   // Map category names from Content's "Explore Our Collection" to Marketplace categories
//   const categoryMapping: { [key: string]: string } = {
//     "Thangka Paintings": "Thangka Art",
//     Handicrafts: "Handicrafts",
//     "Pashmina Shawls": "Pashmina Shawls",
//     "Himalayan Jewelry": "Himalayan Jewelry",
//   };
//
//   // Set selected category from query parameter on mount
//   useEffect(() => {
//     if (category) {
//       const categories = Array.isArray(category)
//         ? category
//         : category.split("&");
//       const mappedCategories = categories
//         .map((cat) => categoryMapping[cat] || cat)
//         .filter((cat) => marketplaceData.categories.includes(cat));
//       setSelectedCategories(mappedCategories);
//     }
//   }, [category]);
//
//   // Helper to compute discounted price
//   const discountedPrice = (product: Product) =>
//     product.price * (1 - product.discountPercent / 100);
//
//   // Filter products
//   const filteredProducts = (
//     selectedCategories.length > 0
//       ? products.filter((product) => selectedCategories.includes(product.title))
//       : featuredProducts
//   )
//     .filter((product) => {
//       const price = discountedPrice(product);
//       const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
//       const inAvailability =
//         availability.length === 0 ||
//         availability.includes(product.availability);
//       return inPriceRange && inAvailability;
//     })
//     .sort((a, b) => {
//       if (sortOption === "Price: Low to High")
//         return discountedPrice(a) - discountedPrice(b);
//       if (sortOption === "Price: High to Low")
//         return discountedPrice(b) - discountedPrice(a);
//       return 0; // "Newest"
//     });
//
//   // Pagination
//   const productsPerPage = 9;
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const paginatedProducts = filteredProducts.slice(
//     (currentPage - 1) * productsPerPage,
//     currentPage * productsPerPage
//   );
//
//   // Handlers
//   const handleCategoryChange = (category: string) => {
//     const newCategories = selectedCategories.includes(category)
//       ? selectedCategories.filter((c) => c !== category)
//       : [...selectedCategories, category];
//
//     setSelectedCategories(newCategories);
//     setCurrentPage(1);
//
//     // Update URL with selected categories
//     const query =
//       newCategories.length > 0 ? { category: newCategories.join("&") } : {};
//     router.push(
//       {
//         pathname: router.pathname,
//         query,
//       },
//       undefined,
//       { shallow: true }
//     );
//   };
//
//   const handleAvailabilityChange = (option: string) => {
//     setAvailability((prev) =>
//       prev.includes(option)
//         ? prev.filter((o) => o !== option)
//         : [...prev, option]
//     );
//     setCurrentPage(1);
//   };
//
//   const handleApplyFilters = () => {
//     console.log("Filters applied:", {
//       selectedCategories,
//       priceRange,
//       availability,
//     });
//   };
//
//   return (
//     <div className="font-lexend py-8">
//       <CommonHeader
//         title="Our MarketPlace"
//         description={[
//           "Discover handcrafted treasures from the heart of the Himalayas.",
//           "Each product tells a story of Nepal's rich cultural heritage and skilled artisanship.",
//         ]}
//       />
//
//       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
//         {/* Sidebar */}
//         <aside className="lg:w-64 bg-white shadow-md rounded-lg p-6">
//           <h2 className="text-lg font-bold uppercase mb-4">Categories</h2>
//           <div className="space-y-2">
//             {marketplaceData.categories.map((category) => (
//               <Checkbox
//                 key={category}
//                 label={category}
//                 checked={selectedCategories.includes(category)}
//                 onChange={() => handleCategoryChange(category)}
//                 className="text-sm"
//               />
//             ))}
//           </div>
//
//           <h2 className="text-lg font-bold uppercase mt-6 mb-4">Price Range</h2>
//           <RangeSlider
//             min={0}
//             max={200}
//             step={1}
//             value={priceRange}
//             onChange={setPriceRange}
//             label={(val) => `$${val}`}
//             className="mb-4"
//             color="black"
//           />
//           <div className="flex justify-between text-sm text-gray-600">
//             <span>${priceRange[0]}</span>
//             <span>${priceRange[1]}</span>
//           </div>
//
//           <h2 className="text-lg font-bold uppercase mt-6 mb-4">
//             Availability
//           </h2>
//           <div className="space-y-2">
//             {marketplaceData.availability.map((option) => (
//               <Checkbox
//                 key={option}
//                 label={option}
//                 checked={availability.includes(option)}
//                 onChange={() => handleAvailabilityChange(option)}
//                 className="text-sm"
//               />
//             ))}
//           </div>
//           <CommonButton
//             onClick={handleApplyFilters}
//             label="Apply Filters"
//             radius="lg"
//             className="mt-8 "
//           />
//         </aside>
//
//         {/* Products */}
//         <div className="flex-1">
//           <div className="flex flex-col sm:flex-row justify-between items-center md:my-6 my-0 gap-4 sm:gap-0 md:ml-6">
//             <h2 className="text-lg sm:text-xl font-bold">Featured</h2>
//             <Select
//               value={sortOption}
//               onChange={(val) => setSortOption(val!)}
//               data={["Newest", "Price: Low to High", "Price: High to Low"]}
//               defaultValue="Newest"
//               className="w-full sm:w-48 px-2 sm:mx-0"
//             />
//           </div>
//
//           <div className="grid grid-cols-2 md:grid-cols-3 md:gap-6 gap-2 p-3 sm:pr-6 xl:px-0 md:mx-6">
//             {paginatedProducts.length > 0 ? (
//               paginatedProducts.map((product: Product, id: number) => (
//                 <div
//                   key={id}
//                   className="h-[25em] shadow-2xl rounded-lg space-y-3 cursor-pointer"
//                   onClick={() => router.push(`/${id + 1}`)}
//                 >
//                   <BackgroundImage
//                     src={product.url}
//                     className="relative"
//                     h="15rem"
//                   >
//                     <p className="bg-secondary text-white absolute text-[0.65rem] sm:text-xs m-2 p-1 rounded-md">
//                       {product.type}
//                     </p>
//                   </BackgroundImage>
//                   <div className="p-2 sm:p-3">
//                     <p className="text-[#6C757D] text-[0.65rem] sm:text-xs">
//                       {product.title}
//                     </p>
//                     <p className="text-secondary font-bold text-sm sm:text-base">
//                       {product.name}
//                     </p>
//                     <div className="flex gap-3 sm:gap-5 items-center">
//                       <p className="text-button font-bold text-sm sm:text-base">
//                         ${discountedPrice(product).toFixed(2)}
//                       </p>
//                       {product.discountPercent > 0 && (
//                         <>
//                           <p className="text-[#6C757D] text-[0.65rem] sm:text-xs">
//                             <s>${product.price.toFixed(2)}</s>
//                           </p>
//                           <p className="text-[0.65rem] sm:text-xs rounded-md px-1 bg-[#FFEAEA]">
//                             -{product.discountPercent}%
//                           </p>
//                         </>
//                       )}
//                     </div>
//
//                     <div className="flex justify-between items-center mt-1 sm:mt-2">
//                       <div className="flex items-center text-[0.65rem] sm:text-xs gap-1">
//                         <Star size={10} fill="black" />
//                         <p>{product.rating}</p>
//                         <p>({product.reviews})</p>
//                       </div>
//                       <div className="hidden sm:block">
//                         <CommonButton
//                           label="Add to cart"
//                           onClick={() => handleAddToCart(product, id)}
//                           radius="md"
//                           className="text-[0.65rem] sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3 rounded-md"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-2 md:col-span-3 text-center py-8">
//                 <p className="text-lg text-gray-600">
//                   No products found for the selected filters.
//                 </p>
//               </div>
//             )}
//           </div>
//
//           {/* Pagination */}
//           {paginatedProducts.length > 0 && (
//             <div className="flex justify-center mt-8 space-x-2">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//               >
//                 {"<"}
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-3 py-1 rounded ${
//                       currentPage === page
//                         ? "bg-black text-white"
//                         : "bg-gray-200 hover:bg-gray-300"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 )
//               )}
//               <button
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(totalPages, p + 1))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//               >
//                 {">"}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//
//       <div className="xl:mx-36 my-10">
//         {/*<FeaturedProducts  />*/}
//       </div>
//       <div className="xl:mx-36 my-10">
//         <WhyChooseUS
//           title={whyChooseUsData.title}
//           subtitle={whyChooseUsData.subtitle}
//           data={whyChooseUsData.data}
//         />
//       </div>
//     </div>
//   );
// };
//
// export default Marketplace;
