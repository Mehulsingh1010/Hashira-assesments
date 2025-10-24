import { DynamicForm } from "week2-form-validator-widget";

const loginFields = [
  { name: "email", placeholder: "Email", type: "email", required: true, validators: ["email"] },
  { name: "password", placeholder: "Password", type: "password", required: true, validators: ["minLength"], minLength: 6 },
  { name: "Confirm password", placeholder: "Confirm Password", type: "password", required: true, validators: ["minLength"], minLength: 6 }

];

const LoginForm=()=> {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <DynamicForm
          fields={loginFields}
          onSubmit={(values) => alert("Login Submitted: "+ values)}
          inputClass="w-full border p-3 rounded focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          errorClass="text-red-500  text-sm mt-1"
          buttonClass="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors duration-300 w-full"
        />
      </div>
    </div>
  );
}


export default LoginForm;