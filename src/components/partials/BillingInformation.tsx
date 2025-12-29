import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextInput,
  Select,
  Text,
  Title,
  Container,
} from "@mantine/core";
import "@mantine/core/styles.css";

interface BillingFormData {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  city: string;
  country: string;
}

const BillingForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BillingFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      streetAddress: "",
      city: "",
      country: "",
    },
  });

  const onSubmit = (data: BillingFormData) => {
    console.log("Form Data:", data);
    // Proceed to payment logic here
  };

  return (
    <Container className="py-8 max-w-lg mx-auto">
      <Title order={2} className="text-2xl font-bold text-gray-800 mb-6">
        Billing Information
      </Title>
      <form onSubmit={handleSubmit(onSubmit)} className="gap-4">
        <div className="grid grid-cols-2 gap-5">
          {/* First Name */}

          <div>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First name is required" }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="First Name"
                  placeholder="John"
                  error={errors.firstName?.message}
                  className="w-full"
                />
              )}
            />
          </div>

          {/* Last Name */}
          <div>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Last Name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  className="w-full"
                />
              )}
            />
          </div>

          {/* Email Address */}
          <div className={""}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Email Address"
                  placeholder="john.doe@gmail.com"
                  error={errors.email?.message}
                  className="w-full"
                />
              )}
            />
          </div>
          <div></div>

          {/* Street Address */}
          <div>
            <Controller
              name="streetAddress"
              control={control}
              rules={{ required: "Street address is required" }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Street Address"
                  placeholder="#4400"
                  error={errors.streetAddress?.message}
                  className="w-full"
                />
              )}
            />
          </div>

          {/* City */}
          <div>
            <Controller
              name="city"
              control={control}
              rules={{ required: "City is required" }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="City"
                  placeholder=""
                  error={errors.city?.message}
                  className="w-full"
                />
              )}
            />
          </div>

          {/* Country */}
          <div>
            <Controller
              name="country"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Country"
                  placeholder="Select your country"
                  data={[
                    "Nepal",
                    "United States",
                    "Canada",
                    "United Kingdom",
                    "Australia",
                  ]}
                  error={errors.country?.message}
                  className="w-full"
                  searchable
                />
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="filled"
          color="black"
          size="lg"
          className="mt-4"
        >
          Proceed to Payment
        </Button>
      </form>
    </Container>
  );
};

export default BillingForm;
