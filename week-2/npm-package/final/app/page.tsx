"use client";
import {
  Form,
  TextField,
  PasswordField,
  PhoneField,
  DateField,
  Select,
  MultiSelect,
  Checkbox,
  Radio,
  FileUpload,
  Button,
  FormGroup,
  useFormContext,
  OtpInput

} from "../src/index";

function FormContent() {
  const { values } = useFormContext();

  return (
    <>
      <FormGroup title="Personal Information">
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <TextField
              name="firstName"
              label="First Name"
              type="text"
              placeholder="Mehul"
              required
              validation={{ type: "name", minLength: 5 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <TextField
              name="lastName"
              label="Last Name"
              type="text"
              placeholder="Singh"
              required
              validation={{ type: "name" }}
            />
          </div>
        </div>
      </FormGroup>

      <FormGroup title="Contact Information">
        <TextField
          name="email"
          label="Email Address"
          type="email"
          placeholder="mehul@example.com"
          required
          validation={{ type: "email" }}
          helperText="We'll never share your email"
        />
        <PhoneField
          name="phone"
          label="Phone Number"
          placeholder="+91 0000000000"
          required
        />
      </FormGroup>
      
<FormGroup title="Verify Your Email">
  <OtpInput
    name="otp"
    label="Enter OTP"
    length={6}
    required
    helperText="Check your email for the 6-digit code"
    onComplete={(otp) => console.log("OTP entered:", otp)}
  />
  <Button type="submit" label="Verify" variant="primary" fullWidth />
</FormGroup>

      <FormGroup title="Additional Details">
        <DateField
          name="birthDate"
          label="Birth Date"
          minAge={1}
          maxAge={65}
          required
        />
        <Select
          name="country"
          label="Country"
          options={[
            { value: "us", label: "United States" },
            { value: "uk", label: "United Kingdom" },
            { value: "ca", label: "Canada" },
            { value: "au", label: "Australia" },
          ]}
          required
        />
        <Radio
          name="gender"
          label="Gender"
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ]}
          required
        />
        <MultiSelect
          name="skills"
          label="Skills"
          options={[
            { value: "react", label: "React" },
            { value: "typescript", label: "TypeScript" },
            { value: "node", label: "Node.js" },
            { value: "python", label: "Python" },
            { value: "vue", label: "Vue.js" },
          ]}
        />
      </FormGroup>

      <FormGroup title="Security">
        <PasswordField
          name="password"
          label="Password"
          minStrength="strong"
          showStrengthMeter
        />
        <PasswordField
          name="confirmPassword"
          label="Confirm Password"
          matchField="password"
        />
      </FormGroup>

      <FormGroup title="Documents">
        <FileUpload
          name="resume"
          label="Upload Resume"
          accept=".pdf,.doc,.docx"
          maxSize={5242880}
        />
      </FormGroup>

      <Checkbox name="terms" label="I agree to terms and conditions" required />

      {/* Primary submit button with throttling and success modal */}
      <Button
        type="submit"
        enableThrottle={true}
        throttleDelay={500}
        showErrorSummary={true}
        showSuccessModal={true}
        successMessage="Your account has been created successfully! We've sent a confirmation email to your inbox."
        fullWidth
      >
        Create Account
      </Button>

      <div
        style={{
          marginTop: "32px",
          paddingTop: "24px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "12px",
          }}
        >
          Current Form Values:
        </h3>
        <pre
          style={{
            backgroundColor: "#f3f4f6",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#1f2937",
            overflow: "auto",
            maxHeight: "200px",
          }}
        >
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
    </>
  );
}

export default function Page() {
  // Clean submission handler - just your business logic
  const handleSubmit = async (values: any) => {
    // Simulate API call (e.g., sending data to server)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Your actual business logic here
    console.log("✓ Form submitted successfully:", values);

    // Could make API calls, save to database, etc.
    // const response = await fetch('/api/submit', {
    //   method: 'POST',
    //   body: JSON.stringify(values)
    // })
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#1f2937",
                marginBottom: "8px",
              }}
            >
              Create Your Account
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Fill out the form below to get started
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
              skills: [],
              gender: "",
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
              "gender",

              "terms",
            ]}
          >
            <FormContent />
          </Form>
        </div>
      </div>
    </div>
  );
}
