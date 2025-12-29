// import React, { useState, useRef, useEffect } from "react";
// import {
//   Burger,
//   Button,
//   Modal,
//   TextInput,
//   Image,
//   Drawer,
//   Divider,
//   Loader,
// } from "@mantine/core";
// import {
//   Clock,
//   Mail,
//   MapPin,
//   Phone,
//   Search,
//   ShoppingCart,
//   Trash,
//   Minus,
//   Plus,
// } from "lucide-react";
// import { useDisclosure } from "@mantine/hooks";
// import { useRouter } from "next/router";
// import CommonButton from "@/components/common/CommonButton";
// import CommonLogo from "@/components/common/CommonLogo";
// import GoogleLoginButton from "@/components/common/GoogleLoginButton";
// import { useAppDispatch, useAppSelector } from "@/redux/hook";
// import {
//   fetchCart,
//   updateCartItemQty,
//   removeCartItem,
//   clearCart,
//   resetCartStatus,
// } from "@/redux/slice/cartSlice";
// import {
//   APIClearCart,
//   APIDeleteCartItem,
//   APIGetMenuItemBySearch,
//   APIUpdateProductQuantity,
// } from "@/apis/product";
// import { getCookie, deleteCookie } from "cookies-next";
// import Link from "next/link";
// import showNotify from "@/utils/notify";
//
// interface ContactInfo {
//   icon: any;
//   text: string;
// }
//
// interface ContactSection {
//   title: string;
//   info: ContactInfo[];
// }
//
// const Navbar: React.FC = () => {
//   const [opened, { toggle }] = useDisclosure(false);
//   const [modalOpen, { open: openCartModal, close: closeCartModal }] =
//     useDisclosure(false);
//   const [loginModalOpen, { open: openLoginModal, close: closeLoginModal }] =
//     useDisclosure(false);
//   const [searchBarOpen, { toggle: toggleSearchBar }] = useDisclosure(false);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const router = useRouter();
//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<string | null>(null);
//   const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [isFocused, setIsFocused] = useState(false);
// const [showSuggestions, setShowSuggestions] = useState(true);
//
//   // Redux state
//   const dispatch = useAppDispatch();
//   const {
//     items: cartItems,
//     totals,
//     status,
//     error,
//   } = useAppSelector((state) => state.cart);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//
//   // Typing effect state
//   const placeholderWords = ["kurtha", "sari", "tops", "dresses", "skirts"];
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [displayedText, setDisplayedText] = useState("");
//   const [isTyping, setIsTyping] = useState(true);
//   const [charIndex, setCharIndex] = useState(0);
//
//   // Check authentication
//   const checkAuth = () => {
//     const token = getCookie("token");
//     setIsLoggedIn(!!token);
//   };
//
//   useEffect(() => {
//     checkAuth(); // Check on mount
//     router.events.on("routeChangeComplete", checkAuth);
//     return () => {
//       router.events.off("routeChangeComplete", checkAuth);
//     };
//   }, [router.events]);
//
//   // Typing effect logic
//   useEffect(() => {
//     if (isFocused) return; // Pause animation when input is focused
//
//     const currentWord = placeholderWords[currentWordIndex];
//     let timeout: NodeJS.Timeout;
//
//     if (isTyping) {
//       // Type characters
//       if (charIndex < currentWord.length) {
//         timeout = setTimeout(() => {
//           setDisplayedText((prev) => prev + currentWord[charIndex]);
//           setCharIndex((prev) => prev + 1);
//         }, 150); // Typing speed
//       } else {
//         // Pause before deleting
//         timeout = setTimeout(() => {
//           setIsTyping(false);
//         }, 1000); // Pause duration
//       }
//     } else {
//       // Delete characters
//       if (charIndex > 0) {
//         timeout = setTimeout(() => {
//           setDisplayedText((prev) => prev.slice(0, -1));
//           setCharIndex((prev) => prev - 1);
//         }, 100); // Deleting speed
//       } else {
//         // Move to next word
//         timeout = setTimeout(() => {
//           setCurrentWordIndex((prev) => (prev + 1) % placeholderWords.length);
//           setIsTyping(true);
//           setCharIndex(0);
//         }, 500); // Pause before typing next word
//       }
//     }
//
//     return () => clearTimeout(timeout);
//   }, [
//     charIndex,
//     isTyping,
//     currentWordIndex,
//     isFocused,
//     placeholderWords.length,
//   ]);
//
//   const placeholderText = `Search for ${displayedText}|`;
//
//   const handleLogout = () => {
//     deleteCookie("token");
//     setIsLoggedIn(false);
//     router.reload();
//   };
//
//   const contact: ContactSection = {
//     title: "Contact Us",
//     info: [
//       {
//         icon: <MapPin />,
//         text: "42468 Unicorn Dr, South Riding, VA, United States",
//       },
//       { icon: <Phone />, text: "+977-1-4123456" },
//       { icon: <Mail />, text: "info@damipasal.com" },
//       { icon: <Clock />, text: "Monday - Saturday: 10am - 7pm" },
//     ],
//   };
//
//   const updateQuantity = async (itemId: string, change: number) => {
//     const cartItem = cartItems.find((item) => item.id.toString() === itemId);
//     if (!cartItem) return;
//
//     const newQty = Math.max(1, cartItem.qty + change);
//     await APIUpdateProductQuantity(itemId, { qty: newQty });
//     dispatch(fetchCart("individual"));
//   };
//
//   const handleDeleteItem = async () => {
//     if (itemToDelete) {
//       await APIDeleteCartItem(itemToDelete);
//       dispatch(fetchCart("individual"));
//     }
//     setIsDeleteModalOpen(false);
//     setItemToDelete(null);
//   };
//
//   const openDeleteModal = (itemId: string) => {
//     setItemToDelete(itemId);
//     setIsDeleteModalOpen(true);
//   };
//
//   const handleClearCart = async () => {
//     await APIClearCart();
//     dispatch(fetchCart("individual"));
//     setIsClearCartModalOpen(false);
//   };
//
//   const openClearCartModal = () => {
//     setIsClearCartModalOpen(true);
//   };
//
//   const handleRemove = (id: number): void => {
//     openDeleteModal(id.toString());
//   };
//
//   const handleSearchIconClick = (): void => {
//     if (searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   };
//
//   useEffect(() => {
//     dispatch(fetchCart("individual"));
//   }, [dispatch]);
//
//   useEffect(() => {
//     if (!modalOpen) {
//       dispatch(resetCartStatus());
//     }
//   }, [modalOpen, dispatch]);
//
//   const getGrandTotal = () => {
//     if (!totals) return 0;
//     return (
//       Number(totals.discountedPrice) +
//       Number(totals.serviceCharge) +
//       Number(totals.deliveryCharge)
//     );
//   };
//
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(async () => {
//       try {
//         setIsSearching(true);
//         const res = await APIGetMenuItemBySearch(searchQuery);
//         setSearchResults(res?.data);
//       } catch (error) {
//         console.error("Search failed:", error);
//       } finally {
//         setIsSearching(false);
//       }
//     }, 500);
//
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchQuery]);
//
//   return (
//     <main className="flex-none sticky top-0 z-50 bg-white shadow-md">
//       <style jsx>{`
//         .blinking-cursor::after {
//           content: "|";
//           animation: blink 1s step-end infinite;
//         }
//         @keyframes blink {
//           50% {
//             opacity: 0;
//           }
//         }
//       `}</style>
//
//       {/* Delete Item Confirmation Modal */}
//
//       {/* Google Login Modal */}
//       <Modal
//         opened={loginModalOpen}
//         onClose={closeLoginModal}
//         title="Sign In Required"
//         centered
//         size="sm"
//       >
//         <GoogleLoginButton handleModal={closeLoginModal} />
//       </Modal>
//
//       {/* Cart Modal */}
//       <Modal
//         opened={modalOpen}
//         onClose={closeCartModal}
//         title={<span className="font-bold text-lg">Your Shopping Cart</span>}
//         centered
//         size="lg"
//         radius="md"
//         className="font-lexend"
//       >
//         {status === "loading" && (
//           <div className="flex justify-center py-8">
//             <Loader size="md" />
//           </div>
//         )}
//
//         {status !== "loading" && cartItems.length === 0 ? (
//           <div className="flex flex-col items-center gap-4 py-8">
//             <ShoppingCart size={48} className="text-gray-300" />
//             <span className="text-sm text-gray-600">Your cart is empty</span>
//             <Button
//               color="black"
//               radius="md"
//               onClick={() => {
//                 closeCartModal();
//                 router.push("/marketplace");
//               }}
//             >
//               Start Shopping
//             </Button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="space-y-3 max-h-96 overflow-y-auto">
//               {cartItems.map((item: any) => (
//                 <div
//                   key={item?.id}
//                   className="flex gap-3 border-b pb-4 last:border-b-0"
//                 >
//                   <Image
//                     h={80}
//                     w={80}
//                     radius="md"
//                     src={
//                       item?.product?.productImage || "/sample/placeholder.jpg"
//                     }
//                     alt={item?.product?.productName}
//                     fit="cover"
//                   />
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-start">
//                       <div className="space-y-1">
//                         <h4
//                           className="font-semibold text-sm truncate"
//                           title={item?.product?.productName}
//                         >
//                           {item?.product?.productName}
//                         </h4>
//                         <div className={"flex gap-5"}>
//                           {item?.product?.productSize && (
//                             <p className="text-xs text-gray-500">
//                               Size: {item?.product?.productSize}
//                             </p>
//                           )}
//                           {item?.product?.productColor && (
//                             <p className={`text-xs text-gray-500`}>
//                               Color: {item?.product?.productColor}
//                             </p>
//                           )}
//                         </div>
//
//                         <div className={"flex gap-4"}>
//                           <p className="text-sm font-medium text-gray-900">
//                             ${Number(item?.product?.discountedPrice).toFixed(2)}
//                           </p>
//                           <p className="text-sm font-medium text-gray-500 line-through">
//                             {!(
//                               item?.product?.totalPrice ===
//                               item?.product?.discountedPrice
//                             ) && (
//                               <p>
//                                 ${Number(item?.product?.totalPrice).toFixed(2)}
//                               </p>
//                             )}
//                           </p>
//                           <p className="text-sm text-gray-700 ">
//                             {item?.qty} items
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => handleRemove(item.id)}
//                         className="flex-shrink-0 p-1 hover:bg-red-50 rounded-full transition-colors"
//                         disabled={status === "loading"}
//                       >
//                         <Trash
//                           size={16}
//                           className="text-gray-500 hover:text-red-500"
//                         />
//                       </button>
//                     </div>
//                     <div className="flex items-center gap-2 mt-2">
//                       <button
//                         onClick={() => updateQuantity(item.id.toString(), -1)}
//                         className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors text-sm"
//                         disabled={item?.qty <= 1 || status === "loading"}
//                       >
//                         <Minus size={14} className="text-gray-600" />
//                       </button>
//                       <span className="font-medium min-w-[24px] text-center text-sm">
//                         {item?.qty}
//                       </span>
//                       <button
//                         onClick={() => updateQuantity(item.id.toString(), 1)}
//                         className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors text-sm"
//                         disabled={status === "loading"}
//                       >
//                         <Plus size={14} className="text-gray-600" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {totals && (
//               <>
//                 <Divider className="my-4" />
//                 <div className="space-y-2 pt-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium">
//                       ${Number(totals.totalPrice).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Discount</span>
//                     <span className="text-green-600">
//                       -$
//                       {(
//                         Number(totals.totalPrice) -
//                         Number(totals.discountedPrice)
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Discounted Subtotal</span>
//                     <span className="font-medium">
//                       ${Number(totals.discountedPrice).toFixed(2)}
//                     </span>
//                   </div>
//                   <Divider className="my-2" />
//                   <div className="flex justify-between text-base font-bold sm:text-lg">
//                     <span>Total</span>
//                     <span>${getGrandTotal().toFixed(2)}</span>
//                   </div>
//                 </div>
//               </>
//             )}
//             <div className="flex flex-col gap-3 pt-4">
//               <div className=" grid lg:grid-cols-2 grid-cols-1 gap-2">
//                 <CommonButton
//                   label={`Proceed to Checkout - $${getGrandTotal().toFixed(2)}`}
//                   w="100%"
//                   onClick={() => {
//                     closeCartModal();
//                     router.push("/checkout");
//                   }}
//                   className="bg-black hover:bg-gray-800 text-white py-3"
//                 />
//                 <Button
//                   color="red"
//                   radius="md"
//                   onClick={openClearCartModal}
//                   size="sm"
//                   className="flex-1"
//                   disabled={status === "loading"}
//                 >
//                   Clear Cart
//                 </Button>
//               </div>
//               <Button
//                 variant="outline"
//                 color="gray"
//                 onClick={() => {
//                   router.push("/marketplace");
//                   closeCartModal();
//                 }}
//                 size="sm"
//                 disabled={status === "loading"}
//               >
//                 Continue Shopping
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>
//
//       <Drawer
//         offset={10}
//         opened={opened}
//         onClose={toggle}
//         title={
//           <div
//             onClick={toggle}
//             className="cursor-pointer flex items-center gap-2 text-xl font-serif"
//           >
//             <CommonLogo />
//           </div>
//         }
//         radius="md"
//         size="sm"
//         position="right"
//         overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
//       >
//         <div className="flex-col flex cursor-pointer">
//           <div
//             className="border-b-2 p-2 border-secondary"
//             onClick={() => {
//               router.push("/");
//               toggle();
//             }}
//           >
//             Home
//           </div>
//           <div
//             className="border-b-2 p-2 border-secondary"
//             onClick={() => {
//               router.push("/marketplace");
//               toggle();
//             }}
//           >
//             MarketPlace
//           </div>
//           <div
//             className="border-b-2 p-2 border-secondary"
//             onClick={() => {
//               router.push("/aboutUs");
//               toggle();
//             }}
//           >
//             About Us
//           </div>
//           <div className="flex flex-col gap-2 mt-4 px-2">
//             {isLoggedIn ? (
//               <CommonButton
//                 onClick={handleLogout}
//                 className="bg-black text-white w-full"
//               >
//                 Logout
//               </CommonButton>
//             ) : (
//               <CommonButton
//                 onClick={() => {
//                   toggle();
//                   openLoginModal();
//                 }}
//                 className="bg-black text-white w-full"
//               >
//                 Login
//               </CommonButton>
//             )}
//           </div>
//           <div className="mt-20">
//             <h3 className="text-black font-bold uppercase mb-4">
//               {contact.title}
//             </h3>
//             <ul className="space-y-2">
//               {contact.info.map((item: ContactInfo, index: number) => {
//                 let link: string | null = null;
//                 if (item?.icon?.type === Mail) {
//                   link = `mailto:${item.text}`;
//                 } else if (item?.icon?.type === Phone) {
//                   link = `tel:${item.text}`;
//                 } else if (item?.icon?.type === MapPin) {
//                   link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//                     item.text
//                   )}`;
//                 }
//                 return (
//                   <li key={index} className="flex items-center space-x-2">
//                     {link ? (
//                       <a
//                         href={link}
//                         target={link.startsWith("http") ? "_blank" : "_self"}
//                         rel="noopener noreferrer"
//                         className="flex items-center space-x-2 text-gray-700 text-sm hover:text-gray-900 transition"
//                       >
//                         {item.icon}
//                         <span>{item.text}</span>
//                       </a>
//                     ) : (
//                       <div className="flex items-center space-x-2 text-gray-700 text-sm">
//                         {item.icon}
//                         <span>{item.text}</span>
//                       </div>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         </div>
//       </Drawer>
//
//       <div className="block md:hidden">
//         <div className="flex items-center justify-between px-4 py-3">
//           <div>
//             <Burger
//               opened={opened}
//               onClick={toggle}
//               aria-label="Toggle navigation"
//             />
//           </div>
//           <div>
//             <Link href="/" passHref>
//               <Image
//                 src="/damipasal.png"
//                 alt="Dami Pasal"
//                 width={120}
//                 height={40}
//                 className="h-9 w-auto object-contain cursor-pointer"
//               />
//             </Link>
//           </div>
//           <div className="flex gap-3">
//             <div>
//               <Search
//                 size={20}
//                 onClick={toggleSearchBar}
//                 className="cursor-pointer"
//
//               />
//             </div>
//             <div
//               className="relative cursor-pointer"
//               onClick={() => {
//                 openCartModal();
//                 dispatch(fetchCart("individual"));
//               }}
//             >
//               <ShoppingCart size={24} />
//               <div className="absolute -top-2 -right-2 bg-[#f1be1c] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse z-10 min-w-[24px]">
//                 {cartItems.length}
//               </div>
//             </div>
//           </div>
//         </div>
//         {searchBarOpen && (
//           <div className="px-4 pb-3 relative">
//             <TextInput
//               styles={{
//                 input: {
//                   textAlign: "center",
//                   color: "black",
//                   border: "none",
//                   backgroundColor: "#F2F1FF",
//                   "&::placeholder": {
//                     color: "black",
//                   },
//                 },
//               }}
//               placeholder={searchQuery ? "" : placeholderText}
//               leftSection={<Search size={16} color="black" />}
//               radius="xl"
//               value={searchQuery}
//               onChange={(event) =>{setSearchQuery(event.currentTarget.value)
//  setShowSuggestions(true); 
//               }
//             }
//               onKeyDown={(event) => {
//                   if (event.key === "Enter") {
//                       console.log(event.currentTarget.value);
//                        setSearchQuery("");          // clear search box
//     setShowSuggestions(false);  
//                   }
//               }}
//
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//             />
//             {searchQuery && showSuggestions && (
//               <div className="absolute top-12 left-0 w-full bg-white shadow-md rounded-lg p-4 max-h-64 overflow-y-auto z-10">
//                 {isSearching ? (
//                   <div className="flex justify-center py-2">
//                     <Loader size="sm" />
//                   </div>
//                 ) : searchResults.length > 0 ? (
//                   <ul>
//                     {searchResults?.map((product) => (
//                       <li
//                         key={product.id}
//                         className="py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
//                         onClick={() => {
//                           router.push(`/product/${product.slug}`);
//                           setSearchQuery("");
//                           setShowSuggestions(false); 
//                         }}
//                       >
//                         <div className="flex items-center justify-between gap-3">
//                           <span className="truncate">
//                             {product?.productName}
//                           </span>
//                           <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
//                             <Image
//                               src={product?.productImage}
//                               alt={product?.productName || "Product image"}
//                               width={48}
//                               height={48}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-500 text-sm">No products found</p>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//
//       <div className="md:flex items-center justify-around hidden relative">
//         <div className="my-4 flex items-center text-xl cursor-pointer">
//           <CommonLogo />
//         </div>
//         <div className="flex items-center gap-6">
//           <div className="relative">
//             <TextInput
//               ref={searchInputRef}
//               className="w-[25rem]"
//               styles={{
//                 input: {
//                   textAlign: "center",
//                   color: "black",
//                   border: "none",
//                   backgroundColor: "#F2F1FF",
//                   "&::placeholder": {
//                     color: "black",
//                   },
//                 },
//               }}
//               placeholder={searchQuery ? "" : placeholderText}
//               leftSection={
//                 <Search
//                   size={16}
//                   color="black"
//                   onClick={handleSearchIconClick}
//                   className="cursor-pointer"
//
//                 />
//               }
//               radius="xl"
//               value={searchQuery}
//               onChange={(event) => {setSearchQuery(event.currentTarget.value);
//                  setShowSuggestions(true)
//               }}
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//               onKeyDown={(event) => {
//                   if (event.key === "Enter") {
//                       console.log(event.currentTarget.value);
//                       router.push(`/marketplace?searchTerm=${event.currentTarget.value}`);
//                       setSearchQuery("");          // clear search box
//     setShowSuggestions(false); 
//                      
//                   }
//               }}
//
//             />
//             {searchQuery && showSuggestions && searchResults.length > 0  && (
//               <div className="absolute top-12 left-0 w-[25rem] bg-white shadow-md rounded-lg p-4 max-h-64 overflow-y-auto z-10">
//                 {isSearching ? (
//                   <div className="flex justify-center py-2">
//                     <Loader size="sm" />
//                   </div>
//                 ) : searchResults.length > 0 ? (
//                   <ul>
//                     {searchResults?.map((product) => (
//                       <li
//                         key={product.id}
//                         className="py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
//                         onClick={() => {
//                           router.push(`/product/${product.slug}`);
//                           setSearchQuery("");
//                            setShowSuggestions(false); 
//                         }}
//                       >
//                         <div className="flex items-center justify-between gap-3">
//                           <span className="truncate">
//                             {product?.productName}
//                           </span>
//                           <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
//                             <Image
//                               src={product?.productImage}
//                               alt={product?.productName || "Product image"}
//                               width={48}
//                               height={48}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-500 text-sm">No products found</p>
//                 )}
//               </div>
//             )}
//           </div>
//           <div
//             className="relative cursor-pointer"
//             onClick={() => {
//               openCartModal();
//               dispatch(fetchCart("individual"));
//             }}
//           >
//             <ShoppingCart size={24} />
//             <div className="absolute -top-2 -right-2 bg-[#f1be1c] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse z-10 min-w-[24px]">
//               {cartItems.length}
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Burger
//             opened={opened}
//             onClick={toggle}
//             aria-label="Toggle navigation"
//           />
//           <div className="flex items-center gap-2">
//             {isLoggedIn ? (
//               <CommonButton
//                 label="Logout"
//                 onClick={handleLogout}
//                 className="bg-black text-white"
//               />
//             ) : (
//               <CommonButton
//                 label="Login"
//                 onClick={openLoginModal}
//                 className="bg-black text-white"
//               />
//             )}
//           </div>
//         </div>
//       </div>
//       <Modal
//         className="z-10"
//         opened={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         title="Confirm Delete"
//         centered
//         size="sm"
//       >
//         <p>Are you sure you want to remove this item from your cart?</p>
//         <div className="flex justify-end gap-4 mt-4">
//           <Button
//             variant="outline"
//             onClick={() => setIsDeleteModalOpen(false)}
//             size="sm"
//           >
//             Cancel
//           </Button>
//           <Button
//             color="red"
//             onClick={handleDeleteItem}
//             size="sm"
//             loading={status === "loading"}
//           >
//             Delete
//           </Button>
//         </div>
//       </Modal>
//
//       {/* Clear Cart Confirmation Modal */}
//       <Modal
//         opened={isClearCartModalOpen}
//         onClose={() => setIsClearCartModalOpen(false)}
//         title="Confirm Clear Cart"
//         centered
//         size="sm"
//       >
//         <p>Are you sure you want to clear all items from your cart?</p>
//         <div className="flex justify-end gap-4 mt-4">
//           <Button
//             variant="outline"
//             onClick={() => setIsClearCartModalOpen(false)}
//             size="sm"
//           >
//             Cancel
//           </Button>
//           <Button
//             color="red"
//             onClick={handleClearCart}
//             size="sm"
//             loading={status === "loading"}
//           >
//             Clear Cart
//           </Button>
//         </div>
//       </Modal>
//     </main>
//   );
// };
//
// export default Navbar;
