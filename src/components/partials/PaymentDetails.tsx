import { useState } from "react";
import { TextInput, Button, SegmentedControl } from "@mantine/core";
import { CreditCard } from "lucide-react";

const PaymentDetails = () => {
    const paymentMethods = [
        { label: "Credit Card", value: "credit", icon: "CreditCard" },
        { label: "Paypal", value: "paypal", icon: null },
    ];

    // Form state
    const [paymentMethod, setPaymentMethod] = useState("credit");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    // Hardcoded total (from image)
    const total = 175.99;

    // Handle form submission
    const handleSubmit = (e:any) => {
        e.preventDefault();
        console.log("Payment submitted:", {
            paymentMethod,
            cardNumber,
            expiryDate,
            cvv,
        });
    };

    // Map icons for payment methods
    const iconComponents = {
        CreditCard: CreditCard,
    };

    return (
        <div className="font-lexend py-8 px-4">
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold uppercase mb-6">Payment Details</h2>

                {/* Payment Methods */}
                <SegmentedControl
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    data={paymentMethods.map((method) => ({
                        label: (
                            <div className="flex items-center gap-2">
                                {method.icon? (
                                    <CreditCard size={16}  />
                                    ) : (
                                    <span>{method.label}</span>
                        )}
                <span>{method.label}</span>
            </div>
            ),
            value: method.value,
            }))}
            className="mb-6"
            fullWidth
        />


{/* Form Fields */}
{paymentMethod === "credit" && (
        <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.currentTarget.value)}
                radius="md"
                className="w-full"
                styles={{
                    input: { border: "1px solid #D1D5DB", backgroundColor: "white" },
                }}
            />
            <div className="flex gap-4">
                <TextInput
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.currentTarget.value)}
                    radius="md"
                    className="flex-1"
                    styles={{
                        input: { border: "1px solid #D1D5DB", backgroundColor: "white" },
                    }}
                />
                <TextInput
                    label="CVV"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.currentTarget.value)}
                    radius="md"
                    className="flex-1"
                    styles={{
                        input: { border: "1px solid #D1D5DB", backgroundColor: "white" },
                    }}
                />
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mt-6">
                <span className="font-bold">Total</span>
                <span className="font-bold">${total.toFixed(2)}</span>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                color="black"
                radius="xl"
                className="w-full mt-4"
            >
                Proceed to Pay
            </Button>
        </form>
    )}

{paymentMethod === "paypal" && (
        <div className="text-center">
            <div className="flex justify-between items-center mt-6">
                <span className="font-bold">Total</span>
                <span className="font-bold">${total.toFixed(2)}</span>
            </div>

            <Button
                color="black"
                radius="xl"
                className="w-full"
                onClick={() => console.log("Redirect to PayPal")}
            >
                Proceed to PayPal
            </Button>
        </div>
    )}
</div>
</div>
);
};

export default PaymentDetails;