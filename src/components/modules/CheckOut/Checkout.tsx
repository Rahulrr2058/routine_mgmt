// import React, { useState } from 'react';
// import { Stepper, Group, Image } from '@mantine/core';
// import { Star, Trash } from 'lucide-react';
// import { useRouter } from 'next/router';
// import { RootState } from '@/redux/store';
// import { useSelector, useDispatch } from 'react-redux';
// import BillingForm from '@/components/partials/BillingInformation';
// import PaymentDetails from '@/components/partials/PaymentDetails';
// import CommonButton from '@/components/common/CommonButton';
// import {removeCartItem, updateCartItemQty} from "@/redux/slice/cartSlice";
//
//
// function CheckOut() {
//     const router = useRouter();
//     const [active, setActive] = useState(0);
//     const dispatch = useDispatch();
//     const cartItems = useSelector((state: RootState) => state.cart.items);
//
//     const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
//     const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
//
//     const handleRemove = (id: number) => {
//         dispatch(removeCartItem(id));
//     };
//
//     const handleIncrement = (id: number) => {
//         dispatch(updateCartItemQty({ id, quantity: 1 }));
//     };
//
//     const handleDecrement = (id: number) => {
//         dispatch(updateCartItemQty({ id, quantity: -1 }));
//     };
//
//     const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
//     const shipping = 0.0;
//     const tax = 16.0;
//     const total = subtotal + shipping + tax;
//
//     return (
//         <div className="my-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//             <Stepper
//                 active={active}
//                 onStepClick={setActive}
//                 color="black"
//                 iconSize={24}
//                 className="w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto"
//                 styles={{
//                     steps: {
//                         display: 'flex',
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         width: '100%',
//                     },
//                     step: { flexShrink: 0 },
//                     stepIcon: {
//                         width: '24px',
//                         height: '24px',
//                         '@media (min-width: 640px)': { width: '28px', height: '28px' },
//                     },
//                     stepBody: {
//                         fontSize: '0.7rem',
//                         textAlign: 'center',
//                         '@media (min-width: 640px)': { fontSize: '0.8rem' },
//                     },
//                     stepDescription: {
//                         fontSize: '0.6rem',
//                         '@media (min-width: 640px)': { fontSize: '0.7rem' },
//                     },
//                     content: {
//                         paddingBottom: '0.5rem',
//                         '@media (min-width: 640px)': { paddingBottom: '0.75rem' },
//                     },
//                 }}
//             >
//                 <Stepper.Step label="First step" description="Create an account">
//                     <div className="space-y-4 mt-6 sm:mt-8">
//                         {cartItems.map((item: any) => (
//                             <div key={item.id} className="flex gap-3 sm:gap-4 border-b pb-4">
//                                 <Image
//                                     h={80}
//                                     w={80}
//                                     radius="md"
//                                     src={item.image}
//                                     alt={item.name}
//                                     className="object-cover sm:h-20 sm:w-20"
//                                 />
//                                 <div className="flex-1">
//                                     <div className="flex justify-between items-start">
//                                         <div>
//                                             <h4 className="font-bold text-xs sm:text-sm md:text-base">
//                                                 {item.name}
//                                             </h4>
//                                             <p className="text-xs sm:text-sm md:text-base">
//                                                 ${item.price.toFixed(2)}
//                                             </p>
//                                         </div>
//                                         <button onClick={() => handleRemove(item.id)}>
//                                             <Trash
//                                                 size={14}
//                                                 className="text-gray-500 hover:text-red-500 sm:w-4 sm:h-4"
//                                             />
//                                         </button>
//                                     </div>
//                                     <div className="flex items-center gap-1 mt-1">
//                                         {[...Array(item.rating)].map((_, i) => (
//                                             <Star key={i} size={12} fill="black" className="sm:w-4 sm:h-4" />
//                                         ))}
//                                     </div>
//                                     <div className="flex items-center gap-2 mt-2">
//                                         <div
//                                             onClick={() => handleDecrement(item.id)}
//                                             className="p-1.5 bg-secondary text-sm sm:p-2 sm:text-base text-white cursor-pointer"
//                                         >
//                                             -
//                                         </div>
//                                         <span className="text-xs bg-[#F5F5F5] px-3 py-1.5 sm:px-4 sm:py-2 sm:text-sm">
//                                             {item.quantity}
//                                         </span>
//                                         <div
//                                             onClick={() => handleIncrement(item.id)}
//                                             className="p-1.5 bg-secondary text-sm sm:p-2 sm:text-base text-white cursor-pointer"
//                                         >
//                                             +
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                         <div className="space-y-2 max-w-sm mx-auto">
//                             <div className="flex justify-between text-xs sm:text-sm md:text-base">
//                                 <span>Subtotal</span>
//                                 <span>${subtotal.toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between text-xs sm:text-sm md:text-base">
//                                 <span>Shipping</span>
//                                 <span>${shipping.toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between text-xs sm:text-sm md:text-base">
//                                 <span>Tax</span>
//                                 <span>${tax.toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between text-xs sm:text-sm md:text-base font-bold">
//                                 <span>Total</span>
//                                 <span>${total.toFixed(2)}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </Stepper.Step>
//                 <Stepper.Step label="Second step" description="Verify email">
//                     <BillingForm />
//                 </Stepper.Step>
//                 <Stepper.Step label="Final step" description="Get full access">
//                     <PaymentDetails />
//                 </Stepper.Step>
//                 <Stepper.Completed>
//                     Completed, click back button to get to previous step
//                 </Stepper.Completed>
//             </Stepper>
//        <Group justify="center" mt="xl" className="flex-wrap gap-4">
//   {active > 0 && (
//     <CommonButton
//       onClick={prevStep}
//       label="Back"
//       w="full max-w-[180px]"
//     />
//   )}
//
//   {active === 0 && (
//     <CommonButton
//       onClick={() => router.push('/marketplace')}
//       label="Add More Product"
//       w="full max-w-[180px]"
//     />
//   )}
//
//   <CommonButton
//     onClick={nextStep}
//     label={active === 2 ? 'Finish' : 'Next Step'}
//     w="full max-w-[180px]"
//   />
// </Group>
//         </div>
//     );
// }
//
// export default CheckOut;