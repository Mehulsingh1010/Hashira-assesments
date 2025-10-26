// @ts-nocheck
// LoginPage.jsx
"use client";
import {
  Form,
  TextField,
  PasswordField,
  Button,
  FormGroup,
  Checkbox,
} from "form-validator-widget-hashira";

function LoginContent({ onNavigate }) {
  return (
    <>
      <FormGroup>
        <TextField
          name="email"
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          required
          validation={{ type: "email" }}
        />
      </FormGroup>

      <FormGroup>
        <PasswordField
          name="password"
          label="Password"
          required
        />
      </FormGroup>

      <Checkbox
        name="terms"
        label="I agree to the terms and conditions"
        required
      />

      <Button
        type="submit"
        showSuccessModal={false}
        fullWidth
      >
        Sign In
      </Button>

      <p className="text-center text-sm text-stone-600 mt-6">
        Don't have an account?{" "}
        <button
          onClick={(e) => {
            e.preventDefault();
            onNavigate("register");
          }}
          className="text-stone-800 font-semibold underline hover:no-underline"
        >
          Register here
        </button>
      </p>
    </>
  );
}

export default function LoginPage({ onNavigate, onLogin }) {
  const handleSubmit = async (values: { email: any; }) => {
    console.log("Login submitted:", values);
    
    // Store user data in memory (not localStorage as per restrictions)
    sessionStorage.setItem('userData', JSON.stringify({
      email: values.email,
      loginTime: new Date().toISOString(),
    }));
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onLogin();
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background Image - Replace src with your own image URL */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('https://i.pinimg.com/1200x/d7/b2/04/d7b2045bbd484505c5925fa3b675949c.jpg')" }}
      />
      
      <div className="max-w-md w-full bg-white border-4 border-stone-800 shadow-[8px_8px_0px_0px_#292524] p-10 relative z-10">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-stone-800 mx-auto mb-4 flex items-center justify-center text-3xl">
            🔐
          </div>
          <h2 className="text-3xl font-bold text-stone-800 font-serif">Welcome Back</h2>
          <p className="text-sm text-stone-600 mt-2">Sign in to continue to survey</p>
        </div>

        <Form
          onSubmit={handleSubmit}
          initialValues={{
            email: "",
            password: "",
            terms: false,
          }}
          requiredFields={["email", "password", "terms"]}
        >
          <LoginContent onNavigate={onNavigate} />
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