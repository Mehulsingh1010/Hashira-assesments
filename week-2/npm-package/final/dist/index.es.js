import { jsx as r, jsxs as g, Fragment as ue } from "react/jsx-runtime";
import { createContext as he, useState as P, useRef as ne, useCallback as L, useContext as ye, useEffect as Q, useMemo as oe } from "react";
const fe = he(void 0), xe = ({
  children: e,
  onSubmit: n,
  initialValues: s = {},
  requiredFields: l = []
}) => {
  const [t, o] = P(s), [d, p] = P({}), [w, m] = P({}), [i, v] = P(!1), [y, F] = P(!1), f = ne({}), k = ne(null), u = L((V, S) => {
    o((R) => ({ ...R, [V]: S }));
  }, []), C = L((V, S) => {
    p((R) => {
      if (S === "") {
        const B = { ...R };
        return delete B[V], B;
      }
      return { ...R, [V]: S };
    });
  }, []), c = L((V, S) => {
    m((R) => ({ ...R, [V]: S }));
  }, []), h = L((V, S) => {
    f.current[V] = S;
  }, []), D = L((V) => {
    delete f.current[V];
  }, []), W = L(
    async (V) => {
      const S = f.current[V];
      if (S)
        return await S();
      const R = t[V];
      let B = "";
      return l.includes(V) && (R === "" || R === void 0 || R === null || typeof R == "string" && R.trim() === "" || Array.isArray(R) && R.length === 0 ? B = "This field is required" : typeof R == "boolean" && R === !1 && V === "terms" && (B = "You must accept the terms and conditions")), B ? (C(V, B), !1) : (C(V, ""), !0);
    },
    [t, l, C]
  ), z = L(async () => {
    const V = {};
    let S = !0;
    const R = /* @__PURE__ */ new Set([
      ...l,
      ...Object.keys(f.current),
      ...Object.keys(t)
    ]);
    R.forEach((E) => {
      V[E] = !0;
    }), m((E) => ({ ...E, ...V }));
    const B = Array.from(R).map(async (E) => {
      const q = f.current[E];
      if (q)
        try {
          const K = await q();
          return K || (S = !1), K;
        } catch (K) {
          return console.error(`Validation error for field ${E}:`, K), S = !1, !1;
        }
      else {
        const K = t[E];
        let T = "";
        return l.includes(E) && (K === "" || K === void 0 || K === null || typeof K == "string" && K.trim() === "" || Array.isArray(K) && K.length === 0 ? T = "This field is required" : typeof K == "boolean" && K === !1 && E === "terms" && (T = "You must accept the terms and conditions")), T ? (C(E, T), S = !1, !1) : (C(E, ""), !0);
      }
    });
    return await Promise.all(B), S;
  }, [t, l, C]), $ = L(() => {
    o(s), p({}), m({}), F(!1), v(!1);
  }, [s]), b = L(async () => {
    v(!0);
    try {
      await z() && n && (await n(t), F(!0));
    } catch (V) {
      console.error("Form submission error:", V);
    } finally {
      v(!1);
    }
  }, [z, n, t]), a = L(
    (V) => async (S) => {
      S.preventDefault(), S.stopPropagation();
      try {
        await V(t), F(!0), k.current && k.current();
      } catch (R) {
        throw console.error("Form submission error:", R), k.current && k.current(), R;
      }
    },
    [t]
  ), I = {
    values: t,
    errors: d,
    touched: w,
    isSubmitting: i,
    isSubmitted: y,
    setFieldValue: u,
    setFieldError: C,
    setFieldTouched: c,
    validateField: W,
    validateForm: z,
    resetForm: $,
    submitForm: b,
    handleSubmit: a,
    registerField: h,
    unregisterField: D,
    onSubmitSuccess: void 0
    // Will be set by Button component
  };
  return Object.defineProperty(I, "onSubmitSuccess", {
    get: () => k.current,
    set: (V) => {
      k.current = V;
    },
    enumerable: !0,
    configurable: !0
  }), /* @__PURE__ */ r(fe.Provider, { value: I, children: e });
}, ee = () => {
  const e = ye(fe);
  if (!e)
    throw new Error("useFormContext must be used within FormProvider");
  return e;
}, J = {
  primaryColor: "#000000",
  errorColor: "#ef4444",
  successColor: "#22c55e",
  borderColor: "#e5e7eb",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  fontSize: "14px",
  borderRadius: "6px",
  spacing: "8px"
}, Re = ({
  children: e,
  onSubmit: n,
  initialValues: s = {},
  theme: l,
  className: t,
  style: o,
  requiredFields: d = []
}) => {
  const w = {
    display: "flex",
    flexDirection: "column",
    gap: { ...J, ...l }.spacing,
    ...o
  };
  return /* @__PURE__ */ r(
    xe,
    {
      onSubmit: n,
      initialValues: s,
      requiredFields: d,
      children: /* @__PURE__ */ r(
        ge,
        {
          formStyles: w,
          className: t,
          onSubmit: n,
          children: e
        }
      )
    }
  );
};
function ge({
  children: e,
  formStyles: n,
  className: s,
  onSubmit: l
}) {
  const { handleSubmit: t } = ee();
  return /* @__PURE__ */ r(
    "form",
    {
      style: n,
      className: s,
      onSubmit: t(l),
      noValidate: !0,
      children: e
    }
  );
}
const be = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, me = (e) => e.trim() ? be.test(e) ? { isValid: !0 } : { isValid: !1, error: "Invalid email format" } : { isValid: !1, error: "Email is required" }, ve = /^[\d\s\-+$$$$]{10,}$/, Ce = (e) => e.trim() ? ve.test(e.replace(/\s/g, "")) ? { isValid: !0 } : { isValid: !1, error: "Invalid phone number format" } : { isValid: !1, error: "Phone number is required" }, we = /^[a-zA-Z\s'-]{2,}$/, ke = (e) => e.trim() ? we.test(e) ? { isValid: !0 } : { isValid: !1, error: "Name must contain only letters, spaces, hyphens, and apostrophes" } : { isValid: !1, error: "Name is required" }, ze = (e, n = {}) => {
  const {
    minLength: s = 8,
    requireUppercase: l = !0,
    requireLowercase: t = !0,
    requireNumbers: o = !0,
    requireSpecialChars: d = !0
  } = n;
  return e ? e.length < s ? { isValid: !1, error: `Password must be at least ${s} characters` } : l && !/[A-Z]/.test(e) ? { isValid: !1, error: "Password must contain at least one uppercase letter" } : t && !/[a-z]/.test(e) ? { isValid: !1, error: "Password must contain at least one lowercase letter" } : o && !/\d/.test(e) ? { isValid: !1, error: "Password must contain at least one number" } : d && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(e) ? { isValid: !1, error: "Password must contain at least one special character" } : { isValid: !0 } : { isValid: !1, error: "Password is required" };
}, Se = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, Fe = (e) => e.trim() ? Se.test(e) ? { isValid: !0 } : { isValid: !1, error: "Invalid URL format" } : { isValid: !1, error: "URL is required" }, Ie = (e) => e.trim() ? isNaN(Number(e)) ? { isValid: !1, error: "Must be a valid number" } : { isValid: !0 } : { isValid: !1, error: "Number is required" }, $e = /^[a-zA-Z0-9]+$/, Ve = (e) => e.trim() ? $e.test(e) ? { isValid: !0 } : { isValid: !1, error: "Only letters and numbers are allowed" } : { isValid: !1, error: "This field is required" }, Te = (e, n, s) => n && e.length < n ? { isValid: !1, error: `Minimum ${n} characters required` } : s && e.length > s ? { isValid: !1, error: `Maximum ${s} characters allowed` } : { isValid: !0 }, De = (e, n) => e !== n ? { isValid: !1, error: "Passwords do not match" } : { isValid: !0 }, le = (e, n) => {
  if (n.minLength || n.maxLength) {
    const s = Te(e, n.minLength, n.maxLength);
    if (!s.isValid)
      return s;
  }
  if (n.type === "custom" && n.customValidator) {
    const s = n.customValidator(e);
    return {
      isValid: s,
      error: s ? void 0 : n.errorMessage || "Validation failed"
    };
  }
  if (n.pattern) {
    const s = n.pattern.test(e);
    return {
      isValid: s,
      error: s ? void 0 : n.errorMessage || "Invalid format"
    };
  }
  switch (n.type) {
    case "email":
      return me(e);
    case "phone":
      return Ce(e);
    case "name":
      return ke(e);
    case "password":
      return ze(e);
    case "url":
      return Fe(e);
    case "number":
      return Ie(e);
    case "alphanumeric":
      return Ve(e);
    default:
      return { isValid: !0 };
  }
};
function ie(e, n) {
  let s = null;
  return function(...t) {
    const o = () => {
      s = null, e(...t);
    };
    s && clearTimeout(s), s = setTimeout(o, n);
  };
}
const Ye = ({
  name: e,
  label: n,
  placeholder: s,
  type: l = "text",
  validation: t,
  theme: o,
  disabled: d = !1,
  required: p = !1,
  onChange: w,
  onBlur: m,
  value: i,
  helperText: v,
  showError: y = !0,
  className: F = "",
  inputClassName: f = "",
  labelClassName: k = "",
  errorClassName: u = "",
  containerClassName: C = ""
}) => {
  const c = ee(), h = { ...J, ...o }, [D, W] = P(!1), [z, $] = P(!1), b = c.values[e] || "", a = c.errors[e], I = c.touched[e];
  Q(() => {
    i !== void 0 && c.values[e] === void 0 && c.setFieldValue(e, i);
  }, [i, e, c]);
  const V = L(
    (j) => {
      let U = "";
      if (p && (!j || j.trim() === ""))
        U = "This field is required";
      else if (t && j) {
        const H = le(j, t);
        H.isValid || (U = H.error || "Invalid input");
      }
      return c.setFieldError(e, U), !U;
    },
    [e, p, t, c]
  ), S = oe(
    () => ie((j) => {
      c.touched[e] && V(j);
    }, 300),
    [e, V, c.touched]
  ), R = L(
    (j) => {
      const U = j.target.value;
      c.setFieldValue(e, U), w == null || w(U), I && a && c.setFieldError(e, ""), S(U);
    },
    [e, c, w, S, I, a]
  ), B = L(() => {
    W(!1), c.setFieldTouched(e, !0), V(b), m == null || m();
  }, [e, c, m, V, b]), E = L(() => {
    W(!0);
  }, []), K = b && b.length > 0 && !a && I, T = {
    container: {
      marginBottom: h.spacing,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "100%",
      position: "relative"
    },
    labelWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    label: {
      fontSize: "14px",
      fontWeight: 600,
      color: D ? h.primaryColor : h.textColor,
      letterSpacing: "0.02em",
      lineHeight: "1.5",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: D ? "translateY(-1px)" : "translateY(0)"
    },
    requiredBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: `${h.errorColor}15`,
      color: h.errorColor,
      fontSize: "20px",
      fontWeight: 700,
      animation: p ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none"
    },
    inputWrapper: {
      position: "relative",
      width: "100%"
    },
    input: {
      width: "100%",
      padding: "13px 44px 13px 16px",
      fontSize: "15px",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      fontWeight: 400,
      border: `2px solid ${a && I ? h.errorColor : D ? h.primaryColor : z ? "#a1a1aa" : h.borderColor}`,
      borderRadius: "10px",
      backgroundColor: d ? "#fafafa" : h.backgroundColor,
      color: h.textColor,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      boxSizing: "border-box",
      cursor: d ? "not-allowed" : "text",
      opacity: d ? 0.5 : 1,
      WebkitAppearance: "none",
      MozAppearance: "none",
      boxShadow: a && I ? `0 0 0 4px ${h.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)` : D ? `0 0 0 4px ${h.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)` : z ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 4px rgba(0,0,0,0.04)",
      transform: D ? "translateY(-1px)" : "translateY(0)"
    },
    iconContainer: {
      position: "absolute",
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      pointerEvents: "none"
    },
    checkIcon: {
      color: "#10b981",
      opacity: K ? 1 : 0,
      transform: K ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    errorIcon: {
      color: h.errorColor,
      opacity: a && I ? 1 : 0,
      transform: a && I ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: a && I ? "shake 0.5s ease-in-out" : "none"
    },
    errorText: {
      fontSize: "13px",
      color: h.errorColor,
      display: "flex",
      alignItems: "flex-start",
      gap: "6px",
      fontWeight: 500,
      lineHeight: "1.4",
      animation: "slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    helperText: {
      fontSize: "13px",
      color: "#71717a",
      lineHeight: "1.5",
      fontWeight: 400,
      animation: "fadeIn 0.3s ease"
    },
    characterCount: {
      fontSize: "12px",
      color: D ? h.primaryColor : "#a1a1aa",
      textAlign: "right",
      fontWeight: 500,
      transition: "color 0.2s ease"
    }
  }, N = t == null ? void 0 : t.maxLength;
  return /* @__PURE__ */ g("div", { style: T.container, className: C, children: [
    n && /* @__PURE__ */ g("div", { style: T.labelWrapper, children: [
      /* @__PURE__ */ r("label", { style: T.label, htmlFor: e, className: k, children: n }),
      p && /* @__PURE__ */ r("span", { style: T.requiredBadge, title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ g("div", { style: T.inputWrapper, children: [
      /* @__PURE__ */ r(
        "input",
        {
          id: e,
          type: l,
          name: e,
          placeholder: s,
          value: b,
          onChange: R,
          onBlur: B,
          onFocus: E,
          onMouseEnter: () => $(!0),
          onMouseLeave: () => $(!1),
          disabled: d,
          maxLength: N,
          "aria-invalid": !!(a && I),
          "aria-describedby": a && I ? `${e}-error` : void 0,
          style: T.input,
          className: `${F} ${f}`
        }
      ),
      /* @__PURE__ */ g("div", { style: T.iconContainer, children: [
        K && /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: T.checkIcon, children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" }) }),
        a && I && !K && /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", style: T.errorIcon, children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
      ] })
    ] }),
    N && D && /* @__PURE__ */ g("div", { style: T.characterCount, children: [
      b.length,
      " / ",
      N
    ] }),
    y && a && I && /* @__PURE__ */ g("div", { id: `${e}-error`, role: "alert", style: T.errorText, className: u, children: [
      /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", style: { flexShrink: 0, marginTop: "1px" }, children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
      /* @__PURE__ */ r("span", { children: a })
    ] }),
    v && !(a && I) && /* @__PURE__ */ r("div", { style: T.helperText, children: v }),
    /* @__PURE__ */ r("style", { children: `
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }
          
          @keyframes shake {
            0%, 100% {
              transform: translateX(0) translateY(-50%);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-3px) translateY(-50%);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(3px) translateY(-50%);
            }
          }
        ` })
  ] });
}, Ae = ({
  name: e,
  label: n,
  placeholder: s = "Enter password",
  required: l = !1,
  disabled: t = !1,
  minStrength: o,
  showStrengthMeter: d = !1,
  matchField: p,
  onChange: w,
  onValidation: m,
  className: i = "",
  containerClassName: v = "",
  labelClassName: y = "",
  errorClassName: F = "",
  inputClassName: f = "",
  helperText: k,
  theme: u
}) => {
  const C = ee(), c = { ...J, ...u }, [h, D] = P(!1), [W, z] = P(!1), [$, b] = P(!1), a = C.values[e] || "", I = C.errors[e], V = C.touched[e], R = a && a.length > 0 && !I && V, B = oe(() => {
    if (!a) return 0;
    let Y = 0;
    return a.length >= 8 && Y++, /[A-Z]/.test(a) && Y++, /[a-z]/.test(a) && Y++, /\d/.test(a) && Y++, /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(a) && Y++, Y;
  }, [a]), E = oe(() => B === 0 ? "Very Weak" : B === 1 ? "Weak" : B === 2 ? "Fair" : B === 3 ? "Good" : B === 4 ? "Strong" : "Very Strong", [B]), q = oe(() => B <= 1 ? "#ef4444" : B === 2 ? "#f59e0b" : B === 3 ? "#eab308" : "#10b981", [B]), K = oe(() => B <= 1 ? "😟" : B === 2 ? "😐" : B === 3 ? "🙂" : B === 4 ? "😊" : "🔐", [B]), T = L(async () => {
    const Y = C.values[e] || "";
    let O = "";
    if (l && !Y)
      O = "This field is required";
    else if (o && Y) {
      const M = { weak: 1, fair: 2, good: 3, strong: 4, "very-strong": 5 };
      let A = 0;
      Y.length >= 8 && A++, /[A-Z]/.test(Y) && A++, /[a-z]/.test(Y) && A++, /\d/.test(Y) && A++, /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(Y) && A++, A < M[o] && (O = `Password must be at least ${o}`);
    }
    if (!O && p && Y) {
      const M = C.values[p];
      M && Y !== M && (O = "Passwords do not match");
    }
    return C.setFieldError(e, O), m == null || m(!O, O), !O;
  }, [e, l, o, p, C, m]);
  Q(() => (C.registerField(e, T), () => {
    C.unregisterField(e);
  }), [e, T, C]), Q(() => {
    if (p && V) {
      const Y = C.values[p];
      a && Y !== void 0 && T();
    }
  }, [p ? C.values[p] : null]);
  const N = (Y) => {
    const O = Y.target.value;
    C.setFieldValue(e, O), w == null || w(O), V && I && C.setFieldError(e, "");
  }, j = () => {
    z(!1), C.setFieldTouched(e, !0), T();
  }, U = () => {
    z(!0);
  }, H = {
    container: {
      marginBottom: c.spacing,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "100%",
      position: "relative"
    },
    labelWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    label: {
      fontSize: "14px",
      fontWeight: 600,
      color: W ? c.primaryColor : c.textColor,
      letterSpacing: "0.02em",
      lineHeight: "1.5",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: W ? "translateY(-1px)" : "translateY(0)"
    },
    requiredBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: `${c.errorColor}15`,
      color: c.errorColor,
      fontSize: "20px",
      fontWeight: 700,
      animation: l ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none"
    },
    inputWrapper: {
      position: "relative",
      width: "100%"
    },
    input: {
      width: "100%",
      padding: "13px 80px 13px 16px",
      fontSize: "15px",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      fontWeight: 400,
      border: `2px solid ${I && V ? c.errorColor : W ? c.primaryColor : $ ? "#a1a1aa" : c.borderColor}`,
      borderRadius: "10px",
      backgroundColor: t ? "#fafafa" : c.backgroundColor,
      color: c.textColor,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      boxSizing: "border-box",
      cursor: t ? "not-allowed" : "text",
      opacity: t ? 0.5 : 1,
      WebkitAppearance: "none",
      MozAppearance: "none",
      boxShadow: I && V ? `0 0 0 4px ${c.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)` : W ? `0 0 0 4px ${c.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)` : $ ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 4px rgba(0,0,0,0.04)",
      transform: W ? "translateY(-1px)" : "translateY(0)"
    },
    iconContainer: {
      position: "absolute",
      right: "45px",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      pointerEvents: "none"
    },
    checkIcon: {
      color: "#10b981",
      opacity: R ? 1 : 0,
      transform: R ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    errorIcon: {
      color: c.errorColor,
      opacity: I && V ? 1 : 0,
      transform: I && V ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: I && V ? "shake 0.5s ease-in-out" : "none"
    },
    toggleButton: {
      position: "absolute",
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      color: W ? c.primaryColor : "#6b7280",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    strengthMeter: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      animation: "slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    strengthBarContainer: {
      display: "flex",
      gap: "4px",
      alignItems: "center"
    },
    strengthBar: {
      flex: 1,
      height: "6px",
      backgroundColor: "#e5e7eb",
      borderRadius: "3px",
      overflow: "hidden",
      position: "relative"
    },
    strengthSegment: {
      display: "flex",
      gap: "3px",
      flex: 1
    },
    segment: (Y, O) => ({
      flex: 1,
      height: "6px",
      backgroundColor: O ? q : "#e5e7eb",
      borderRadius: "3px",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: O ? "scaleY(1.2)" : "scaleY(1)",
      animation: O ? `segmentPulse 0.5s ease ${Y * 0.1}s` : "none"
    }),
    strengthLabel: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      color: q,
      fontWeight: 600,
      animation: "fadeIn 0.3s ease"
    },
    emoji: {
      fontSize: "16px",
      animation: "bounce 0.5s ease"
    },
    requirements: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      fontSize: "12px",
      animation: "slideDown 0.3s ease"
    },
    requirement: (Y) => ({
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: Y ? "#10b981" : "#6b7280",
      transition: "all 0.3s ease",
      fontWeight: Y ? 500 : 400
    }),
    requirementIcon: (Y) => ({
      fontSize: "12px",
      color: Y ? "#10b981" : "#d1d5db",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: Y ? "scale(1) rotate(0deg)" : "scale(0.8) rotate(-90deg)"
    }),
    errorText: {
      fontSize: "13px",
      color: c.errorColor,
      display: "flex",
      alignItems: "flex-start",
      gap: "6px",
      fontWeight: 500,
      lineHeight: "1.4",
      animation: "slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    helperText: {
      fontSize: "13px",
      color: "#71717a",
      lineHeight: "1.5",
      fontWeight: 400,
      animation: "fadeIn 0.3s ease"
    }
  }, Z = oe(() => [
    { label: "At least 8 characters", met: a.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(a) },
    { label: "Lowercase letter", met: /[a-z]/.test(a) },
    { label: "Number", met: /\d/.test(a) },
    { label: "Special character", met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(a) }
  ], [a]);
  return /* @__PURE__ */ g("div", { style: H.container, className: v, children: [
    n && /* @__PURE__ */ g("div", { style: H.labelWrapper, children: [
      /* @__PURE__ */ r("label", { style: H.label, htmlFor: e, className: y, children: n }),
      l && /* @__PURE__ */ r("span", { style: H.requiredBadge, title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ g("div", { style: H.inputWrapper, children: [
      /* @__PURE__ */ r(
        "input",
        {
          id: e,
          type: h ? "text" : "password",
          name: e,
          value: a,
          onChange: N,
          onFocus: U,
          onBlur: j,
          onMouseEnter: () => b(!0),
          onMouseLeave: () => b(!1),
          placeholder: s,
          disabled: t,
          "aria-invalid": !!(I && V),
          "aria-describedby": I && V ? `${e}-error` : void 0,
          style: H.input,
          className: `${i} ${f}`
        }
      ),
      /* @__PURE__ */ g("div", { style: H.iconContainer, children: [
        R && /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: H.checkIcon, children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" }) }),
        I && V && !R && /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", style: H.errorIcon, children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
      ] }),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => D(!h),
          style: H.toggleButton,
          onMouseEnter: (Y) => Y.currentTarget.style.transform = "translateY(-50%) scale(1.1)",
          onMouseLeave: (Y) => Y.currentTarget.style.transform = "translateY(-50%) scale(1)",
          tabIndex: -1,
          "aria-label": h ? "Hide password" : "Show password",
          children: h ? /* @__PURE__ */ g("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ r("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }),
            /* @__PURE__ */ r("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
          ] }) : /* @__PURE__ */ g("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ r("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
            /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "3" })
          ] })
        }
      )
    ] }),
    d && a && /* @__PURE__ */ g("div", { style: H.strengthMeter, children: [
      /* @__PURE__ */ g("div", { style: H.strengthBarContainer, children: [
        /* @__PURE__ */ r("div", { style: H.strengthSegment, children: [0, 1, 2, 3, 4].map((Y) => /* @__PURE__ */ r(
          "div",
          {
            style: H.segment(Y, Y < B)
          },
          Y
        )) }),
        /* @__PURE__ */ g("div", { style: H.strengthLabel, children: [
          /* @__PURE__ */ r("span", { style: H.emoji, children: K }),
          E
        ] })
      ] }),
      W && /* @__PURE__ */ r("div", { style: H.requirements, children: Z.map((Y, O) => /* @__PURE__ */ g("div", { style: H.requirement(Y.met), children: [
        /* @__PURE__ */ r("span", { style: H.requirementIcon(Y.met), children: Y.met ? "✓" : "○" }),
        Y.label
      ] }, O)) })
    ] }),
    I && V && /* @__PURE__ */ g("div", { id: `${e}-error`, role: "alert", style: H.errorText, className: F, children: [
      /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", style: { flexShrink: 0, marginTop: "1px" }, children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
      /* @__PURE__ */ r("span", { children: I })
    ] }),
    k && !(I && V) && /* @__PURE__ */ r("div", { style: H.helperText, children: k }),
    /* @__PURE__ */ r("style", { children: `
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }
          
          @keyframes shake {
            0%, 100% {
              transform: translateX(0) translateY(-50%);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-3px) translateY(-50%);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(3px) translateY(-50%);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
          }

          @keyframes segmentPulse {
            0% {
              transform: scaleY(1);
              opacity: 0.6;
            }
            50% {
              transform: scaleY(1.4);
              opacity: 1;
            }
            100% {
              transform: scaleY(1.2);
              opacity: 1;
            }
          }
        ` })
  ] });
}, Me = ({
  name: e,
  label: n,
  value: s,
  checked: l,
  onChange: t,
  disabled: o = !1,
  theme: d,
  required: p = !1
}) => {
  const w = ee(), m = { ...J, ...d }, i = w.values[e], v = l !== void 0 ? l : i, y = w.errors[e], [F, f] = P(!1), [k, u] = P(!1), C = L(
    (h) => {
      const D = h.target.checked;
      w.setFieldValue(e, D), w.setFieldTouched(e, !0), t == null || t(D);
    },
    [e, w, t]
  ), c = {
    container: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: m.spacing,
      cursor: o ? "not-allowed" : "pointer",
      opacity: o ? 0.6 : 1,
      transition: "opacity 0.3s ease"
    },
    checkboxWrapper: {
      position: "relative",
      width: "22px",
      height: "22px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    checkboxBase: {
      appearance: "none",
      WebkitAppearance: "none",
      width: "22px",
      height: "22px",
      borderRadius: "6px",
      border: `2px solid ${y ? m.errorColor : k ? m.primaryColor : m.borderColor}`,
      backgroundColor: v ? m.primaryColor : m.backgroundColor,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: o ? "not-allowed" : "pointer",
      boxShadow: F ? `0 0 0 4px ${m.primaryColor}15` : k ? `0 0 0 4px ${m.primaryColor}20` : "none",
      outline: "none",
      position: "relative"
    },
    checkmark: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: v ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0)",
      opacity: v ? 1 : 0,
      color: m.backgroundColor,
      transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      pointerEvents: "none"
    },
    label: {
      fontSize: m.fontSize || "14px",
      color: m.textColor,
      cursor: o ? "not-allowed" : "pointer",
      userSelect: "none",
      fontWeight: 500,
      transition: "color 0.2s ease"
    },
    requiredMark: {
      color: m.errorColor,
      marginLeft: "4px",
      fontWeight: 600
    },
    errorText: {
      fontSize: "12px",
      color: m.errorColor,
      marginTop: "4px",
      animation: "fadeIn 0.3s ease"
    }
  };
  return /* @__PURE__ */ g("div", { children: [
    /* @__PURE__ */ g(
      "div",
      {
        style: c.container,
        onMouseEnter: () => f(!0),
        onMouseLeave: () => f(!1),
        children: [
          /* @__PURE__ */ g("div", { style: c.checkboxWrapper, children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                name: e,
                id: e,
                value: s,
                checked: v || !1,
                disabled: o,
                onChange: C,
                onFocus: () => u(!0),
                onBlur: () => u(!1),
                style: c.checkboxBase
              }
            ),
            /* @__PURE__ */ r(
              "svg",
              {
                style: c.checkmark,
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" })
              }
            )
          ] }),
          n && /* @__PURE__ */ g("label", { htmlFor: e, style: c.label, children: [
            n,
            p && /* @__PURE__ */ r("span", { style: c.requiredMark, children: "*" })
          ] })
        ]
      }
    ),
    y && /* @__PURE__ */ r("div", { style: c.errorText, children: y }),
    /* @__PURE__ */ r("style", { children: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-3px); }
            to { opacity: 1; transform: translateY(0); }
          }
          input[type="checkbox"]:checked {
            animation: fillPulse 0.3s ease forwards;
          }
          @keyframes fillPulse {
            0% {
              box-shadow: 0 0 0 0 ${m.primaryColor}40;
            }
            50% {
              box-shadow: 0 0 0 6px ${m.primaryColor}20;
            }
            100% {
              box-shadow: 0 0 0 0 ${m.primaryColor}00;
            }
          }
        ` })
  ] });
}, Be = ({
  name: e,
  options: n,
  label: s,
  onChange: l,
  disabled: t = !1,
  required: o = !1,
  direction: d = "vertical",
  helperText: p,
  theme: w
}) => {
  var D, W, z;
  const m = { ...J, ...w }, i = (() => {
    try {
      return ee();
    } catch {
      return null;
    }
  })(), [v, y] = P(""), F = ((D = i == null ? void 0 : i.values) == null ? void 0 : D[e]) ?? v, f = (W = i == null ? void 0 : i.errors) == null ? void 0 : W[e], k = (z = i == null ? void 0 : i.touched) == null ? void 0 : z[e], [u, C] = P(!1), c = L(async () => {
    if (!i) return !0;
    const $ = i.values[e];
    let b = "";
    return o && !$ && (b = "This field is required"), i.setFieldError(e, b), !b;
  }, [i, e, o]);
  Q(() => {
    if (i)
      return i.registerField(e, c), () => i.unregisterField(e);
  }, [i, e, c]);
  const h = L(
    ($) => {
      var b, a;
      i ? (i.setFieldValue(e, $), i.setFieldTouched(e, !0)) : y($), C(!0), l == null || l($), (b = i == null ? void 0 : i.touched) != null && b[e] && ((a = i == null ? void 0 : i.errors) != null && a[e]) && i.setFieldError(e, "");
    },
    [i, e, l]
  );
  return /* @__PURE__ */ g(
    "div",
    {
      style: {
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      },
      children: [
        s && /* @__PURE__ */ g(
          "label",
          {
            style: {
              fontSize: "14px",
              fontWeight: 600,
              color: m.textColor
            },
            children: [
              s,
              o && /* @__PURE__ */ r("span", { style: { color: m.errorColor }, children: " *" })
            ]
          }
        ),
        /* @__PURE__ */ r(
          "div",
          {
            role: "radiogroup",
            "aria-label": s,
            "aria-required": o,
            "aria-invalid": !!(f && (k || u)),
            style: {
              display: "flex",
              flexDirection: d === "vertical" ? "column" : "row",
              gap: d === "vertical" ? "10px" : "24px"
            },
            children: n.map(($) => {
              const b = F === $.value, a = t || $.disabled;
              return /* @__PURE__ */ g(
                "label",
                {
                  htmlFor: `${e}-${$.value}`,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: a ? "not-allowed" : "pointer",
                    opacity: a ? 0.6 : 1,
                    userSelect: "none",
                    transition: "all 0.2s ease"
                  },
                  children: [
                    /* @__PURE__ */ r(
                      "div",
                      {
                        style: {
                          position: "relative",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: `2px solid ${b ? m.primaryColor : "#d1d5db"}`,
                          backgroundColor: "#fff",
                          transition: "all 0.25s ease",
                          boxShadow: b ? `0 0 0 3px ${m.primaryColor}25` : "none"
                        },
                        children: /* @__PURE__ */ r(
                          "div",
                          {
                            style: {
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: `translate(-50%, -50%) scale(${b ? 1 : 0})`,
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: m.primaryColor,
                              transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                            }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "radio",
                        id: `${e}-${$.value}`,
                        name: e,
                        value: $.value,
                        checked: b,
                        disabled: a,
                        onChange: () => !a && h($.value),
                        style: { position: "absolute", opacity: 0, pointerEvents: "none" }
                      }
                    ),
                    /* @__PURE__ */ r(
                      "span",
                      {
                        style: {
                          fontSize: "14px",
                          color: m.textColor,
                          transition: "color 0.2s ease"
                        },
                        children: $.label
                      }
                    )
                  ]
                },
                $.value
              );
            })
          }
        ),
        f && (k || u) && /* @__PURE__ */ r("div", { role: "alert", style: { fontSize: "12px", color: m.errorColor }, children: f }),
        p && !(f && (k || u)) && /* @__PURE__ */ r("div", { style: { fontSize: "12px", color: "#6b7280" }, children: p })
      ]
    }
  );
}, Le = ({
  type: e = "button",
  children: n,
  label: s,
  onClick: l,
  disabled: t = !1,
  loading: o = !1,
  variant: d = "primary",
  theme: p,
  fullWidth: w = !1,
  size: m = "medium",
  style: i,
  enableThrottle: v,
  throttleDelay: y,
  showErrorSummary: F = !0,
  showSuccessModal: f = !0,
  successMessage: k = "Form submitted successfully!",
  onSuccess: u,
  submissionDelay: C = 2e3
}) => {
  const c = { ...J, ...p }, h = (() => {
    try {
      return ee();
    } catch {
      return null;
    }
  })(), D = e === "submit", [W, z] = P(!1), [$, b] = P([]), [a, I] = P(!1), [V, S] = P(!1), R = v ?? D, B = y ?? (D ? 1e3 : 300), E = ne(0), q = o || W, K = L(async (j) => {
    var U;
    if (!(t || q)) {
      if (R) {
        const H = Date.now();
        if (H - E.current < B) {
          j.preventDefault(), j.stopPropagation(), console.log("⏳ Please wait before clicking again.");
          return;
        }
        E.current = H;
      }
      if (D && h) {
        j.preventDefault(), I(!1), b([]);
        try {
          if (!await h.validateForm()) {
            if (F) {
              const Z = Object.entries(h.errors).filter(([Y, O]) => O).map(([Y, O]) => `${Y}: ${O}`);
              b(Z), I(!0);
            }
            return;
          }
          z(!0), await new Promise((Z) => setTimeout(Z, C)), await ((U = h.submitForm) == null ? void 0 : U.call(h)), z(!1), f && S(!0), u == null || u();
        } catch (H) {
          console.error("Form submission error:", H), z(!1), b(["An unexpected error occurred during submission."]), I(!0);
        }
      } else
        l == null || l();
    }
  }, [
    t,
    q,
    R,
    B,
    D,
    h,
    C,
    F,
    f,
    u
  ]), T = {
    primary: { backgroundColor: c.primaryColor, color: "#fff" },
    secondary: { backgroundColor: "#f3f4f6", color: c.textColor },
    danger: { backgroundColor: c.errorColor, color: "#fff" }
  }[d];
  return /* @__PURE__ */ g(ue, { children: [
    /* @__PURE__ */ r("style", { children: `
        @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      ` }),
    /* @__PURE__ */ r(
      "button",
      {
        type: e,
        onClick: K,
        disabled: t || q,
        style: {
          ...T,
          ...m === "small" ? { padding: "6px 12px", fontSize: 12 } : m === "large" ? { padding: "14px 24px", fontSize: 16 } : { padding: "10px 16px", fontSize: 14 },
          width: w ? "100%" : "auto",
          border: "none",
          borderRadius: c.borderRadius,
          cursor: t || q ? "not-allowed" : "pointer",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: t || q ? 0.6 : 1,
          transition: "all 0.2s ease-in-out",
          ...i
        },
        children: q ? /* @__PURE__ */ g(ue, { children: [
          /* @__PURE__ */ r(
            "div",
            {
              style: {
                width: 16,
                height: 16,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite"
              }
            }
          ),
          /* @__PURE__ */ r("span", { children: "Processing..." })
        ] }) : n || s
      }
    ),
    F && a && $.length > 0 && /* @__PURE__ */ g(
      "div",
      {
        style: {
          marginTop: 12,
          padding: 16,
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: c.borderRadius,
          color: "#991b1b",
          fontSize: 13
        },
        children: [
          /* @__PURE__ */ r("strong", { children: "⚠️ Please fix the following errors:" }),
          /* @__PURE__ */ r("ul", { style: { marginTop: 8, paddingLeft: 20 }, children: $.map((j, U) => /* @__PURE__ */ r("li", { children: j }, U)) })
        ]
      }
    ),
    V && /* @__PURE__ */ r(
      "div",
      {
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          animation: "fadeIn 0.25s ease"
        },
        onClick: () => S(!1),
        children: /* @__PURE__ */ g(
          "div",
          {
            style: {
              background: "#fff",
              padding: 32,
              borderRadius: 12,
              textAlign: "center",
              animation: "scaleIn 0.3s ease-out",
              maxWidth: 400,
              width: "90%"
            },
            onClick: (j) => j.stopPropagation(),
            children: [
              /* @__PURE__ */ r(
                "div",
                {
                  style: {
                    width: 64,
                    height: 64,
                    background: "#dcfce7",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px"
                  },
                  children: /* @__PURE__ */ r("span", { style: { color: "#16a34a", fontSize: 32 }, children: "✓" })
                }
              ),
              /* @__PURE__ */ r("h2", { style: { fontSize: 22, marginBottom: 8 }, children: "Success!" }),
              /* @__PURE__ */ r("p", { style: { color: "#6b7280", marginBottom: 24 }, children: k }),
              /* @__PURE__ */ r(
                "button",
                {
                  style: {
                    padding: "10px 24px",
                    border: "none",
                    backgroundColor: c.primaryColor,
                    color: "#fff",
                    borderRadius: c.borderRadius,
                    fontWeight: 600,
                    cursor: "pointer"
                  },
                  onClick: (j) => {
                    j.stopPropagation(), setTimeout(() => S(!1), 150);
                  },
                  children: "Continue"
                }
              )
            ]
          }
        )
      }
    )
  ] });
}, Pe = ({
  name: e,
  options: n,
  label: s,
  placeholder: l = "Select an option",
  onChange: t,
  disabled: o = !1,
  required: d = !1,
  value: p,
  helperText: w,
  className: m = "",
  containerClassName: i = "",
  labelClassName: v = "",
  errorClassName: y = "",
  inputClassName: F = "",
  theme: f
}) => {
  const k = ee(), u = { ...J, ...f }, [C, c] = P(!1), [h, D] = P(!1), [W, z] = P(!1), $ = ne(null), b = k.values[e] || "", a = k.errors[e], I = k.touched[e], S = b && b.length > 0 && !a && I, R = n.find((N) => N.value === b);
  Q(() => {
    p !== void 0 && k.values[e] === void 0 && k.setFieldValue(e, p);
  }, [p, e, k]), Q(() => {
    const N = (j) => {
      $.current && !$.current.contains(j.target) && (z(!1), c(!1));
    };
    return document.addEventListener("mousedown", N), () => document.removeEventListener("mousedown", N);
  }, []);
  const B = L(async () => {
    const N = k.values[e] || "";
    let j = "";
    return d && !N && (j = "This field is required"), k.setFieldError(e, j), !j;
  }, [e, d, k]);
  Q(() => (k.registerField(e, B), () => {
    k.unregisterField(e);
  }), [e, B, k]);
  const E = L((N) => {
    o || (k.setFieldValue(e, N), t == null || t(N), k.setFieldTouched(e, !0), a && k.setFieldError(e, ""), z(!1), c(!1));
  }, [e, k, t, a, o]), q = L(() => {
    o || (z(!W), c(!W));
  }, [o, W]), K = L(() => {
    W || (c(!1), k.setFieldTouched(e, !0), B());
  }, [e, k, B, W]), T = {
    container: {
      marginBottom: u.spacing,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "100%",
      position: "relative"
    },
    labelWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    label: {
      fontSize: "14px",
      fontWeight: 600,
      color: C ? u.primaryColor : u.textColor,
      letterSpacing: "0.02em",
      lineHeight: "1.5",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: C ? "translateY(-1px)" : "translateY(0)"
    },
    requiredBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: `${u.errorColor}15`,
      color: u.errorColor,
      fontSize: "20px",
      fontWeight: 700,
      animation: d ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none"
    },
    selectWrapper: {
      position: "relative",
      width: "100%"
    },
    select: {
      width: "100%",
      padding: S && !W ? "13px 70px 13px 16px" : "13px 44px 13px 16px",
      fontSize: "15px",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      fontWeight: 400,
      border: `2px solid ${a && I ? u.errorColor : C ? u.primaryColor : h ? "#a1a1aa" : u.borderColor}`,
      borderRadius: "10px",
      backgroundColor: o ? "#fafafa" : u.backgroundColor,
      color: b ? u.textColor : "#9ca3af",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      boxSizing: "border-box",
      cursor: o ? "not-allowed" : "pointer",
      opacity: o ? 0.5 : 1,
      boxShadow: a && I ? `0 0 0 4px ${u.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)` : C ? `0 0 0 4px ${u.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)` : h ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 4px rgba(0,0,0,0.04)",
      transform: C ? "translateY(-1px)" : "translateY(0)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    arrow: {
      fontSize: "12px",
      color: C ? u.primaryColor : "#6b7280",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: W ? "rotate(180deg)" : "rotate(0deg)"
    },
    iconContainer: {
      position: "absolute",
      right: "40px",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      pointerEvents: "none"
    },
    checkIcon: {
      color: "#10b981",
      opacity: S ? 1 : 0,
      transform: S ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    errorIcon: {
      color: u.errorColor,
      opacity: a && I ? 1 : 0,
      transform: a && I ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: a && I ? "shake 0.5s ease-in-out" : "none"
    },
    dropdown: {
      position: "absolute",
      top: "calc(100% + 4px)",
      left: 0,
      right: 0,
      backgroundColor: "#ffffff",
      border: `2px solid ${u.primaryColor}`,
      borderRadius: "10px",
      maxHeight: "240px",
      overflowY: "auto",
      zIndex: 1e3,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      animation: "dropdownSlide 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    option: {
      padding: "12px 16px",
      cursor: "pointer",
      color: u.textColor,
      transition: "all 0.15s ease",
      fontSize: "15px",
      borderBottom: `1px solid ${u.borderColor}20`
    },
    errorText: {
      fontSize: "13px",
      color: u.errorColor,
      display: "flex",
      alignItems: "flex-start",
      gap: "6px",
      fontWeight: 500,
      lineHeight: "1.4",
      animation: "slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    helperText: {
      fontSize: "13px",
      color: "#71717a",
      lineHeight: "1.5",
      fontWeight: 400,
      animation: "fadeIn 0.3s ease"
    }
  };
  return /* @__PURE__ */ g("div", { ref: $, style: T.container, className: i, children: [
    s && /* @__PURE__ */ g("div", { style: T.labelWrapper, children: [
      /* @__PURE__ */ r("label", { style: T.label, htmlFor: e, className: v, children: s }),
      d && /* @__PURE__ */ r("span", { style: T.requiredBadge, title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ g("div", { style: T.selectWrapper, children: [
      /* @__PURE__ */ g(
        "div",
        {
          style: T.select,
          onClick: q,
          onBlur: K,
          onMouseEnter: () => D(!0),
          onMouseLeave: () => D(!1),
          tabIndex: o ? -1 : 0,
          className: `${m} ${F}`,
          onKeyDown: (N) => {
            (N.key === "Enter" || N.key === " ") && (N.preventDefault(), q());
          },
          "aria-invalid": !!(a && I),
          "aria-describedby": a && I ? `${e}-error` : void 0,
          children: [
            /* @__PURE__ */ r("span", { style: b ? void 0 : { color: "#9ca3af" }, children: R ? R.label : l }),
            /* @__PURE__ */ r("span", { style: T.arrow, children: "▼" })
          ]
        }
      ),
      !W && /* @__PURE__ */ g("div", { style: T.iconContainer, children: [
        S && /* @__PURE__ */ r("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: T.checkIcon, children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" }) }),
        a && I && !S && /* @__PURE__ */ r("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", style: T.errorIcon, children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
      ] }),
      W && /* @__PURE__ */ r("div", { style: T.dropdown, children: n.length === 0 ? /* @__PURE__ */ r("div", { style: { ...T.option, cursor: "default", opacity: 0.6 }, children: "No options available" }) : n.map((N) => {
        const j = b === N.value;
        return /* @__PURE__ */ g(
          "div",
          {
            style: {
              ...T.option,
              backgroundColor: j ? `${u.primaryColor}08` : "transparent",
              fontWeight: j ? 600 : 400
            },
            onClick: (U) => {
              U.stopPropagation(), E(N.value);
            },
            onMouseEnter: (U) => {
              U.currentTarget.style.backgroundColor = j ? `${u.primaryColor}15` : `${u.primaryColor}05`;
            },
            onMouseLeave: (U) => {
              U.currentTarget.style.backgroundColor = j ? `${u.primaryColor}08` : "transparent";
            },
            children: [
              N.label,
              j && /* @__PURE__ */ r(
                "svg",
                {
                  style: {
                    marginLeft: "auto",
                    display: "inline-block",
                    verticalAlign: "middle",
                    color: u.primaryColor
                  },
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "3",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" })
                }
              )
            ]
          },
          N.value
        );
      }) })
    ] }),
    a && I && /* @__PURE__ */ g("div", { id: `${e}-error`, role: "alert", style: T.errorText, className: y, children: [
      /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", style: { flexShrink: 0, marginTop: "1px" }, children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
      /* @__PURE__ */ r("span", { children: a })
    ] }),
    w && !(a && I) && /* @__PURE__ */ r("div", { style: T.helperText, children: w }),
    /* @__PURE__ */ r("style", { children: `
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }
          
          @keyframes shake {
            0%, 100% {
              transform: translateX(0) translateY(-50%);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-3px) translateY(-50%);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(3px) translateY(-50%);
            }
          }

          @keyframes dropdownSlide {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        ` })
  ] });
}, Ne = ({
  name: e,
  label: n,
  placeholder: s,
  validation: l,
  theme: t,
  disabled: o = !1,
  required: d = !1,
  onChange: p,
  onBlur: w,
  value: m,
  rows: i = 4,
  maxLength: v,
  showCharCount: y = !1
}) => {
  const F = ee(), f = { ...J, ...t }, [k, u] = P(m || ""), [C, c] = P(!1), h = m !== void 0 ? m : k, D = F.errors[e], W = F.touched[e], z = oe(
    () => ie((V) => {
      if (l) {
        const S = le(V, l);
        S.isValid ? F.setFieldError(e, "") : F.setFieldError(e, S.error || "Invalid input");
      }
    }, 300),
    [e, l, F]
  ), $ = L(
    (V) => {
      const S = V.target.value;
      (!v || S.length <= v) && (u(S), F.setFieldValue(e, S), p == null || p(S), z(S));
    },
    [e, F, p, z, v]
  ), b = L(() => {
    c(!1), F.setFieldTouched(e, !0), w == null || w();
  }, [e, F, w]), a = L(() => {
    c(!0);
  }, []), I = {
    container: {
      marginBottom: f.spacing,
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    },
    label: {
      fontSize: "12px",
      fontWeight: 600,
      color: f.textColor,
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    },
    textarea: {
      width: "100%",
      padding: "10px 12px",
      fontSize: f.fontSize,
      border: `1px solid ${D && W ? f.errorColor : f.borderColor}`,
      borderRadius: f.borderRadius,
      backgroundColor: o ? "#f3f4f6" : f.backgroundColor,
      color: f.textColor,
      transition: "all 0.2s ease-in-out",
      outline: "none",
      boxSizing: "border-box",
      cursor: o ? "not-allowed" : "pointer",
      opacity: o ? 0.6 : 1,
      fontFamily: "inherit",
      resize: "vertical"
    },
    textareaFocused: {
      borderColor: D && W ? f.errorColor : f.primaryColor,
      boxShadow: `0 0 0 3px ${D && W ? `${f.errorColor}20` : `${f.primaryColor}20`}`
    },
    errorText: {
      fontSize: "12px",
      color: f.errorColor,
      marginTop: "4px"
    },
    charCount: {
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "4px",
      textAlign: "right"
    }
  };
  return /* @__PURE__ */ g("div", { style: I.container, children: [
    n && /* @__PURE__ */ g("label", { style: I.label, children: [
      n,
      d && /* @__PURE__ */ r("span", { style: { color: f.errorColor }, children: "*" })
    ] }),
    /* @__PURE__ */ r(
      "textarea",
      {
        name: e,
        placeholder: s,
        value: h,
        onChange: $,
        onBlur: b,
        onFocus: a,
        disabled: o,
        rows: i,
        style: {
          ...I.textarea,
          ...C ? I.textareaFocused : {}
        }
      }
    ),
    D && W && /* @__PURE__ */ r("div", { style: I.errorText, children: D }),
    y && v && /* @__PURE__ */ g("div", { style: I.charCount, children: [
      h.length,
      " / ",
      v
    ] })
  ] });
}, je = ({
  name: e,
  label: n,
  placeholder: s = "Enter a number",
  min: l,
  max: t,
  step: o = 1,
  required: d = !1,
  disabled: p = !1,
  error: w,
  onChange: m,
  onBlur: i,
  className: v = "",
  helperText: y
}) => {
  const [F, f] = P(""), [k, u] = P(!1), [C, c] = P(""), h = L(
    ($) => {
      const b = $ === "" ? null : parseFloat($);
      if (b !== null) {
        if (l !== void 0 && b < l) {
          c(`Must be at least ${l}`);
          return;
        }
        if (t !== void 0 && b > t) {
          c(`Must be at most ${t}`);
          return;
        }
      }
      c(""), m == null || m(b);
    },
    [l, t, m]
  ), D = ($) => {
    const b = $.target.value;
    (b === "" || b === "-" || !isNaN(parseFloat(b))) && (f(b), h(b));
  }, W = () => {
    u(!1), F === "-" && (f(""), c("")), i == null || i();
  }, z = w || C;
  return /* @__PURE__ */ g("div", { style: { marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }, className: v, children: [
    n && /* @__PURE__ */ g(
      "label",
      {
        style: {
          fontSize: "14px",
          fontWeight: "500",
          color: "#1f2937",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        },
        children: [
          n,
          d && /* @__PURE__ */ r("span", { style: { color: "#ef4444" }, children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ r(
      "input",
      {
        type: "number",
        name: e,
        value: F,
        onChange: D,
        onFocus: () => u(!0),
        onBlur: W,
        placeholder: s,
        min: l,
        max: t,
        step: o,
        disabled: p,
        required: d,
        style: {
          padding: "10px 12px",
          fontSize: "14px",
          border: `1px solid ${z ? "#ef4444" : k ? "#000000" : "#e5e7eb"}`,
          borderRadius: "6px",
          backgroundColor: p ? "#f3f4f6" : "#ffffff",
          color: "#1f2937",
          transition: "all 0.2s ease",
          outline: "none",
          width: "100%",
          boxSizing: "border-box"
        }
      }
    ),
    z && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#ef4444" }, children: z }),
    y && !z && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#6b7280" }, children: y })
  ] });
}, He = ({
  name: e,
  label: n,
  placeholder: s = "Select a date",
  min: l,
  max: t,
  minAge: o,
  maxAge: d,
  required: p = !1,
  disabled: w = !1,
  onChange: m,
  onBlur: i,
  className: v = "",
  containerClassName: y = "",
  labelClassName: F = "",
  errorClassName: f = "",
  inputClassName: k = "",
  helperText: u,
  theme: C
}) => {
  var j;
  const c = ee(), h = { ...J, ...C }, [D, W] = P(!1), [z, $] = P(!1), b = c.values[e] || "", a = c.errors[e], I = c.touched[e], S = b && b.length > 0 && !a && I, R = (U) => {
    const H = new Date(U), Z = /* @__PURE__ */ new Date();
    let Y = Z.getFullYear() - H.getFullYear();
    const O = Z.getMonth() - H.getMonth();
    return (O < 0 || O === 0 && Z.getDate() < H.getDate()) && Y--, Y;
  }, B = L(async () => {
    const U = c.values[e] || "";
    let H = "";
    if (p && !U)
      H = "This field is required";
    else if (U) {
      const Z = new Date(U);
      l && Z < new Date(l) ? H = `Date must be after ${l}` : t && Z > new Date(t) ? H = `Date must be before ${t}` : o !== void 0 ? R(U) < o && (H = `You must be at least ${o} years old`) : d !== void 0 && R(U) > d && (H = `Age cannot exceed ${d} years`);
    }
    return c.setFieldError(e, H), !H;
  }, [e, p, l, t, o, d, c]);
  Q(() => (c.registerField(e, B), () => {
    c.unregisterField(e);
  }), [e, B, c]);
  const E = (U) => {
    const H = U.target.value;
    c.setFieldValue(e, H), m == null || m(H), I && a && c.setFieldError(e, "");
  }, q = () => {
    W(!1), c.setFieldTouched(e, !0), B(), i == null || i();
  }, K = () => {
    W(!0);
  }, T = {
    container: {
      marginBottom: h.spacing,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "100%",
      position: "relative"
    },
    labelWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    label: {
      fontSize: "14px",
      fontWeight: 600,
      color: D ? h.primaryColor : h.textColor,
      letterSpacing: "0.02em",
      lineHeight: "1.5",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: D ? "translateY(-1px)" : "translateY(0)"
    },
    requiredBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: `${h.errorColor}15`,
      color: h.errorColor,
      fontSize: "20px",
      fontWeight: 700,
      animation: p ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none"
    },
    inputWrapper: {
      position: "relative",
      width: "100%"
    },
    input: {
      width: "100%",
      padding: "13px 44px 13px 16px",
      fontSize: "15px",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      fontWeight: 400,
      border: `2px solid ${a && I ? h.errorColor : D ? h.primaryColor : z ? "#a1a1aa" : h.borderColor}`,
      borderRadius: "10px",
      backgroundColor: w ? "#fafafa" : h.backgroundColor,
      color: h.textColor,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      boxSizing: "border-box",
      cursor: w ? "not-allowed" : "text",
      opacity: w ? 0.5 : 1,
      WebkitAppearance: "none",
      MozAppearance: "none",
      boxShadow: a && I ? `0 0 0 4px ${h.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)` : D ? `0 0 0 4px ${h.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)` : z ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 4px rgba(0,0,0,0.04)",
      transform: D ? "translateY(-1px)" : "translateY(0)"
    },
    iconContainer: {
      position: "absolute",
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      pointerEvents: "none"
    },
    checkIcon: {
      color: "#10b981",
      opacity: S ? 1 : 0,
      transform: S ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    errorIcon: {
      color: h.errorColor,
      opacity: a && I ? 1 : 0,
      transform: a && I ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: a && I ? "shake 0.5s ease-in-out" : "none"
    },
    errorText: {
      fontSize: "13px",
      color: h.errorColor,
      display: "flex",
      alignItems: "flex-start",
      gap: "6px",
      fontWeight: 500,
      lineHeight: "1.4",
      animation: "slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    helperText: {
      fontSize: "13px",
      color: "#71717a",
      lineHeight: "1.5",
      fontWeight: 400,
      animation: "fadeIn 0.3s ease"
    }
  }, N = `date-field-${e}`;
  return /* @__PURE__ */ g("div", { style: T.container, className: y, children: [
    n && /* @__PURE__ */ g("div", { style: T.labelWrapper, children: [
      /* @__PURE__ */ r("label", { style: T.label, htmlFor: e, className: F, children: n }),
      p && /* @__PURE__ */ r("span", { style: T.requiredBadge, title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ g("div", { style: T.inputWrapper, children: [
      /* @__PURE__ */ r(
        "input",
        {
          id: e,
          type: "date",
          name: e,
          value: b,
          onChange: E,
          onFocus: K,
          onBlur: q,
          onMouseEnter: () => $(!0),
          onMouseLeave: () => $(!1),
          placeholder: s,
          min: l,
          max: t,
          disabled: w,
          "aria-invalid": !!(a && I),
          "aria-describedby": a && I ? `${e}-error` : void 0,
          style: T.input,
          className: `${v} ${k} ${N}`
        }
      ),
      /* @__PURE__ */ g("div", { style: T.iconContainer, children: [
        S && /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: T.checkIcon, children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" }) }),
        a && I && !S && /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", style: T.errorIcon, children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
      ] })
    ] }),
    a && I && /* @__PURE__ */ g("div", { id: `${e}-error`, role: "alert", style: T.errorText, className: f, children: [
      /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", style: { flexShrink: 0, marginTop: "1px" }, children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
      /* @__PURE__ */ r("span", { children: a })
    ] }),
    u && !(a && I) && /* @__PURE__ */ r("div", { style: T.helperText, children: u }),
    /* @__PURE__ */ r("style", { children: `
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }
          
          @keyframes shake {
            0%, 100% {
              transform: translateX(0) translateY(-50%);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-3px) translateY(-50%);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(3px) translateY(-50%);
            }
          }

          /* Custom Calendar Picker Styles */
          .${N}::-webkit-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.6;
            transition: all 0.2s ease;
            filter: none;
            width: 20px;
            height: 20px;
            margin-right: -8px;
          }

          .${N}::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
            transform: scale(1.1);
          }

          .${N}::-webkit-datetime-edit-fields-wrapper {
            padding: 0;
          }

          .${N}::-webkit-datetime-edit-text {
            color: ${h.textColor};
            padding: 0 2px;
          }

          .${N}::-webkit-datetime-edit-month-field,
          .${N}::-webkit-datetime-edit-day-field,
          .${N}::-webkit-datetime-edit-year-field {
            color: ${h.textColor};
            padding: 2px;
            border-radius: 4px;
            transition: all 0.2s ease;
          }

          .${N}::-webkit-datetime-edit-month-field:focus,
          .${N}::-webkit-datetime-edit-day-field:focus,
          .${N}::-webkit-datetime-edit-year-field:focus {
            background-color: ${h.primaryColor}15;
            color: ${h.primaryColor};
            outline: none;
          }

          /* Calendar dropdown styling */
          .${N}::-webkit-calendar-picker-indicator {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23${(j = h.primaryColor) == null ? void 0 : j.replace("#", "")}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
          }

          /* Firefox date picker */
          .${N}::-moz-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.6;
            transition: all 0.2s ease;
          }

          .${N}::-moz-calendar-picker-indicator:hover {
            opacity: 1;
            transform: scale(1.1);
          }
        ` })
  ] });
}, te = (e, n) => {
  const s = ee(), l = e || "field", t = oe(
    () => ie((d, p) => {
      if (!n) {
        p({ isValid: !0 });
        return;
      }
      const w = le(d, n);
      p(w);
    }, 300),
    [n]
  );
  return {
    validateField: L(
      (d) => {
        if (!n)
          return s.setFieldError(l, ""), { isValid: !0 };
        const p = le(d, n);
        return p.isValid ? s.setFieldError(l, "") : s.setFieldError(l, p.error || "Validation failed"), t(d, (w) => {
          w.isValid ? s.setFieldError(l, "") : s.setFieldError(l, w.error || "Validation failed");
        }), p;
      },
      [l, s, t, n]
    ),
    error: s.errors[l],
    isTouched: s.touched[l]
  };
}, Oe = ({
  name: e,
  label: n,
  placeholder: s = "Select a time",
  required: l = !1,
  disabled: t = !1,
  error: o,
  onChange: d,
  onBlur: p,
  className: w = "",
  helperText: m
}) => {
  const [i, v] = P(""), [y, F] = P(!1), { validateField: f } = te(e), k = L(
    ie((C) => {
      f(C), d == null || d(C);
    }, 300),
    [d, f]
  );
  return /* @__PURE__ */ g("div", { style: { marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }, className: w, children: [
    n && /* @__PURE__ */ g(
      "label",
      {
        style: {
          fontSize: "14px",
          fontWeight: "500",
          color: "#1f2937",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        },
        children: [
          n,
          l && /* @__PURE__ */ r("span", { style: { color: "#ef4444" }, children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ r(
      "input",
      {
        type: "time",
        name: e,
        value: i,
        onChange: (C) => {
          const c = C.target.value;
          v(c), k(c);
        },
        onFocus: () => F(!0),
        onBlur: () => {
          F(!1), p == null || p();
        },
        placeholder: s,
        disabled: t,
        style: {
          padding: "10px 12px",
          fontSize: "14px",
          border: `1px solid ${o ? "#ef4444" : y ? "#000000" : "#e5e7eb"}`,
          borderRadius: "6px",
          backgroundColor: t ? "#f3f4f6" : "#ffffff",
          color: "#1f2937",
          transition: "all 0.2s ease",
          outline: "none"
        }
      }
    ),
    o && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#ef4444" }, children: o }),
    m && !o && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#6b7280" }, children: m })
  ] });
}, Ue = ({
  name: e,
  label: n,
  accept: s,
  multiple: l = !1,
  maxSize: t = 5242880,
  // 5MB default
  required: o = !1,
  disabled: d = !1,
  helperText: p,
  theme: w,
  className: m,
  style: i,
  showPreview: v = !0
}) => {
  const y = { ...J, ...w }, {
    values: F,
    errors: f,
    touched: k,
    setFieldValue: u,
    setFieldError: C,
    setFieldTouched: c,
    registerField: h,
    unregisterField: D
  } = ee(), [W, z] = P(!1), [$, b] = P(!1), [a, I] = P(0), V = ne(!1), S = F[e], R = f[e], B = k[e], E = L(async () => {
    const x = F[e];
    let X = "";
    return o && (!x || Array.isArray(x) && x.length === 0) && (X = "Please upload at least one file"), C(e, X), !X;
  }, [F, e, o, C]);
  Q(() => (h(e, E), () => D(e)), [e, h, D, E]);
  const q = L(async (x) => new Promise((X) => {
    b(!0), I(0), V.current = !0;
    const _ = 2e3, G = 100, se = _ / G;
    let re = 0;
    const pe = setInterval(() => {
      re++, I(re), re >= G && (clearInterval(pe), b(!1), V.current = !1, X());
    }, se);
  }), []), K = L((x) => {
    var X;
    if (!x || x.length === 0)
      return null;
    if (V.current)
      return "Please wait for the current upload to complete";
    if (!l && x.length > 1)
      return "Only one file is allowed";
    for (let _ = 0; _ < x.length; _++)
      if (t && x[_].size > t)
        return `File "${x[_].name}" exceeds ${(t / 1024 / 1024).toFixed(1)}MB limit`;
    if (s) {
      const _ = s.split(",").map((G) => G.trim());
      for (let G = 0; G < x.length; G++) {
        const se = "." + ((X = x[G].name.split(".").pop()) == null ? void 0 : X.toLowerCase()), re = x[G].type;
        if (!_.some((ce) => ce.startsWith(".") ? se === ce.toLowerCase() : re.match(new RegExp(ce.replace("*", ".*")))))
          return `File "${x[G].name}" type is not allowed`;
      }
    }
    return null;
  }, [l, t, s]), T = L(async (x) => {
    if (!x || x.length === 0) return;
    c(e, !0);
    const X = K(x);
    if (X) {
      C(e, X);
      return;
    }
    C(e, "");
    const _ = Array.from(x);
    if (await q(_), l) {
      const G = Array.isArray(S) ? S : [], se = _.map((re) => ({
        name: re.name,
        size: re.size,
        type: re.type,
        file: re
      }));
      u(e, [...G, ...se]);
    } else {
      const G = {
        name: _[0].name,
        size: _[0].size,
        type: _[0].type,
        file: _[0]
      };
      u(e, G);
    }
  }, [e, K, u, C, c, q, l, S]), N = L((x) => {
    T(x.target.files), x.target.value = "";
  }, [T]), j = L((x) => {
    x.preventDefault(), z(!1), T(x.dataTransfer.files);
  }, [T]), U = L((x) => {
    x.preventDefault(), !d && !$ && z(!0);
  }, [d, $]), H = L(() => {
    z(!1);
  }, []), Z = L((x) => {
    if (l && Array.isArray(S)) {
      const X = S.filter((_, G) => G !== x);
      u(e, X.length > 0 ? X : null);
    } else
      u(e, null);
    c(e, !0);
  }, [l, S, e, u, c]), Y = B && R, O = l ? Array.isArray(S) ? S : [] : S ? [S] : [], M = {
    container: {
      marginBottom: y.spacing,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      ...i
    },
    label: {
      fontSize: "14px",
      fontWeight: 500,
      color: y.textColor,
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    required: {
      color: y.errorColor
    },
    dropzone: {
      padding: "24px",
      border: `2px dashed ${$ || W ? y.primaryColor : Y ? y.errorColor : y.borderColor}`,
      borderRadius: y.borderRadius,
      backgroundColor: W ? "#f9fafb" : "#ffffff",
      cursor: d || $ ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      textAlign: "center",
      opacity: d ? 0.6 : 1
    },
    dropzoneLabel: {
      cursor: d || $ ? "not-allowed" : "pointer",
      display: "block"
    },
    dropzoneText: {
      fontSize: "14px",
      color: y.textColor,
      marginBottom: "4px"
    },
    sizeText: {
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "4px"
    },
    progressContainer: {
      marginTop: "12px",
      width: "100%"
    },
    progressBar: {
      width: "100%",
      height: "8px",
      backgroundColor: "#e5e7eb",
      borderRadius: "4px",
      overflow: "hidden"
    },
    progressFill: {
      height: "100%",
      backgroundColor: y.primaryColor,
      transition: "width 0.1s ease",
      borderRadius: "4px"
    },
    progressText: {
      fontSize: "12px",
      color: y.primaryColor,
      marginTop: "4px",
      fontWeight: 600
    },
    filesContainer: {
      marginTop: "12px",
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    fileItem: {
      fontSize: "13px",
      color: y.textColor,
      padding: "10px 12px",
      backgroundColor: "#f9fafb",
      borderRadius: y.borderRadius,
      border: `1px solid ${y.borderColor}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "8px"
    },
    fileInfo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flex: 1
    },
    fileIcon: {
      fontSize: "16px"
    },
    fileName: {
      fontWeight: 500
    },
    fileSize: {
      fontSize: "11px",
      color: "#6b7280"
    },
    removeButton: {
      background: "none",
      border: "none",
      color: y.errorColor,
      cursor: "pointer",
      fontSize: "18px",
      padding: "0",
      lineHeight: 1,
      transition: "opacity 0.2s"
    },
    error: {
      fontSize: "12px",
      color: y.errorColor,
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    helperText: {
      fontSize: "12px",
      color: "#6b7280"
    }
  }, A = (x) => x < 1024 ? x + " B" : x < 1024 * 1024 ? (x / 1024).toFixed(1) + " KB" : (x / (1024 * 1024)).toFixed(1) + " MB";
  return /* @__PURE__ */ g("div", { style: M.container, className: m, children: [
    n && /* @__PURE__ */ g("label", { style: M.label, children: [
      n,
      o && /* @__PURE__ */ r("span", { style: M.required, children: "*" })
    ] }),
    /* @__PURE__ */ g(
      "div",
      {
        style: M.dropzone,
        onDragOver: U,
        onDragLeave: H,
        onDrop: j,
        children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "file",
              name: e,
              onChange: N,
              accept: s,
              multiple: l,
              disabled: d || $,
              style: { display: "none" },
              id: `file-input-${e}`
            }
          ),
          /* @__PURE__ */ g("label", { htmlFor: `file-input-${e}`, style: M.dropzoneLabel, children: [
            /* @__PURE__ */ r("div", { style: M.dropzoneText, children: $ ? "Uploading..." : "Drag and drop files here or click to select" }),
            t && /* @__PURE__ */ g("div", { style: M.sizeText, children: [
              "Max file size: ",
              (t / 1024 / 1024).toFixed(1),
              "MB"
            ] })
          ] }),
          $ && /* @__PURE__ */ g("div", { style: M.progressContainer, children: [
            /* @__PURE__ */ r("div", { style: M.progressBar, children: /* @__PURE__ */ r(
              "div",
              {
                style: {
                  ...M.progressFill,
                  width: `${a}%`
                }
              }
            ) }),
            /* @__PURE__ */ g("div", { style: M.progressText, children: [
              "Uploading... ",
              a,
              "%"
            ] })
          ] })
        ]
      }
    ),
    v && O.length > 0 && /* @__PURE__ */ r("div", { style: M.filesContainer, children: O.map((x, X) => /* @__PURE__ */ g("div", { style: M.fileItem, children: [
      /* @__PURE__ */ g("div", { style: M.fileInfo, children: [
        /* @__PURE__ */ r("span", { style: M.fileIcon, children: "📄" }),
        /* @__PURE__ */ g("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ r("div", { style: M.fileName, children: x.name }),
          /* @__PURE__ */ r("div", { style: M.fileSize, children: A(x.size) })
        ] })
      ] }),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => Z(X),
          style: M.removeButton,
          onMouseEnter: (_) => _.currentTarget.style.opacity = "0.7",
          onMouseLeave: (_) => _.currentTarget.style.opacity = "1",
          title: "Remove file",
          children: "×"
        }
      )
    ] }, X)) }),
    Y && /* @__PURE__ */ g("span", { style: M.error, children: [
      "⚠️ ",
      R
    ] }),
    p && !Y && /* @__PURE__ */ r("span", { style: M.helperText, children: p })
  ] });
};
function ae(e, n) {
  let s = !1;
  return function(...t) {
    s || (e(...t), s = !0, setTimeout(() => {
      s = !1;
    }, n));
  };
}
const qe = ({
  name: e,
  label: n,
  checked: s = !1,
  disabled: l = !1,
  onChange: t,
  className: o = "",
  helperText: d
}) => {
  const [p, w] = P(s), { validateField: m } = te(e), i = L(
    ae((y) => {
      m(""), t == null || t(y);
    }, 200),
    [t, m]
  );
  return /* @__PURE__ */ g(
    "div",
    {
      style: {
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      },
      className: o,
      children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            name: e,
            onClick: () => {
              const y = !p;
              w(y), i(y);
            },
            disabled: l,
            style: {
              position: "relative",
              width: "48px",
              height: "24px",
              backgroundColor: p ? "#000000" : "#e5e7eb",
              borderRadius: "12px",
              cursor: l ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
              border: "none",
              padding: 0
            },
            "aria-pressed": p,
            children: /* @__PURE__ */ r(
              "div",
              {
                style: {
                  position: "absolute",
                  top: "2px",
                  left: p ? "26px" : "2px",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  transition: "left 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }
              }
            )
          }
        ),
        n && /* @__PURE__ */ r(
          "label",
          {
            style: {
              fontSize: "14px",
              fontWeight: "500",
              color: "#1f2937",
              cursor: l ? "not-allowed" : "pointer",
              userSelect: "none"
            },
            children: n
          }
        ),
        d && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#6b7280" }, children: d })
      ]
    }
  );
}, Xe = ({
  name: e,
  label: n,
  min: s = 0,
  max: l = 100,
  step: t = 1,
  value: o = 50,
  disabled: d = !1,
  onChange: p,
  className: w = "",
  helperText: m,
  showValue: i = !0
}) => {
  const [v, y] = P(o), { validateField: F } = te(e), f = L(
    ae((C) => {
      F(""), p == null || p(C);
    }, 100),
    [p, F]
  ), k = (C) => {
    const c = Number.parseFloat(C.target.value);
    y(c), f(c);
  }, u = (v - s) / (l - s) * 100;
  return /* @__PURE__ */ g(
    "div",
    {
      style: {
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      },
      className: w,
      children: [
        n && /* @__PURE__ */ g(
          "div",
          {
            style: {
              fontSize: "14px",
              fontWeight: "500",
              color: "#1f2937",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ r("span", { children: n }),
              i && /* @__PURE__ */ r("span", { style: { fontSize: "12px", fontWeight: "600", color: "#000000" }, children: v })
            ]
          }
        ),
        /* @__PURE__ */ r(
          "div",
          {
            style: {
              position: "relative",
              display: "flex",
              alignItems: "center"
            },
            children: /* @__PURE__ */ r(
              "input",
              {
                type: "range",
                name: e,
                min: s,
                max: l,
                step: t,
                value: v,
                onChange: k,
                disabled: d,
                style: {
                  width: "100%",
                  height: "6px",
                  borderRadius: "3px",
                  background: `linear-gradient(to right, #000000 0%, #000000 ${u}%, #e5e7eb ${u}%, #e5e7eb 100%)`,
                  outline: "none",
                  WebkitAppearance: "none",
                  appearance: "none",
                  cursor: d ? "not-allowed" : "pointer"
                }
              }
            )
          }
        ),
        m && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#6b7280" }, children: m })
      ]
    }
  );
}, Ke = ({
  name: e,
  label: n,
  maxStars: s = 5,
  value: l = 0,
  disabled: t = !1,
  onChange: o,
  className: d = "",
  helperText: p
}) => {
  const [w, m] = P(l), [i, v] = P(0), { validateField: y } = te(e), F = L(
    ae((k) => {
      y(""), o == null || o(k);
    }, 100),
    [o, y]
  ), f = (k) => {
    t || (m(k), F(k));
  };
  return /* @__PURE__ */ g(
    "div",
    {
      style: {
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      },
      className: d,
      children: [
        n && /* @__PURE__ */ r(
          "label",
          {
            style: {
              fontSize: "14px",
              fontWeight: "500",
              color: "#1f2937"
            },
            children: n
          }
        ),
        /* @__PURE__ */ r(
          "div",
          {
            style: {
              display: "flex",
              gap: "8px"
            },
            children: Array.from({ length: s }).map((k, u) => /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => f(u + 1),
                onMouseEnter: () => v(u + 1),
                onMouseLeave: () => v(0),
                style: {
                  fontSize: "24px",
                  cursor: t ? "not-allowed" : "pointer",
                  color: u < (i || w) ? "#000000" : "#e5e7eb",
                  transition: "color 0.2s ease, transform 0.2s ease",
                  transform: u < (i || w) ? "scale(1.1)" : "scale(1)",
                  background: "none",
                  border: "none",
                  padding: 0
                },
                disabled: t,
                "aria-label": `Rate ${u + 1} out of ${s}`,
                children: "★"
              },
              u
            ))
          }
        ),
        p && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#6b7280" }, children: p })
      ]
    }
  );
}, _e = ({
  name: e,
  label: n,
  value: s = "#000000",
  required: l = !1,
  disabled: t = !1,
  error: o,
  onChange: d,
  onBlur: p,
  className: w = "",
  helperText: m
}) => {
  const [i, v] = P(s), [y, F] = P(!1), { validateField: f } = te(e), k = L(
    ie((C) => {
      f(C), d == null || d(C);
    }, 300),
    [d, f]
  );
  return /* @__PURE__ */ g("div", { style: { marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }, className: w, children: [
    n && /* @__PURE__ */ g(
      "label",
      {
        style: {
          fontSize: "14px",
          fontWeight: "500",
          color: "#1f2937",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        },
        children: [
          n,
          l && /* @__PURE__ */ r("span", { style: { color: "#ef4444" }, children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ g("div", { style: { display: "flex", gap: "8px", alignItems: "center" }, children: [
      /* @__PURE__ */ r(
        "input",
        {
          type: "color",
          name: e,
          value: i,
          onChange: (C) => {
            const c = C.target.value;
            v(c), k(c);
          },
          onFocus: () => F(!0),
          onBlur: () => {
            F(!1), p == null || p();
          },
          disabled: t,
          style: {
            width: "50px",
            height: "40px",
            border: `1px solid ${o ? "#ef4444" : y ? "#000000" : "#e5e7eb"}`,
            borderRadius: "6px",
            cursor: t ? "not-allowed" : "pointer"
          }
        }
      ),
      /* @__PURE__ */ r("span", { style: { fontSize: "14px", color: "#1f2937", fontFamily: "monospace" }, children: i })
    ] }),
    o && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#ef4444" }, children: o }),
    m && !o && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#6b7280" }, children: m })
  ] });
}, Ze = ({
  name: e,
  label: n,
  options: s,
  placeholder: l = "Select options",
  required: t = !1,
  disabled: o = !1,
  helperText: d,
  theme: p,
  className: w,
  containerClassName: m = "",
  labelClassName: i = "",
  errorClassName: v = "",
  style: y,
  maxSelection: F
}) => {
  const f = { ...J, ...p }, {
    values: k,
    errors: u,
    touched: C,
    setFieldValue: c,
    setFieldError: h,
    setFieldTouched: D,
    registerField: W,
    unregisterField: z
  } = ee(), [$, b] = P(!1), [a, I] = P(!1), [V, S] = P(!1), R = ne(null), B = k[e] || [], E = Array.isArray(B) ? B : [], q = u[e], K = C[e], N = E.length > 0 && !q && K, j = L(async () => {
    const M = k[e], A = Array.isArray(M) ? M : [];
    let x = "";
    return t && A.length === 0 && (x = "Please select at least one option"), F && A.length > F && (x = `You can select a maximum of ${F} option${F > 1 ? "s" : ""}`), h(e, x), !x;
  }, [k, e, t, F, h]);
  Q(() => (W(e, j), () => z(e)), [e, W, z, j]), Q(() => {
    const M = (A) => {
      R.current && !R.current.contains(A.target) && (b(!1), I(!1), E.length > 0 && D(e, !0));
    };
    return document.addEventListener("mousedown", M), () => document.removeEventListener("mousedown", M);
  }, [e, E.length, D]);
  const U = L((M) => {
    if (o) return;
    const A = E.includes(M);
    let x;
    if (A)
      x = E.filter((X) => X !== M);
    else {
      if (F && E.length >= F) {
        h(e, `You can only select up to ${F} option${F > 1 ? "s" : ""}`);
        return;
      }
      x = [...E, M];
    }
    c(e, x), D(e, !0), A && q && h(e, "");
  }, [e, E, o, F, c, D, h, q]), H = L((M, A) => {
    if (A.stopPropagation(), o) return;
    const x = E.filter((X) => X !== M);
    c(e, x), D(e, !0), q && h(e, "");
  }, [e, E, o, c, D, h, q]), Z = L(() => {
    o || (b(!$), I(!$));
  }, [o, $]), Y = K && q, O = {
    container: {
      marginBottom: f.spacing,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "100%",
      position: "relative",
      ...y
    },
    labelWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    label: {
      fontSize: "14px",
      fontWeight: 600,
      color: a ? f.primaryColor : f.textColor,
      letterSpacing: "0.02em",
      lineHeight: "1.5",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: a ? "translateY(-1px)" : "translateY(0)"
    },
    requiredBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: `${f.errorColor}15`,
      color: f.errorColor,
      fontSize: "20px",
      fontWeight: 700,
      animation: t ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none"
    },
    selectWrapper: {
      position: "relative",
      width: "100%"
    },
    select: {
      width: "100%",
      padding: "13px 44px 13px 16px",
      fontSize: "15px",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      fontWeight: 400,
      border: `2px solid ${Y ? f.errorColor : a ? f.primaryColor : V ? "#a1a1aa" : f.borderColor}`,
      borderRadius: "10px",
      backgroundColor: o ? "#fafafa" : f.backgroundColor,
      color: f.textColor,
      cursor: o ? "not-allowed" : "pointer",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxSizing: "border-box",
      opacity: o ? 0.5 : 1,
      boxShadow: Y ? `0 0 0 4px ${f.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)` : a ? `0 0 0 4px ${f.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)` : V ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 4px rgba(0,0,0,0.04)",
      transform: a ? "translateY(-1px)" : "translateY(0)"
    },
    placeholder: {
      color: "#9ca3af",
      fontSize: "15px"
    },
    selectedText: {
      color: f.textColor,
      fontSize: "15px",
      fontWeight: 500
    },
    arrow: {
      fontSize: "12px",
      color: a ? f.primaryColor : "#6b7280",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: $ ? "rotate(180deg)" : "rotate(0deg)"
    },
    iconContainer: {
      position: "absolute",
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      pointerEvents: "none"
    },
    checkIcon: {
      color: "#10b981",
      opacity: N ? 1 : 0,
      transform: N ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    errorIcon: {
      color: f.errorColor,
      opacity: Y ? 1 : 0,
      transform: Y ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: Y ? "shake 0.5s ease-in-out" : "none"
    },
    dropdown: {
      position: "absolute",
      top: "calc(100% + 4px)",
      left: 0,
      right: 0,
      backgroundColor: "#ffffff",
      border: `2px solid ${f.primaryColor}`,
      borderRadius: "10px",
      maxHeight: "240px",
      overflowY: "auto",
      zIndex: 1e3,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      animation: "dropdownSlide 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    option: {
      padding: "12px 16px",
      cursor: "pointer",
      color: f.textColor,
      transition: "all 0.15s ease",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "15px",
      borderBottom: `1px solid ${f.borderColor}20`
    },
    customCheckbox: {
      width: "18px",
      height: "18px",
      borderRadius: "4px",
      border: `2px solid ${f.primaryColor}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      flexShrink: 0
    },
    checkmark: {
      width: "10px",
      height: "10px",
      color: "#ffffff"
    },
    selectedBadges: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      animation: "fadeIn 0.3s ease"
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 12px",
      backgroundColor: `${f.primaryColor}`,
      color: "#ffffff",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: 500,
      animation: "badgeAppear 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    badgeButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#ffffff",
      fontSize: "18px",
      padding: 0,
      lineHeight: 1,
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "50%"
    },
    errorText: {
      fontSize: "13px",
      color: f.errorColor,
      display: "flex",
      alignItems: "flex-start",
      gap: "6px",
      fontWeight: 500,
      lineHeight: "1.4",
      animation: "slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    helperText: {
      fontSize: "13px",
      color: "#71717a",
      lineHeight: "1.5",
      fontWeight: 400,
      animation: "fadeIn 0.3s ease"
    }
  };
  return /* @__PURE__ */ g(
    "div",
    {
      ref: R,
      style: O.container,
      className: m,
      children: [
        n && /* @__PURE__ */ g("div", { style: O.labelWrapper, children: [
          /* @__PURE__ */ r("label", { style: O.label, className: i, children: n }),
          t && /* @__PURE__ */ r("span", { style: O.requiredBadge, title: "Required field", children: "*" })
        ] }),
        /* @__PURE__ */ g("div", { style: O.selectWrapper, children: [
          /* @__PURE__ */ g(
            "div",
            {
              style: O.select,
              onClick: Z,
              onMouseEnter: () => S(!0),
              onMouseLeave: () => S(!1),
              tabIndex: o ? -1 : 0,
              className: w,
              onKeyDown: (M) => {
                (M.key === "Enter" || M.key === " ") && (M.preventDefault(), Z());
              },
              children: [
                /* @__PURE__ */ r("span", { style: E.length === 0 ? O.placeholder : O.selectedText, children: E.length === 0 ? l : `${E.length} option${E.length > 1 ? "s" : ""} selected` }),
                /* @__PURE__ */ r("span", { style: O.arrow, children: "▼" })
              ]
            }
          ),
          !$ && /* @__PURE__ */ g("div", { style: O.iconContainer, children: [
            N && /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: O.checkIcon, children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" }) }),
            Y && !N && /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", style: O.errorIcon, children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
          ] }),
          $ && /* @__PURE__ */ r("div", { style: O.dropdown, children: s.length === 0 ? /* @__PURE__ */ r("div", { style: { ...O.option, cursor: "default", opacity: 0.6 }, children: "No options available" }) : s.map((M) => {
            const A = E.includes(M.value);
            return /* @__PURE__ */ g(
              "div",
              {
                style: {
                  ...O.option,
                  backgroundColor: A ? `${f.primaryColor}08` : "transparent",
                  fontWeight: A ? 500 : 400
                },
                onClick: (x) => {
                  x.stopPropagation(), U(M.value);
                },
                onMouseEnter: (x) => {
                  x.currentTarget.style.backgroundColor = A ? `${f.primaryColor}15` : `${f.primaryColor}05`;
                },
                onMouseLeave: (x) => {
                  x.currentTarget.style.backgroundColor = A ? `${f.primaryColor}08` : "transparent";
                },
                children: [
                  /* @__PURE__ */ r("div", { style: {
                    ...O.customCheckbox,
                    backgroundColor: A ? f.primaryColor : "transparent"
                  }, children: A && /* @__PURE__ */ r("svg", { style: O.checkmark, viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ r("polyline", { points: "2 6 5 9 10 3", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                  M.label
                ]
              },
              M.value
            );
          }) })
        ] }),
        E.length > 0 && /* @__PURE__ */ r("div", { style: O.selectedBadges, children: E.map((M) => {
          const A = s.find((x) => x.value === M);
          return A ? /* @__PURE__ */ g("div", { style: O.badge, children: [
            A.label,
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: (x) => H(M, x),
                style: O.badgeButton,
                onMouseEnter: (x) => {
                  x.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)", x.currentTarget.style.transform = "scale(1.1)";
                },
                onMouseLeave: (x) => {
                  x.currentTarget.style.backgroundColor = "transparent", x.currentTarget.style.transform = "scale(1)";
                },
                title: "Remove",
                children: "×"
              }
            )
          ] }, M) : null;
        }) }),
        Y && /* @__PURE__ */ g("div", { style: O.errorText, className: v, children: [
          /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", style: { flexShrink: 0, marginTop: "1px" }, children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
          /* @__PURE__ */ r("span", { children: q })
        ] }),
        d && !Y && /* @__PURE__ */ r("span", { style: O.helperText, children: d }),
        /* @__PURE__ */ r("style", { children: `
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }
          
          @keyframes shake {
            0%, 100% {
              transform: translateX(0) translateY(-50%);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-3px) translateY(-50%);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(3px) translateY(-50%);
            }
          }

          @keyframes dropdownSlide {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes badgeAppear {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        ` })
      ]
    }
  );
}, Ge = ({
  name: e,
  label: n,
  placeholder: s = "Add tags and press Enter",
  value: l = [],
  required: t = !1,
  disabled: o = !1,
  error: d,
  onChange: p,
  onBlur: w,
  className: m = "",
  helperText: i,
  maxTags: v
}) => {
  const [y, F] = P(l), [f, k] = P(""), [u, C] = P(!1), { validateField: c } = te(e), h = L(
    ie((z) => {
      c(""), p == null || p(z);
    }, 300),
    [p, c]
  ), D = (z) => {
    if (z.key === "Enter" && f.trim()) {
      if (z.preventDefault(), !v || y.length < v) {
        const $ = [...y, f.trim()];
        F($), k(""), h($);
      }
    } else if (z.key === "Backspace" && !f && y.length > 0) {
      const $ = y.slice(0, -1);
      F($), h($);
    }
  }, W = (z) => {
    const $ = y.filter((b, a) => a !== z);
    F($), h($);
  };
  return /* @__PURE__ */ g("div", { style: { marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }, className: m, children: [
    n && /* @__PURE__ */ g(
      "label",
      {
        style: {
          fontSize: "14px",
          fontWeight: "500",
          color: "#1f2937",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        },
        children: [
          n,
          t && /* @__PURE__ */ r("span", { style: { color: "#ef4444" }, children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ g(
      "div",
      {
        style: {
          padding: "10px 12px",
          fontSize: "14px",
          border: `1px solid ${d ? "#ef4444" : u ? "#000000" : "#e5e7eb"}`,
          borderRadius: "6px",
          backgroundColor: o ? "#f3f4f6" : "#ffffff",
          color: "#1f2937",
          transition: "all 0.2s ease",
          outline: "none",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          alignItems: "center"
        },
        children: [
          y.map((z, $) => /* @__PURE__ */ g(
            "div",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 8px",
                backgroundColor: "#00000010",
                color: "#000000",
                borderRadius: "4px",
                fontSize: "12px"
              },
              children: [
                z,
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => W($),
                    style: {
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "inherit",
                      fontSize: "16px"
                    },
                    children: "×"
                  }
                )
              ]
            },
            $
          )),
          /* @__PURE__ */ r(
            "input",
            {
              type: "text",
              value: f,
              onChange: (z) => k(z.target.value),
              onKeyDown: D,
              onFocus: () => C(!0),
              onBlur: () => {
                C(!1), w == null || w();
              },
              placeholder: y.length === 0 ? s : "",
              disabled: o || !!(v && y.length >= v),
              style: {
                flex: 1,
                minWidth: "100px",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                color: "#1f2937",
                fontSize: "14px"
              }
            }
          )
        ]
      }
    ),
    d && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#ef4444" }, children: d }),
    i && !d && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#6b7280" }, children: i })
  ] });
}, Je = ({
  name: e,
  label: n,
  options: s,
  placeholder: l = "Search...",
  required: t = !1,
  disabled: o = !1,
  helperText: d,
  theme: p,
  className: w,
  style: m,
  multiple: i = !1,
  freeSolo: v = !1,
  maxSelection: y
}) => {
  const F = { ...J, ...p }, {
    values: f,
    errors: k,
    touched: u,
    setFieldValue: C,
    setFieldError: c,
    setFieldTouched: h,
    registerField: D,
    unregisterField: W
  } = ee(), [z, $] = P(""), [b, a] = P(!1), [I, V] = P(!1), S = ne(null), R = ne(null), B = f[e], E = i ? Array.isArray(B) ? B : [] : B, q = k[e], K = u[e], T = L(async () => {
    const A = f[e];
    let x = "";
    return t && (i ? (Array.isArray(A) ? A : []).length === 0 && (x = "Please select at least one option") : (!A || A === "") && (x = "This field is required")), i && y && (Array.isArray(A) ? A : []).length > y && (x = `You can select a maximum of ${y} option${y > 1 ? "s" : ""}`), c(e, x), !x;
  }, [f, e, t, i, y, c]);
  Q(() => (D(e, T), () => W(e)), [e, D, W, T]);
  const N = oe(() => {
    let A = s;
    return i && Array.isArray(E) && (A = s.filter((x) => !E.includes(x.value))), z && (A = A.filter(
      (x) => x.label.toLowerCase().includes(z.toLowerCase())
    )), A;
  }, [z, s, i, E]);
  Q(() => {
    const A = (x) => {
      S.current && !S.current.contains(x.target) && (a(!1), V(!1), v && z && !i && C(e, z), h(e, !0));
    };
    return document.addEventListener("mousedown", A), () => document.removeEventListener("mousedown", A);
  }, [e, z, v, i, C, h]);
  const j = L((A) => {
    var x;
    if (!o) {
      if (i) {
        const X = Array.isArray(E) ? E : [];
        if (y && X.length >= y) {
          c(e, `You can only select up to ${y} option${y > 1 ? "s" : ""}`);
          return;
        }
        const _ = [...X, A.value];
        C(e, _), $(""), a(!0);
      } else
        C(e, A.value), $(A.label), a(!1);
      h(e, !0), (x = R.current) == null || x.focus();
    }
  }, [e, i, E, y, o, C, h, c]), U = L((A, x) => {
    if (x.stopPropagation(), o || !i) return;
    const _ = (Array.isArray(E) ? E : []).filter((G) => G !== A);
    C(e, _), h(e, !0), q && c(e, "");
  }, [e, i, E, o, C, h, c, q]), H = L((A) => {
    const x = A.target.value;
    $(x), a(!0), v && !i && C(e, x);
  }, [v, i, e, C]), Z = L((A) => {
    if (A.key === "Enter" && v && z && i) {
      A.preventDefault();
      const x = Array.isArray(E) ? E : [];
      if (y && x.length >= y) {
        c(e, `You can only select up to ${y} option${y > 1 ? "s" : ""}`);
        return;
      }
      x.includes(z) || (C(e, [...x, z]), $(""), h(e, !0));
    }
    A.key === "Escape" && a(!1);
  }, [v, z, i, E, y, e, C, h, c]), Y = K && q, O = L(() => {
    if (i)
      return (Array.isArray(E) ? E : []).map((x) => {
        const X = s.find((_) => _.value === x);
        return X ? X.label : String(x);
      });
    {
      if (!E) return [];
      const A = s.find((x) => x.value === E);
      return A ? [A.label] : [];
    }
  }, [i, E, s]), M = {
    container: {
      marginBottom: F.spacing,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      position: "relative",
      ...m
    },
    label: {
      fontSize: "14px",
      fontWeight: 500,
      color: F.textColor,
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    required: {
      color: F.errorColor
    },
    inputWrapper: {
      position: "relative"
    },
    input: {
      padding: "10px 12px",
      fontSize: "14px",
      border: `1px solid ${Y ? F.errorColor : I ? F.focusColor : F.borderColor}`,
      borderRadius: F.borderRadius,
      backgroundColor: o ? F.disabledColor : "#ffffff",
      color: F.textColor,
      transition: "all 0.2s ease",
      outline: "none",
      width: "100%",
      cursor: o ? "not-allowed" : "text"
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: "#ffffff",
      border: `1px solid ${F.borderColor}`,
      borderRadius: F.borderRadius,
      marginTop: "4px",
      maxHeight: "240px",
      overflowY: "auto",
      zIndex: 1e3,
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    },
    option: {
      padding: "10px 12px",
      cursor: "pointer",
      color: F.textColor,
      borderBottom: `1px solid ${F.borderColor}`,
      transition: "background-color 0.2s ease"
    },
    noOptions: {
      padding: "10px 12px",
      color: "#6b7280",
      textAlign: "center"
    },
    selectedBadges: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      marginTop: "4px"
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "5px 10px",
      backgroundColor: F.primaryColor,
      color: "#ffffff",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 500
    },
    badgeButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#ffffff",
      fontSize: "16px",
      padding: 0,
      lineHeight: 1,
      transition: "opacity 0.2s"
    },
    error: {
      fontSize: "12px",
      color: F.errorColor,
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    helperText: {
      fontSize: "12px",
      color: "#6b7280"
    }
  };
  return /* @__PURE__ */ g(
    "div",
    {
      ref: S,
      style: M.container,
      className: w,
      children: [
        n && /* @__PURE__ */ g("label", { style: M.label, children: [
          n,
          t && /* @__PURE__ */ r("span", { style: M.required, children: "*" })
        ] }),
        /* @__PURE__ */ g("div", { style: M.inputWrapper, children: [
          /* @__PURE__ */ r(
            "input",
            {
              ref: R,
              type: "text",
              name: e,
              value: z,
              onChange: H,
              onFocus: () => {
                V(!0), a(!0);
              },
              onBlur: () => {
                V(!1);
              },
              onKeyDown: Z,
              placeholder: l,
              disabled: o,
              style: M.input,
              autoComplete: "off"
            }
          ),
          b && N.length > 0 && /* @__PURE__ */ r("div", { style: M.dropdown, children: N.map((A) => {
            const x = i && Array.isArray(E) && E.includes(A.value);
            return /* @__PURE__ */ g(
              "div",
              {
                style: {
                  ...M.option,
                  backgroundColor: x ? "#e0f2fe" : "transparent",
                  fontWeight: x ? 600 : 400
                },
                onMouseDown: (X) => {
                  X.preventDefault(), j(A);
                },
                onMouseEnter: (X) => {
                  X.currentTarget.style.backgroundColor = x ? "#bfdbfe" : "#f3f4f6";
                },
                onMouseLeave: (X) => {
                  X.currentTarget.style.backgroundColor = x ? "#e0f2fe" : "transparent";
                },
                children: [
                  i && /* @__PURE__ */ r("span", { style: { marginRight: "8px" }, children: x ? "✓" : "○" }),
                  A.label
                ]
              },
              A.value
            );
          }) }),
          b && N.length === 0 && z && /* @__PURE__ */ r("div", { style: M.dropdown, children: /* @__PURE__ */ r("div", { style: M.noOptions, children: v ? `Press Enter to add "${z}"` : "No options found" }) })
        ] }),
        i && Array.isArray(E) && E.length > 0 && /* @__PURE__ */ r("div", { style: M.selectedBadges, children: O().map((A, x) => {
          const X = E[x];
          return /* @__PURE__ */ g("div", { style: M.badge, children: [
            A,
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: (_) => U(X, _),
                style: M.badgeButton,
                onMouseEnter: (_) => _.currentTarget.style.opacity = "0.7",
                onMouseLeave: (_) => _.currentTarget.style.opacity = "1",
                title: "Remove",
                children: "×"
              }
            )
          ] }, X);
        }) }),
        Y && /* @__PURE__ */ g("span", { style: M.error, children: [
          "⚠️ ",
          q
        ] }),
        d && !Y && /* @__PURE__ */ r("span", { style: M.helperText, children: d })
      ]
    }
  );
}, Qe = ({
  name: e,
  label: n,
  placeholder: s = "0.00",
  currency: l = "USD",
  min: t,
  max: o,
  required: d = !1,
  disabled: p = !1,
  error: w,
  onChange: m,
  onBlur: i,
  className: v = "",
  helperText: y
}) => {
  const [F, f] = P(""), [k, u] = P(!1), { validateField: C } = te(e, {
    type: "custom",
    customValidator: (W) => {
      const z = W === "" ? null : Number.parseFloat(W);
      return !(d && (z === null || isNaN(z)) || z !== null && (t !== void 0 && z < t || o !== void 0 && z > o));
    },
    errorMessage: d ? `Please enter a valid ${l} amount between ${t == null ? void 0 : t.toFixed(2)} and ${o == null ? void 0 : o.toFixed(2)}` : `Amount must be between ${t == null ? void 0 : t.toFixed(2)} and ${o == null ? void 0 : o.toFixed(2)}`
  }), c = (W) => {
    const z = W.replace(/[^\d.]/g, "");
    return z ? Number.parseFloat(z).toFixed(2) : "";
  }, h = L(
    ie((W) => {
      C(W);
      const z = W === "" ? null : Number.parseFloat(W);
      m == null || m(z);
    }, 300),
    [C, m]
  ), D = (W) => {
    const z = c(W.target.value);
    f(z), h(z);
  };
  return Q(() => {
    const W = document.createElement("style");
    return W.innerHTML = `
      .currency-field {
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        animation: fadeIn 0.2s ease-in;
      }
      .currency-label {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .currency-required {
        color: #e63946;
      }
      .currency-input-container {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 6px;
        background-color: #fff;
        transition: all 0.2s ease;
        overflow: hidden;
        animation: slideIn 0.2s ease;
      }
      .currency-input-container.focused {
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
      }
      .currency-input-container.error {
        border-color: #e63946;
      }
      .currency-input-container.disabled {
        background-color: #f2f2f2;
        opacity: 0.7;
      }
      .currency-symbol {
        padding: 10px 12px;
        font-size: 14px;
        font-weight: 500;
        color: #555;
        border-right: 1px solid #ddd;
      }
      .currency-input {
        flex: 1;
        padding: 10px 12px;
        font-size: 14px;
        border: none;
        outline: none;
        color: #222;
        background: transparent;
      }
      .currency-input::placeholder {
        color: #aaa;
      }
      .currency-error-text {
        font-size: 12px;
        color: #e63946;
        animation: fadeIn 0.2s ease;
      }
      .currency-helper-text {
        font-size: 12px;
        color: #777;
      }
      @keyframes slideIn {
        from { transform: translateY(-3px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `, document.head.appendChild(W), () => {
      document.head.removeChild(W);
    };
  }, []), /* @__PURE__ */ g("div", { className: `currency-field ${v}`, children: [
    n && /* @__PURE__ */ g("label", { className: "currency-label", children: [
      n,
      d && /* @__PURE__ */ r("span", { className: "currency-required", children: "*" })
    ] }),
    /* @__PURE__ */ g(
      "div",
      {
        className: `currency-input-container 
          ${k ? "focused" : ""} 
          ${w ? "error" : ""} 
          ${p ? "disabled" : ""}`,
        children: [
          /* @__PURE__ */ r("span", { className: "currency-symbol", children: l }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "text",
              name: e,
              value: F,
              onChange: D,
              onFocus: () => u(!0),
              onBlur: () => {
                u(!1), i == null || i();
              },
              placeholder: s,
              disabled: p,
              className: "currency-input"
            }
          )
        ]
      }
    ),
    w && /* @__PURE__ */ r("span", { className: "currency-error-text", children: w }),
    y && !w && /* @__PURE__ */ r("span", { className: "currency-helper-text", children: y })
  ] });
}, er = ({
  name: e,
  label: n,
  placeholder: s = "5550000000",
  countryCode: l = "+1",
  required: t = !1,
  disabled: o = !1,
  onChange: d,
  onBlur: p,
  className: w = "",
  containerClassName: m = "",
  labelClassName: i = "",
  errorClassName: v = "",
  inputClassName: y = "",
  helperText: F,
  theme: f
}) => {
  const k = ee(), u = { ...J, ...f }, [C, c] = P(l), [h, D] = P(!1), [W, z] = P(!1), $ = k.values[e] || "", b = k.errors[e], a = k.touched[e], I = $.replace(/^\+\d+\s*/, ""), S = I && I.length > 0 && !b && a, R = L(async () => {
    const N = k.values[e] || "";
    let j = "";
    if (t && !N)
      j = "This field is required";
    else if (N) {
      const U = N.replace(/\D/g, "");
      U.length < 10 ? j = "Phone number must be at least 10 digits" : U.length > 15 && (j = "Phone number is too long");
    }
    return k.setFieldError(e, j), !j;
  }, [e, t, k]);
  Q(() => (k.registerField(e, R), () => {
    k.unregisterField(e);
  }), [e, R, k]);
  const B = (N) => {
    const U = N.target.value.replace(/[^\d\s\-()]/g, ""), H = `${C} ${U}`;
    k.setFieldValue(e, H), d == null || d(H), a && b && k.setFieldError(e, "");
  }, E = (N) => {
    let j = N.target.value;
    if (j ? j.startsWith("+") || (j = "+" + j) : j = "+", j = "+" + j.slice(1).replace(/\D/g, ""), c(j), I) {
      const U = `${j} ${I}`;
      k.setFieldValue(e, U), d == null || d(U);
    }
  }, q = () => {
    D(!1), k.setFieldTouched(e, !0), R(), p == null || p();
  }, K = () => {
    D(!0);
  }, T = {
    container: {
      marginBottom: u.spacing,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "100%",
      position: "relative"
    },
    labelWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    label: {
      fontSize: "14px",
      fontWeight: 600,
      color: h ? u.primaryColor : u.textColor,
      letterSpacing: "0.02em",
      lineHeight: "1.5",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: h ? "translateY(-1px)" : "translateY(0)"
    },
    requiredBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: `${u.errorColor}15`,
      color: u.errorColor,
      fontSize: "20px",
      fontWeight: 700,
      animation: t ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none"
    },
    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      border: `2px solid ${b && a ? u.errorColor : h ? u.primaryColor : W ? "#a1a1aa" : u.borderColor}`,
      borderRadius: "10px",
      backgroundColor: o ? "#fafafa" : u.backgroundColor,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: b && a ? `0 0 0 4px ${u.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)` : h ? `0 0 0 4px ${u.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)` : W ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 4px rgba(0,0,0,0.04)",
      transform: h ? "translateY(-1px)" : "translateY(0)",
      opacity: o ? 0.5 : 1
    },
    countryCodeInput: {
      width: "70px",
      padding: "13px 8px",
      fontSize: "15px",
      fontWeight: 600,
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      color: u.textColor,
      border: "none",
      borderRight: `1.5px solid ${u.borderColor}`,
      backgroundColor: "transparent",
      outline: "none",
      textAlign: "center",
      cursor: o ? "not-allowed" : "text",
      transition: "all 0.2s ease"
    },
    phoneInput: {
      flex: 1,
      padding: "13px 44px 13px 12px",
      fontSize: "15px",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      fontWeight: 400,
      border: "none",
      backgroundColor: "transparent",
      color: u.textColor,
      outline: "none",
      cursor: o ? "not-allowed" : "text",
      WebkitAppearance: "none",
      MozAppearance: "none"
    },
    iconContainer: {
      position: "absolute",
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      pointerEvents: "none"
    },
    checkIcon: {
      color: "#10b981",
      opacity: S ? 1 : 0,
      transform: S ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    errorIcon: {
      color: u.errorColor,
      opacity: b && a ? 1 : 0,
      transform: b && a ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: b && a ? "shake 0.5s ease-in-out" : "none"
    },
    errorText: {
      fontSize: "13px",
      color: u.errorColor,
      display: "flex",
      alignItems: "flex-start",
      gap: "6px",
      fontWeight: 500,
      lineHeight: "1.4",
      animation: "slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    helperText: {
      fontSize: "13px",
      color: "#71717a",
      lineHeight: "1.5",
      fontWeight: 400,
      animation: "fadeIn 0.3s ease"
    }
  };
  return /* @__PURE__ */ g("div", { style: T.container, className: m, children: [
    n && /* @__PURE__ */ g("div", { style: T.labelWrapper, children: [
      /* @__PURE__ */ r("label", { style: T.label, htmlFor: e, className: i, children: n }),
      t && /* @__PURE__ */ r("span", { style: T.requiredBadge, title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ g(
      "div",
      {
        style: T.inputWrapper,
        onMouseEnter: () => z(!0),
        onMouseLeave: () => z(!1),
        children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "text",
              value: C,
              onChange: E,
              onFocus: K,
              onBlur: q,
              disabled: o,
              style: T.countryCodeInput,
              className: y,
              placeholder: "+1"
            }
          ),
          /* @__PURE__ */ r(
            "input",
            {
              id: e,
              type: "tel",
              name: e,
              value: I,
              onChange: B,
              onFocus: K,
              onBlur: q,
              placeholder: s,
              disabled: o,
              "aria-invalid": !!(b && a),
              "aria-describedby": b && a ? `${e}-error` : void 0,
              style: T.phoneInput,
              className: `${w} ${y}`
            }
          ),
          /* @__PURE__ */ g("div", { style: T.iconContainer, children: [
            S && /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: T.checkIcon, children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" }) }),
            b && a && !S && /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", style: T.errorIcon, children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
          ] })
        ]
      }
    ),
    b && a && /* @__PURE__ */ g("div", { id: `${e}-error`, role: "alert", style: T.errorText, className: v, children: [
      /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", style: { flexShrink: 0, marginTop: "1px" }, children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
      /* @__PURE__ */ r("span", { children: b })
    ] }),
    F && !(b && a) && /* @__PURE__ */ r("div", { style: T.helperText, children: F }),
    /* @__PURE__ */ r("style", { children: `
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }
          
          @keyframes shake {
            0%, 100% {
              transform: translateX(0) translateY(-50%);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-3px) translateY(-50%);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(3px) translateY(-50%);
            }
          }
        ` })
  ] });
}, de = (e, n = 300, s = "ease-in-out") => ({
  animation: `${e} ${n}ms ${s}`
}), rr = ({
  name: e,
  label: n,
  placeholder: s = "https://example.com",
  required: l = !1,
  disabled: t = !1,
  onChange: o,
  onBlur: d,
  theme: p = J,
  className: w = "",
  helperText: m
}) => {
  const [i, v] = P(""), [y, F] = P(!1), { validateField: f, error: k } = te(e, {
    type: "url",
    customValidator: (z) => {
      if (!z) return !l;
      try {
        return new URL(z), !0;
      } catch {
        return !1;
      }
    },
    errorMessage: l ? "URL is required" : "Please enter a valid URL"
  }), u = L(
    ie((z) => {
      f(z), o == null || o(z);
    }, 300),
    [f, o]
  ), C = (z) => {
    const $ = z.target.value;
    v($), u($);
  }, c = {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  }, h = {
    fontSize: "14px",
    fontWeight: "500",
    color: p.text.primary,
    display: "flex",
    alignItems: "center",
    gap: "4px"
  }, D = {
    padding: "10px 12px",
    fontSize: "14px",
    border: `1px solid ${k ? p.colors.error : y ? p.colors.primary : p.colors.border}`,
    borderRadius: "6px",
    backgroundColor: t ? p.colors.disabled : p.colors.background,
    color: p.text.primary,
    transition: "all 0.2s ease",
    outline: "none",
    ...de("slideIn")
  }, W = {
    fontSize: "12px",
    color: p.colors.error,
    animation: "slideIn 0.2s ease"
  };
  return /* @__PURE__ */ g("div", { style: c, className: w, children: [
    n && /* @__PURE__ */ g("label", { style: h, children: [
      n,
      l && /* @__PURE__ */ r("span", { style: { color: p.colors.error }, children: "*" })
    ] }),
    /* @__PURE__ */ r(
      "input",
      {
        type: "url",
        name: e,
        value: i,
        onChange: C,
        onFocus: () => F(!0),
        onBlur: () => {
          F(!1), f(i), d == null || d();
        },
        placeholder: s,
        disabled: t,
        style: D
      }
    ),
    k && /* @__PURE__ */ r("span", { style: W, children: k }),
    m && !k && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: p.text.secondary }, children: m })
  ] });
}, tr = ({
  name: e,
  label: n,
  placeholder: s = "Search...",
  minChars: l = 2,
  required: t = !1,
  disabled: o = !1,
  error: d,
  onChange: p,
  onSearch: w,
  onBlur: m,
  theme: i = J,
  className: v = "",
  helperText: y
}) => {
  const [F, f] = P(""), [k, u] = P(!1), { validateField: C, error: c } = te(e, {
    type: "custom",
    customValidator: (S) => !(t && !S.trim() || S.length < l),
    errorMessage: t ? `Please enter at least ${l} characters` : `Minimum ${l} characters required`
  }), h = L(
    ie((S) => {
      C(S), S.length >= l && (w == null || w(S)), p == null || p(S);
    }, 300),
    [C, l, w, p]
  ), D = (S) => {
    const R = S.target.value;
    f(R), h(R);
  }, W = {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  }, z = {
    fontSize: "14px",
    fontWeight: "500",
    color: i.text.primary,
    display: "flex",
    alignItems: "center",
    gap: "4px"
  }, $ = {
    display: "flex",
    alignItems: "center",
    border: `1px solid ${d ? i.colors.error : k ? i.colors.primary : i.colors.border}`,
    borderRadius: "6px",
    backgroundColor: o ? i.colors.disabled : i.colors.background,
    transition: "all 0.2s ease",
    ...de("slideIn")
  }, b = {
    padding: "10px 12px",
    color: i.text.secondary,
    fontSize: "16px"
  }, a = {
    flex: 1,
    padding: "10px 12px",
    fontSize: "14px",
    border: "none",
    backgroundColor: "transparent",
    color: i.text.primary,
    outline: "none"
  }, I = {
    padding: "10px 12px",
    background: "none",
    border: "none",
    color: i.text.secondary,
    cursor: "pointer",
    fontSize: "16px",
    display: F ? "block" : "none"
  }, V = {
    fontSize: "12px",
    color: i.colors.error,
    animation: "slideIn 0.2s ease"
  };
  return /* @__PURE__ */ g("div", { style: W, className: v, children: [
    n && /* @__PURE__ */ g("label", { style: z, children: [
      n,
      t && /* @__PURE__ */ r("span", { style: { color: i.colors.error }, children: "*" })
    ] }),
    /* @__PURE__ */ g("div", { style: $, children: [
      /* @__PURE__ */ r("span", { style: b, children: "🔍" }),
      /* @__PURE__ */ r(
        "input",
        {
          type: "text",
          name: e,
          value: F,
          onChange: D,
          onFocus: () => u(!0),
          onBlur: () => {
            u(!1), m == null || m();
          },
          placeholder: s,
          disabled: o,
          style: a
        }
      ),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            f(""), p == null || p("");
          },
          style: I,
          disabled: o,
          children: "✕"
        }
      )
    ] }),
    d && /* @__PURE__ */ r("span", { style: V, children: d }),
    y && !d && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: i.text.secondary }, children: y })
  ] });
}, or = ({
  name: e,
  label: n,
  value: s = 0,
  min: l = 0,
  max: t = 100,
  step: o = 1,
  disabled: d = !1,
  onChange: p,
  theme: w = J,
  className: m = "",
  helperText: i
}) => {
  const [v, y] = P(s), { validateField: F, error: f } = te(e, {
    type: "custom",
    customValidator: (b) => {
      const a = Number(b);
      return !(isNaN(a) || a < l || a > t);
    },
    errorMessage: `Value must be between ${l} and ${t}`
  }), k = L(
    ae((b) => {
      F(b.toString()), p && p(b);
    }, 100),
    [F, p]
  ), u = () => {
    if (v < t) {
      const b = v + o;
      y(b), k(b);
    }
  }, C = () => {
    if (v > l) {
      const b = v - o;
      y(b), k(b);
    }
  }, c = (b) => {
    const a = Number.parseInt(b.target.value) || 0;
    a >= l && a <= t && (y(a), k(a));
  }, h = {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  }, D = {
    fontSize: "14px",
    fontWeight: "500",
    color: w.text.primary
  }, W = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    ...de("slideIn")
  }, z = (b) => ({
    width: "40px",
    height: "40px",
    border: `1px solid ${w.colors.border}`,
    borderRadius: "6px",
    backgroundColor: b ? w.colors.disabled : w.colors.background,
    color: w.text.primary,
    cursor: b ? "not-allowed" : "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "all 0.2s ease"
  }), $ = {
    width: "60px",
    padding: "8px",
    fontSize: "14px",
    border: `1px solid ${w.colors.border}`,
    borderRadius: "6px",
    backgroundColor: d ? w.colors.disabled : w.colors.background,
    color: w.text.primary,
    textAlign: "center",
    outline: "none"
  };
  return /* @__PURE__ */ g("div", { style: h, className: m, children: [
    n && /* @__PURE__ */ r("label", { style: D, children: n }),
    /* @__PURE__ */ g("div", { style: W, children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: C,
          disabled: d || v <= l,
          style: z(d || v <= l),
          children: "−"
        }
      ),
      /* @__PURE__ */ r(
        "input",
        {
          type: "number",
          name: e,
          value: v,
          onChange: c,
          disabled: d,
          style: $,
          min: l,
          max: t
        }
      ),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: u,
          disabled: d || v >= t,
          style: z(d || v >= t),
          children: "+"
        }
      )
    ] }),
    i && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: w.text.secondary }, children: i })
  ] });
}, nr = ({
  children: e,
  title: n,
  description: s,
  theme: l,
  spacing: t = "normal",
  highlight: o = !1
}) => {
  const d = { ...J, ...l }, w = {
    container: {
      marginBottom: {
        compact: "10px",
        normal: "16px",
        relaxed: "24px"
      }[t],
      padding: "18px 20px",
      borderRadius: d.borderRadius,
      border: `1px solid ${d.borderColor}`,
      backgroundColor: "#ffffff",
      boxShadow: o ? `0 0 0 4px ${d.primaryColor}10, 0 1px 6px rgba(0,0,0,0.05)` : "0 1px 4px rgba(0,0,0,0.03)",
      transition: "all 0.25s ease",
      position: "relative",
      overflow: "visible"
    },
    header: {
      marginBottom: s ? "10px" : "6px"
    },
    title: {
      fontSize: "15px",
      fontWeight: 600,
      color: d.textColor,
      marginBottom: s ? "4px" : "0",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    underline: {
      height: "2px",
      width: "40px",
      backgroundColor: d.primaryColor,
      borderRadius: "2px",
      marginTop: "6px",
      opacity: o ? 1 : 0.6,
      transition: "opacity 0.25s ease"
    },
    description: {
      fontSize: "13px",
      color: "#6b7280",
      lineHeight: 1.5
    },
    content: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      animation: "fadeInGroup 0.3s ease"
    }
  };
  return /* @__PURE__ */ g(
    "div",
    {
      style: w.container,
      onMouseEnter: (m) => {
        m.currentTarget.style.boxShadow = `0 0 0 4px ${d.primaryColor}15, 0 2px 8px rgba(0,0,0,0.06)`;
      },
      onMouseLeave: (m) => {
        m.currentTarget.style.boxShadow = o ? `0 0 0 4px ${d.primaryColor}10, 0 1px 6px rgba(0,0,0,0.05)` : "0 1px 4px rgba(0,0,0,0.03)";
      },
      children: [
        (n || s) && /* @__PURE__ */ g("div", { style: w.header, children: [
          n && /* @__PURE__ */ r("div", { style: w.title, children: n }),
          s && /* @__PURE__ */ r("div", { style: w.description, children: s }),
          n && /* @__PURE__ */ r("div", { style: w.underline })
        ] }),
        /* @__PURE__ */ r("div", { style: w.content, children: e }),
        /* @__PURE__ */ r("style", { children: `
          @keyframes fadeInGroup {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        ` })
      ]
    }
  );
}, ir = ({ children: e, columns: n = 2, gap: s = "16px" }) => {
  const l = {
    container: {
      display: "grid",
      gridTemplateColumns: `repeat(${n}, 1fr)`,
      gap: s,
      marginBottom: s
    }
  };
  return /* @__PURE__ */ r("div", { style: l.container, children: e });
}, sr = ({
  name: e,
  length: n = 6,
  label: s,
  required: l = !1,
  disabled: t = !1,
  onComplete: o,
  theme: d,
  helperText: p,
  className: w,
  style: m
}) => {
  var a, I;
  const i = { ...J, ...d }, v = (() => {
    try {
      return ee();
    } catch {
      return null;
    }
  })(), [y, F] = P(Array(n).fill("")), [f, k] = P(!1), u = ne([]), C = (a = v == null ? void 0 : v.errors) == null ? void 0 : a[e], h = (((I = v == null ? void 0 : v.touched) == null ? void 0 : I[e]) || f) && C, D = L(async () => {
    if (!v) return !0;
    const V = y.join("");
    let S = "";
    return l && V.length < n && (S = "Please enter complete OTP"), v.setFieldError(e, S), !S;
  }, [v, e, y, l, n]);
  Q(() => {
    if (v)
      return v.registerField(e, D), () => v.unregisterField(e);
  }, [v, e, D]), Q(() => {
    v && v.setFieldValue(e, y.join(""));
  }, [y, v, e]);
  const W = (V, S) => {
    var E;
    if (t || !/^[0-9a-zA-Z]?$/.test(S)) return;
    const R = [...y];
    R[V] = S, F(R), k(!0), v == null || v.setFieldTouched(e, !0), v == null || v.setFieldError(e, ""), S && V < n - 1 && ((E = u.current[V + 1]) == null || E.focus());
    const B = R.join("");
    B.length === n && (o == null || o(B));
  }, z = (V, S) => {
    var R;
    S.key === "Backspace" && !y[V] && V > 0 && ((R = u.current[V - 1]) == null || R.focus());
  }, $ = (V) => {
    V.preventDefault();
    const R = V.clipboardData.getData("text").slice(0, n).split(""), B = Array(n).fill("").map((E, q) => R[q] ?? "");
    F(B), B.join("").length === n && (o == null || o(B.join("")));
  }, b = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginBottom: i.spacing,
      ...m
    },
    label: {
      fontSize: "14px",
      fontWeight: 600,
      color: i.textColor,
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    required: { color: i.errorColor },
    inputGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "10px"
    },
    box: {
      width: "42px",
      height: "48px",
      borderRadius: i.borderRadius,
      border: `2px solid ${h ? i.errorColor : i.borderColor}`,
      textAlign: "center",
      fontSize: "20px",
      fontWeight: 600,
      outline: "none",
      color: i.textColor,
      transition: "all 0.2s ease",
      backgroundColor: t ? "#f3f4f6" : "#fff"
    },
    errorText: {
      fontSize: "12px",
      color: i.errorColor,
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    helperText: {
      fontSize: "12px",
      color: "#6b7280"
    }
  };
  return /* @__PURE__ */ g("div", { style: b.container, className: w, children: [
    s && /* @__PURE__ */ g("label", { style: b.label, children: [
      s,
      l && /* @__PURE__ */ r("span", { style: b.required, children: "*" })
    ] }),
    /* @__PURE__ */ r("div", { style: b.inputGroup, onPaste: $, children: y.map((V, S) => /* @__PURE__ */ r(
      "input",
      {
        type: "text",
        inputMode: "numeric",
        maxLength: 1,
        value: V,
        disabled: t,
        onChange: (R) => W(S, R.target.value),
        onKeyDown: (R) => z(S, R),
        ref: (R) => u.current[S] = R,
        style: b.box
      },
      S
    )) }),
    h && /* @__PURE__ */ g("span", { style: b.errorText, children: [
      "⚠️ ",
      C
    ] }),
    p && !h && /* @__PURE__ */ r("span", { style: b.helperText, children: p })
  ] });
}, lr = () => {
  const e = ee();
  return {
    values: e.values,
    errors: e.errors,
    touched: e.touched,
    isSubmitting: e.isSubmitting,
    setFieldValue: e.setFieldValue,
    setFieldError: e.setFieldError,
    setFieldTouched: e.setFieldTouched,
    resetForm: e.resetForm,
    handleSubmit: e.handleSubmit
  };
};
String.prototype.includes || (String.prototype.includes = function(e, n) {
  return typeof n != "number" && (n = 0), this.indexOf(e, n) !== -1;
});
Array.prototype.find || (Array.prototype.find = function(e, n) {
  if (this == null)
    throw new TypeError("Array.prototype.find called on null or undefined");
  const s = Object(this), l = Number.parseInt(s.length, 10) || 0;
  if (l !== 0)
    for (let t = 0; t < l; t++) {
      const o = s[t];
      if (e.call(n, o, t, s))
        return o;
    }
});
typeof Object.assign != "function" && Object.defineProperty(Object, "assign", {
  value: function(n, ...s) {
    if (n == null)
      throw new TypeError("Cannot convert undefined or null to object");
    const l = Object(n);
    for (let t = 0; t < s.length; t++) {
      const o = s[t];
      if (o != null)
        for (const d in o)
          Object.prototype.hasOwnProperty.call(o, d) && (l[d] = o[d]);
    }
    return l;
  },
  writable: !0,
  configurable: !0
});
export {
  Je as Autocomplete,
  Le as Button,
  Me as Checkbox,
  _e as ColorPicker,
  Qe as CurrencyField,
  He as DateField,
  Ue as FileUpload,
  Re as Form,
  nr as FormGroup,
  xe as FormProvider,
  ir as FormRow,
  Ze as MultiSelect,
  je as NumberField,
  sr as OtpInput,
  Ae as PasswordField,
  er as PhoneField,
  Be as Radio,
  Ke as Rating,
  tr as SearchField,
  Pe as Select,
  Xe as Slider,
  or as Stepper,
  Ge as TagsInput,
  Ye as TextField,
  Ne as Textarea,
  Oe as TimeField,
  qe as Toggle,
  rr as URLField,
  ie as debounce,
  J as defaultTheme,
  ae as throttle,
  te as useFieldValidation,
  lr as useForm,
  ee as useFormContext,
  le as validate,
  Ve as validateAlphanumeric,
  me as validateEmail,
  Te as validateLength,
  ke as validateName,
  Ie as validateNumber,
  ze as validatePassword,
  De as validatePasswordMatch,
  Ce as validatePhone,
  Fe as validateUrl
};
