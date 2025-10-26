// @ts-nocheck
"use client";
import { useState } from "react";
import {
  Form,
  TextField,
  PasswordField,
  Button,
  FormGroup,
  Radio,
  useFormContext,
} from "form-validator-widget-hashira";

// Landing Page Component
function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-5">
      <div className="max-w-2xl w-full bg-white border-4 border-stone-800 shadow-[8px_8px_0px_0px_#292524] p-16 text-center">
        <div className="w-20 h-20 bg-stone-800 mx-auto mb-8 flex items-center justify-center text-5xl">
          📝
        </div>
        
        <h1 className="text-5xl font-bold text-stone-800 mb-4 font-serif">
          Teacher Survey
        </h1>
        
        <p className="text-lg text-stone-600 mb-10 leading-relaxed">
          Share your valuable feedback and help us improve the educational experience
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate("login")}
            className="px-8 py-3 bg-stone-800 text-stone-50 border-3 border-stone-800 text-base font-semibold hover:bg-stone-50 hover:text-stone-800 transition-all"
          >
            Login
          </button>
          
          <button
            onClick={() => onNavigate("register")}
            className="px-8 py-3 bg-stone-50 text-stone-800 border-3 border-stone-800 text-base font-semibold hover:bg-stone-800 hover:text-stone-50 transition-all"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

// Login Page Component
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

function LoginPage({ onNavigate, onLogin }) {
  const handleSubmit = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Login:", values);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-5">
      <div className="max-w-md w-full bg-white border-4 border-stone-800 shadow-[8px_8px_0px_0px_#292524] p-10">
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
          }}
          requiredFields={["email", "password"]}
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

// Register Page Component
function RegisterContent({ onNavigate }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormGroup>
          <TextField
            name="firstName"
            label="First Name"
            type="text"
            placeholder="John"
            required
            validation={{ type: "name" }}
          />
        </FormGroup>

        <FormGroup>
          <TextField
            name="lastName"
            label="Last Name"
            type="text"
            placeholder="Doe"
            required
            validation={{ type: "name" }}
          />
        </FormGroup>
      </div>

      <FormGroup>
        <TextField
          name="email"
          label="Email Address"
          type="email"
          placeholder="john.doe@example.com"
          required
          validation={{ type: "email" }}
        />
      </FormGroup>

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

      <Button
        type="submit"
        showSuccessModal={false}
        fullWidth
      >
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

function RegisterPage({ onNavigate, onRegister }) {
  const handleSubmit = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Register:", values);
    onRegister();
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-5">
      <div className="max-w-md w-full bg-white border-4 border-stone-800 shadow-[8px_8px_0px_0px_#292524] p-10">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-stone-800 mx-auto mb-4 flex items-center justify-center text-3xl">
            ✍️
          </div>
          <h2 className="text-3xl font-bold text-stone-800 font-serif">Create Account</h2>
          <p className="text-sm text-stone-600 mt-2">Join us to share your feedback</p>
        </div>

        <Form
          onSubmit={handleSubmit}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          requiredFields={["firstName", "lastName", "email", "password", "confirmPassword"]}
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

// Teacher Card Component
function TeacherCard({ teacher, isExpanded, onToggle, onSubmitReview }) {
  return (
    <div className="bg-white border-3 border-stone-800 shadow-[4px_4px_0px_0px_#292524] mb-6">
      <div
        onClick={onToggle}
        className="p-6 cursor-pointer hover:bg-stone-50 transition-colors flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-stone-800 text-stone-50 flex items-center justify-center text-2xl">
            {teacher.emoji}
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-800">{teacher.name}</h3>
            <p className="text-sm text-stone-600">{teacher.subject}</p>
          </div>
        </div>
        <div className="text-2xl text-stone-800">
          {isExpanded ? "−" : "+"}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t-3 border-stone-800 p-6 bg-stone-50">
          <div className="mb-6">
            <p className="text-stone-700 mb-2"><strong>Department:</strong> {teacher.department}</p>
            <p className="text-stone-700 mb-2"><strong>Experience:</strong> {teacher.experience}</p>
            <p className="text-stone-700 mb-4"><strong>About:</strong> {teacher.about}</p>
          </div>

          <Form
            onSubmit={(values) => onSubmitReview(teacher.id, values)}
            initialValues={{
              rating: "",
              teachingStyle: "",
              comment: "",
            }}
            requiredFields={["rating", "teachingStyle"]}
          >
            <SurveyFormContent teacherName={teacher.name} />
          </Form>
        </div>
      )}
    </div>
  );
}

// Survey Form Content Component
function SurveyFormContent({ teacherName }) {
  return (
    <>
      <FormGroup>
        <Radio
          name="rating"
          label="Overall Rating"
          options={[
            { value: "5", label: "⭐⭐⭐⭐⭐ Excellent" },
            { value: "4", label: "⭐⭐⭐⭐ Good" },
            { value: "3", label: "⭐⭐⭐ Average" },
            { value: "2", label: "⭐⭐ Below Average" },
            { value: "1", label: "⭐ Poor" },
          ]}
          required
        />
      </FormGroup>

      <FormGroup>
        <Radio
          name="teachingStyle"
          label="Teaching Style"
          options={[
            { value: "interactive", label: "Interactive & Engaging" },
            { value: "structured", label: "Well-Structured" },
            { value: "flexible", label: "Flexible & Adaptive" },
            { value: "traditional", label: "Traditional Approach" },
          ]}
          required
        />
      </FormGroup>

      <FormGroup>
        <TextField
          name="comment"
          label="Additional Comments (Optional)"
          type="text"
          placeholder="Share your detailed feedback..."
        />
      </FormGroup>

      <Button
        type="submit"
        showSuccessModal={true}
        successMessage={`Thank you for reviewing ${teacherName}! Your feedback has been submitted.`}
        fullWidth
      >
        Submit Review
      </Button>
    </>
  );
}

// Home/Survey Page Component
function HomePage({ onLogout }) {
  const [expandedTeacher, setExpandedTeacher] = useState(null);

  const teachers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      subject: "Mathematics",
      department: "Science & Mathematics",
      experience: "15 years",
      about: "Specializes in calculus and algebra. Known for making complex concepts simple.",
      emoji: "📐",
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      subject: "Computer Science",
      department: "Technology",
      experience: "12 years",
      about: "Expert in programming and algorithms. Passionate about hands-on learning.",
      emoji: "💻",
    },
    {
      id: 3,
      name: "Ms. Emily Rodriguez",
      subject: "Literature",
      department: "Arts & Humanities",
      experience: "10 years",
      about: "Encourages creative thinking and critical analysis of classical and modern texts.",
      emoji: "📚",
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      subject: "Physics",
      department: "Science & Mathematics",
      experience: "18 years",
      about: "Brings physics to life through experiments and real-world applications.",
      emoji: "⚛️",
    },
  ];

  const handleSubmitReview = async (teacherId, values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Review for teacher ${teacherId}:`, values);
    setExpandedTeacher(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-4 border-stone-800 shadow-[8px_8px_0px_0px_#292524] p-8 mb-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-stone-800 mb-2 font-serif">Teacher Survey</h1>
              <p className="text-stone-600">Select a teacher to expand details and submit your review</p>
            </div>
            <button
              onClick={onLogout}
              className="px-6 py-2 bg-stone-800 text-stone-50 border-3 border-stone-800 font-semibold hover:bg-stone-50 hover:text-stone-800 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              isExpanded={expandedTeacher === teacher.id}
              onToggle={() => setExpandedTeacher(expandedTeacher === teacher.id ? null : teacher.id)}
              onSubmitReview={handleSubmitReview}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
