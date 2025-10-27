<div align="center">

<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="400">


<h1>
  Mehul Form Validator Widget
</h1>

<p align="center">
  <strong>🚀 The Ultimate React Form Library</strong><br/>
  Beautiful • Customizable • Powerful • Developer-Friendly
</p>

<p align="center">

  <img src="https://img.shields.io/npm/l/mehul-form-validator-widget?style=for-the-badge&color=00d2d3&labelColor=2d3436" alt="license" />
  <img src="https://img.shields.io/badge/React-18+-61dafb?style=for-the-badge&logo=react&logoColor=white&labelColor=2d3436" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=2d3436" alt="TypeScript" />
</p>

<br/>

```bash
npm install mehul-form-validator-widget
```

<br/>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="700">

<br/>

### 🎯 Why Choose This Library?

<table>
  <tr>
    <td align="center" width="25%">
      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png" width="60" /><br/>
      <b>25+ Components</b>
    </td>
    <td align="center" width="25%">
      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png" width="60" /><br/>
      <b>Lightning Fast</b>
    </td>
    <td align="center" width="25%">
      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png" width="60" /><br/>
      <b>Fully Customizable</b>
    </td>
    <td align="center" width="25%">
      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png" width="60" /><br/>
      <b>Zero Dependencies</b>
    </td>
  </tr>
</table>

<img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="700">

</div>

<br/>

---

## 🚀 Quick Start

```tsx
import { FormProvider, Form, TextField, Button } from 'mehul-form-validator-widget'

function MyForm() {
  return (
    <FormProvider onSubmit={(values) => console.log(values)}>
      <Form>
        <TextField
          name="email"
          label="Email"
          type="email"
          validation={{ email: true }}
          required
        />
        
        <Button type="submit" fullWidth>Submit</Button>
      </Form>
    </FormProvider>
  )
}
```

---

## ✨ Key Features

- 🎯 **25+ Components** - Text, password, select, checkbox, radio, date picker, file upload & more
- ✅ **Smart Validation** - Email, URL, phone, regex, custom validators with debouncing
- 🎨 **Theme System** - Customize colors, borders, spacing with simple props
- 📱 **Responsive** - Works perfectly on mobile, tablet, and desktop
- ♿ **Accessible** - ARIA labels, keyboard navigation, screen reader support
- 💪 **TypeScript** - Fully typed for excellent developer experience
- 🌈 **Animations** - Beautiful micro-animations out of the box

---

## 🎨 Customization

### Quick Theme Override

```tsx
const theme = {
  primaryColor: "#6c5ce7",
  errorColor: "#ff4757",
  borderRadius: "12px"
}

<TextField name="email" theme={theme} />
```

### CSS Classes

```tsx
<TextField
  name="username"
  inputClassName="custom-input"
  labelClassName="custom-label"
  errorClassName="custom-error"
/>
```

---

## 📦 Available Components

**Form Structure:** `FormProvider` • `Form` • `FormGroup`

**Inputs:** `TextField` • `PasswordField` • `TextArea` • `Select` • `PhoneInput` • `OTPInput`

**Selection:** `Checkbox` • `CheckboxGroup` • `RadioGroup` • `DatePicker` • `ColorPicker`

**Upload:** `FileUpload` • `Slider`

**Actions:** `Button` • `SuccessModal`

---

## ✅ Validation Examples

```tsx
// Email validation
<TextField
  name="email"
  validation={{ email: true, required: true }}
/>

// Password with rules
<PasswordField
  name="password"
  validation={{
    minLength: 8,
    pattern: /^(?=.*[A-Z])(?=.*[0-9])/,
    customMessage: "Must contain uppercase and number"
  }}
/>

// Custom validation
<TextField
  name="username"
  validation={{
    pattern: /^[a-zA-Z0-9_]+$/,
    minLength: 3,
    maxLength: 20
  }}
/>
```

---

## 🎯 Advanced Usage

### Conditional Fields

```tsx
const { values } = useFormContext()

return (
  <>
    <Select name="type" options={[...]} />
    {values.type === 'business' && (
      <TextField name="company" required />
    )}
  </>
)
```

### Custom Validation

```tsx
const { setFieldError } = useFormContext()

<TextField
  name="username"
  onChange={async (value) => {
    const exists = await checkUsername(value)
    if (exists) setFieldError('username', 'Taken')
  }}
/>
```

---

## 🎨 Example Themes

```tsx
// Retro
const retro = {
  primaryColor: "#ff6b9d",
  borderColor: "#6c5ce7",
  borderRadius: "4px"
}

// Dark Mode
const dark = {
  primaryColor: "#00d2d3",
  backgroundColor: "#1a1a1a",
  textColor: "#ffffff"
}

// Minimal
const minimal = {
  primaryColor: "#000000",
  borderColor: "#e0e0e0",
  borderRadius: "0px"
}
```



<div align="center">

**⭐ Star this repo if you find it helpful!**

[🐛 Report Bug](https://github.com/yourusername/mehul-form-validator-widget/issues) • [💡 Request Feature](https://github.com/yourusername/mehul-form-validator-widget/issues) • [📖 Documentation](https://github.com/yourusername/mehul-form-validator-widget)

<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="400">

Made with ❤️ by [Mehul](https://github.com/yourusername)

</div>