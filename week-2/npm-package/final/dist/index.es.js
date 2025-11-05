import { jsx as r, jsxs as d, Fragment as ne } from "react/jsx-runtime";
import { createContext as de, useState as R, useRef as Q, useCallback as B, useContext as ue, useEffect as Z, useMemo as J } from "react";
const ae = de(void 0), fe = ({
  children: e,
  onSubmit: t,
  initialValues: o = {},
  requiredFields: i = []
}) => {
  const [s, n] = R(o), [y, V] = R({}), [L, D] = R({}), [j, F] = R(!1), [A, M] = R(!1), c = Q({}), h = Q(null), k = B((g, p) => {
    n((w) => ({ ...w, [g]: p }));
  }, []), b = B((g, p) => {
    V((w) => {
      if (!p) {
        const x = { ...w };
        return delete x[g], x;
      }
      return { ...w, [g]: p };
    });
  }, []), P = B((g, p) => {
    D((w) => ({ ...w, [g]: p }));
  }, []), z = B((g, p) => {
    c.current[g] = p;
  }, []), T = B((g) => {
    delete c.current[g];
  }, []), m = B(
    async (g) => {
      const p = c.current[g];
      if (p) return await p();
      const w = s[g];
      let x = "";
      return i.includes(g) && (w === "" || w == null || typeof w == "string" && w.trim() === "" || Array.isArray(w) && w.length === 0 ? x = "This field is required" : g === "terms" && w === !1 && (x = "You must accept the terms and conditions")), b(g, x), !x;
    },
    [s, i, b]
  ), u = B(async () => {
    const g = /* @__PURE__ */ new Set([...i, ...Object.keys(c.current), ...Object.keys(s)]), p = {};
    g.forEach((x) => p[x] = !0), D((x) => ({ ...x, ...p }));
    let w = !0;
    return await Promise.all(Array.from(g).map(async (x) => {
      await m(x) || (w = !1);
    })), w;
  }, [s, i, m]), f = B(() => {
    n(o), V({}), D({}), M(!1), F(!1);
  }, [o]), N = B(async () => {
    F(!0);
    try {
      await u() && t && (await t(s), M(!0));
    } finally {
      F(!1);
    }
  }, [u, t, s]), q = B(
    (g) => async (p) => {
      var w, x;
      p.preventDefault(), p.stopPropagation();
      try {
        await g(s), M(!0), (w = h.current) == null || w.call(h);
      } catch (a) {
        throw console.error(a), (x = h.current) == null || x.call(h), a;
      }
    },
    [s]
  ), E = {
    values: s,
    errors: y,
    touched: L,
    isSubmitting: j,
    isSubmitted: A,
    setFieldValue: k,
    setFieldError: b,
    setFieldTouched: P,
    validateField: m,
    validateForm: u,
    resetForm: f,
    submitForm: N,
    handleSubmit: q,
    registerField: z,
    unregisterField: T,
    get onSubmitSuccess() {
      return h.current;
    },
    set onSubmitSuccess(g) {
      h.current = g;
    }
  };
  return /* @__PURE__ */ r(ae.Provider, { value: E, children: e });
}, _ = () => {
  const e = ue(ae);
  if (!e) throw new Error("useFormContext must be used within FormProvider");
  return e;
}, Pe = ({
  children: e,
  onSubmit: t,
  initialValues: o = {},
  className: i = "",
  containerClassName: s = "",
  requiredFields: n = []
}) => /* @__PURE__ */ r(
  fe,
  {
    onSubmit: t,
    initialValues: o,
    requiredFields: n,
    children: /* @__PURE__ */ r(
      he,
      {
        className: i,
        containerClassName: s,
        onSubmit: t,
        children: e
      }
    )
  }
);
function he({
  children: e,
  className: t,
  containerClassName: o,
  onSubmit: i
}) {
  const { handleSubmit: s } = _(), n = `
    form-container
    ${t}
  `.trim().replace(/\s+/g, " ");
  return /* @__PURE__ */ r("div", { className: o, children: /* @__PURE__ */ r(
    "form",
    {
      className: n,
      onSubmit: s(i),
      noValidate: !0,
      children: e
    }
  ) });
}
const me = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, pe = (e) => e.trim() ? me.test(e) ? { isValid: !0 } : { isValid: !1, error: "Invalid email format" } : { isValid: !1, error: "Email is required" }, ve = /^[\d\s\-+$$$$]{10,}$/, ge = (e) => e.trim() ? ve.test(e.replace(/\s/g, "")) ? { isValid: !0 } : { isValid: !1, error: "Invalid phone number format" } : { isValid: !1, error: "Phone number is required" }, be = /^[a-zA-Z\s'-]{2,}$/, we = (e) => e.trim() ? be.test(e) ? { isValid: !0 } : { isValid: !1, error: "Name must contain only letters, spaces, hyphens, and apostrophes" } : { isValid: !1, error: "Name is required" }, Ne = (e, t = {}) => {
  const {
    minLength: o = 8,
    requireUppercase: i = !0,
    requireLowercase: s = !0,
    requireNumbers: n = !0,
    requireSpecialChars: y = !0
  } = t;
  return e ? e.length < o ? { isValid: !1, error: `Password must be at least ${o} characters` } : i && !/[A-Z]/.test(e) ? { isValid: !1, error: "Password must contain at least one uppercase letter" } : s && !/[a-z]/.test(e) ? { isValid: !1, error: "Password must contain at least one lowercase letter" } : n && !/\d/.test(e) ? { isValid: !1, error: "Password must contain at least one number" } : y && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(e) ? { isValid: !1, error: "Password must contain at least one special character" } : { isValid: !0 } : { isValid: !1, error: "Password is required" };
}, ye = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, Fe = (e) => e.trim() ? ye.test(e) ? { isValid: !0 } : { isValid: !1, error: "Invalid URL format" } : { isValid: !1, error: "URL is required" }, $e = (e) => e.trim() ? isNaN(Number(e)) ? { isValid: !1, error: "Must be a valid number" } : { isValid: !0 } : { isValid: !1, error: "Number is required" }, Ve = /^[a-zA-Z0-9]+$/, ke = (e) => e.trim() ? Ve.test(e) ? { isValid: !0 } : { isValid: !1, error: "Only letters and numbers are allowed" } : { isValid: !1, error: "This field is required" }, xe = (e, t, o) => t && e.length < t ? { isValid: !1, error: `Minimum ${t} characters required` } : o && e.length > o ? { isValid: !1, error: `Maximum ${o} characters allowed` } : { isValid: !0 }, Te = (e, t) => e !== t ? { isValid: !1, error: "Passwords do not match" } : { isValid: !0 }, le = (e, t) => {
  if (t.minLength || t.maxLength) {
    const o = xe(e, t.minLength, t.maxLength);
    if (!o.isValid)
      return o;
  }
  if (t.type === "custom" && t.customValidator) {
    const o = t.customValidator(e);
    return {
      isValid: o,
      error: o ? void 0 : t.errorMessage || "Validation failed"
    };
  }
  if (t.pattern) {
    const o = t.pattern.test(e);
    return {
      isValid: o,
      error: o ? void 0 : t.errorMessage || "Invalid format"
    };
  }
  switch (t.type) {
    case "email":
      return pe(e);
    case "phone":
      return ge(e);
    case "name":
      return we(e);
    case "password":
      return Ne(e);
    case "url":
      return Fe(e);
    case "number":
      return $e(e);
    case "alphanumeric":
      return ke(e);
    default:
      return { isValid: !0 };
  }
};
function ce(e, t) {
  let o = null;
  return function(...s) {
    const n = () => {
      o = null, e(...s);
    };
    o && clearTimeout(o), o = setTimeout(n, t);
  };
}
const Be = ({
  name: e,
  label: t,
  placeholder: o,
  type: i = "text",
  validation: s,
  disabled: n = !1,
  required: y = !1,
  onChange: V,
  onBlur: L,
  value: D,
  helperText: j,
  showError: F = !0,
  className: A = "",
  inputClassName: M = "",
  labelClassName: c = "",
  errorClassName: h = "",
  containerClassName: k = ""
}) => {
  const b = _(), [P, z] = R(!1), T = b.values[e] || "", m = b.errors[e], u = b.touched[e];
  Z(() => {
    D !== void 0 && b.values[e] === void 0 && b.setFieldValue(e, D);
  }, [D, e, b]);
  const f = B(
    (a) => {
      let $ = "";
      if (y && (!a || a.trim() === ""))
        $ = "This field is required";
      else if (s && a) {
        const W = le(a, s);
        W.isValid || ($ = W.error || "Invalid input");
      }
      return b.setFieldError(e, $), !$;
    },
    [e, y, s, b]
  ), N = J(
    () => ce((a) => {
      b.touched[e] && f(a);
    }, 300),
    [e, f, b.touched]
  ), q = B(
    (a) => {
      const $ = a.target.value;
      b.setFieldValue(e, $), V == null || V($), u && m && b.setFieldError(e, ""), N($);
    },
    [e, b, V, N, u, m]
  ), E = B(() => {
    z(!1), b.setFieldTouched(e, !0), f(T), L == null || L();
  }, [e, b, L, f, T]), g = B(() => {
    z(!0);
  }, []), w = T && T.length > 0 && !m && u, x = s == null ? void 0 : s.maxLength;
  return /* @__PURE__ */ d("div", { className: `form-field-container ${k}`, children: [
    t && /* @__PURE__ */ d("div", { className: "form-label-wrapper", children: [
      /* @__PURE__ */ r(
        "label",
        {
          className: `form-label ${P ? "focused" : ""} ${c}`,
          htmlFor: e,
          children: t
        }
      ),
      y && /* @__PURE__ */ r("span", { className: "form-required-badge", title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ d("div", { className: "form-input-wrapper", children: [
      /* @__PURE__ */ r(
        "input",
        {
          id: e,
          type: i,
          name: e,
          placeholder: o,
          value: T,
          onChange: q,
          onBlur: E,
          onFocus: g,
          disabled: n,
          maxLength: x,
          "aria-invalid": !!(m && u),
          "aria-describedby": m && u ? `${e}-error` : void 0,
          className: `form-input ${m && u ? "error" : ""} ${A} ${M}`
        }
      ),
      /* @__PURE__ */ d("div", { className: "form-icon-container", children: [
        w && /* @__PURE__ */ r(
          "svg",
          {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "3",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: `form-check-icon ${w ? "visible" : ""}`,
            children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" })
          }
        ),
        m && u && !w && /* @__PURE__ */ r(
          "svg",
          {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            className: `form-error-icon ${m && u && !w ? "visible" : ""}`,
            children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" })
          }
        )
      ] })
    ] }),
    x && P && /* @__PURE__ */ d("div", { className: `form-character-count ${P ? "focused" : ""}`, children: [
      T.length,
      " / ",
      x
    ] }),
    F && m && u && /* @__PURE__ */ d(
      "div",
      {
        id: `${e}-error`,
        role: "alert",
        className: `form-error-text ${h}`,
        children: [
          /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
          /* @__PURE__ */ r("span", { children: m })
        ]
      }
    ),
    j && !(m && u) && /* @__PURE__ */ r("div", { className: "form-helper-text", children: j })
  ] });
}, De = ({
  name: e,
  label: t,
  placeholder: o = "Enter password",
  required: i = !1,
  disabled: s = !1,
  minStrength: n,
  showStrengthMeter: y = !1,
  matchField: V,
  onChange: L,
  onValidation: D,
  className: j = "",
  containerClassName: F = "",
  labelClassName: A = "",
  errorClassName: M = "",
  inputClassName: c = "",
  helperText: h
}) => {
  const k = _(), [b, P] = R(!1), [z, T] = R(!1), m = k.values[e] || "", u = k.errors[e], f = k.touched[e], q = m && m.length > 0 && !u && f, E = J(() => {
    if (!m) return 0;
    let l = 0;
    return m.length >= 8 && l++, /[A-Z]/.test(m) && l++, /[a-z]/.test(m) && l++, /\d/.test(m) && l++, /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(m) && l++, l;
  }, [m]), g = J(() => E === 0 ? "Very Weak" : E === 1 ? "Weak" : E === 2 ? "Fair" : E === 3 ? "Good" : E === 4 ? "Strong" : "Very Strong", [E]), p = J(() => E <= 1 ? "weak" : E === 2 ? "fair" : E === 3 ? "good" : "strong", [E]), w = J(() => E <= 1 ? "😟" : E === 2 ? "😐" : E === 3 ? "🙂" : E === 4 ? "😊" : "🔐", [E]), x = B(async () => {
    const l = k.values[e] || "";
    let C = "";
    if (i && !l)
      C = "This field is required";
    else if (n && l) {
      const H = { weak: 1, fair: 2, good: 3, strong: 4, "very-strong": 5 };
      let K = 0;
      l.length >= 8 && K++, /[A-Z]/.test(l) && K++, /[a-z]/.test(l) && K++, /\d/.test(l) && K++, /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(l) && K++, K < H[n] && (C = `Password must be at least ${n}`);
    }
    if (!C && V && l) {
      const H = k.values[V];
      H && l !== H && (C = "Passwords do not match");
    }
    return k.setFieldError(e, C), D == null || D(!C, C), !C;
  }, [e, i, n, V, k, D]);
  Z(() => (k.registerField(e, x), () => {
    k.unregisterField(e);
  }), [e, x, k]), Z(() => {
    if (V && f) {
      const l = k.values[V];
      m && l !== void 0 && x();
    }
  }, [V ? k.values[V] : null]);
  const a = (l) => {
    const C = l.target.value;
    k.setFieldValue(e, C), L == null || L(C), f && u && k.setFieldError(e, "");
  }, $ = () => {
    T(!1), k.setFieldTouched(e, !0), x();
  }, W = () => {
    T(!0);
  }, I = J(() => [
    { label: "At least 8 characters", met: m.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(m) },
    { label: "Lowercase letter", met: /[a-z]/.test(m) },
    { label: "Number", met: /\d/.test(m) },
    { label: "Special character", met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(m) }
  ], [m]);
  return /* @__PURE__ */ d("div", { className: `form-field-container ${F}`, children: [
    t && /* @__PURE__ */ d("div", { className: "form-label-wrapper", children: [
      /* @__PURE__ */ r(
        "label",
        {
          className: `form-label ${z ? "focused" : ""} ${A}`,
          htmlFor: e,
          children: t
        }
      ),
      i && /* @__PURE__ */ r("span", { className: "form-required-badge", title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ d("div", { className: "form-input-wrapper", children: [
      /* @__PURE__ */ r(
        "input",
        {
          id: e,
          type: b ? "text" : "password",
          name: e,
          value: m,
          onChange: a,
          onFocus: W,
          onBlur: $,
          placeholder: o,
          disabled: s,
          "aria-invalid": !!(u && f),
          "aria-describedby": u && f ? `${e}-error` : void 0,
          className: `form-input password-input ${u && f ? "error" : ""} ${j} ${c}`
        }
      ),
      /* @__PURE__ */ d("div", { className: "form-icon-container password-icon", children: [
        q && /* @__PURE__ */ r(
          "svg",
          {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "3",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: `form-check-icon ${q ? "visible" : ""}`,
            children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" })
          }
        ),
        u && f && !q && /* @__PURE__ */ r(
          "svg",
          {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            className: `form-error-icon ${u && f && !q ? "visible" : ""}`,
            children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" })
          }
        )
      ] }),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => P(!b),
          className: "form-password-toggle",
          tabIndex: -1,
          "aria-label": b ? "Hide password" : "Show password",
          children: b ? /* @__PURE__ */ d("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ r("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }),
            /* @__PURE__ */ r("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
          ] }) : /* @__PURE__ */ d("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ r("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
            /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "3" })
          ] })
        }
      )
    ] }),
    y && m && /* @__PURE__ */ d("div", { className: "form-strength-meter", children: [
      /* @__PURE__ */ d("div", { className: "form-strength-bar-container", children: [
        /* @__PURE__ */ r("div", { className: "form-strength-segment", children: [0, 1, 2, 3, 4].map((l) => /* @__PURE__ */ r(
          "div",
          {
            className: `form-strength-segment-item ${l < E ? "active" : ""} ${l < E ? p : ""}`,
            style: { animationDelay: `${l * 0.1}s` }
          },
          l
        )) }),
        /* @__PURE__ */ d("div", { className: `form-strength-label ${p}`, children: [
          /* @__PURE__ */ r("span", { className: "form-strength-emoji", children: w }),
          g
        ] })
      ] }),
      z && /* @__PURE__ */ r("div", { className: "form-requirements", children: I.map((l, C) => /* @__PURE__ */ d("div", { className: `form-requirement-item ${l.met ? "met" : ""}`, children: [
        /* @__PURE__ */ r("span", { className: `form-requirement-icon ${l.met ? "met" : ""}`, children: l.met ? "✓" : "○" }),
        l.label
      ] }, C)) })
    ] }),
    u && f && /* @__PURE__ */ d(
      "div",
      {
        id: `${e}-error`,
        role: "alert",
        className: `form-error-text ${M}`,
        children: [
          /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
          /* @__PURE__ */ r("span", { children: u })
        ]
      }
    ),
    h && !(u && f) && /* @__PURE__ */ r("div", { className: "form-helper-text", children: h })
  ] });
}, Le = ({
  name: e,
  label: t,
  value: o,
  checked: i,
  onChange: s,
  disabled: n = !1,
  required: y = !1,
  className: V = "",
  containerClassName: L = "",
  labelClassName: D = "",
  errorClassName: j = ""
}) => {
  const F = _(), A = F.values[e], M = i !== void 0 ? i : A, c = F.errors[e], h = F.touched[e], [k, b] = R(!1), [P, z] = R(!1), T = B(
    (f) => {
      const N = f.target.checked;
      F.setFieldValue(e, N), F.setFieldTouched(e, !0), s == null || s(N);
    },
    [e, F, s]
  ), m = `
    form-checkbox-input
    ${M ? "form-checkbox-checked" : ""}
    ${c && h ? "form-checkbox-error" : ""}
    ${P ? "form-checkbox-focused" : ""}
    ${k ? "form-checkbox-hovered" : ""}
    ${n ? "form-checkbox-disabled" : ""}
    ${V}
  `.trim().replace(/\s+/g, " "), u = `
    form-checkbox-container
    ${n ? "form-checkbox-container-disabled" : ""}
    ${L}
  `.trim().replace(/\s+/g, " ");
  return /* @__PURE__ */ d("div", { className: "form-checkbox-wrapper", children: [
    /* @__PURE__ */ d(
      "div",
      {
        className: u,
        onMouseEnter: () => !n && b(!0),
        onMouseLeave: () => b(!1),
        children: [
          /* @__PURE__ */ d("div", { className: "form-checkbox-box-wrapper", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                name: e,
                id: e,
                value: o,
                checked: M || !1,
                disabled: n,
                onChange: T,
                onFocus: () => z(!0),
                onBlur: () => z(!1),
                className: m,
                "aria-invalid": !!(c && h),
                "aria-describedby": c && h ? `${e}-error` : void 0
              }
            ),
            /* @__PURE__ */ r(
              "svg",
              {
                className: `form-checkbox-checkmark ${M ? "form-checkbox-checkmark-visible" : ""}`,
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
          t && /* @__PURE__ */ d(
            "label",
            {
              htmlFor: e,
              className: `form-checkbox-label ${D}`,
              children: [
                t,
                y && /* @__PURE__ */ r("span", { className: "form-checkbox-required-mark", children: "*" })
              ]
            }
          )
        ]
      }
    ),
    c && h && /* @__PURE__ */ d(
      "div",
      {
        id: `${e}-error`,
        role: "alert",
        className: `form-checkbox-error-text ${j}`,
        children: [
          /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
          /* @__PURE__ */ r("span", { children: c })
        ]
      }
    )
  ] });
}, je = ({
  name: e,
  options: t,
  label: o,
  onChange: i,
  disabled: s = !1,
  required: n = !1,
  direction: y = "vertical",
  helperText: V,
  className: L = "",
  containerClassName: D = "",
  labelClassName: j = "",
  errorClassName: F = "",
  style: A,
  containerStyle: M,
  labelStyle: c
}) => {
  var p, w, x;
  const h = (() => {
    try {
      return _();
    } catch {
      return null;
    }
  })(), [k, b] = R(""), P = ((p = h == null ? void 0 : h.values) == null ? void 0 : p[e]) ?? k, z = (w = h == null ? void 0 : h.errors) == null ? void 0 : w[e], T = (x = h == null ? void 0 : h.touched) == null ? void 0 : x[e], [m, u] = R(!1), f = z && (T || m), N = B(async () => {
    if (!h) return !0;
    const a = h.values[e];
    let $ = "";
    return n && !a && ($ = "This field is required"), h.setFieldError(e, $), !$;
  }, [h, e, n]);
  Z(() => {
    if (h)
      return h.registerField(e, N), () => h.unregisterField(e);
  }, [h, e, N]);
  const q = B(
    (a) => {
      var $, W;
      h ? (h.setFieldValue(e, a), h.setFieldTouched(e, !0)) : b(a), u(!0), i == null || i(a), ($ = h == null ? void 0 : h.touched) != null && $[e] && ((W = h == null ? void 0 : h.errors) != null && W[e]) && h.setFieldError(e, "");
    },
    [h, e, i]
  ), E = [
    "form-radio-group",
    y === "vertical" ? "form-radio-group-vertical" : "form-radio-group-horizontal",
    f && "form-radio-error",
    L
  ].filter(Boolean).join(" "), g = [
    "form-label",
    j
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ d(
    "div",
    {
      className: `form-radio-container ${D}`,
      style: M,
      children: [
        o && /* @__PURE__ */ d("div", { className: "form-label-wrapper", children: [
          /* @__PURE__ */ r("label", { className: g, style: c, children: o }),
          n && /* @__PURE__ */ r("span", { className: "form-required-badge", title: "Required field", children: "*" })
        ] }),
        /* @__PURE__ */ r(
          "div",
          {
            role: "radiogroup",
            "aria-label": o,
            "aria-required": n,
            "aria-invalid": !!f,
            className: E,
            style: A,
            children: t.map((a) => {
              const $ = P === a.value, W = s || a.disabled, I = [
                "form-radio-option",
                W && "form-radio-disabled"
              ].filter(Boolean).join(" "), l = [
                "form-radio-circle",
                $ && "form-radio-selected"
              ].filter(Boolean).join(" "), C = [
                "form-radio-dot",
                $ && "form-radio-selected"
              ].filter(Boolean).join(" ");
              return /* @__PURE__ */ d(
                "label",
                {
                  htmlFor: `${e}-${a.value}`,
                  className: I,
                  children: [
                    /* @__PURE__ */ r("div", { className: l, children: /* @__PURE__ */ r("div", { className: C }) }),
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "radio",
                        id: `${e}-${a.value}`,
                        name: e,
                        value: a.value,
                        checked: $,
                        disabled: W,
                        onChange: () => !W && q(a.value),
                        className: "form-radio-input"
                      }
                    ),
                    /* @__PURE__ */ r("span", { className: "form-radio-text", children: a.label })
                  ]
                },
                a.value
              );
            })
          }
        ),
        f && /* @__PURE__ */ d("div", { role: "alert", className: `form-error-text ${F}`, children: [
          /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
          /* @__PURE__ */ r("span", { children: z })
        ] }),
        V && !f && /* @__PURE__ */ r("span", { className: "form-helper-text", children: V })
      ]
    }
  );
}, Ae = ({
  type: e = "button",
  children: t,
  label: o,
  onClick: i,
  disabled: s = !1,
  loading: n = !1,
  variant: y = "primary",
  fullWidth: V = !1,
  size: L = "medium",
  enableThrottle: D,
  throttleDelay: j,
  showErrorSummary: F = !0,
  showSuccessModal: A = !0,
  successMessage: M = "Form submitted successfully!",
  onSuccess: c,
  submissionDelay: h = 2e3,
  className: k = "",
  containerClassName: b = ""
}) => {
  const P = (() => {
    try {
      return _();
    } catch {
      return null;
    }
  })(), z = e === "submit", [T, m] = R(!1), [u, f] = R([]), [N, q] = R(!1), [E, g] = R(!1), p = D ?? z, w = j ?? (z ? 1e3 : 300), x = Q(0), a = n || T, $ = B(
    async (I) => {
      var l;
      if (!(s || a)) {
        if (p) {
          const C = Date.now();
          if (C - x.current < w) {
            I.preventDefault(), I.stopPropagation(), console.log("⏱ Please wait before clicking again.");
            return;
          }
          x.current = C;
        }
        if (z && P) {
          I.preventDefault(), q(!1), f([]);
          try {
            if (!await P.validateForm()) {
              if (F) {
                const H = Object.entries(P.errors).filter(([K, G]) => G).map(([K, G]) => `${K}: ${G}`);
                f(H), q(!0);
              }
              return;
            }
            m(!0), await new Promise((H) => setTimeout(H, h)), await ((l = P.submitForm) == null ? void 0 : l.call(P)), m(!1), A && g(!0), c == null || c();
          } catch (C) {
            console.error("Form submission error:", C), m(!1), f(["An unexpected error occurred during submission."]), q(!0);
          }
        } else
          i == null || i();
      }
    },
    [
      s,
      a,
      p,
      w,
      z,
      P,
      h,
      F,
      A,
      c,
      i
    ]
  ), W = `
    form-button
    form-button-${y}
    form-button-${L}
    ${V ? "form-button-full-width" : ""}
    ${a ? "form-button-loading" : ""}
    ${s ? "form-button-disabled" : ""}
    ${k}
  `.trim().replace(/\s+/g, " ");
  return /* @__PURE__ */ d("div", { className: `form-button-container ${b}`, children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: e,
        onClick: $,
        disabled: s || a,
        className: W,
        children: a ? /* @__PURE__ */ d(ne, { children: [
          /* @__PURE__ */ r("div", { className: "form-button-spinner" }),
          /* @__PURE__ */ r("span", { children: "Processing..." })
        ] }) : t || o
      }
    ),
    F && N && u.length > 0 && /* @__PURE__ */ d("div", { className: "form-button-error-summary", children: [
      /* @__PURE__ */ r("strong", { children: "⚠️ Please fix the following errors:" }),
      /* @__PURE__ */ r("ul", { children: u.map((I, l) => /* @__PURE__ */ r("li", { children: I }, l)) })
    ] }),
    E && /* @__PURE__ */ r(
      "div",
      {
        className: "form-button-modal-overlay",
        onClick: () => g(!1),
        children: /* @__PURE__ */ d(
          "div",
          {
            className: "form-button-modal-content",
            onClick: (I) => I.stopPropagation(),
            children: [
              /* @__PURE__ */ r("div", { className: "form-button-modal-icon", children: /* @__PURE__ */ r("span", { children: "✓" }) }),
              /* @__PURE__ */ r("h2", { className: "form-button-modal-title", children: "Success!" }),
              /* @__PURE__ */ r("p", { className: "form-button-modal-message", children: M }),
              /* @__PURE__ */ r(
                "button",
                {
                  className: "form-button form-button-primary form-button-medium",
                  onClick: (I) => {
                    I.stopPropagation(), setTimeout(() => g(!1), 150);
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
}, Me = ({
  name: e,
  options: t,
  label: o,
  placeholder: i = "Select an option",
  onChange: s,
  disabled: n = !1,
  required: y = !1,
  value: V,
  helperText: L,
  className: D = "",
  containerClassName: j = "",
  labelClassName: F = "",
  errorClassName: A = "",
  inputClassName: M = ""
}) => {
  const c = _(), [h, k] = R(!1), [b, P] = R(!1), [z, T] = R(!1), m = Q(null), u = c.values[e] || "", f = c.errors[e], N = c.touched[e], E = u && u.length > 0 && !f && N, g = t.find((l) => l.value === u);
  Z(() => {
    V !== void 0 && c.values[e] === void 0 && c.setFieldValue(e, V);
  }, [V, e, c]), Z(() => {
    const l = (C) => {
      m.current && !m.current.contains(C.target) && (T(!1), k(!1));
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, []);
  const p = B(async () => {
    const l = c.values[e] || "";
    let C = "";
    return y && !l && (C = "This field is required"), c.setFieldError(e, C), !C;
  }, [e, y, c]);
  Z(() => (c.registerField(e, p), () => {
    c.unregisterField(e);
  }), [e, p, c]);
  const w = B((l) => {
    n || (c.setFieldValue(e, l), s == null || s(l), c.setFieldTouched(e, !0), f && c.setFieldError(e, ""), T(!1), k(!1));
  }, [e, c, s, f, n]), x = B(() => {
    n || (T(!z), k(!z));
  }, [n, z]), a = B(() => {
    z || (k(!1), c.setFieldTouched(e, !0), p());
  }, [e, c, p, z]), $ = [
    "form-select-box",
    h && "form-select-focused",
    f && N && "form-select-error",
    n && "form-select-disabled",
    !u && "form-select-placeholder",
    E && !z && "form-select-valid",
    D,
    M
  ].filter(Boolean).join(" "), W = [
    "form-select-label",
    h && "form-select-focused",
    F
  ].filter(Boolean).join(" "), I = [
    "form-select-arrow",
    h && "form-select-focused",
    z && "form-select-open"
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ d(
    "div",
    {
      ref: m,
      className: `form-select-container ${j}`,
      children: [
        o && /* @__PURE__ */ d("div", { className: "form-select-label-wrapper", children: [
          /* @__PURE__ */ r("label", { className: W, htmlFor: e, children: o }),
          y && /* @__PURE__ */ r("span", { className: "form-select-required-badge", title: "Required field", children: "*" })
        ] }),
        /* @__PURE__ */ d("div", { className: "form-select-wrapper", children: [
          /* @__PURE__ */ d(
            "div",
            {
              className: $,
              onClick: x,
              onBlur: a,
              onMouseEnter: () => P(!0),
              onMouseLeave: () => P(!1),
              tabIndex: n ? -1 : 0,
              onKeyDown: (l) => {
                (l.key === "Enter" || l.key === " ") && (l.preventDefault(), x());
              },
              "aria-invalid": !!(f && N),
              "aria-describedby": f && N ? `${e}-error` : void 0,
              children: [
                /* @__PURE__ */ r("span", { children: g ? g.label : i }),
                /* @__PURE__ */ r("span", { className: I, children: "▼" })
              ]
            }
          ),
          !z && /* @__PURE__ */ d("div", { className: "form-select-icon-container", children: [
            E && /* @__PURE__ */ r(
              "svg",
              {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "3",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: `form-select-check-icon ${E ? "form-select-visible" : ""}`,
                children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" })
              }
            ),
            f && N && !E && /* @__PURE__ */ r(
              "svg",
              {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "currentColor",
                className: `form-select-error-icon ${f && N ? "form-select-visible" : ""}`,
                children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" })
              }
            )
          ] }),
          z && /* @__PURE__ */ r("div", { className: "form-select-dropdown", children: t.length === 0 ? /* @__PURE__ */ r("div", { className: "form-select-option form-select-no-options", children: "No options available" }) : t.map((l) => {
            const C = u === l.value;
            return /* @__PURE__ */ d(
              "div",
              {
                className: `form-select-option ${C ? "form-select-option-selected" : ""}`,
                onClick: (H) => {
                  H.stopPropagation(), w(l.value);
                },
                children: [
                  l.label,
                  C && /* @__PURE__ */ r(
                    "svg",
                    {
                      className: "form-select-option-checkmark",
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
              l.value
            );
          }) })
        ] }),
        f && N && /* @__PURE__ */ d(
          "div",
          {
            id: `${e}-error`,
            role: "alert",
            className: `form-select-error-text ${A}`,
            children: [
              /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
              /* @__PURE__ */ r("span", { children: f })
            ]
          }
        ),
        L && !(f && N) && /* @__PURE__ */ r("div", { className: "form-select-helper-text", children: L })
      ]
    }
  );
}, Ie = ({
  name: e,
  label: t,
  placeholder: o = "Enter a number",
  min: i,
  max: s,
  step: n = 1,
  required: y = !1,
  disabled: V = !1,
  error: L,
  onChange: D,
  onBlur: j,
  className: F = "",
  helperText: A
}) => {
  const [M, c] = R(""), [h, k] = R(!1), [b, P] = R(""), z = B(
    (f) => {
      const N = f === "" ? null : parseFloat(f);
      if (N !== null) {
        if (i !== void 0 && N < i) {
          P(`Must be at least ${i}`);
          return;
        }
        if (s !== void 0 && N > s) {
          P(`Must be at most ${s}`);
          return;
        }
      }
      P(""), D == null || D(N);
    },
    [i, s, D]
  ), T = (f) => {
    const N = f.target.value;
    (N === "" || N === "-" || !isNaN(parseFloat(N))) && (c(N), z(N));
  }, m = () => {
    k(!1), M === "-" && (c(""), P("")), j == null || j();
  }, u = L || b;
  return /* @__PURE__ */ d("div", { style: { marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }, className: F, children: [
    t && /* @__PURE__ */ d(
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
          t,
          y && /* @__PURE__ */ r("span", { style: { color: "#ef4444" }, children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ r(
      "input",
      {
        type: "number",
        name: e,
        value: M,
        onChange: T,
        onFocus: () => k(!0),
        onBlur: m,
        placeholder: o,
        min: i,
        max: s,
        step: n,
        disabled: V,
        required: y,
        style: {
          padding: "10px 12px",
          fontSize: "14px",
          border: `1px solid ${u ? "#ef4444" : h ? "#000000" : "#e5e7eb"}`,
          borderRadius: "6px",
          backgroundColor: V ? "#f3f4f6" : "#ffffff",
          color: "#1f2937",
          transition: "all 0.2s ease",
          outline: "none",
          width: "100%",
          boxSizing: "border-box"
        }
      }
    ),
    u && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#ef4444" }, children: u }),
    A && !u && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#6b7280" }, children: A })
  ] });
}, Se = ({
  name: e,
  label: t,
  placeholder: o = "Select a date",
  min: i,
  max: s,
  minAge: n,
  maxAge: y,
  required: V = !1,
  disabled: L = !1,
  onChange: D,
  onBlur: j,
  className: F = "",
  containerClassName: A = "",
  labelClassName: M = "",
  errorClassName: c = "",
  inputClassName: h = "",
  helperText: k
}) => {
  const b = _(), [P, z] = R(!1), T = b.values[e] || "", m = b.errors[e], u = b.touched[e], N = T && T.length > 0 && !m && u, q = (a) => {
    const $ = new Date(a), W = /* @__PURE__ */ new Date();
    let I = W.getFullYear() - $.getFullYear();
    const l = W.getMonth() - $.getMonth();
    return (l < 0 || l === 0 && W.getDate() < $.getDate()) && I--, I;
  }, E = B(async () => {
    const a = b.values[e] || "";
    let $ = "";
    if (V && !a)
      $ = "This field is required";
    else if (a) {
      const W = new Date(a);
      i && W < new Date(i) ? $ = `Date must be after ${i}` : s && W > new Date(s) ? $ = `Date must be before ${s}` : n !== void 0 ? q(a) < n && ($ = `You must be at least ${n} years old`) : y !== void 0 && q(a) > y && ($ = `Age cannot exceed ${y} years`);
    }
    return b.setFieldError(e, $), !$;
  }, [e, V, i, s, n, y, b]);
  Z(() => (b.registerField(e, E), () => {
    b.unregisterField(e);
  }), [e, E, b]);
  const g = (a) => {
    const $ = a.target.value;
    b.setFieldValue(e, $), D == null || D($), u && m && b.setFieldError(e, "");
  }, p = () => {
    z(!1), b.setFieldTouched(e, !0), E(), j == null || j();
  }, w = () => {
    z(!0);
  }, x = `
    form-input
    form-date-input
    ${m && u ? "error" : ""}
    ${F}
    ${h}
  `.trim().replace(/\s+/g, " ");
  return /* @__PURE__ */ d("div", { className: `form-field-container ${A}`, children: [
    t && /* @__PURE__ */ d("div", { className: "form-label-wrapper", children: [
      /* @__PURE__ */ r(
        "label",
        {
          className: `form-label ${P ? "focused" : ""} ${M}`,
          htmlFor: e,
          children: t
        }
      ),
      V && /* @__PURE__ */ r("span", { className: "form-required-badge", title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ d("div", { className: "form-input-wrapper", children: [
      /* @__PURE__ */ r(
        "input",
        {
          id: e,
          type: "date",
          name: e,
          value: T,
          onChange: g,
          onFocus: w,
          onBlur: p,
          placeholder: o,
          min: i,
          max: s,
          disabled: L,
          "aria-invalid": !!(m && u),
          "aria-describedby": m && u ? `${e}-error` : void 0,
          className: x
        }
      ),
      /* @__PURE__ */ d("div", { className: "form-icon-container", children: [
        N && /* @__PURE__ */ r(
          "svg",
          {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "3",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: `form-check-icon ${N ? "visible" : ""}`,
            children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" })
          }
        ),
        m && u && !N && /* @__PURE__ */ r(
          "svg",
          {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            className: `form-error-icon ${m && u && !N ? "visible" : ""}`,
            children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" })
          }
        )
      ] })
    ] }),
    m && u && /* @__PURE__ */ d(
      "div",
      {
        id: `${e}-error`,
        role: "alert",
        className: `form-error-text ${c}`,
        children: [
          /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
          /* @__PURE__ */ r("span", { children: m })
        ]
      }
    ),
    k && !(m && u) && /* @__PURE__ */ r("div", { className: "form-helper-text", children: k })
  ] });
}, Re = ({
  name: e,
  label: t,
  accept: o,
  multiple: i = !1,
  maxSize: s = 5242880,
  // 5MB default
  required: n = !1,
  disabled: y = !1,
  helperText: V,
  className: L = "",
  containerClassName: D = "",
  labelClassName: j = "",
  errorClassName: F = "",
  showPreview: A = !0
}) => {
  const {
    values: M,
    errors: c,
    touched: h,
    setFieldValue: k,
    setFieldError: b,
    setFieldTouched: P,
    registerField: z,
    unregisterField: T
  } = _(), [m, u] = R(!1), [f, N] = R(!1), [q, E] = R(0), g = Q(!1), p = M[e], w = c[e], x = h[e], a = B(async () => {
    const v = M[e];
    let S = "";
    return n && (!v || Array.isArray(v) && v.length === 0) && (S = "Please upload at least one file"), b(e, S), !S;
  }, [M, e, n, b]);
  Z(() => (z(e, a), () => T(e)), [e, z, T, a]);
  const $ = B(async (v) => new Promise((S) => {
    N(!0), E(0), g.current = !0;
    const O = 2e3, U = 100, ee = O / U;
    let Y = 0;
    const ie = setInterval(() => {
      Y++, E(Y), Y >= U && (clearInterval(ie), N(!1), g.current = !1, S());
    }, ee);
  }), []), W = B((v) => {
    var S;
    if (!v || v.length === 0)
      return null;
    if (g.current)
      return "Please wait for the current upload to complete";
    if (!i && v.length > 1)
      return "Only one file is allowed";
    for (let O = 0; O < v.length; O++)
      if (s && v[O].size > s)
        return `File "${v[O].name}" exceeds ${(s / 1024 / 1024).toFixed(1)}MB limit`;
    if (o) {
      const O = o.split(",").map((U) => U.trim());
      for (let U = 0; U < v.length; U++) {
        const ee = "." + ((S = v[U].name.split(".").pop()) == null ? void 0 : S.toLowerCase()), Y = v[U].type;
        if (!O.some((oe) => oe.startsWith(".") ? ee === oe.toLowerCase() : Y.match(new RegExp(oe.replace("*", ".*")))))
          return `File "${v[U].name}" type is not allowed`;
      }
    }
    return null;
  }, [i, s, o]), I = B(async (v) => {
    if (!v || v.length === 0) return;
    P(e, !0);
    const S = W(v);
    if (S) {
      b(e, S);
      return;
    }
    b(e, "");
    const O = Array.from(v);
    if (await $(O), i) {
      const U = Array.isArray(p) ? p : [], ee = O.map((Y) => ({
        name: Y.name,
        size: Y.size,
        type: Y.type,
        file: Y
      }));
      k(e, [...U, ...ee]);
    } else {
      const U = {
        name: O[0].name,
        size: O[0].size,
        type: O[0].type,
        file: O[0]
      };
      k(e, U);
    }
  }, [e, W, k, b, P, $, i, p]), l = B((v) => {
    I(v.target.files), v.target.value = "";
  }, [I]), C = B((v) => {
    v.preventDefault(), u(!1), I(v.dataTransfer.files);
  }, [I]), H = B((v) => {
    v.preventDefault(), !y && !f && u(!0);
  }, [y, f]), K = B(() => {
    u(!1);
  }, []), G = B((v) => {
    if (i && Array.isArray(p)) {
      const S = p.filter((O, U) => U !== v);
      k(e, S.length > 0 ? S : null);
    } else
      k(e, null);
    P(e, !0);
  }, [i, p, e, k, P]), X = x && w, re = i ? Array.isArray(p) ? p : [] : p ? [p] : [], te = `
    form-file-dropzone
    ${m ? "form-file-dropzone-dragover" : ""}
    ${f ? "form-file-dropzone-uploading" : ""}
    ${X ? "form-file-dropzone-error" : ""}
    ${y ? "form-file-dropzone-disabled" : ""}
    ${L}
  `.trim().replace(/\s+/g, " "), se = (v) => v < 1024 ? v + " B" : v < 1024 * 1024 ? (v / 1024).toFixed(1) + " KB" : (v / (1024 * 1024)).toFixed(1) + " MB";
  return /* @__PURE__ */ d("div", { className: `form-field-container ${D}`, children: [
    t && /* @__PURE__ */ d("div", { className: "form-label-wrapper", children: [
      /* @__PURE__ */ r("label", { className: `form-label ${j}`, children: t }),
      n && /* @__PURE__ */ r("span", { className: "form-required-badge", title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ d(
      "div",
      {
        className: te,
        onDragOver: H,
        onDragLeave: K,
        onDrop: C,
        children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "file",
              name: e,
              onChange: l,
              accept: o,
              multiple: i,
              disabled: y || f,
              className: "form-file-input",
              id: `file-input-${e}`
            }
          ),
          /* @__PURE__ */ d("label", { htmlFor: `file-input-${e}`, className: "form-file-dropzone-label", children: [
            /* @__PURE__ */ r("div", { className: "form-file-dropzone-text", children: f ? "Uploading..." : "Drag and drop files here or click to select" }),
            s && /* @__PURE__ */ d("div", { className: "form-file-size-text", children: [
              "Max file size: ",
              (s / 1024 / 1024).toFixed(1),
              "MB"
            ] })
          ] }),
          f && /* @__PURE__ */ d("div", { className: "form-file-progress-container", children: [
            /* @__PURE__ */ r("div", { className: "form-file-progress-bar", children: /* @__PURE__ */ r(
              "div",
              {
                className: "form-file-progress-fill",
                style: { width: `${q}%` }
              }
            ) }),
            /* @__PURE__ */ d("div", { className: "form-file-progress-text", children: [
              "Uploading... ",
              q,
              "%"
            ] })
          ] })
        ]
      }
    ),
    A && re.length > 0 && /* @__PURE__ */ r("div", { className: "form-file-list", children: re.map((v, S) => /* @__PURE__ */ d("div", { className: "form-file-item", children: [
      /* @__PURE__ */ d("div", { className: "form-file-info", children: [
        /* @__PURE__ */ r("span", { className: "form-file-icon", children: "📄" }),
        /* @__PURE__ */ d("div", { className: "form-file-details", children: [
          /* @__PURE__ */ r("div", { className: "form-file-name", children: v.name }),
          /* @__PURE__ */ r("div", { className: "form-file-size", children: se(v.size) })
        ] })
      ] }),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => G(S),
          className: "form-file-remove-button",
          title: "Remove file",
          children: "×"
        }
      )
    ] }, S)) }),
    X && /* @__PURE__ */ d("div", { className: `form-error-text ${F}`, children: [
      /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
      /* @__PURE__ */ r("span", { children: w })
    ] }),
    V && !X && /* @__PURE__ */ r("div", { className: "form-helper-text", children: V })
  ] });
}, Oe = ({
  name: e,
  label: t,
  options: o,
  placeholder: i = "Select options",
  required: s = !1,
  disabled: n = !1,
  helperText: y,
  className: V = "",
  containerClassName: L = "",
  labelClassName: D = "",
  errorClassName: j = "",
  style: F,
  containerStyle: A,
  labelStyle: M,
  maxSelection: c
}) => {
  const {
    values: h,
    errors: k,
    touched: b,
    setFieldValue: P,
    setFieldError: z,
    setFieldTouched: T,
    registerField: m,
    unregisterField: u
  } = _(), [f, N] = R(!1), [q, E] = R(!1), [g, p] = R(!1), w = Q(null), x = h[e] || [], a = Array.isArray(x) ? x : [], $ = k[e], W = b[e], l = a.length > 0 && !$ && W, C = W && $, H = B(async () => {
    const v = h[e], S = Array.isArray(v) ? v : [];
    let O = "";
    return s && S.length === 0 && (O = "Please select at least one option"), c && S.length > c && (O = `You can select a maximum of ${c} option${c > 1 ? "s" : ""}`), z(e, O), !O;
  }, [h, e, s, c, z]);
  Z(() => (m(e, H), () => u(e)), [e, m, u, H]), Z(() => {
    const v = (S) => {
      w.current && !w.current.contains(S.target) && (N(!1), E(!1), a.length > 0 && T(e, !0));
    };
    return document.addEventListener("mousedown", v), () => document.removeEventListener("mousedown", v);
  }, [e, a.length, T]);
  const K = B((v) => {
    if (n) return;
    const S = a.includes(v);
    let O;
    if (S)
      O = a.filter((U) => U !== v);
    else {
      if (c && a.length >= c) {
        z(e, `You can only select up to ${c} option${c > 1 ? "s" : ""}`);
        return;
      }
      O = [...a, v];
    }
    P(e, O), T(e, !0), S && $ && z(e, "");
  }, [e, a, n, c, P, T, z, $]), G = B((v, S) => {
    if (S.stopPropagation(), n) return;
    const O = a.filter((U) => U !== v);
    P(e, O), T(e, !0), $ && z(e, "");
  }, [e, a, n, P, T, z, $]), X = B(() => {
    n || (N(!f), E(!f));
  }, [n, f]), re = [
    "form-multiselect-select",
    q && "form-multiselect-focused",
    C && "form-multiselect-error",
    n && "form-multiselect-disabled",
    V
  ].filter(Boolean).join(" "), te = [
    "form-label",
    q && "focused",
    D
  ].filter(Boolean).join(" "), se = [
    "form-multiselect-arrow",
    f && "form-multiselect-open"
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ d(
    "div",
    {
      ref: w,
      className: `form-multiselect-container ${L}`,
      style: A,
      children: [
        t && /* @__PURE__ */ d("div", { className: "form-label-wrapper", children: [
          /* @__PURE__ */ r("label", { className: te, style: M, children: t }),
          s && /* @__PURE__ */ r("span", { className: "form-required-badge", title: "Required field", children: "*" })
        ] }),
        /* @__PURE__ */ d("div", { className: "form-multiselect-wrapper", children: [
          /* @__PURE__ */ d(
            "div",
            {
              className: re,
              style: F,
              onClick: X,
              onMouseEnter: () => p(!0),
              onMouseLeave: () => p(!1),
              tabIndex: n ? -1 : 0,
              onKeyDown: (v) => {
                (v.key === "Enter" || v.key === " ") && (v.preventDefault(), X());
              },
              children: [
                /* @__PURE__ */ r("span", { className: a.length === 0 ? "form-multiselect-placeholder" : "form-multiselect-selected-text", children: a.length === 0 ? i : `${a.length} option${a.length > 1 ? "s" : ""} selected` }),
                /* @__PURE__ */ r("span", { className: se, children: "▼" })
              ]
            }
          ),
          !f && /* @__PURE__ */ d("div", { className: "form-icon-container", children: [
            l && /* @__PURE__ */ r(
              "svg",
              {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "3",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: `form-check-icon ${l ? "visible" : ""}`,
                children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" })
              }
            ),
            C && !l && /* @__PURE__ */ r(
              "svg",
              {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "currentColor",
                className: `form-error-icon ${C ? "visible" : ""}`,
                children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" })
              }
            )
          ] }),
          f && /* @__PURE__ */ r("div", { className: "form-multiselect-dropdown", children: o.length === 0 ? /* @__PURE__ */ r("div", { className: "form-multiselect-option form-multiselect-no-options", children: "No options available" }) : o.map((v) => {
            const S = a.includes(v.value), O = [
              "form-multiselect-option",
              S && "form-multiselect-option-selected"
            ].filter(Boolean).join(" ");
            return /* @__PURE__ */ d(
              "div",
              {
                className: O,
                onClick: (U) => {
                  U.stopPropagation(), K(v.value);
                },
                children: [
                  /* @__PURE__ */ r("div", { className: `form-multiselect-checkbox ${S ? "form-multiselect-checkbox-checked" : ""}`, children: S && /* @__PURE__ */ r("svg", { className: "form-multiselect-checkmark", viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ r("polyline", { points: "2 6 5 9 10 3", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                  v.label
                ]
              },
              v.value
            );
          }) })
        ] }),
        a.length > 0 && /* @__PURE__ */ r("div", { className: "form-multiselect-badges", children: a.map((v) => {
          const S = o.find((O) => O.value === v);
          return S ? /* @__PURE__ */ d("div", { className: "form-multiselect-badge", children: [
            S.label,
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: (O) => G(v, O),
                className: "form-multiselect-badge-button",
                title: "Remove",
                children: "×"
              }
            )
          ] }, v) : null;
        }) }),
        C && /* @__PURE__ */ d("div", { className: `form-error-text ${j}`, children: [
          /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
          /* @__PURE__ */ r("span", { children: $ })
        ] }),
        y && !C && /* @__PURE__ */ r("span", { className: "form-helper-text", children: y })
      ]
    }
  );
}, We = ({
  name: e,
  label: t,
  placeholder: o = "5550000000",
  countryCode: i = "+1",
  required: s = !1,
  disabled: n = !1,
  onChange: y,
  onBlur: V,
  className: L = "",
  containerClassName: D = "",
  labelClassName: j = "",
  errorClassName: F = "",
  inputClassName: A = "",
  helperText: M
}) => {
  const c = _(), [h, k] = R(i), [b, P] = R(!1), [z, T] = R(!1), m = c.values[e] || "", u = c.errors[e], f = c.touched[e], N = m.replace(/^\+\d+\s*/, ""), E = N && N.length > 0 && !u && f, g = B(async () => {
    const I = c.values[e] || "";
    let l = "";
    if (s && !I)
      l = "This field is required";
    else if (I) {
      const C = I.replace(/\D/g, "");
      C.length < 10 ? l = "Phone number must be at least 10 digits" : C.length > 15 && (l = "Phone number is too long");
    }
    return c.setFieldError(e, l), !l;
  }, [e, s, c]);
  Z(() => (c.registerField(e, g), () => {
    c.unregisterField(e);
  }), [e, g, c]);
  const p = (I) => {
    const C = I.target.value.replace(/[^\d\s\-()]/g, ""), H = `${h} ${C}`;
    c.setFieldValue(e, H), y == null || y(H), f && u && c.setFieldError(e, "");
  }, w = (I) => {
    let l = I.target.value;
    if (l ? l.startsWith("+") || (l = "+" + l) : l = "+", l = "+" + l.slice(1).replace(/\D/g, ""), k(l), N) {
      const C = `${l} ${N}`;
      c.setFieldValue(e, C), y == null || y(C);
    }
  }, x = () => {
    P(!1), c.setFieldTouched(e, !0), g(), V == null || V();
  }, a = () => {
    P(!0);
  }, $ = [
    "form-phone-input-wrapper",
    b && "form-phone-focused",
    u && f && "form-phone-error",
    n && "form-phone-disabled"
  ].filter(Boolean).join(" "), W = [
    "form-phone-label",
    b && "form-phone-focused",
    j
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ d("div", { className: `form-phone-container ${D}`, children: [
    t && /* @__PURE__ */ d("div", { className: "form-phone-label-wrapper", children: [
      /* @__PURE__ */ r("label", { className: W, htmlFor: e, children: t }),
      s && /* @__PURE__ */ r("span", { className: "form-phone-required-badge", title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ d(
      "div",
      {
        className: $,
        onMouseEnter: () => T(!0),
        onMouseLeave: () => T(!1),
        children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "text",
              value: h,
              onChange: w,
              onFocus: a,
              onBlur: x,
              disabled: n,
              className: `form-phone-country-code ${A}`,
              placeholder: "+1"
            }
          ),
          /* @__PURE__ */ r(
            "input",
            {
              id: e,
              type: "tel",
              name: e,
              value: N,
              onChange: p,
              onFocus: a,
              onBlur: x,
              placeholder: o,
              disabled: n,
              "aria-invalid": !!(u && f),
              "aria-describedby": u && f ? `${e}-error` : void 0,
              className: `form-phone-input ${L} ${A}`
            }
          ),
          /* @__PURE__ */ d("div", { className: "form-phone-icon-container", children: [
            E && /* @__PURE__ */ r(
              "svg",
              {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "3",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: `form-phone-check-icon ${E ? "form-phone-visible" : ""}`,
                children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" })
              }
            ),
            u && f && !E && /* @__PURE__ */ r(
              "svg",
              {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "currentColor",
                className: `form-phone-error-icon ${u && f ? "form-phone-visible" : ""}`,
                children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" })
              }
            )
          ] })
        ]
      }
    ),
    u && f && /* @__PURE__ */ d(
      "div",
      {
        id: `${e}-error`,
        role: "alert",
        className: `form-phone-error-text ${F}`,
        children: [
          /* @__PURE__ */ r("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ r("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
          /* @__PURE__ */ r("span", { children: u })
        ]
      }
    ),
    M && !(u && f) && /* @__PURE__ */ r("div", { className: "form-phone-helper-text", children: M })
  ] });
}, qe = ({
  children: e,
  title: t,
  description: o,
  spacing: i = "normal",
  highlight: s = !1,
  className: n = "",
  containerClassName: y = "",
  titleClassName: V = "",
  descriptionClassName: L = ""
}) => {
  const D = `
    form-group
    form-group-spacing-${i}
    ${s ? "form-group-highlight" : ""}
    ${y}
  `.trim().replace(/\s+/g, " ");
  return /* @__PURE__ */ d("div", { className: D, children: [
    (t || o) && /* @__PURE__ */ d("div", { className: "form-group-header", children: [
      t && /* @__PURE__ */ d(ne, { children: [
        /* @__PURE__ */ r("div", { className: `form-group-title ${V}`, children: t }),
        /* @__PURE__ */ r("div", { className: "form-group-underline" })
      ] }),
      o && /* @__PURE__ */ r("div", { className: `form-group-description ${L}`, children: o })
    ] }),
    /* @__PURE__ */ r("div", { className: `form-group-content ${n}`, children: e })
  ] });
}, Ue = ({ children: e, columns: t = 2, gap: o = "16px" }) => {
  const i = {
    container: {
      display: "grid",
      gridTemplateColumns: `repeat(${t}, 1fr)`,
      gap: o,
      marginBottom: o
    }
  };
  return /* @__PURE__ */ r("div", { style: i.container, children: e });
}, ze = {
  primaryColor: "#000000",
  errorColor: "#ef4444",
  successColor: "#22c55e",
  borderColor: "#e5e7eb",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  fontSize: "14px",
  borderRadius: "6px",
  spacing: "8px"
}, He = ({
  name: e,
  length: t = 6,
  label: o,
  required: i = !1,
  disabled: s = !1,
  onComplete: n,
  theme: y,
  helperText: V,
  className: L,
  style: D
}) => {
  var q, E;
  const j = { ...ze, ...y }, F = (() => {
    try {
      return _();
    } catch {
      return null;
    }
  })(), [A, M] = R(Array(t).fill("")), [c, h] = R(!1), k = Q([]), b = (q = F == null ? void 0 : F.errors) == null ? void 0 : q[e], z = (((E = F == null ? void 0 : F.touched) == null ? void 0 : E[e]) || c) && b, T = B(async () => {
    if (!F) return !0;
    const g = A.join("");
    let p = "";
    return i && g.length < t && (p = "Please enter complete OTP"), F.setFieldError(e, p), !p;
  }, [F, e, A, i, t]);
  Z(() => {
    if (F)
      return F.registerField(e, T), () => F.unregisterField(e);
  }, [F, e, T]), Z(() => {
    F && F.setFieldValue(e, A.join(""));
  }, [A, F, e]);
  const m = (g, p) => {
    var a;
    if (s || !/^[0-9a-zA-Z]?$/.test(p)) return;
    const w = [...A];
    w[g] = p, M(w), h(!0), F == null || F.setFieldTouched(e, !0), F == null || F.setFieldError(e, ""), p && g < t - 1 && ((a = k.current[g + 1]) == null || a.focus());
    const x = w.join("");
    x.length === t && (n == null || n(x));
  }, u = (g, p) => {
    var w;
    p.key === "Backspace" && !A[g] && g > 0 && ((w = k.current[g - 1]) == null || w.focus());
  }, f = (g) => {
    g.preventDefault();
    const w = g.clipboardData.getData("text").slice(0, t).split(""), x = Array(t).fill("").map((a, $) => w[$] ?? "");
    M(x), x.join("").length === t && (n == null || n(x.join("")));
  }, N = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginBottom: j.spacing,
      ...D
    },
    label: {
      fontSize: "14px",
      fontWeight: 600,
      color: j.textColor,
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    required: { color: j.errorColor },
    inputGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "10px"
    },
    box: {
      width: "42px",
      height: "48px",
      borderRadius: j.borderRadius,
      border: `2px solid ${z ? j.errorColor : j.borderColor}`,
      textAlign: "center",
      fontSize: "20px",
      fontWeight: 600,
      outline: "none",
      color: j.textColor,
      transition: "all 0.2s ease",
      backgroundColor: s ? "#f3f4f6" : "#fff"
    },
    errorText: {
      fontSize: "12px",
      color: j.errorColor,
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    helperText: {
      fontSize: "12px",
      color: "#6b7280"
    }
  };
  return /* @__PURE__ */ d("div", { style: N.container, className: L, children: [
    o && /* @__PURE__ */ d("label", { style: N.label, children: [
      o,
      i && /* @__PURE__ */ r("span", { style: N.required, children: "*" })
    ] }),
    /* @__PURE__ */ r("div", { style: N.inputGroup, onPaste: f, children: A.map((g, p) => /* @__PURE__ */ r(
      "input",
      {
        type: "text",
        inputMode: "numeric",
        maxLength: 1,
        value: g,
        disabled: s,
        onChange: (w) => m(p, w.target.value),
        onKeyDown: (w) => u(p, w),
        ref: (w) => k.current[p] = w,
        style: N.box
      },
      p
    )) }),
    z && /* @__PURE__ */ d("span", { style: N.errorText, children: [
      "⚠️ ",
      b
    ] }),
    V && !z && /* @__PURE__ */ r("span", { style: N.helperText, children: V })
  ] });
}, Ze = () => {
  const e = _();
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
}, _e = (e, t) => {
  const o = _(), i = e || "field", s = J(
    () => ce((y, V) => {
      if (!t) {
        V({ isValid: !0 });
        return;
      }
      const L = le(y, t);
      V(L);
    }, 300),
    [t]
  );
  return {
    validateField: B(
      (y) => {
        if (!t)
          return o.setFieldError(i, ""), { isValid: !0 };
        const V = le(y, t);
        return V.isValid ? o.setFieldError(i, "") : o.setFieldError(i, V.error || "Validation failed"), s(y, (L) => {
          L.isValid ? o.setFieldError(i, "") : o.setFieldError(i, L.error || "Validation failed");
        }), V;
      },
      [i, o, s, t]
    ),
    error: o.errors[i],
    isTouched: o.touched[i]
  };
};
function Ke(e, t) {
  let o = !1;
  return function(...s) {
    o || (e(...s), o = !0, setTimeout(() => {
      o = !1;
    }, t));
  };
}
String.prototype.includes || (String.prototype.includes = function(e, t) {
  return typeof t != "number" && (t = 0), this.indexOf(e, t) !== -1;
});
Array.prototype.find || (Array.prototype.find = function(e, t) {
  if (this == null)
    throw new TypeError("Array.prototype.find called on null or undefined");
  const o = Object(this), i = Number.parseInt(o.length, 10) || 0;
  if (i !== 0)
    for (let s = 0; s < i; s++) {
      const n = o[s];
      if (e.call(t, n, s, o))
        return n;
    }
});
typeof Object.assign != "function" && Object.defineProperty(Object, "assign", {
  value: function(t, ...o) {
    if (t == null)
      throw new TypeError("Cannot convert undefined or null to object");
    const i = Object(t);
    for (let s = 0; s < o.length; s++) {
      const n = o[s];
      if (n != null)
        for (const y in n)
          Object.prototype.hasOwnProperty.call(n, y) && (i[y] = n[y]);
    }
    return i;
  },
  writable: !0,
  configurable: !0
});
export {
  Ae as Button,
  Le as Checkbox,
  Se as DateField,
  Re as FileUpload,
  Pe as Form,
  qe as FormGroup,
  fe as FormProvider,
  Ue as FormRow,
  Oe as MultiSelect,
  Ie as NumberField,
  He as OtpInput,
  De as PasswordField,
  We as PhoneField,
  je as Radio,
  Me as Select,
  Be as TextField,
  ce as debounce,
  ze as defaultTheme,
  Ke as throttle,
  _e as useFieldValidation,
  Ze as useForm,
  _ as useFormContext,
  le as validate,
  ke as validateAlphanumeric,
  pe as validateEmail,
  xe as validateLength,
  we as validateName,
  $e as validateNumber,
  Ne as validatePassword,
  Te as validatePasswordMatch,
  ge as validatePhone,
  Fe as validateUrl
};
