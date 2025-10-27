/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import {
  Form,
  TextField,
  PasswordField,
  Button,
  FormGroup,
  Checkbox,
  DateField,
  FileUpload,
  PhoneField,
  Select,
} from "mehul-form-validator-widget";

function RegisterContent({ onNavigate }) {
  return (
    <>
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <FormGroup>
          <TextField
            name="firstName"
            label="First Name"
            type="text"
            placeholder="first name"
            required
            validation={{ type: "name" }}
          />
        </FormGroup>

        <FormGroup>
          <TextField
            name="lastName"
            label="Last Name"
            type="text"
            placeholder="last name"
            required
            validation={{ type: "name" }}
          />
        </FormGroup>
      </div>

      {/* Contact Info */}
      <FormGroup>
        <TextField
          name="email"
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          required
          validation={{ type: "email" }}
        />
      </FormGroup>

      <FormGroup>
        <PhoneField
          name="phone"
          label="Phone Number"
          placeholder="0000000000"
          required
        />
      </FormGroup>

      {/* Date Picker */}
      <FormGroup>
        <DateField
          name="birthDate"
          label="Date of Birth"
          required
          minAge={10}
          maxAge={100}
        />
      </FormGroup>

      {/* Country Select */}
      <FormGroup>

     
        <Select
          name="country"
          label="Country"
          required
          options={[
            { value: "us", label: "United States" },
            { value: "in", label: "India" },
            { value: "uk", label: "United Kingdom" },
            { value: "ca", label: "Canada" },
          ]}
        />
      </FormGroup>

      {/* Resume Upload */}
      <FormGroup>
        <FileUpload
          name="resume"
          label="Upload Resume (PDF or DOC)"
          accept=".pdf,.doc,.docx"
          maxSize={5 * 1024 * 1024} // 5MB
          required
        />
      </FormGroup>

      {/* Passwords */}
      <FormGroup>
        <PasswordField
          name="password"
          label="Password"
          minStrength="medium"
          showStrengthMeter
          required
        />
      </FormGroup>

      <FormGroup>
        <PasswordField
          name="confirmPassword"
          label="Confirm Password"
          matchField="password"
          required
        />
      </FormGroup>

      {/* Terms */}
      <Checkbox
        name="terms"
        label="I agree to the terms and conditions"
        required
      />

      {/* Submit */}
      <Button type="submit" showSuccessModal={false} fullWidth>
        Create Account
      </Button>

      <p className="text-center text-sm text-stone-600 mt-6">
        Already have an account?{" "}
        <button
          onClick={(e) => {
            e.preventDefault();
            onNavigate("login");
          }}
          className="text-stone-800 font-semibold underline hover:no-underline"
        >
          Login here
        </button>
      </p>
    </>
  );
}

export default function RegisterPage({ onNavigate, onRegister }) {
  const handleSubmit = async (values) => {
    console.log("Registration submitted:", values);

    // Store user data in sessionStorage
    sessionStorage.setItem(
      "userData",
      JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        registrationTime: new Date().toISOString(),
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));
    onRegister();
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background Image - Replace src with your own image URL */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/d7/b2/04/d7b2045bbd484505c5925fa3b675949c.jpg')",
        }}
      />

      <div className="max-w-md w-full bg-white border-4 border-stone-800 shadow-[8px_8px_0px_0px_#292524] p-10 relative z-10">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-stone-800 mx-auto mb-4 flex items-center justify-center text-3xl">
            ✍️
          </div>
          <h2 className="text-3xl font-bold text-stone-800 font-serif">
            Create Account
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Join us to share your feedback
          </p>
        </div>

        <Form
          onSubmit={handleSubmit}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            birthDate: "",
            country: "",
            resume: null,
            password: "",
            confirmPassword: "",
            terms: false,
          }}
          requiredFields={[
            "firstName",
            "lastName",
            "email",
            "phone",
            "birthDate",
            "country",
            "resume",
            "password",
            "confirmPassword",
            "terms",
          ]}
        >
          <RegisterContent onNavigate={onNavigate} />
        </Form>

        <button
          onClick={() => onNavigate("landing")}
          className="mt-6 w-full px-4 py-2 bg-stone-100 text-stone-800 border-2 border-stone-300 text-sm font-medium hover:bg-stone-200 transition-all"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
