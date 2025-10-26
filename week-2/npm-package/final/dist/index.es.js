import ge, { createContext as be, useState as O, useRef as oe, useCallback as L, useContext as me, useEffect as J, useMemo as te } from "react";
var pe = { exports: {} }, ie = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xe;
function ve() {
  if (xe) return ie;
  xe = 1;
  var e = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
  function i(l, t, o) {
    var d = null;
    if (o !== void 0 && (d = "" + o), t.key !== void 0 && (d = "" + t.key), "key" in t) {
      o = {};
      for (var u in t)
        u !== "key" && (o[u] = t[u]);
    } else o = t;
    return t = o.ref, {
      $$typeof: e,
      type: l,
      key: d,
      ref: t !== void 0 ? t : null,
      props: o
    };
  }
  return ie.Fragment = n, ie.jsx = i, ie.jsxs = i, ie;
}
var le = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var he;
function je() {
  return he || (he = 1, process.env.NODE_ENV !== "production" && function() {
    function e(s) {
      if (s == null) return null;
      if (typeof s == "function")
        return s.$$typeof === R ? null : s.displayName || s.name || null;
      if (typeof s == "string") return s;
      switch (s) {
        case f:
          return "Fragment";
        case p:
          return "Profiler";
        case w:
          return "StrictMode";
        case z:
          return "Suspense";
        case E:
          return "SuspenseList";
        case I:
          return "Activity";
      }
      if (typeof s == "object")
        switch (typeof s.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), s.$$typeof) {
          case S:
            return "Portal";
          case D:
            return s.displayName || "Context";
          case g:
            return (s._context.displayName || "Context") + ".Consumer";
          case A:
            var F = s.render;
            return s = s.displayName, s || (s = F.displayName || F.name || "", s = s !== "" ? "ForwardRef(" + s + ")" : "ForwardRef"), s;
          case m:
            return F = s.displayName || null, F !== null ? F : e(s.type) || "Memo";
          case c:
            F = s._payload, s = s._init;
            try {
              return e(s(F));
            } catch {
            }
        }
      return null;
    }
    function n(s) {
      return "" + s;
    }
    function i(s) {
      try {
        n(s);
        var F = !1;
      } catch {
        F = !0;
      }
      if (F) {
        F = console;
        var q = F.error, $ = typeof Symbol == "function" && Symbol.toStringTag && s[Symbol.toStringTag] || s.constructor.name || "Object";
        return q.call(
          F,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          $
        ), n(s);
      }
    }
    function l(s) {
      if (s === f) return "<>";
      if (typeof s == "object" && s !== null && s.$$typeof === c)
        return "<...>";
      try {
        var F = e(s);
        return F ? "<" + F + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function t() {
      var s = k.A;
      return s === null ? null : s.getOwner();
    }
    function o() {
      return Error("react-stack-top-frame");
    }
    function d(s) {
      if (Y.call(s, "key")) {
        var F = Object.getOwnPropertyDescriptor(s, "key").get;
        if (F && F.isReactWarning) return !1;
      }
      return s.key !== void 0;
    }
    function u(s, F) {
      function q() {
        U || (U = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          F
        ));
      }
      q.isReactWarning = !0, Object.defineProperty(s, "key", {
        get: q,
        configurable: !0
      });
    }
    function C() {
      var s = e(this.type);
      return X[s] || (X[s] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), s = this.props.ref, s !== void 0 ? s : null;
    }
    function v(s, F, q, $, B, P) {
      var T = q.ref;
      return s = {
        $$typeof: h,
        type: s,
        key: F,
        props: q,
        _owner: $
      }, (T !== void 0 ? T : null) !== null ? Object.defineProperty(s, "ref", {
        enumerable: !1,
        get: C
      }) : Object.defineProperty(s, "ref", { enumerable: !1, value: null }), s._store = {}, Object.defineProperty(s._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(s, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(s, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: B
      }), Object.defineProperty(s, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: P
      }), Object.freeze && (Object.freeze(s.props), Object.freeze(s)), s;
    }
    function a(s, F, q, $, B, P) {
      var T = F.children;
      if (T !== void 0)
        if ($)
          if (N(T)) {
            for ($ = 0; $ < T.length; $++)
              b(T[$]);
            Object.freeze && Object.freeze(T);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else b(T);
      if (Y.call(F, "key")) {
        T = e(s);
        var x = Object.keys(F).filter(function(G) {
          return G !== "key";
        });
        $ = 0 < x.length ? "{key: someKey, " + x.join(": ..., ") + ": ...}" : "{key: someKey}", _[T + $] || (x = 0 < x.length ? "{" + x.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          $,
          T,
          x,
          T
        ), _[T + $] = !0);
      }
      if (T = null, q !== void 0 && (i(q), T = "" + q), d(F) && (i(F.key), T = "" + F.key), "key" in F) {
        q = {};
        for (var H in F)
          H !== "key" && (q[H] = F[H]);
      } else q = F;
      return T && u(
        q,
        typeof s == "function" ? s.displayName || s.name || "Unknown" : s
      ), v(
        s,
        T,
        q,
        t(),
        B,
        P
      );
    }
    function b(s) {
      y(s) ? s._store && (s._store.validated = 1) : typeof s == "object" && s !== null && s.$$typeof === c && (s._payload.status === "fulfilled" ? y(s._payload.value) && s._payload.value._store && (s._payload.value._store.validated = 1) : s._store && (s._store.validated = 1));
    }
    function y(s) {
      return typeof s == "object" && s !== null && s.$$typeof === h;
    }
    var j = ge, h = Symbol.for("react.transitional.element"), S = Symbol.for("react.portal"), f = Symbol.for("react.fragment"), w = Symbol.for("react.strict_mode"), p = Symbol.for("react.profiler"), g = Symbol.for("react.consumer"), D = Symbol.for("react.context"), A = Symbol.for("react.forward_ref"), z = Symbol.for("react.suspense"), E = Symbol.for("react.suspense_list"), m = Symbol.for("react.memo"), c = Symbol.for("react.lazy"), I = Symbol.for("react.activity"), R = Symbol.for("react.client.reference"), k = j.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Y = Object.prototype.hasOwnProperty, N = Array.isArray, W = console.createTask ? console.createTask : function() {
      return null;
    };
    j = {
      react_stack_bottom_frame: function(s) {
        return s();
      }
    };
    var U, X = {}, V = j.react_stack_bottom_frame.bind(
      j,
      o
    )(), M = W(l(o)), _ = {};
    le.Fragment = f, le.jsx = function(s, F, q) {
      var $ = 1e4 > k.recentlyCreatedOwnerStacks++;
      return a(
        s,
        F,
        q,
        !1,
        $ ? Error("react-stack-top-frame") : V,
        $ ? W(l(s)) : M
      );
    }, le.jsxs = function(s, F, q) {
      var $ = 1e4 > k.recentlyCreatedOwnerStacks++;
      return a(
        s,
        F,
        q,
        !0,
        $ ? Error("react-stack-top-frame") : V,
        $ ? W(l(s)) : M
      );
    };
  }()), le;
}
process.env.NODE_ENV === "production" ? pe.exports = ve() : pe.exports = je();
var r = pe.exports;
const ye = be(void 0), we = ({
  children: e,
  onSubmit: n,
  initialValues: i = {},
  requiredFields: l = []
}) => {
  const [t, o] = O(i), [d, u] = O({}), [C, v] = O({}), [a, b] = O(!1), [y, j] = O(!1), h = oe({}), S = oe(null), f = L((R, k) => {
    o((Y) => ({ ...Y, [R]: k }));
  }, []), w = L((R, k) => {
    u((Y) => {
      if (k === "") {
        const N = { ...Y };
        return delete N[R], N;
      }
      return { ...Y, [R]: k };
    });
  }, []), p = L((R, k) => {
    v((Y) => ({ ...Y, [R]: k }));
  }, []), g = L((R, k) => {
    h.current[R] = k;
  }, []), D = L((R) => {
    delete h.current[R];
  }, []), A = L(
    async (R) => {
      const k = h.current[R];
      if (k)
        return await k();
      const Y = t[R];
      let N = "";
      return l.includes(R) && (Y === "" || Y === void 0 || Y === null || typeof Y == "string" && Y.trim() === "" || Array.isArray(Y) && Y.length === 0 ? N = "This field is required" : typeof Y == "boolean" && Y === !1 && R === "terms" && (N = "You must accept the terms and conditions")), N ? (w(R, N), !1) : (w(R, ""), !0);
    },
    [t, l, w]
  ), z = L(async () => {
    const R = {};
    let k = !0;
    const Y = /* @__PURE__ */ new Set([
      ...l,
      ...Object.keys(h.current),
      ...Object.keys(t)
    ]);
    Y.forEach((W) => {
      R[W] = !0;
    }), v((W) => ({ ...W, ...R }));
    const N = Array.from(Y).map(async (W) => {
      const U = h.current[W];
      if (U)
        try {
          const X = await U();
          return X || (k = !1), X;
        } catch (X) {
          return console.error(`Validation error for field ${W}:`, X), k = !1, !1;
        }
      else {
        const X = t[W];
        let V = "";
        return l.includes(W) && (X === "" || X === void 0 || X === null || typeof X == "string" && X.trim() === "" || Array.isArray(X) && X.length === 0 ? V = "This field is required" : typeof X == "boolean" && X === !1 && W === "terms" && (V = "You must accept the terms and conditions")), V ? (w(W, V), k = !1, !1) : (w(W, ""), !0);
      }
    });
    return await Promise.all(N), k;
  }, [t, l, w]), E = L(() => {
    o(i), u({}), v({}), j(!1), b(!1);
  }, [i]), m = L(async () => {
    b(!0);
    try {
      await z() && n && (await n(t), j(!0));
    } catch (R) {
      console.error("Form submission error:", R);
    } finally {
      b(!1);
    }
  }, [z, n, t]), c = L(
    (R) => async (k) => {
      k.preventDefault(), k.stopPropagation();
      try {
        await R(t), j(!0), S.current && S.current();
      } catch (Y) {
        throw console.error("Form submission error:", Y), S.current && S.current(), Y;
      }
    },
    [t]
  ), I = {
    values: t,
    errors: d,
    touched: C,
    isSubmitting: a,
    isSubmitted: y,
    setFieldValue: f,
    setFieldError: w,
    setFieldTouched: p,
    validateField: A,
    validateForm: z,
    resetForm: E,
    submitForm: m,
    handleSubmit: c,
    registerField: g,
    unregisterField: D,
    onSubmitSuccess: void 0
    // Will be set by Button component
  };
  return Object.defineProperty(I, "onSubmitSuccess", {
    get: () => S.current,
    set: (R) => {
      S.current = R;
    },
    enumerable: !0,
    configurable: !0
  }), /* @__PURE__ */ r.jsx(ye.Provider, { value: I, children: e });
}, Q = () => {
  const e = me(ye);
  if (!e)
    throw new Error("useFormContext must be used within FormProvider");
  return e;
}, K = {
  primaryColor: "#000000",
  errorColor: "#ef4444",
  successColor: "#22c55e",
  borderColor: "#e5e7eb",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  fontSize: "14px",
  borderRadius: "6px",
  spacing: "8px"
}, Pe = ({
  children: e,
  onSubmit: n,
  initialValues: i = {},
  theme: l,
  className: t,
  style: o,
  requiredFields: d = []
}) => {
  const C = {
    display: "flex",
    flexDirection: "column",
    gap: { ...K, ...l }.spacing,
    ...o
  };
  return /* @__PURE__ */ r.jsx(
    we,
    {
      onSubmit: n,
      initialValues: i,
      requiredFields: d,
      children: /* @__PURE__ */ r.jsx(
        ke,
        {
          formStyles: C,
          className: t,
          onSubmit: n,
          children: e
        }
      )
    }
  );
};
function ke({
  children: e,
  formStyles: n,
  className: i,
  onSubmit: l
}) {
  const { handleSubmit: t } = Q();
  return /* @__PURE__ */ r.jsx(
    "form",
    {
      style: n,
      className: i,
      onSubmit: t(l),
      noValidate: !0,
      children: e
    }
  );
}
const Ce = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, Se = (e) => e.trim() ? Ce.test(e) ? { isValid: !0 } : { isValid: !1, error: "Invalid email format" } : { isValid: !1, error: "Email is required" }, ze = /^[\d\s\-+$$$$]{10,}$/, Fe = (e) => e.trim() ? ze.test(e.replace(/\s/g, "")) ? { isValid: !0 } : { isValid: !1, error: "Invalid phone number format" } : { isValid: !1, error: "Phone number is required" }, Ie = /^[a-zA-Z\s'-]{2,}$/, $e = (e) => e.trim() ? Ie.test(e) ? { isValid: !0 } : { isValid: !1, error: "Name must contain only letters, spaces, hyphens, and apostrophes" } : { isValid: !1, error: "Name is required" }, Te = (e, n = {}) => {
  const {
    minLength: i = 8,
    requireUppercase: l = !0,
    requireLowercase: t = !0,
    requireNumbers: o = !0,
    requireSpecialChars: d = !0
  } = n;
  return e ? e.length < i ? { isValid: !1, error: `Password must be at least ${i} characters` } : l && !/[A-Z]/.test(e) ? { isValid: !1, error: "Password must contain at least one uppercase letter" } : t && !/[a-z]/.test(e) ? { isValid: !1, error: "Password must contain at least one lowercase letter" } : o && !/\d/.test(e) ? { isValid: !1, error: "Password must contain at least one number" } : d && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(e) ? { isValid: !1, error: "Password must contain at least one special character" } : { isValid: !0 } : { isValid: !1, error: "Password is required" };
}, Ee = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, Re = (e) => e.trim() ? Ee.test(e) ? { isValid: !0 } : { isValid: !1, error: "Invalid URL format" } : { isValid: !1, error: "URL is required" }, Ve = (e) => e.trim() ? isNaN(Number(e)) ? { isValid: !1, error: "Must be a valid number" } : { isValid: !0 } : { isValid: !1, error: "Number is required" }, Ae = /^[a-zA-Z0-9]+$/, We = (e) => e.trim() ? Ae.test(e) ? { isValid: !0 } : { isValid: !1, error: "Only letters and numbers are allowed" } : { isValid: !1, error: "This field is required" }, Ye = (e, n, i) => n && e.length < n ? { isValid: !1, error: `Minimum ${n} characters required` } : i && e.length > i ? { isValid: !1, error: `Maximum ${i} characters allowed` } : { isValid: !0 }, Me = (e, n) => e !== n ? { isValid: !1, error: "Passwords do not match" } : { isValid: !0 }, ae = (e, n) => {
  if (n.minLength || n.maxLength) {
    const i = Ye(e, n.minLength, n.maxLength);
    if (!i.isValid)
      return i;
  }
  if (n.type === "custom" && n.customValidator) {
    const i = n.customValidator(e);
    return {
      isValid: i,
      error: i ? void 0 : n.errorMessage || "Validation failed"
    };
  }
  if (n.pattern) {
    const i = n.pattern.test(e);
    return {
      isValid: i,
      error: i ? void 0 : n.errorMessage || "Invalid format"
    };
  }
  switch (n.type) {
    case "email":
      return Se(e);
    case "phone":
      return Fe(e);
    case "name":
      return $e(e);
    case "password":
      return Te(e);
    case "url":
      return Re(e);
    case "number":
      return Ve(e);
    case "alphanumeric":
      return We(e);
    default:
      return { isValid: !0 };
  }
};
function se(e, n) {
  let i = null;
  return function(...t) {
    const o = () => {
      i = null, e(...t);
    };
    i && clearTimeout(i), i = setTimeout(o, n);
  };
}
const Ne = ({
  name: e,
  label: n,
  placeholder: i,
  type: l = "text",
  validation: t,
  theme: o,
  disabled: d = !1,
  required: u = !1,
  onChange: C,
  onBlur: v,
  value: a,
  helperText: b,
  showError: y = !0,
  className: j = "",
  inputClassName: h = "",
  labelClassName: S = "",
  errorClassName: f = "",
  containerClassName: w = ""
}) => {
  const p = Q(), g = { ...K, ...o }, [D, A] = O(!1), [z, E] = O(!1), m = p.values[e] || "", c = p.errors[e], I = p.touched[e];
  J(() => {
    a !== void 0 && p.values[e] === void 0 && p.setFieldValue(e, a);
  }, [a, e, p]);
  const R = L(
    (_) => {
      let s = "";
      if (u && (!_ || _.trim() === ""))
        s = "This field is required";
      else if (t && _) {
        const F = ae(_, t);
        F.isValid || (s = F.error || "Invalid input");
      }
      return p.setFieldError(e, s), !s;
    },
    [e, u, t, p]
  ), k = te(
    () => se((_) => {
      p.touched[e] && R(_);
    }, 300),
    [e, R, p.touched]
  ), Y = L(
    (_) => {
      const s = _.target.value;
      p.setFieldValue(e, s), C == null || C(s), I && c && p.setFieldError(e, ""), k(s);
    },
    [e, p, C, k, I, c]
  ), N = L(() => {
    A(!1), p.setFieldTouched(e, !0), R(m), v == null || v();
  }, [e, p, v, R, m]), W = L(() => {
    A(!0);
  }, []), X = m && m.length > 0 && !c && I, V = {
    container: {
      marginBottom: g.spacing,
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
      color: D ? g.primaryColor : g.textColor,
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
      backgroundColor: `${g.errorColor}15`,
      color: g.errorColor,
      fontSize: "20px",
      fontWeight: 700,
      animation: u ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none"
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
      border: `2px solid ${c && I ? g.errorColor : D ? g.primaryColor : z ? "#a1a1aa" : g.borderColor}`,
      borderRadius: "10px",
      backgroundColor: d ? "#fafafa" : g.backgroundColor,
      color: g.textColor,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      boxSizing: "border-box",
      cursor: d ? "not-allowed" : "text",
      opacity: d ? 0.5 : 1,
      WebkitAppearance: "none",
      MozAppearance: "none",
      boxShadow: c && I ? `0 0 0 4px ${g.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)` : D ? `0 0 0 4px ${g.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)` : z ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 4px rgba(0,0,0,0.04)",
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
      opacity: X ? 1 : 0,
      transform: X ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    errorIcon: {
      color: g.errorColor,
      opacity: c && I ? 1 : 0,
      transform: c && I ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: c && I ? "shake 0.5s ease-in-out" : "none"
    },
    errorText: {
      fontSize: "13px",
      color: g.errorColor,
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
      color: D ? g.primaryColor : "#a1a1aa",
      textAlign: "right",
      fontWeight: 500,
      transition: "color 0.2s ease"
    }
  }, M = t == null ? void 0 : t.maxLength;
  return /* @__PURE__ */ r.jsxs("div", { style: V.container, className: w, children: [
    n && /* @__PURE__ */ r.jsxs("div", { style: V.labelWrapper, children: [
      /* @__PURE__ */ r.jsx("label", { style: V.label, htmlFor: e, className: S, children: n }),
      u && /* @__PURE__ */ r.jsx("span", { style: V.requiredBadge, title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ r.jsxs("div", { style: V.inputWrapper, children: [
      /* @__PURE__ */ r.jsx(
        "input",
        {
          id: e,
          type: l,
          name: e,
          placeholder: i,
          value: m,
          onChange: Y,
          onBlur: N,
          onFocus: W,
          onMouseEnter: () => E(!0),
          onMouseLeave: () => E(!1),
          disabled: d,
          maxLength: M,
          "aria-invalid": !!(c && I),
          "aria-describedby": c && I ? `${e}-error` : void 0,
          style: V.input,
          className: `${j} ${h}`
        }
      ),
      /* @__PURE__ */ r.jsxs("div", { style: V.iconContainer, children: [
        X && /* @__PURE__ */ r.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: V.checkIcon, children: /* @__PURE__ */ r.jsx("polyline", { points: "20 6 9 17 4 12" }) }),
        c && I && !X && /* @__PURE__ */ r.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", style: V.errorIcon, children: /* @__PURE__ */ r.jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
      ] })
    ] }),
    M && D && /* @__PURE__ */ r.jsxs("div", { style: V.characterCount, children: [
      m.length,
      " / ",
      M
    ] }),
    y && c && I && /* @__PURE__ */ r.jsxs("div", { id: `${e}-error`, role: "alert", style: V.errorText, className: f, children: [
      /* @__PURE__ */ r.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", style: { flexShrink: 0, marginTop: "1px" }, children: /* @__PURE__ */ r.jsx("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
      /* @__PURE__ */ r.jsx("span", { children: c })
    ] }),
    b && !(c && I) && /* @__PURE__ */ r.jsx("div", { style: V.helperText, children: b }),
    /* @__PURE__ */ r.jsx("style", { children: `
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
}, _e = ({
  name: e,
  label: n,
  placeholder: i = "Enter password",
  required: l = !1,
  disabled: t = !1,
  minStrength: o,
  showStrengthMeter: d = !1,
  matchField: u,
  onChange: C,
  onValidation: v,
  className: a = "",
  containerClassName: b = "",
  labelClassName: y = "",
  errorClassName: j = "",
  inputClassName: h = "",
  helperText: S,
  theme: f
}) => {
  const w = Q(), p = { ...K, ...f }, [g, D] = O(!1), [A, z] = O(!1), [E, m] = O(!1), c = w.values[e] || "", I = w.errors[e], R = w.touched[e], Y = c && c.length > 0 && !I && R, N = te(() => {
    if (!c) return 0;
    let $ = 0;
    return c.length >= 8 && $++, /[A-Z]/.test(c) && $++, /[a-z]/.test(c) && $++, /\d/.test(c) && $++, /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(c) && $++, $;
  }, [c]), W = te(() => N === 0 ? "Very Weak" : N === 1 ? "Weak" : N === 2 ? "Fair" : N === 3 ? "Good" : N === 4 ? "Strong" : "Very Strong", [N]), U = te(() => N <= 1 ? "#ef4444" : N === 2 ? "#f59e0b" : N === 3 ? "#eab308" : "#10b981", [N]), X = te(() => N <= 1 ? "😟" : N === 2 ? "😐" : N === 3 ? "🙂" : N === 4 ? "😊" : "🔐", [N]), V = L(async () => {
    const $ = w.values[e] || "";
    let B = "";
    if (l && !$)
      B = "This field is required";
    else if (o && $) {
      const P = { weak: 1, fair: 2, good: 3, strong: 4, "very-strong": 5 };
      let T = 0;
      $.length >= 8 && T++, /[A-Z]/.test($) && T++, /[a-z]/.test($) && T++, /\d/.test($) && T++, /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test($) && T++, T < P[o] && (B = `Password must be at least ${o}`);
    }
    if (!B && u && $) {
      const P = w.values[u];
      P && $ !== P && (B = "Passwords do not match");
    }
    return w.setFieldError(e, B), v == null || v(!B, B), !B;
  }, [e, l, o, u, w, v]);
  J(() => (w.registerField(e, V), () => {
    w.unregisterField(e);
  }), [e, V, w]), J(() => {
    if (u && R) {
      const $ = w.values[u];
      c && $ !== void 0 && V();
    }
  }, [u ? w.values[u] : null]);
  const M = ($) => {
    const B = $.target.value;
    w.setFieldValue(e, B), C == null || C(B), R && I && w.setFieldError(e, "");
  }, _ = () => {
    z(!1), w.setFieldTouched(e, !0), V();
  }, s = () => {
    z(!0);
  }, F = {
    container: {
      marginBottom: p.spacing,
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
      color: A ? p.primaryColor : p.textColor,
      letterSpacing: "0.02em",
      lineHeight: "1.5",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: A ? "translateY(-1px)" : "translateY(0)"
    },
    requiredBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: `${p.errorColor}15`,
      color: p.errorColor,
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
      border: `2px solid ${I && R ? p.errorColor : A ? p.primaryColor : E ? "#a1a1aa" : p.borderColor}`,
      borderRadius: "10px",
      backgroundColor: t ? "#fafafa" : p.backgroundColor,
      color: p.textColor,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      boxSizing: "border-box",
      cursor: t ? "not-allowed" : "text",
      opacity: t ? 0.5 : 1,
      WebkitAppearance: "none",
      MozAppearance: "none",
      boxShadow: I && R ? `0 0 0 4px ${p.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)` : A ? `0 0 0 4px ${p.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)` : E ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 4px rgba(0,0,0,0.04)",
      transform: A ? "translateY(-1px)" : "translateY(0)"
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
      opacity: Y ? 1 : 0,
      transform: Y ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    errorIcon: {
      color: p.errorColor,
      opacity: I && R ? 1 : 0,
      transform: I && R ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: I && R ? "shake 0.5s ease-in-out" : "none"
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
      color: A ? p.primaryColor : "#6b7280",
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
    segment: ($, B) => ({
      flex: 1,
      height: "6px",
      backgroundColor: B ? U : "#e5e7eb",
      borderRadius: "3px",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: B ? "scaleY(1.2)" : "scaleY(1)",
      animation: B ? `segmentPulse 0.5s ease ${$ * 0.1}s` : "none"
    }),
    strengthLabel: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      color: U,
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
    requirement: ($) => ({
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: $ ? "#10b981" : "#6b7280",
      transition: "all 0.3s ease",
      fontWeight: $ ? 500 : 400
    }),
    requirementIcon: ($) => ({
      fontSize: "12px",
      color: $ ? "#10b981" : "#d1d5db",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: $ ? "scale(1) rotate(0deg)" : "scale(0.8) rotate(-90deg)"
    }),
    errorText: {
      fontSize: "13px",
      color: p.errorColor,
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
  }, q = te(() => [
    { label: "At least 8 characters", met: c.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(c) },
    { label: "Lowercase letter", met: /[a-z]/.test(c) },
    { label: "Number", met: /\d/.test(c) },
    { label: "Special character", met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(c) }
  ], [c]);
  return /* @__PURE__ */ r.jsxs("div", { style: F.container, className: b, children: [
    n && /* @__PURE__ */ r.jsxs("div", { style: F.labelWrapper, children: [
      /* @__PURE__ */ r.jsx("label", { style: F.label, htmlFor: e, className: y, children: n }),
      l && /* @__PURE__ */ r.jsx("span", { style: F.requiredBadge, title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ r.jsxs("div", { style: F.inputWrapper, children: [
      /* @__PURE__ */ r.jsx(
        "input",
        {
          id: e,
          type: g ? "text" : "password",
          name: e,
          value: c,
          onChange: M,
          onFocus: s,
          onBlur: _,
          onMouseEnter: () => m(!0),
          onMouseLeave: () => m(!1),
          placeholder: i,
          disabled: t,
          "aria-invalid": !!(I && R),
          "aria-describedby": I && R ? `${e}-error` : void 0,
          style: F.input,
          className: `${a} ${h}`
        }
      ),
      /* @__PURE__ */ r.jsxs("div", { style: F.iconContainer, children: [
        Y && /* @__PURE__ */ r.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: F.checkIcon, children: /* @__PURE__ */ r.jsx("polyline", { points: "20 6 9 17 4 12" }) }),
        I && R && !Y && /* @__PURE__ */ r.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", style: F.errorIcon, children: /* @__PURE__ */ r.jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
      ] }),
      /* @__PURE__ */ r.jsx(
        "button",
        {
          type: "button",
          onClick: () => D(!g),
          style: F.toggleButton,
          onMouseEnter: ($) => $.currentTarget.style.transform = "translateY(-50%) scale(1.1)",
          onMouseLeave: ($) => $.currentTarget.style.transform = "translateY(-50%) scale(1)",
          tabIndex: -1,
          "aria-label": g ? "Hide password" : "Show password",
          children: g ? /* @__PURE__ */ r.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ r.jsx("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }),
            /* @__PURE__ */ r.jsx("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
          ] }) : /* @__PURE__ */ r.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ r.jsx("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
            /* @__PURE__ */ r.jsx("circle", { cx: "12", cy: "12", r: "3" })
          ] })
        }
      )
    ] }),
    d && c && /* @__PURE__ */ r.jsxs("div", { style: F.strengthMeter, children: [
      /* @__PURE__ */ r.jsxs("div", { style: F.strengthBarContainer, children: [
        /* @__PURE__ */ r.jsx("div", { style: F.strengthSegment, children: [0, 1, 2, 3, 4].map(($) => /* @__PURE__ */ r.jsx(
          "div",
          {
            style: F.segment($, $ < N)
          },
          $
        )) }),
        /* @__PURE__ */ r.jsxs("div", { style: F.strengthLabel, children: [
          /* @__PURE__ */ r.jsx("span", { style: F.emoji, children: X }),
          W
        ] })
      ] }),
      A && /* @__PURE__ */ r.jsx("div", { style: F.requirements, children: q.map(($, B) => /* @__PURE__ */ r.jsxs("div", { style: F.requirement($.met), children: [
        /* @__PURE__ */ r.jsx("span", { style: F.requirementIcon($.met), children: $.met ? "✓" : "○" }),
        $.label
      ] }, B)) })
    ] }),
    I && R && /* @__PURE__ */ r.jsxs("div", { id: `${e}-error`, role: "alert", style: F.errorText, className: j, children: [
      /* @__PURE__ */ r.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", style: { flexShrink: 0, marginTop: "1px" }, children: /* @__PURE__ */ r.jsx("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
      /* @__PURE__ */ r.jsx("span", { children: I })
    ] }),
    S && !(I && R) && /* @__PURE__ */ r.jsx("div", { style: F.helperText, children: S }),
    /* @__PURE__ */ r.jsx("style", { children: `
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
}, Le = ({
  name: e,
  label: n,
  value: i,
  checked: l,
  onChange: t,
  disabled: o = !1,
  theme: d,
  required: u = !1
}) => {
  const C = Q(), v = { ...K, ...d }, a = C.values[e], b = l !== void 0 ? l : a, y = C.errors[e], [j, h] = O(!1), [S, f] = O(!1), w = L(
    (g) => {
      const D = g.target.checked;
      C.setFieldValue(e, D), C.setFieldTouched(e, !0), t == null || t(D);
    },
    [e, C, t]
  ), p = {
    container: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: v.spacing,
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
      border: `2px solid ${y ? v.errorColor : S ? v.primaryColor : v.borderColor}`,
      backgroundColor: b ? v.primaryColor : v.backgroundColor,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: o ? "not-allowed" : "pointer",
      boxShadow: j ? `0 0 0 4px ${v.primaryColor}15` : S ? `0 0 0 4px ${v.primaryColor}20` : "none",
      outline: "none",
      position: "relative"
    },
    checkmark: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: b ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0)",
      opacity: b ? 1 : 0,
      color: v.backgroundColor,
      transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      pointerEvents: "none"
    },
    label: {
      fontSize: v.fontSize || "14px",
      color: v.textColor,
      cursor: o ? "not-allowed" : "pointer",
      userSelect: "none",
      fontWeight: 500,
      transition: "color 0.2s ease"
    },
    requiredMark: {
      color: v.errorColor,
      marginLeft: "4px",
      fontWeight: 600
    },
    errorText: {
      fontSize: "12px",
      color: v.errorColor,
      marginTop: "4px",
      animation: "fadeIn 0.3s ease"
    }
  };
  return /* @__PURE__ */ r.jsxs("div", { children: [
    /* @__PURE__ */ r.jsxs(
      "div",
      {
        style: p.container,
        onMouseEnter: () => h(!0),
        onMouseLeave: () => h(!1),
        children: [
          /* @__PURE__ */ r.jsxs("div", { style: p.checkboxWrapper, children: [
            /* @__PURE__ */ r.jsx(
              "input",
              {
                type: "checkbox",
                name: e,
                id: e,
                value: i,
                checked: b || !1,
                disabled: o,
                onChange: w,
                onFocus: () => f(!0),
                onBlur: () => f(!1),
                style: p.checkboxBase
              }
            ),
            /* @__PURE__ */ r.jsx(
              "svg",
              {
                style: p.checkmark,
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /* @__PURE__ */ r.jsx("polyline", { points: "20 6 9 17 4 12" })
              }
            )
          ] }),
          n && /* @__PURE__ */ r.jsxs("label", { htmlFor: e, style: p.label, children: [
            n,
            u && /* @__PURE__ */ r.jsx("span", { style: p.requiredMark, children: "*" })
          ] })
        ]
      }
    ),
    y && /* @__PURE__ */ r.jsx("div", { style: p.errorText, children: y }),
    /* @__PURE__ */ r.jsx("style", { children: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-3px); }
            to { opacity: 1; transform: translateY(0); }
          }
          input[type="checkbox"]:checked {
            animation: fillPulse 0.3s ease forwards;
          }
          @keyframes fillPulse {
            0% {
              box-shadow: 0 0 0 0 ${v.primaryColor}40;
            }
            50% {
              box-shadow: 0 0 0 6px ${v.primaryColor}20;
            }
            100% {
              box-shadow: 0 0 0 0 ${v.primaryColor}00;
            }
          }
        ` })
  ] });
}, Oe = ({
  name: e,
  options: n,
  label: i,
  onChange: l,
  disabled: t = !1,
  required: o = !1,
  direction: d = "vertical",
  helperText: u,
  theme: C
}) => {
  var D, A, z;
  const v = { ...K, ...C }, a = (() => {
    try {
      return Q();
    } catch {
      return null;
    }
  })(), [b, y] = O(""), j = ((D = a == null ? void 0 : a.values) == null ? void 0 : D[e]) ?? b, h = (A = a == null ? void 0 : a.errors) == null ? void 0 : A[e], S = (z = a == null ? void 0 : a.touched) == null ? void 0 : z[e], [f, w] = O(!1), p = L(async () => {
    if (!a) return !0;
    const E = a.values[e];
    let m = "";
    return o && !E && (m = "This field is required"), a.setFieldError(e, m), !m;
  }, [a, e, o]);
  J(() => {
    if (a)
      return a.registerField(e, p), () => a.unregisterField(e);
  }, [a, e, p]);
  const g = L(
    (E) => {
      var m, c;
      a ? (a.setFieldValue(e, E), a.setFieldTouched(e, !0)) : y(E), w(!0), l == null || l(E), (m = a == null ? void 0 : a.touched) != null && m[e] && ((c = a == null ? void 0 : a.errors) != null && c[e]) && a.setFieldError(e, "");
    },
    [a, e, l]
  );
  return /* @__PURE__ */ r.jsxs(
    "div",
    {
      style: {
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      },
      children: [
        i && /* @__PURE__ */ r.jsxs(
          "label",
          {
            style: {
              fontSize: "14px",
              fontWeight: 600,
              color: v.textColor
            },
            children: [
              i,
              o && /* @__PURE__ */ r.jsx("span", { style: { color: v.errorColor }, children: " *" })
            ]
          }
        ),
        /* @__PURE__ */ r.jsx(
          "div",
          {
            role: "radiogroup",
            "aria-label": i,
            "aria-required": o,
            "aria-invalid": !!(h && (S || f)),
            style: {
              display: "flex",
              flexDirection: d === "vertical" ? "column" : "row",
              gap: d === "vertical" ? "10px" : "24px"
            },
            children: n.map((E) => {
              const m = j === E.value, c = t || E.disabled;
              return /* @__PURE__ */ r.jsxs(
                "label",
                {
                  htmlFor: `${e}-${E.value}`,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: c ? "not-allowed" : "pointer",
                    opacity: c ? 0.6 : 1,
                    userSelect: "none",
                    transition: "all 0.2s ease"
                  },
                  children: [
                    /* @__PURE__ */ r.jsx(
                      "div",
                      {
                        style: {
                          position: "relative",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: `2px solid ${m ? v.primaryColor : "#d1d5db"}`,
                          backgroundColor: "#fff",
                          transition: "all 0.25s ease",
                          boxShadow: m ? `0 0 0 3px ${v.primaryColor}25` : "none"
                        },
                        children: /* @__PURE__ */ r.jsx(
                          "div",
                          {
                            style: {
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: `translate(-50%, -50%) scale(${m ? 1 : 0})`,
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: v.primaryColor,
                              transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                            }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ r.jsx(
                      "input",
                      {
                        type: "radio",
                        id: `${e}-${E.value}`,
                        name: e,
                        value: E.value,
                        checked: m,
                        disabled: c,
                        onChange: () => !c && g(E.value),
                        style: { position: "absolute", opacity: 0, pointerEvents: "none" }
                      }
                    ),
                    /* @__PURE__ */ r.jsx(
                      "span",
                      {
                        style: {
                          fontSize: "14px",
                          color: v.textColor,
                          transition: "color 0.2s ease"
                        },
                        children: E.label
                      }
                    )
                  ]
                },
                E.value
              );
            })
          }
        ),
        h && (S || f) && /* @__PURE__ */ r.jsx("div", { role: "alert", style: { fontSize: "12px", color: v.errorColor }, children: h }),
        u && !(h && (S || f)) && /* @__PURE__ */ r.jsx("div", { style: { fontSize: "12px", color: "#6b7280" }, children: u })
      ]
    }
  );
}, Be = ({
  type: e = "button",
  children: n,
  label: i,
  onClick: l,
  disabled: t = !1,
  loading: o = !1,
  variant: d = "primary",
  theme: u,
  fullWidth: C = !1,
  size: v = "medium",
  style: a,
  enableThrottle: b,
  throttleDelay: y,
  showErrorSummary: j = !0,
  showSuccessModal: h = !0,
  successMessage: S = "Form submitted successfully!",
  onSuccess: f,
  submissionDelay: w = 2e3
}) => {
  const p = { ...K, ...u }, g = (() => {
    try {
      return Q();
    } catch {
      return null;
    }
  })(), D = e === "submit", [A, z] = O(!1), [E, m] = O([]), [c, I] = O(!1), [R, k] = O(!1), Y = b ?? D, N = y ?? (D ? 1e3 : 300), W = oe(0), U = o || A, X = L(async (_) => {
    var s;
    if (!(t || U)) {
      if (Y) {
        const F = Date.now();
        if (F - W.current < N) {
          _.preventDefault(), _.stopPropagation(), console.log("⏳ Please wait before clicking again.");
          return;
        }
        W.current = F;
      }
      if (D && g) {
        _.preventDefault(), I(!1), m([]);
        try {
          if (!await g.validateForm()) {
            if (j) {
              const q = Object.entries(g.errors).filter(([$, B]) => B).map(([$, B]) => `${$}: ${B}`);
              m(q), I(!0);
            }
            return;
          }
          z(!0), await new Promise((q) => setTimeout(q, w)), await ((s = g.submitForm) == null ? void 0 : s.call(g)), z(!1), h && k(!0), f == null || f();
        } catch (F) {
          console.error("Form submission error:", F), z(!1), m(["An unexpected error occurred during submission."]), I(!0);
        }
      } else
        l == null || l();
    }
  }, [
    t,
    U,
    Y,
    N,
    D,
    g,
    w,
    j,
    h,
    f
  ]), V = {
    primary: { backgroundColor: p.primaryColor, color: "#fff" },
    secondary: { backgroundColor: "#f3f4f6", color: p.textColor },
    danger: { backgroundColor: p.errorColor, color: "#fff" }
  }[d], M = v === "small" ? { padding: "6px 12px", fontSize: 12 } : v === "large" ? { padding: "14px 24px", fontSize: 16 } : { padding: "10px 16px", fontSize: 14 };
  return /* @__PURE__ */ r.jsxs(r.Fragment, { children: [
    /* @__PURE__ */ r.jsx("style", { children: `
        @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      ` }),
    /* @__PURE__ */ r.jsx(
      "button",
      {
        type: e,
        onClick: X,
        disabled: t || U,
        style: {
          ...V,
          ...M,
          width: C ? "100%" : "auto",
          border: "none",
          borderRadius: p.borderRadius,
          cursor: t || U ? "not-allowed" : "pointer",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: t || U ? 0.6 : 1,
          transition: "all 0.2s ease-in-out",
          ...a
        },
        children: U ? /* @__PURE__ */ r.jsxs(r.Fragment, { children: [
          /* @__PURE__ */ r.jsx(
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
          /* @__PURE__ */ r.jsx("span", { children: "Processing..." })
        ] }) : n || i
      }
    ),
    j && c && E.length > 0 && /* @__PURE__ */ r.jsxs(
      "div",
      {
        style: {
          marginTop: 12,
          padding: 16,
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: p.borderRadius,
          color: "#991b1b",
          fontSize: 13
        },
        children: [
          /* @__PURE__ */ r.jsx("strong", { children: "⚠️ Please fix the following errors:" }),
          /* @__PURE__ */ r.jsx("ul", { style: { marginTop: 8, paddingLeft: 20 }, children: E.map((_, s) => /* @__PURE__ */ r.jsx("li", { children: _ }, s)) })
        ]
      }
    ),
    R && /* @__PURE__ */ r.jsx(
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
        onClick: () => k(!1),
        children: /* @__PURE__ */ r.jsxs(
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
            onClick: (_) => _.stopPropagation(),
            children: [
              /* @__PURE__ */ r.jsx(
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
                  children: /* @__PURE__ */ r.jsx("span", { style: { color: "#16a34a", fontSize: 32 }, children: "✓" })
                }
              ),
              /* @__PURE__ */ r.jsx("h2", { style: { fontSize: 22, marginBottom: 8 }, children: "Success!" }),
              /* @__PURE__ */ r.jsx("p", { style: { color: "#6b7280", marginBottom: 24 }, children: S }),
              /* @__PURE__ */ r.jsx(
                "button",
                {
                  style: {
                    padding: "10px 24px",
                    border: "none",
                    backgroundColor: p.primaryColor,
                    color: "#fff",
                    borderRadius: p.borderRadius,
                    fontWeight: 600,
                    cursor: "pointer"
                  },
                  onClick: (_) => {
                    _.stopPropagation(), setTimeout(() => k(!1), 150);
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
}, He = ({
  name: e,
  options: n,
  label: i,
  placeholder: l = "Select an option",
  onChange: t,
  disabled: o = !1,
  required: d = !1,
  value: u,
  helperText: C,
  className: v = "",
  containerClassName: a = "",
  labelClassName: b = "",
  errorClassName: y = "",
  inputClassName: j = "",
  theme: h
}) => {
  const S = Q(), f = { ...K, ...h }, [w, p] = O(!1), [g, D] = O(!1), [A, z] = O(!1), E = oe(null), m = S.values[e] || "", c = S.errors[e], I = S.touched[e], k = m && m.length > 0 && !c && I, Y = n.find((M) => M.value === m);
  J(() => {
    u !== void 0 && S.values[e] === void 0 && S.setFieldValue(e, u);
  }, [u, e, S]), J(() => {
    const M = (_) => {
      E.current && !E.current.contains(_.target) && (z(!1), p(!1));
    };
    return document.addEventListener("mousedown", M), () => document.removeEventListener("mousedown", M);
  }, []);
  const N = L(async () => {
    const M = S.values[e] || "";
    let _ = "";
    return d && !M && (_ = "This field is required"), S.setFieldError(e, _), !_;
  }, [e, d, S]);
  J(() => (S.registerField(e, N), () => {
    S.unregisterField(e);
  }), [e, N, S]);
  const W = L((M) => {
    o || (S.setFieldValue(e, M), t == null || t(M), S.setFieldTouched(e, !0), c && S.setFieldError(e, ""), z(!1), p(!1));
  }, [e, S, t, c, o]), U = L(() => {
    o || (z(!A), p(!A));
  }, [o, A]), X = L(() => {
    A || (p(!1), S.setFieldTouched(e, !0), N());
  }, [e, S, N, A]), V = {
    container: {
      marginBottom: f.spacing,
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
      color: w ? f.primaryColor : f.textColor,
      letterSpacing: "0.02em",
      lineHeight: "1.5",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: w ? "translateY(-1px)" : "translateY(0)"
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
      animation: d ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none"
    },
    selectWrapper: {
      position: "relative",
      width: "100%"
    },
    select: {
      width: "100%",
      padding: k && !A ? "13px 70px 13px 16px" : "13px 44px 13px 16px",
      fontSize: "15px",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      fontWeight: 400,
      border: `2px solid ${c && I ? f.errorColor : w ? f.primaryColor : g ? "#a1a1aa" : f.borderColor}`,
      borderRadius: "10px",
      backgroundColor: o ? "#fafafa" : f.backgroundColor,
      color: m ? f.textColor : "#9ca3af",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      boxSizing: "border-box",
      cursor: o ? "not-allowed" : "pointer",
      opacity: o ? 0.5 : 1,
      boxShadow: c && I ? `0 0 0 4px ${f.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)` : w ? `0 0 0 4px ${f.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)` : g ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 4px rgba(0,0,0,0.04)",
      transform: w ? "translateY(-1px)" : "translateY(0)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    arrow: {
      fontSize: "12px",
      color: w ? f.primaryColor : "#6b7280",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: A ? "rotate(180deg)" : "rotate(0deg)"
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
      opacity: k ? 1 : 0,
      transform: k ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    errorIcon: {
      color: f.errorColor,
      opacity: c && I ? 1 : 0,
      transform: c && I ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: c && I ? "shake 0.5s ease-in-out" : "none"
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
      fontSize: "15px",
      borderBottom: `1px solid ${f.borderColor}20`
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
  return /* @__PURE__ */ r.jsxs("div", { ref: E, style: V.container, className: a, children: [
    i && /* @__PURE__ */ r.jsxs("div", { style: V.labelWrapper, children: [
      /* @__PURE__ */ r.jsx("label", { style: V.label, htmlFor: e, className: b, children: i }),
      d && /* @__PURE__ */ r.jsx("span", { style: V.requiredBadge, title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ r.jsxs("div", { style: V.selectWrapper, children: [
      /* @__PURE__ */ r.jsxs(
        "div",
        {
          style: V.select,
          onClick: U,
          onBlur: X,
          onMouseEnter: () => D(!0),
          onMouseLeave: () => D(!1),
          tabIndex: o ? -1 : 0,
          className: `${v} ${j}`,
          onKeyDown: (M) => {
            (M.key === "Enter" || M.key === " ") && (M.preventDefault(), U());
          },
          "aria-invalid": !!(c && I),
          "aria-describedby": c && I ? `${e}-error` : void 0,
          children: [
            /* @__PURE__ */ r.jsx("span", { style: m ? void 0 : { color: "#9ca3af" }, children: Y ? Y.label : l }),
            /* @__PURE__ */ r.jsx("span", { style: V.arrow, children: "▼" })
          ]
        }
      ),
      !A && /* @__PURE__ */ r.jsxs("div", { style: V.iconContainer, children: [
        k && /* @__PURE__ */ r.jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: V.checkIcon, children: /* @__PURE__ */ r.jsx("polyline", { points: "20 6 9 17 4 12" }) }),
        c && I && !k && /* @__PURE__ */ r.jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", style: V.errorIcon, children: /* @__PURE__ */ r.jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
      ] }),
      A && /* @__PURE__ */ r.jsx("div", { style: V.dropdown, children: n.length === 0 ? /* @__PURE__ */ r.jsx("div", { style: { ...V.option, cursor: "default", opacity: 0.6 }, children: "No options available" }) : n.map((M) => {
        const _ = m === M.value;
        return /* @__PURE__ */ r.jsxs(
          "div",
          {
            style: {
              ...V.option,
              backgroundColor: _ ? `${f.primaryColor}08` : "transparent",
              fontWeight: _ ? 600 : 400
            },
            onClick: (s) => {
              s.stopPropagation(), W(M.value);
            },
            onMouseEnter: (s) => {
              s.currentTarget.style.backgroundColor = _ ? `${f.primaryColor}15` : `${f.primaryColor}05`;
            },
            onMouseLeave: (s) => {
              s.currentTarget.style.backgroundColor = _ ? `${f.primaryColor}08` : "transparent";
            },
            children: [
              M.label,
              _ && /* @__PURE__ */ r.jsx(
                "svg",
                {
                  style: {
                    marginLeft: "auto",
                    display: "inline-block",
                    verticalAlign: "middle",
                    color: f.primaryColor
                  },
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "3",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: /* @__PURE__ */ r.jsx("polyline", { points: "20 6 9 17 4 12" })
                }
              )
            ]
          },
          M.value
        );
      }) })
    ] }),
    c && I && /* @__PURE__ */ r.jsxs("div", { id: `${e}-error`, role: "alert", style: V.errorText, className: y, children: [
      /* @__PURE__ */ r.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", style: { flexShrink: 0, marginTop: "1px" }, children: /* @__PURE__ */ r.jsx("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
      /* @__PURE__ */ r.jsx("span", { children: c })
    ] }),
    C && !(c && I) && /* @__PURE__ */ r.jsx("div", { style: V.helperText, children: C }),
    /* @__PURE__ */ r.jsx("style", { children: `
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
}, Ue = ({
  name: e,
  label: n,
  placeholder: i,
  validation: l,
  theme: t,
  disabled: o = !1,
  required: d = !1,
  onChange: u,
  onBlur: C,
  value: v,
  rows: a = 4,
  maxLength: b,
  showCharCount: y = !1
}) => {
  const j = Q(), h = { ...K, ...t }, [S, f] = O(v || ""), [w, p] = O(!1), g = v !== void 0 ? v : S, D = j.errors[e], A = j.touched[e], z = te(
    () => se((R) => {
      if (l) {
        const k = ae(R, l);
        k.isValid ? j.setFieldError(e, "") : j.setFieldError(e, k.error || "Invalid input");
      }
    }, 300),
    [e, l, j]
  ), E = L(
    (R) => {
      const k = R.target.value;
      (!b || k.length <= b) && (f(k), j.setFieldValue(e, k), u == null || u(k), z(k));
    },
    [e, j, u, z, b]
  ), m = L(() => {
    p(!1), j.setFieldTouched(e, !0), C == null || C();
  }, [e, j, C]), c = L(() => {
    p(!0);
  }, []), I = {
    container: {
      marginBottom: h.spacing,
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    },
    label: {
      fontSize: "12px",
      fontWeight: 600,
      color: h.textColor,
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    },
    textarea: {
      width: "100%",
      padding: "10px 12px",
      fontSize: h.fontSize,
      border: `1px solid ${D && A ? h.errorColor : h.borderColor}`,
      borderRadius: h.borderRadius,
      backgroundColor: o ? "#f3f4f6" : h.backgroundColor,
      color: h.textColor,
      transition: "all 0.2s ease-in-out",
      outline: "none",
      boxSizing: "border-box",
      cursor: o ? "not-allowed" : "pointer",
      opacity: o ? 0.6 : 1,
      fontFamily: "inherit",
      resize: "vertical"
    },
    textareaFocused: {
      borderColor: D && A ? h.errorColor : h.primaryColor,
      boxShadow: `0 0 0 3px ${D && A ? `${h.errorColor}20` : `${h.primaryColor}20`}`
    },
    errorText: {
      fontSize: "12px",
      color: h.errorColor,
      marginTop: "4px"
    },
    charCount: {
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "4px",
      textAlign: "right"
    }
  };
  return /* @__PURE__ */ r.jsxs("div", { style: I.container, children: [
    n && /* @__PURE__ */ r.jsxs("label", { style: I.label, children: [
      n,
      d && /* @__PURE__ */ r.jsx("span", { style: { color: h.errorColor }, children: "*" })
    ] }),
    /* @__PURE__ */ r.jsx(
      "textarea",
      {
        name: e,
        placeholder: i,
        value: g,
        onChange: E,
        onBlur: m,
        onFocus: c,
        disabled: o,
        rows: a,
        style: {
          ...I.textarea,
          ...w ? I.textareaFocused : {}
        }
      }
    ),
    D && A && /* @__PURE__ */ r.jsx("div", { style: I.errorText, children: D }),
    y && b && /* @__PURE__ */ r.jsxs("div", { style: I.charCount, children: [
      g.length,
      " / ",
      b
    ] })
  ] });
}, qe = ({
  name: e,
  label: n,
  placeholder: i = "Enter a number",
  min: l,
  max: t,
  step: o = 1,
  required: d = !1,
  disabled: u = !1,
  error: C,
  onChange: v,
  onBlur: a,
  className: b = "",
  helperText: y
}) => {
  const [j, h] = O(""), [S, f] = O(!1), [w, p] = O(""), g = L(
    (E) => {
      const m = E === "" ? null : parseFloat(E);
      if (m !== null) {
        if (l !== void 0 && m < l) {
          p(`Must be at least ${l}`);
          return;
        }
        if (t !== void 0 && m > t) {
          p(`Must be at most ${t}`);
          return;
        }
      }
      p(""), v == null || v(m);
    },
    [l, t, v]
  ), D = (E) => {
    const m = E.target.value;
    (m === "" || m === "-" || !isNaN(parseFloat(m))) && (h(m), g(m));
  }, A = () => {
    f(!1), j === "-" && (h(""), p("")), a == null || a();
  }, z = C || w;
  return /* @__PURE__ */ r.jsxs("div", { style: { marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }, className: b, children: [
    n && /* @__PURE__ */ r.jsxs(
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
          d && /* @__PURE__ */ r.jsx("span", { style: { color: "#ef4444" }, children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ r.jsx(
      "input",
      {
        type: "number",
        name: e,
        value: j,
        onChange: D,
        onFocus: () => f(!0),
        onBlur: A,
        placeholder: i,
        min: l,
        max: t,
        step: o,
        disabled: u,
        required: d,
        style: {
          padding: "10px 12px",
          fontSize: "14px",
          border: `1px solid ${z ? "#ef4444" : S ? "#000000" : "#e5e7eb"}`,
          borderRadius: "6px",
          backgroundColor: u ? "#f3f4f6" : "#ffffff",
          color: "#1f2937",
          transition: "all 0.2s ease",
          outline: "none",
          width: "100%",
          boxSizing: "border-box"
        }
      }
    ),
    z && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: "#ef4444" }, children: z }),
    y && !z && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: "#6b7280" }, children: y })
  ] });
}, Xe = ({
  name: e,
  label: n,
  placeholder: i = "Select a date",
  min: l,
  max: t,
  minAge: o,
  maxAge: d,
  required: u = !1,
  disabled: C = !1,
  onChange: v,
  onBlur: a,
  className: b = "",
  containerClassName: y = "",
  labelClassName: j = "",
  errorClassName: h = "",
  inputClassName: S = "",
  helperText: f,
  theme: w
}) => {
  var _;
  const p = Q(), g = { ...K, ...w }, [D, A] = O(!1), [z, E] = O(!1), m = p.values[e] || "", c = p.errors[e], I = p.touched[e], k = m && m.length > 0 && !c && I, Y = (s) => {
    const F = new Date(s), q = /* @__PURE__ */ new Date();
    let $ = q.getFullYear() - F.getFullYear();
    const B = q.getMonth() - F.getMonth();
    return (B < 0 || B === 0 && q.getDate() < F.getDate()) && $--, $;
  }, N = L(async () => {
    const s = p.values[e] || "";
    let F = "";
    if (u && !s)
      F = "This field is required";
    else if (s) {
      const q = new Date(s);
      l && q < new Date(l) ? F = `Date must be after ${l}` : t && q > new Date(t) ? F = `Date must be before ${t}` : o !== void 0 ? Y(s) < o && (F = `You must be at least ${o} years old`) : d !== void 0 && Y(s) > d && (F = `Age cannot exceed ${d} years`);
    }
    return p.setFieldError(e, F), !F;
  }, [e, u, l, t, o, d, p]);
  J(() => (p.registerField(e, N), () => {
    p.unregisterField(e);
  }), [e, N, p]);
  const W = (s) => {
    const F = s.target.value;
    p.setFieldValue(e, F), v == null || v(F), I && c && p.setFieldError(e, "");
  }, U = () => {
    A(!1), p.setFieldTouched(e, !0), N(), a == null || a();
  }, X = () => {
    A(!0);
  }, V = {
    container: {
      marginBottom: g.spacing,
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
      color: D ? g.primaryColor : g.textColor,
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
      backgroundColor: `${g.errorColor}15`,
      color: g.errorColor,
      fontSize: "20px",
      fontWeight: 700,
      animation: u ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none"
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
      border: `2px solid ${c && I ? g.errorColor : D ? g.primaryColor : z ? "#a1a1aa" : g.borderColor}`,
      borderRadius: "10px",
      backgroundColor: C ? "#fafafa" : g.backgroundColor,
      color: g.textColor,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      boxSizing: "border-box",
      cursor: C ? "not-allowed" : "text",
      opacity: C ? 0.5 : 1,
      WebkitAppearance: "none",
      MozAppearance: "none",
      boxShadow: c && I ? `0 0 0 4px ${g.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)` : D ? `0 0 0 4px ${g.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)` : z ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 4px rgba(0,0,0,0.04)",
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
      opacity: k ? 1 : 0,
      transform: k ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    errorIcon: {
      color: g.errorColor,
      opacity: c && I ? 1 : 0,
      transform: c && I ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: c && I ? "shake 0.5s ease-in-out" : "none"
    },
    errorText: {
      fontSize: "13px",
      color: g.errorColor,
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
  }, M = `date-field-${e}`;
  return /* @__PURE__ */ r.jsxs("div", { style: V.container, className: y, children: [
    n && /* @__PURE__ */ r.jsxs("div", { style: V.labelWrapper, children: [
      /* @__PURE__ */ r.jsx("label", { style: V.label, htmlFor: e, className: j, children: n }),
      u && /* @__PURE__ */ r.jsx("span", { style: V.requiredBadge, title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ r.jsxs("div", { style: V.inputWrapper, children: [
      /* @__PURE__ */ r.jsx(
        "input",
        {
          id: e,
          type: "date",
          name: e,
          value: m,
          onChange: W,
          onFocus: X,
          onBlur: U,
          onMouseEnter: () => E(!0),
          onMouseLeave: () => E(!1),
          placeholder: i,
          min: l,
          max: t,
          disabled: C,
          "aria-invalid": !!(c && I),
          "aria-describedby": c && I ? `${e}-error` : void 0,
          style: V.input,
          className: `${b} ${S} ${M}`
        }
      ),
      /* @__PURE__ */ r.jsxs("div", { style: V.iconContainer, children: [
        k && /* @__PURE__ */ r.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: V.checkIcon, children: /* @__PURE__ */ r.jsx("polyline", { points: "20 6 9 17 4 12" }) }),
        c && I && !k && /* @__PURE__ */ r.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", style: V.errorIcon, children: /* @__PURE__ */ r.jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
      ] })
    ] }),
    c && I && /* @__PURE__ */ r.jsxs("div", { id: `${e}-error`, role: "alert", style: V.errorText, className: h, children: [
      /* @__PURE__ */ r.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", style: { flexShrink: 0, marginTop: "1px" }, children: /* @__PURE__ */ r.jsx("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
      /* @__PURE__ */ r.jsx("span", { children: c })
    ] }),
    f && !(c && I) && /* @__PURE__ */ r.jsx("div", { style: V.helperText, children: f }),
    /* @__PURE__ */ r.jsx("style", { children: `
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
          .${M}::-webkit-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.6;
            transition: all 0.2s ease;
            filter: none;
            width: 20px;
            height: 20px;
            margin-right: -8px;
          }

          .${M}::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
            transform: scale(1.1);
          }

          .${M}::-webkit-datetime-edit-fields-wrapper {
            padding: 0;
          }

          .${M}::-webkit-datetime-edit-text {
            color: ${g.textColor};
            padding: 0 2px;
          }

          .${M}::-webkit-datetime-edit-month-field,
          .${M}::-webkit-datetime-edit-day-field,
          .${M}::-webkit-datetime-edit-year-field {
            color: ${g.textColor};
            padding: 2px;
            border-radius: 4px;
            transition: all 0.2s ease;
          }

          .${M}::-webkit-datetime-edit-month-field:focus,
          .${M}::-webkit-datetime-edit-day-field:focus,
          .${M}::-webkit-datetime-edit-year-field:focus {
            background-color: ${g.primaryColor}15;
            color: ${g.primaryColor};
            outline: none;
          }

          /* Calendar dropdown styling */
          .${M}::-webkit-calendar-picker-indicator {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23${(_ = g.primaryColor) == null ? void 0 : _.replace("#", "")}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
          }

          /* Firefox date picker */
          .${M}::-moz-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.6;
            transition: all 0.2s ease;
          }

          .${M}::-moz-calendar-picker-indicator:hover {
            opacity: 1;
            transform: scale(1.1);
          }
        ` })
  ] });
}, re = (e, n) => {
  const i = Q(), l = e || "field", t = te(
    () => se((d, u) => {
      if (!n) {
        u({ isValid: !0 });
        return;
      }
      const C = ae(d, n);
      u(C);
    }, 300),
    [n]
  );
  return {
    validateField: L(
      (d) => {
        if (!n)
          return i.setFieldError(l, ""), { isValid: !0 };
        const u = ae(d, n);
        return u.isValid ? i.setFieldError(l, "") : i.setFieldError(l, u.error || "Validation failed"), t(d, (C) => {
          C.isValid ? i.setFieldError(l, "") : i.setFieldError(l, C.error || "Validation failed");
        }), u;
      },
      [l, i, t, n]
    ),
    error: i.errors[l],
    isTouched: i.touched[l]
  };
}, Ge = ({
  name: e,
  label: n,
  placeholder: i = "Select a time",
  required: l = !1,
  disabled: t = !1,
  error: o,
  onChange: d,
  onBlur: u,
  className: C = "",
  helperText: v
}) => {
  const [a, b] = O(""), [y, j] = O(!1), { validateField: h } = re(e), S = L(
    se((w) => {
      h(w), d == null || d(w);
    }, 300),
    [d, h]
  ), f = (w) => {
    const p = w.target.value;
    b(p), S(p);
  };
  return /* @__PURE__ */ r.jsxs("div", { style: { marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }, className: C, children: [
    n && /* @__PURE__ */ r.jsxs(
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
          l && /* @__PURE__ */ r.jsx("span", { style: { color: "#ef4444" }, children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ r.jsx(
      "input",
      {
        type: "time",
        name: e,
        value: a,
        onChange: f,
        onFocus: () => j(!0),
        onBlur: () => {
          j(!1), u == null || u();
        },
        placeholder: i,
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
    o && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: "#ef4444" }, children: o }),
    v && !o && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: "#6b7280" }, children: v })
  ] });
}, Ze = ({
  name: e,
  label: n,
  accept: i,
  multiple: l = !1,
  maxSize: t = 5242880,
  // 5MB default
  required: o = !1,
  disabled: d = !1,
  helperText: u,
  theme: C,
  className: v,
  style: a,
  showPreview: b = !0
}) => {
  const y = { ...K, ...C }, {
    values: j,
    errors: h,
    touched: S,
    setFieldValue: f,
    setFieldError: w,
    setFieldTouched: p,
    registerField: g,
    unregisterField: D
  } = Q(), [A, z] = O(!1), [E, m] = O(!1), [c, I] = O(0), R = oe(!1), k = j[e], Y = h[e], N = S[e], W = L(async () => {
    const x = j[e];
    let H = "";
    return o && (!x || Array.isArray(x) && x.length === 0) && (H = "Please upload at least one file"), w(e, H), !H;
  }, [j, e, o, w]);
  J(() => (g(e, W), () => D(e)), [e, g, D, W]);
  const U = L(async (x) => new Promise((H) => {
    m(!0), I(0), R.current = !0;
    const G = 2e3, Z = 100, ne = G / Z;
    let ee = 0;
    const fe = setInterval(() => {
      ee++, I(ee), ee >= Z && (clearInterval(fe), m(!1), R.current = !1, H());
    }, ne);
  }), []), X = L((x) => {
    var H;
    if (!x || x.length === 0)
      return null;
    if (R.current)
      return "Please wait for the current upload to complete";
    if (!l && x.length > 1)
      return "Only one file is allowed";
    for (let G = 0; G < x.length; G++)
      if (t && x[G].size > t)
        return `File "${x[G].name}" exceeds ${(t / 1024 / 1024).toFixed(1)}MB limit`;
    if (i) {
      const G = i.split(",").map((Z) => Z.trim());
      for (let Z = 0; Z < x.length; Z++) {
        const ne = "." + ((H = x[Z].name.split(".").pop()) == null ? void 0 : H.toLowerCase()), ee = x[Z].type;
        if (!G.some((de) => de.startsWith(".") ? ne === de.toLowerCase() : ee.match(new RegExp(de.replace("*", ".*")))))
          return `File "${x[Z].name}" type is not allowed`;
      }
    }
    return null;
  }, [l, t, i]), V = L(async (x) => {
    if (!x || x.length === 0) return;
    p(e, !0);
    const H = X(x);
    if (H) {
      w(e, H);
      return;
    }
    w(e, "");
    const G = Array.from(x);
    if (await U(G), l) {
      const Z = Array.isArray(k) ? k : [], ne = G.map((ee) => ({
        name: ee.name,
        size: ee.size,
        type: ee.type,
        file: ee
      }));
      f(e, [...Z, ...ne]);
    } else {
      const Z = {
        name: G[0].name,
        size: G[0].size,
        type: G[0].type,
        file: G[0]
      };
      f(e, Z);
    }
  }, [e, X, f, w, p, U, l, k]), M = L((x) => {
    V(x.target.files), x.target.value = "";
  }, [V]), _ = L((x) => {
    x.preventDefault(), z(!1), V(x.dataTransfer.files);
  }, [V]), s = L((x) => {
    x.preventDefault(), !d && !E && z(!0);
  }, [d, E]), F = L(() => {
    z(!1);
  }, []), q = L((x) => {
    if (l && Array.isArray(k)) {
      const H = k.filter((G, Z) => Z !== x);
      f(e, H.length > 0 ? H : null);
    } else
      f(e, null);
    p(e, !0);
  }, [l, k, e, f, p]), $ = N && Y, B = l ? Array.isArray(k) ? k : [] : k ? [k] : [], P = {
    container: {
      marginBottom: y.spacing,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      ...a
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
      border: `2px dashed ${E || A ? y.primaryColor : $ ? y.errorColor : y.borderColor}`,
      borderRadius: y.borderRadius,
      backgroundColor: A ? "#f9fafb" : "#ffffff",
      cursor: d || E ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      textAlign: "center",
      opacity: d ? 0.6 : 1
    },
    dropzoneLabel: {
      cursor: d || E ? "not-allowed" : "pointer",
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
  }, T = (x) => x < 1024 ? x + " B" : x < 1024 * 1024 ? (x / 1024).toFixed(1) + " KB" : (x / (1024 * 1024)).toFixed(1) + " MB";
  return /* @__PURE__ */ r.jsxs("div", { style: P.container, className: v, children: [
    n && /* @__PURE__ */ r.jsxs("label", { style: P.label, children: [
      n,
      o && /* @__PURE__ */ r.jsx("span", { style: P.required, children: "*" })
    ] }),
    /* @__PURE__ */ r.jsxs(
      "div",
      {
        style: P.dropzone,
        onDragOver: s,
        onDragLeave: F,
        onDrop: _,
        children: [
          /* @__PURE__ */ r.jsx(
            "input",
            {
              type: "file",
              name: e,
              onChange: M,
              accept: i,
              multiple: l,
              disabled: d || E,
              style: { display: "none" },
              id: `file-input-${e}`
            }
          ),
          /* @__PURE__ */ r.jsxs("label", { htmlFor: `file-input-${e}`, style: P.dropzoneLabel, children: [
            /* @__PURE__ */ r.jsx("div", { style: P.dropzoneText, children: E ? "Uploading..." : "Drag and drop files here or click to select" }),
            t && /* @__PURE__ */ r.jsxs("div", { style: P.sizeText, children: [
              "Max file size: ",
              (t / 1024 / 1024).toFixed(1),
              "MB"
            ] })
          ] }),
          E && /* @__PURE__ */ r.jsxs("div", { style: P.progressContainer, children: [
            /* @__PURE__ */ r.jsx("div", { style: P.progressBar, children: /* @__PURE__ */ r.jsx(
              "div",
              {
                style: {
                  ...P.progressFill,
                  width: `${c}%`
                }
              }
            ) }),
            /* @__PURE__ */ r.jsxs("div", { style: P.progressText, children: [
              "Uploading... ",
              c,
              "%"
            ] })
          ] })
        ]
      }
    ),
    b && B.length > 0 && /* @__PURE__ */ r.jsx("div", { style: P.filesContainer, children: B.map((x, H) => /* @__PURE__ */ r.jsxs("div", { style: P.fileItem, children: [
      /* @__PURE__ */ r.jsxs("div", { style: P.fileInfo, children: [
        /* @__PURE__ */ r.jsx("span", { style: P.fileIcon, children: "📄" }),
        /* @__PURE__ */ r.jsxs("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ r.jsx("div", { style: P.fileName, children: x.name }),
          /* @__PURE__ */ r.jsx("div", { style: P.fileSize, children: T(x.size) })
        ] })
      ] }),
      /* @__PURE__ */ r.jsx(
        "button",
        {
          type: "button",
          onClick: () => q(H),
          style: P.removeButton,
          onMouseEnter: (G) => G.currentTarget.style.opacity = "0.7",
          onMouseLeave: (G) => G.currentTarget.style.opacity = "1",
          title: "Remove file",
          children: "×"
        }
      )
    ] }, H)) }),
    $ && /* @__PURE__ */ r.jsxs("span", { style: P.error, children: [
      "⚠️ ",
      Y
    ] }),
    u && !$ && /* @__PURE__ */ r.jsx("span", { style: P.helperText, children: u })
  ] });
};
function ce(e, n) {
  let i = !1;
  return function(...t) {
    i || (e(...t), i = !0, setTimeout(() => {
      i = !1;
    }, n));
  };
}
const Ke = ({
  name: e,
  label: n,
  checked: i = !1,
  disabled: l = !1,
  onChange: t,
  className: o = "",
  helperText: d
}) => {
  const [u, C] = O(i), { validateField: v } = re(e), a = L(
    ce((y) => {
      v(""), t == null || t(y);
    }, 200),
    [t, v]
  ), b = () => {
    const y = !u;
    C(y), a(y);
  };
  return /* @__PURE__ */ r.jsxs(
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
        /* @__PURE__ */ r.jsx(
          "button",
          {
            type: "button",
            name: e,
            onClick: b,
            disabled: l,
            style: {
              position: "relative",
              width: "48px",
              height: "24px",
              backgroundColor: u ? "#000000" : "#e5e7eb",
              borderRadius: "12px",
              cursor: l ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
              border: "none",
              padding: 0
            },
            "aria-pressed": u,
            children: /* @__PURE__ */ r.jsx(
              "div",
              {
                style: {
                  position: "absolute",
                  top: "2px",
                  left: u ? "26px" : "2px",
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
        n && /* @__PURE__ */ r.jsx(
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
        d && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: "#6b7280" }, children: d })
      ]
    }
  );
}, Je = ({
  name: e,
  label: n,
  min: i = 0,
  max: l = 100,
  step: t = 1,
  value: o = 50,
  disabled: d = !1,
  onChange: u,
  className: C = "",
  helperText: v,
  showValue: a = !0
}) => {
  const [b, y] = O(o), { validateField: j } = re(e), h = L(
    ce((w) => {
      j(""), u == null || u(w);
    }, 100),
    [u, j]
  ), S = (w) => {
    const p = Number.parseFloat(w.target.value);
    y(p), h(p);
  }, f = (b - i) / (l - i) * 100;
  return /* @__PURE__ */ r.jsxs(
    "div",
    {
      style: {
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      },
      className: C,
      children: [
        n && /* @__PURE__ */ r.jsxs(
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
              /* @__PURE__ */ r.jsx("span", { children: n }),
              a && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", fontWeight: "600", color: "#000000" }, children: b })
            ]
          }
        ),
        /* @__PURE__ */ r.jsx(
          "div",
          {
            style: {
              position: "relative",
              display: "flex",
              alignItems: "center"
            },
            children: /* @__PURE__ */ r.jsx(
              "input",
              {
                type: "range",
                name: e,
                min: i,
                max: l,
                step: t,
                value: b,
                onChange: S,
                disabled: d,
                style: {
                  width: "100%",
                  height: "6px",
                  borderRadius: "3px",
                  background: `linear-gradient(to right, #000000 0%, #000000 ${f}%, #e5e7eb ${f}%, #e5e7eb 100%)`,
                  outline: "none",
                  WebkitAppearance: "none",
                  appearance: "none",
                  cursor: d ? "not-allowed" : "pointer"
                }
              }
            )
          }
        ),
        v && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: "#6b7280" }, children: v })
      ]
    }
  );
}, Qe = ({
  name: e,
  label: n,
  maxStars: i = 5,
  value: l = 0,
  disabled: t = !1,
  onChange: o,
  className: d = "",
  helperText: u
}) => {
  const [C, v] = O(l), [a, b] = O(0), { validateField: y } = re(e), j = L(
    ce((S) => {
      y(""), o == null || o(S);
    }, 100),
    [o, y]
  ), h = (S) => {
    t || (v(S), j(S));
  };
  return /* @__PURE__ */ r.jsxs(
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
        n && /* @__PURE__ */ r.jsx(
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
        /* @__PURE__ */ r.jsx(
          "div",
          {
            style: {
              display: "flex",
              gap: "8px"
            },
            children: Array.from({ length: i }).map((S, f) => /* @__PURE__ */ r.jsx(
              "button",
              {
                type: "button",
                onClick: () => h(f + 1),
                onMouseEnter: () => b(f + 1),
                onMouseLeave: () => b(0),
                style: {
                  fontSize: "24px",
                  cursor: t ? "not-allowed" : "pointer",
                  color: f < (a || C) ? "#000000" : "#e5e7eb",
                  transition: "color 0.2s ease, transform 0.2s ease",
                  transform: f < (a || C) ? "scale(1.1)" : "scale(1)",
                  background: "none",
                  border: "none",
                  padding: 0
                },
                disabled: t,
                "aria-label": `Rate ${f + 1} out of ${i}`,
                children: "★"
              },
              f
            ))
          }
        ),
        u && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: "#6b7280" }, children: u })
      ]
    }
  );
}, er = ({
  name: e,
  label: n,
  value: i = "#000000",
  required: l = !1,
  disabled: t = !1,
  error: o,
  onChange: d,
  onBlur: u,
  className: C = "",
  helperText: v
}) => {
  const [a, b] = O(i), [y, j] = O(!1), { validateField: h } = re(e), S = L(
    se((w) => {
      h(w), d == null || d(w);
    }, 300),
    [d, h]
  ), f = (w) => {
    const p = w.target.value;
    b(p), S(p);
  };
  return /* @__PURE__ */ r.jsxs("div", { style: { marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }, className: C, children: [
    n && /* @__PURE__ */ r.jsxs(
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
          l && /* @__PURE__ */ r.jsx("span", { style: { color: "#ef4444" }, children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ r.jsxs("div", { style: { display: "flex", gap: "8px", alignItems: "center" }, children: [
      /* @__PURE__ */ r.jsx(
        "input",
        {
          type: "color",
          name: e,
          value: a,
          onChange: f,
          onFocus: () => j(!0),
          onBlur: () => {
            j(!1), u == null || u();
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
      /* @__PURE__ */ r.jsx("span", { style: { fontSize: "14px", color: "#1f2937", fontFamily: "monospace" }, children: a })
    ] }),
    o && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: "#ef4444" }, children: o }),
    v && !o && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: "#6b7280" }, children: v })
  ] });
}, rr = ({
  name: e,
  label: n,
  options: i,
  placeholder: l = "Select options",
  required: t = !1,
  disabled: o = !1,
  helperText: d,
  theme: u,
  className: C,
  containerClassName: v = "",
  labelClassName: a = "",
  errorClassName: b = "",
  style: y,
  maxSelection: j
}) => {
  const h = { ...K, ...u }, {
    values: S,
    errors: f,
    touched: w,
    setFieldValue: p,
    setFieldError: g,
    setFieldTouched: D,
    registerField: A,
    unregisterField: z
  } = Q(), [E, m] = O(!1), [c, I] = O(!1), [R, k] = O(!1), Y = oe(null), N = S[e] || [], W = Array.isArray(N) ? N : [], U = f[e], X = w[e], M = W.length > 0 && !U && X, _ = L(async () => {
    const P = S[e], T = Array.isArray(P) ? P : [];
    let x = "";
    return t && T.length === 0 && (x = "Please select at least one option"), j && T.length > j && (x = `You can select a maximum of ${j} option${j > 1 ? "s" : ""}`), g(e, x), !x;
  }, [S, e, t, j, g]);
  J(() => (A(e, _), () => z(e)), [e, A, z, _]), J(() => {
    const P = (T) => {
      Y.current && !Y.current.contains(T.target) && (m(!1), I(!1), W.length > 0 && D(e, !0));
    };
    return document.addEventListener("mousedown", P), () => document.removeEventListener("mousedown", P);
  }, [e, W.length, D]);
  const s = L((P) => {
    if (o) return;
    const T = W.includes(P);
    let x;
    if (T)
      x = W.filter((H) => H !== P);
    else {
      if (j && W.length >= j) {
        g(e, `You can only select up to ${j} option${j > 1 ? "s" : ""}`);
        return;
      }
      x = [...W, P];
    }
    p(e, x), D(e, !0), T && U && g(e, "");
  }, [e, W, o, j, p, D, g, U]), F = L((P, T) => {
    if (T.stopPropagation(), o) return;
    const x = W.filter((H) => H !== P);
    p(e, x), D(e, !0), U && g(e, "");
  }, [e, W, o, p, D, g, U]), q = L(() => {
    o || (m(!E), I(!E));
  }, [o, E]), $ = X && U, B = {
    container: {
      marginBottom: h.spacing,
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
      color: c ? h.primaryColor : h.textColor,
      letterSpacing: "0.02em",
      lineHeight: "1.5",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: c ? "translateY(-1px)" : "translateY(0)"
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
      border: `2px solid ${$ ? h.errorColor : c ? h.primaryColor : R ? "#a1a1aa" : h.borderColor}`,
      borderRadius: "10px",
      backgroundColor: o ? "#fafafa" : h.backgroundColor,
      color: h.textColor,
      cursor: o ? "not-allowed" : "pointer",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxSizing: "border-box",
      opacity: o ? 0.5 : 1,
      boxShadow: $ ? `0 0 0 4px ${h.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)` : c ? `0 0 0 4px ${h.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)` : R ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 4px rgba(0,0,0,0.04)",
      transform: c ? "translateY(-1px)" : "translateY(0)"
    },
    placeholder: {
      color: "#9ca3af",
      fontSize: "15px"
    },
    selectedText: {
      color: h.textColor,
      fontSize: "15px",
      fontWeight: 500
    },
    arrow: {
      fontSize: "12px",
      color: c ? h.primaryColor : "#6b7280",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: E ? "rotate(180deg)" : "rotate(0deg)"
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
      opacity: M ? 1 : 0,
      transform: M ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    errorIcon: {
      color: h.errorColor,
      opacity: $ ? 1 : 0,
      transform: $ ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: $ ? "shake 0.5s ease-in-out" : "none"
    },
    dropdown: {
      position: "absolute",
      top: "calc(100% + 4px)",
      left: 0,
      right: 0,
      backgroundColor: "#ffffff",
      border: `2px solid ${h.primaryColor}`,
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
      color: h.textColor,
      transition: "all 0.15s ease",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "15px",
      borderBottom: `1px solid ${h.borderColor}20`
    },
    customCheckbox: {
      width: "18px",
      height: "18px",
      borderRadius: "4px",
      border: `2px solid ${h.primaryColor}`,
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
      backgroundColor: `${h.primaryColor}`,
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
  };
  return /* @__PURE__ */ r.jsxs(
    "div",
    {
      ref: Y,
      style: B.container,
      className: v,
      children: [
        n && /* @__PURE__ */ r.jsxs("div", { style: B.labelWrapper, children: [
          /* @__PURE__ */ r.jsx("label", { style: B.label, className: a, children: n }),
          t && /* @__PURE__ */ r.jsx("span", { style: B.requiredBadge, title: "Required field", children: "*" })
        ] }),
        /* @__PURE__ */ r.jsxs("div", { style: B.selectWrapper, children: [
          /* @__PURE__ */ r.jsxs(
            "div",
            {
              style: B.select,
              onClick: q,
              onMouseEnter: () => k(!0),
              onMouseLeave: () => k(!1),
              tabIndex: o ? -1 : 0,
              className: C,
              onKeyDown: (P) => {
                (P.key === "Enter" || P.key === " ") && (P.preventDefault(), q());
              },
              children: [
                /* @__PURE__ */ r.jsx("span", { style: W.length === 0 ? B.placeholder : B.selectedText, children: W.length === 0 ? l : `${W.length} option${W.length > 1 ? "s" : ""} selected` }),
                /* @__PURE__ */ r.jsx("span", { style: B.arrow, children: "▼" })
              ]
            }
          ),
          !E && /* @__PURE__ */ r.jsxs("div", { style: B.iconContainer, children: [
            M && /* @__PURE__ */ r.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: B.checkIcon, children: /* @__PURE__ */ r.jsx("polyline", { points: "20 6 9 17 4 12" }) }),
            $ && !M && /* @__PURE__ */ r.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", style: B.errorIcon, children: /* @__PURE__ */ r.jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
          ] }),
          E && /* @__PURE__ */ r.jsx("div", { style: B.dropdown, children: i.length === 0 ? /* @__PURE__ */ r.jsx("div", { style: { ...B.option, cursor: "default", opacity: 0.6 }, children: "No options available" }) : i.map((P) => {
            const T = W.includes(P.value);
            return /* @__PURE__ */ r.jsxs(
              "div",
              {
                style: {
                  ...B.option,
                  backgroundColor: T ? `${h.primaryColor}08` : "transparent",
                  fontWeight: T ? 500 : 400
                },
                onClick: (x) => {
                  x.stopPropagation(), s(P.value);
                },
                onMouseEnter: (x) => {
                  x.currentTarget.style.backgroundColor = T ? `${h.primaryColor}15` : `${h.primaryColor}05`;
                },
                onMouseLeave: (x) => {
                  x.currentTarget.style.backgroundColor = T ? `${h.primaryColor}08` : "transparent";
                },
                children: [
                  /* @__PURE__ */ r.jsx("div", { style: {
                    ...B.customCheckbox,
                    backgroundColor: T ? h.primaryColor : "transparent"
                  }, children: T && /* @__PURE__ */ r.jsx("svg", { style: B.checkmark, viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ r.jsx("polyline", { points: "2 6 5 9 10 3", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                  P.label
                ]
              },
              P.value
            );
          }) })
        ] }),
        W.length > 0 && /* @__PURE__ */ r.jsx("div", { style: B.selectedBadges, children: W.map((P) => {
          const T = i.find((x) => x.value === P);
          return T ? /* @__PURE__ */ r.jsxs("div", { style: B.badge, children: [
            T.label,
            /* @__PURE__ */ r.jsx(
              "button",
              {
                type: "button",
                onClick: (x) => F(P, x),
                style: B.badgeButton,
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
          ] }, P) : null;
        }) }),
        $ && /* @__PURE__ */ r.jsxs("div", { style: B.errorText, className: b, children: [
          /* @__PURE__ */ r.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", style: { flexShrink: 0, marginTop: "1px" }, children: /* @__PURE__ */ r.jsx("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
          /* @__PURE__ */ r.jsx("span", { children: U })
        ] }),
        d && !$ && /* @__PURE__ */ r.jsx("span", { style: B.helperText, children: d }),
        /* @__PURE__ */ r.jsx("style", { children: `
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
}, tr = ({
  name: e,
  label: n,
  placeholder: i = "Add tags and press Enter",
  value: l = [],
  required: t = !1,
  disabled: o = !1,
  error: d,
  onChange: u,
  onBlur: C,
  className: v = "",
  helperText: a,
  maxTags: b
}) => {
  const [y, j] = O(l), [h, S] = O(""), [f, w] = O(!1), { validateField: p } = re(e), g = L(
    se((z) => {
      p(""), u == null || u(z);
    }, 300),
    [u, p]
  ), D = (z) => {
    if (z.key === "Enter" && h.trim()) {
      if (z.preventDefault(), !b || y.length < b) {
        const E = [...y, h.trim()];
        j(E), S(""), g(E);
      }
    } else if (z.key === "Backspace" && !h && y.length > 0) {
      const E = y.slice(0, -1);
      j(E), g(E);
    }
  }, A = (z) => {
    const E = y.filter((m, c) => c !== z);
    j(E), g(E);
  };
  return /* @__PURE__ */ r.jsxs("div", { style: { marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }, className: v, children: [
    n && /* @__PURE__ */ r.jsxs(
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
          t && /* @__PURE__ */ r.jsx("span", { style: { color: "#ef4444" }, children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ r.jsxs(
      "div",
      {
        style: {
          padding: "10px 12px",
          fontSize: "14px",
          border: `1px solid ${d ? "#ef4444" : f ? "#000000" : "#e5e7eb"}`,
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
          y.map((z, E) => /* @__PURE__ */ r.jsxs(
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
                /* @__PURE__ */ r.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => A(E),
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
            E
          )),
          /* @__PURE__ */ r.jsx(
            "input",
            {
              type: "text",
              value: h,
              onChange: (z) => S(z.target.value),
              onKeyDown: D,
              onFocus: () => w(!0),
              onBlur: () => {
                w(!1), C == null || C();
              },
              placeholder: y.length === 0 ? i : "",
              disabled: o || !!(b && y.length >= b),
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
    d && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: "#ef4444" }, children: d }),
    a && !d && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: "#6b7280" }, children: a })
  ] });
}, or = ({
  name: e,
  label: n,
  options: i,
  placeholder: l = "Search...",
  required: t = !1,
  disabled: o = !1,
  helperText: d,
  theme: u,
  className: C,
  style: v,
  multiple: a = !1,
  freeSolo: b = !1,
  maxSelection: y
}) => {
  const j = { ...K, ...u }, {
    values: h,
    errors: S,
    touched: f,
    setFieldValue: w,
    setFieldError: p,
    setFieldTouched: g,
    registerField: D,
    unregisterField: A
  } = Q(), [z, E] = O(""), [m, c] = O(!1), [I, R] = O(!1), k = oe(null), Y = oe(null), N = h[e], W = a ? Array.isArray(N) ? N : [] : N, U = S[e], X = f[e], V = L(async () => {
    const T = h[e];
    let x = "";
    return t && (a ? (Array.isArray(T) ? T : []).length === 0 && (x = "Please select at least one option") : (!T || T === "") && (x = "This field is required")), a && y && (Array.isArray(T) ? T : []).length > y && (x = `You can select a maximum of ${y} option${y > 1 ? "s" : ""}`), p(e, x), !x;
  }, [h, e, t, a, y, p]);
  J(() => (D(e, V), () => A(e)), [e, D, A, V]);
  const M = te(() => {
    let T = i;
    return a && Array.isArray(W) && (T = i.filter((x) => !W.includes(x.value))), z && (T = T.filter(
      (x) => x.label.toLowerCase().includes(z.toLowerCase())
    )), T;
  }, [z, i, a, W]);
  J(() => {
    const T = (x) => {
      k.current && !k.current.contains(x.target) && (c(!1), R(!1), b && z && !a && w(e, z), g(e, !0));
    };
    return document.addEventListener("mousedown", T), () => document.removeEventListener("mousedown", T);
  }, [e, z, b, a, w, g]);
  const _ = L((T) => {
    var x;
    if (!o) {
      if (a) {
        const H = Array.isArray(W) ? W : [];
        if (y && H.length >= y) {
          p(e, `You can only select up to ${y} option${y > 1 ? "s" : ""}`);
          return;
        }
        const G = [...H, T.value];
        w(e, G), E(""), c(!0);
      } else
        w(e, T.value), E(T.label), c(!1);
      g(e, !0), (x = Y.current) == null || x.focus();
    }
  }, [e, a, W, y, o, w, g, p]), s = L((T, x) => {
    if (x.stopPropagation(), o || !a) return;
    const G = (Array.isArray(W) ? W : []).filter((Z) => Z !== T);
    w(e, G), g(e, !0), U && p(e, "");
  }, [e, a, W, o, w, g, p, U]), F = L((T) => {
    const x = T.target.value;
    E(x), c(!0), b && !a && w(e, x);
  }, [b, a, e, w]), q = L((T) => {
    if (T.key === "Enter" && b && z && a) {
      T.preventDefault();
      const x = Array.isArray(W) ? W : [];
      if (y && x.length >= y) {
        p(e, `You can only select up to ${y} option${y > 1 ? "s" : ""}`);
        return;
      }
      x.includes(z) || (w(e, [...x, z]), E(""), g(e, !0));
    }
    T.key === "Escape" && c(!1);
  }, [b, z, a, W, y, e, w, g, p]), $ = X && U, B = L(() => {
    if (a)
      return (Array.isArray(W) ? W : []).map((x) => {
        const H = i.find((G) => G.value === x);
        return H ? H.label : String(x);
      });
    {
      if (!W) return [];
      const T = i.find((x) => x.value === W);
      return T ? [T.label] : [];
    }
  }, [a, W, i]), P = {
    container: {
      marginBottom: j.spacing,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      position: "relative",
      ...v
    },
    label: {
      fontSize: "14px",
      fontWeight: 500,
      color: j.textColor,
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    required: {
      color: j.errorColor
    },
    inputWrapper: {
      position: "relative"
    },
    input: {
      padding: "10px 12px",
      fontSize: "14px",
      border: `1px solid ${$ ? j.errorColor : I ? j.focusColor : j.borderColor}`,
      borderRadius: j.borderRadius,
      backgroundColor: o ? j.disabledColor : "#ffffff",
      color: j.textColor,
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
      border: `1px solid ${j.borderColor}`,
      borderRadius: j.borderRadius,
      marginTop: "4px",
      maxHeight: "240px",
      overflowY: "auto",
      zIndex: 1e3,
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    },
    option: {
      padding: "10px 12px",
      cursor: "pointer",
      color: j.textColor,
      borderBottom: `1px solid ${j.borderColor}`,
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
      backgroundColor: j.primaryColor,
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
  return /* @__PURE__ */ r.jsxs(
    "div",
    {
      ref: k,
      style: P.container,
      className: C,
      children: [
        n && /* @__PURE__ */ r.jsxs("label", { style: P.label, children: [
          n,
          t && /* @__PURE__ */ r.jsx("span", { style: P.required, children: "*" })
        ] }),
        /* @__PURE__ */ r.jsxs("div", { style: P.inputWrapper, children: [
          /* @__PURE__ */ r.jsx(
            "input",
            {
              ref: Y,
              type: "text",
              name: e,
              value: z,
              onChange: F,
              onFocus: () => {
                R(!0), c(!0);
              },
              onBlur: () => {
                R(!1);
              },
              onKeyDown: q,
              placeholder: l,
              disabled: o,
              style: P.input,
              autoComplete: "off"
            }
          ),
          m && M.length > 0 && /* @__PURE__ */ r.jsx("div", { style: P.dropdown, children: M.map((T) => {
            const x = a && Array.isArray(W) && W.includes(T.value);
            return /* @__PURE__ */ r.jsxs(
              "div",
              {
                style: {
                  ...P.option,
                  backgroundColor: x ? "#e0f2fe" : "transparent",
                  fontWeight: x ? 600 : 400
                },
                onMouseDown: (H) => {
                  H.preventDefault(), _(T);
                },
                onMouseEnter: (H) => {
                  H.currentTarget.style.backgroundColor = x ? "#bfdbfe" : "#f3f4f6";
                },
                onMouseLeave: (H) => {
                  H.currentTarget.style.backgroundColor = x ? "#e0f2fe" : "transparent";
                },
                children: [
                  a && /* @__PURE__ */ r.jsx("span", { style: { marginRight: "8px" }, children: x ? "✓" : "○" }),
                  T.label
                ]
              },
              T.value
            );
          }) }),
          m && M.length === 0 && z && /* @__PURE__ */ r.jsx("div", { style: P.dropdown, children: /* @__PURE__ */ r.jsx("div", { style: P.noOptions, children: b ? `Press Enter to add "${z}"` : "No options found" }) })
        ] }),
        a && Array.isArray(W) && W.length > 0 && /* @__PURE__ */ r.jsx("div", { style: P.selectedBadges, children: B().map((T, x) => {
          const H = W[x];
          return /* @__PURE__ */ r.jsxs("div", { style: P.badge, children: [
            T,
            /* @__PURE__ */ r.jsx(
              "button",
              {
                type: "button",
                onClick: (G) => s(H, G),
                style: P.badgeButton,
                onMouseEnter: (G) => G.currentTarget.style.opacity = "0.7",
                onMouseLeave: (G) => G.currentTarget.style.opacity = "1",
                title: "Remove",
                children: "×"
              }
            )
          ] }, H);
        }) }),
        $ && /* @__PURE__ */ r.jsxs("span", { style: P.error, children: [
          "⚠️ ",
          U
        ] }),
        d && !$ && /* @__PURE__ */ r.jsx("span", { style: P.helperText, children: d })
      ]
    }
  );
}, sr = ({
  name: e,
  label: n,
  placeholder: i = "0.00",
  currency: l = "USD",
  min: t,
  max: o,
  required: d = !1,
  disabled: u = !1,
  error: C,
  onChange: v,
  onBlur: a,
  className: b = "",
  helperText: y
}) => {
  const [j, h] = O(""), [S, f] = O(!1), { validateField: w } = re(e, {
    type: "custom",
    customValidator: (A) => {
      const z = A === "" ? null : Number.parseFloat(A);
      return !(d && (z === null || isNaN(z)) || z !== null && (t !== void 0 && z < t || o !== void 0 && z > o));
    },
    errorMessage: d ? `Please enter a valid ${l} amount between ${t == null ? void 0 : t.toFixed(2)} and ${o == null ? void 0 : o.toFixed(2)}` : `Amount must be between ${t == null ? void 0 : t.toFixed(2)} and ${o == null ? void 0 : o.toFixed(2)}`
  }), p = (A) => {
    const z = A.replace(/[^\d.]/g, "");
    return z ? Number.parseFloat(z).toFixed(2) : "";
  }, g = L(
    se((A) => {
      w(A);
      const z = A === "" ? null : Number.parseFloat(A);
      v == null || v(z);
    }, 300),
    [w, v]
  ), D = (A) => {
    const z = p(A.target.value);
    h(z), g(z);
  };
  return J(() => {
    const A = document.createElement("style");
    return A.innerHTML = `
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
    `, document.head.appendChild(A), () => {
      document.head.removeChild(A);
    };
  }, []), /* @__PURE__ */ r.jsxs("div", { className: `currency-field ${b}`, children: [
    n && /* @__PURE__ */ r.jsxs("label", { className: "currency-label", children: [
      n,
      d && /* @__PURE__ */ r.jsx("span", { className: "currency-required", children: "*" })
    ] }),
    /* @__PURE__ */ r.jsxs(
      "div",
      {
        className: `currency-input-container 
          ${S ? "focused" : ""} 
          ${C ? "error" : ""} 
          ${u ? "disabled" : ""}`,
        children: [
          /* @__PURE__ */ r.jsx("span", { className: "currency-symbol", children: l }),
          /* @__PURE__ */ r.jsx(
            "input",
            {
              type: "text",
              name: e,
              value: j,
              onChange: D,
              onFocus: () => f(!0),
              onBlur: () => {
                f(!1), a == null || a();
              },
              placeholder: i,
              disabled: u,
              className: "currency-input"
            }
          )
        ]
      }
    ),
    C && /* @__PURE__ */ r.jsx("span", { className: "currency-error-text", children: C }),
    y && !C && /* @__PURE__ */ r.jsx("span", { className: "currency-helper-text", children: y })
  ] });
}, nr = ({
  name: e,
  label: n,
  placeholder: i = "5550000000",
  countryCode: l = "+1",
  required: t = !1,
  disabled: o = !1,
  onChange: d,
  onBlur: u,
  className: C = "",
  containerClassName: v = "",
  labelClassName: a = "",
  errorClassName: b = "",
  inputClassName: y = "",
  helperText: j,
  theme: h
}) => {
  const S = Q(), f = { ...K, ...h }, [w, p] = O(l), [g, D] = O(!1), [A, z] = O(!1), E = S.values[e] || "", m = S.errors[e], c = S.touched[e], I = E.replace(/^\+\d+\s*/, ""), k = I && I.length > 0 && !m && c, Y = L(async () => {
    const M = S.values[e] || "";
    let _ = "";
    if (t && !M)
      _ = "This field is required";
    else if (M) {
      const s = M.replace(/\D/g, "");
      s.length < 10 ? _ = "Phone number must be at least 10 digits" : s.length > 15 && (_ = "Phone number is too long");
    }
    return S.setFieldError(e, _), !_;
  }, [e, t, S]);
  J(() => (S.registerField(e, Y), () => {
    S.unregisterField(e);
  }), [e, Y, S]);
  const N = (M) => {
    const s = M.target.value.replace(/[^\d\s\-()]/g, ""), F = `${w} ${s}`;
    S.setFieldValue(e, F), d == null || d(F), c && m && S.setFieldError(e, "");
  }, W = (M) => {
    let _ = M.target.value;
    if (_ ? _.startsWith("+") || (_ = "+" + _) : _ = "+", _ = "+" + _.slice(1).replace(/\D/g, ""), p(_), I) {
      const s = `${_} ${I}`;
      S.setFieldValue(e, s), d == null || d(s);
    }
  }, U = () => {
    D(!1), S.setFieldTouched(e, !0), Y(), u == null || u();
  }, X = () => {
    D(!0);
  }, V = {
    container: {
      marginBottom: f.spacing,
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
      color: g ? f.primaryColor : f.textColor,
      letterSpacing: "0.02em",
      lineHeight: "1.5",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: g ? "translateY(-1px)" : "translateY(0)"
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
    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      border: `2px solid ${m && c ? f.errorColor : g ? f.primaryColor : A ? "#a1a1aa" : f.borderColor}`,
      borderRadius: "10px",
      backgroundColor: o ? "#fafafa" : f.backgroundColor,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: m && c ? `0 0 0 4px ${f.errorColor}08, 0 2px 8px rgba(0,0,0,0.04)` : g ? `0 0 0 4px ${f.primaryColor}10, 0 4px 12px rgba(0,0,0,0.08)` : A ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 4px rgba(0,0,0,0.04)",
      transform: g ? "translateY(-1px)" : "translateY(0)",
      opacity: o ? 0.5 : 1
    },
    countryCodeInput: {
      width: "70px",
      padding: "13px 8px",
      fontSize: "15px",
      fontWeight: 600,
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      color: f.textColor,
      border: "none",
      borderRight: `1.5px solid ${f.borderColor}`,
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
      color: f.textColor,
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
      opacity: k ? 1 : 0,
      transform: k ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    errorIcon: {
      color: f.errorColor,
      opacity: m && c ? 1 : 0,
      transform: m && c ? "scale(1)" : "scale(0)",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: m && c ? "shake 0.5s ease-in-out" : "none"
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
  return /* @__PURE__ */ r.jsxs("div", { style: V.container, className: v, children: [
    n && /* @__PURE__ */ r.jsxs("div", { style: V.labelWrapper, children: [
      /* @__PURE__ */ r.jsx("label", { style: V.label, htmlFor: e, className: a, children: n }),
      t && /* @__PURE__ */ r.jsx("span", { style: V.requiredBadge, title: "Required field", children: "*" })
    ] }),
    /* @__PURE__ */ r.jsxs(
      "div",
      {
        style: V.inputWrapper,
        onMouseEnter: () => z(!0),
        onMouseLeave: () => z(!1),
        children: [
          /* @__PURE__ */ r.jsx(
            "input",
            {
              type: "text",
              value: w,
              onChange: W,
              onFocus: X,
              onBlur: U,
              disabled: o,
              style: V.countryCodeInput,
              className: y,
              placeholder: "+1"
            }
          ),
          /* @__PURE__ */ r.jsx(
            "input",
            {
              id: e,
              type: "tel",
              name: e,
              value: I,
              onChange: N,
              onFocus: X,
              onBlur: U,
              placeholder: i,
              disabled: o,
              "aria-invalid": !!(m && c),
              "aria-describedby": m && c ? `${e}-error` : void 0,
              style: V.phoneInput,
              className: `${C} ${y}`
            }
          ),
          /* @__PURE__ */ r.jsxs("div", { style: V.iconContainer, children: [
            k && /* @__PURE__ */ r.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: V.checkIcon, children: /* @__PURE__ */ r.jsx("polyline", { points: "20 6 9 17 4 12" }) }),
            m && c && !k && /* @__PURE__ */ r.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", style: V.errorIcon, children: /* @__PURE__ */ r.jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" }) })
          ] })
        ]
      }
    ),
    m && c && /* @__PURE__ */ r.jsxs("div", { id: `${e}-error`, role: "alert", style: V.errorText, className: b, children: [
      /* @__PURE__ */ r.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", style: { flexShrink: 0, marginTop: "1px" }, children: /* @__PURE__ */ r.jsx("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z" }) }),
      /* @__PURE__ */ r.jsx("span", { children: m })
    ] }),
    j && !(m && c) && /* @__PURE__ */ r.jsx("div", { style: V.helperText, children: j }),
    /* @__PURE__ */ r.jsx("style", { children: `
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
}, ue = (e, n = 300, i = "ease-in-out") => ({
  animation: `${e} ${n}ms ${i}`
}), ir = ({
  name: e,
  label: n,
  placeholder: i = "https://example.com",
  required: l = !1,
  disabled: t = !1,
  onChange: o,
  onBlur: d,
  theme: u = K,
  className: C = "",
  helperText: v
}) => {
  const [a, b] = O(""), [y, j] = O(!1), { validateField: h, error: S } = re(e, {
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
  }), f = L(
    se((z) => {
      h(z), o == null || o(z);
    }, 300),
    [h, o]
  ), w = (z) => {
    const E = z.target.value;
    b(E), f(E);
  }, p = {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  }, g = {
    fontSize: "14px",
    fontWeight: "500",
    color: u.text.primary,
    display: "flex",
    alignItems: "center",
    gap: "4px"
  }, D = {
    padding: "10px 12px",
    fontSize: "14px",
    border: `1px solid ${S ? u.colors.error : y ? u.colors.primary : u.colors.border}`,
    borderRadius: "6px",
    backgroundColor: t ? u.colors.disabled : u.colors.background,
    color: u.text.primary,
    transition: "all 0.2s ease",
    outline: "none",
    ...ue("slideIn")
  }, A = {
    fontSize: "12px",
    color: u.colors.error,
    animation: "slideIn 0.2s ease"
  };
  return /* @__PURE__ */ r.jsxs("div", { style: p, className: C, children: [
    n && /* @__PURE__ */ r.jsxs("label", { style: g, children: [
      n,
      l && /* @__PURE__ */ r.jsx("span", { style: { color: u.colors.error }, children: "*" })
    ] }),
    /* @__PURE__ */ r.jsx(
      "input",
      {
        type: "url",
        name: e,
        value: a,
        onChange: w,
        onFocus: () => j(!0),
        onBlur: () => {
          j(!1), h(a), d == null || d();
        },
        placeholder: i,
        disabled: t,
        style: D
      }
    ),
    S && /* @__PURE__ */ r.jsx("span", { style: A, children: S }),
    v && !S && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: u.text.secondary }, children: v })
  ] });
}, lr = ({
  name: e,
  label: n,
  placeholder: i = "Search...",
  minChars: l = 2,
  required: t = !1,
  disabled: o = !1,
  error: d,
  onChange: u,
  onSearch: C,
  onBlur: v,
  theme: a = K,
  className: b = "",
  helperText: y
}) => {
  const [j, h] = O(""), [S, f] = O(!1), { validateField: w, error: p } = re(e, {
    type: "custom",
    customValidator: (k) => !(t && !k.trim() || k.length < l),
    errorMessage: t ? `Please enter at least ${l} characters` : `Minimum ${l} characters required`
  }), g = L(
    se((k) => {
      w(k), k.length >= l && (C == null || C(k)), u == null || u(k);
    }, 300),
    [w, l, C, u]
  ), D = (k) => {
    const Y = k.target.value;
    h(Y), g(Y);
  }, A = {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  }, z = {
    fontSize: "14px",
    fontWeight: "500",
    color: a.text.primary,
    display: "flex",
    alignItems: "center",
    gap: "4px"
  }, E = {
    display: "flex",
    alignItems: "center",
    border: `1px solid ${d ? a.colors.error : S ? a.colors.primary : a.colors.border}`,
    borderRadius: "6px",
    backgroundColor: o ? a.colors.disabled : a.colors.background,
    transition: "all 0.2s ease",
    ...ue("slideIn")
  }, m = {
    padding: "10px 12px",
    color: a.text.secondary,
    fontSize: "16px"
  }, c = {
    flex: 1,
    padding: "10px 12px",
    fontSize: "14px",
    border: "none",
    backgroundColor: "transparent",
    color: a.text.primary,
    outline: "none"
  }, I = {
    padding: "10px 12px",
    background: "none",
    border: "none",
    color: a.text.secondary,
    cursor: "pointer",
    fontSize: "16px",
    display: j ? "block" : "none"
  }, R = {
    fontSize: "12px",
    color: a.colors.error,
    animation: "slideIn 0.2s ease"
  };
  return /* @__PURE__ */ r.jsxs("div", { style: A, className: b, children: [
    n && /* @__PURE__ */ r.jsxs("label", { style: z, children: [
      n,
      t && /* @__PURE__ */ r.jsx("span", { style: { color: a.colors.error }, children: "*" })
    ] }),
    /* @__PURE__ */ r.jsxs("div", { style: E, children: [
      /* @__PURE__ */ r.jsx("span", { style: m, children: "🔍" }),
      /* @__PURE__ */ r.jsx(
        "input",
        {
          type: "text",
          name: e,
          value: j,
          onChange: D,
          onFocus: () => f(!0),
          onBlur: () => {
            f(!1), v == null || v();
          },
          placeholder: i,
          disabled: o,
          style: c
        }
      ),
      /* @__PURE__ */ r.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            h(""), u == null || u("");
          },
          style: I,
          disabled: o,
          children: "✕"
        }
      )
    ] }),
    d && /* @__PURE__ */ r.jsx("span", { style: R, children: d }),
    y && !d && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: a.text.secondary }, children: y })
  ] });
}, ar = ({
  name: e,
  label: n,
  value: i = 0,
  min: l = 0,
  max: t = 100,
  step: o = 1,
  disabled: d = !1,
  onChange: u,
  theme: C = K,
  className: v = "",
  helperText: a
}) => {
  const [b, y] = O(i), { validateField: j, error: h } = re(e, {
    type: "custom",
    customValidator: (m) => {
      const c = Number(m);
      return !(isNaN(c) || c < l || c > t);
    },
    errorMessage: `Value must be between ${l} and ${t}`
  }), S = L(
    ce((m) => {
      j(m.toString()), u && u(m);
    }, 100),
    [j, u]
  ), f = () => {
    if (b < t) {
      const m = b + o;
      y(m), S(m);
    }
  }, w = () => {
    if (b > l) {
      const m = b - o;
      y(m), S(m);
    }
  }, p = (m) => {
    const c = Number.parseInt(m.target.value) || 0;
    c >= l && c <= t && (y(c), S(c));
  }, g = {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  }, D = {
    fontSize: "14px",
    fontWeight: "500",
    color: C.text.primary
  }, A = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    ...ue("slideIn")
  }, z = (m) => ({
    width: "40px",
    height: "40px",
    border: `1px solid ${C.colors.border}`,
    borderRadius: "6px",
    backgroundColor: m ? C.colors.disabled : C.colors.background,
    color: C.text.primary,
    cursor: m ? "not-allowed" : "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "all 0.2s ease"
  }), E = {
    width: "60px",
    padding: "8px",
    fontSize: "14px",
    border: `1px solid ${C.colors.border}`,
    borderRadius: "6px",
    backgroundColor: d ? C.colors.disabled : C.colors.background,
    color: C.text.primary,
    textAlign: "center",
    outline: "none"
  };
  return /* @__PURE__ */ r.jsxs("div", { style: g, className: v, children: [
    n && /* @__PURE__ */ r.jsx("label", { style: D, children: n }),
    /* @__PURE__ */ r.jsxs("div", { style: A, children: [
      /* @__PURE__ */ r.jsx(
        "button",
        {
          type: "button",
          onClick: w,
          disabled: d || b <= l,
          style: z(d || b <= l),
          children: "−"
        }
      ),
      /* @__PURE__ */ r.jsx(
        "input",
        {
          type: "number",
          name: e,
          value: b,
          onChange: p,
          disabled: d,
          style: E,
          min: l,
          max: t
        }
      ),
      /* @__PURE__ */ r.jsx(
        "button",
        {
          type: "button",
          onClick: f,
          disabled: d || b >= t,
          style: z(d || b >= t),
          children: "+"
        }
      )
    ] }),
    a && /* @__PURE__ */ r.jsx("span", { style: { fontSize: "12px", color: C.text.secondary }, children: a })
  ] });
}, cr = ({
  children: e,
  title: n,
  description: i,
  theme: l,
  spacing: t = "normal",
  highlight: o = !1
}) => {
  const d = { ...K, ...l }, C = {
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
      overflow: "hidden"
    },
    header: {
      marginBottom: i ? "10px" : "6px"
    },
    title: {
      fontSize: "15px",
      fontWeight: 600,
      color: d.textColor,
      marginBottom: i ? "4px" : "0",
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
  return /* @__PURE__ */ r.jsxs(
    "div",
    {
      style: C.container,
      onMouseEnter: (v) => {
        v.currentTarget.style.boxShadow = `0 0 0 4px ${d.primaryColor}15, 0 2px 8px rgba(0,0,0,0.06)`;
      },
      onMouseLeave: (v) => {
        v.currentTarget.style.boxShadow = o ? `0 0 0 4px ${d.primaryColor}10, 0 1px 6px rgba(0,0,0,0.05)` : "0 1px 4px rgba(0,0,0,0.03)";
      },
      children: [
        (n || i) && /* @__PURE__ */ r.jsxs("div", { style: C.header, children: [
          n && /* @__PURE__ */ r.jsx("div", { style: C.title, children: n }),
          i && /* @__PURE__ */ r.jsx("div", { style: C.description, children: i }),
          n && /* @__PURE__ */ r.jsx("div", { style: C.underline })
        ] }),
        /* @__PURE__ */ r.jsx("div", { style: C.content, children: e }),
        /* @__PURE__ */ r.jsx("style", { children: `
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
}, dr = ({ children: e, columns: n = 2, gap: i = "16px" }) => {
  const l = {
    container: {
      display: "grid",
      gridTemplateColumns: `repeat(${n}, 1fr)`,
      gap: i,
      marginBottom: i
    }
  };
  return /* @__PURE__ */ r.jsx("div", { style: l.container, children: e });
}, pr = ({
  name: e,
  length: n = 6,
  label: i,
  required: l = !1,
  disabled: t = !1,
  onComplete: o,
  theme: d,
  helperText: u,
  className: C,
  style: v
}) => {
  var c, I;
  const a = { ...K, ...d }, b = (() => {
    try {
      return Q();
    } catch {
      return null;
    }
  })(), [y, j] = O(Array(n).fill("")), [h, S] = O(!1), f = oe([]), w = (c = b == null ? void 0 : b.errors) == null ? void 0 : c[e], g = (((I = b == null ? void 0 : b.touched) == null ? void 0 : I[e]) || h) && w, D = L(async () => {
    if (!b) return !0;
    const R = y.join("");
    let k = "";
    return l && R.length < n && (k = "Please enter complete OTP"), b.setFieldError(e, k), !k;
  }, [b, e, y, l, n]);
  J(() => {
    if (b)
      return b.registerField(e, D), () => b.unregisterField(e);
  }, [b, e, D]), J(() => {
    b && b.setFieldValue(e, y.join(""));
  }, [y, b, e]);
  const A = (R, k) => {
    var W;
    if (t || !/^[0-9a-zA-Z]?$/.test(k)) return;
    const Y = [...y];
    Y[R] = k, j(Y), S(!0), b == null || b.setFieldTouched(e, !0), b == null || b.setFieldError(e, ""), k && R < n - 1 && ((W = f.current[R + 1]) == null || W.focus());
    const N = Y.join("");
    N.length === n && (o == null || o(N));
  }, z = (R, k) => {
    var Y;
    k.key === "Backspace" && !y[R] && R > 0 && ((Y = f.current[R - 1]) == null || Y.focus());
  }, E = (R) => {
    R.preventDefault();
    const Y = R.clipboardData.getData("text").slice(0, n).split(""), N = Array(n).fill("").map((W, U) => Y[U] ?? "");
    j(N), N.join("").length === n && (o == null || o(N.join("")));
  }, m = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginBottom: a.spacing,
      ...v
    },
    label: {
      fontSize: "14px",
      fontWeight: 600,
      color: a.textColor,
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    required: { color: a.errorColor },
    inputGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "10px"
    },
    box: {
      width: "42px",
      height: "48px",
      borderRadius: a.borderRadius,
      border: `2px solid ${g ? a.errorColor : a.borderColor}`,
      textAlign: "center",
      fontSize: "20px",
      fontWeight: 600,
      outline: "none",
      color: a.textColor,
      transition: "all 0.2s ease",
      backgroundColor: t ? "#f3f4f6" : "#fff"
    },
    errorText: {
      fontSize: "12px",
      color: a.errorColor,
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    helperText: {
      fontSize: "12px",
      color: "#6b7280"
    }
  };
  return /* @__PURE__ */ r.jsxs("div", { style: m.container, className: C, children: [
    i && /* @__PURE__ */ r.jsxs("label", { style: m.label, children: [
      i,
      l && /* @__PURE__ */ r.jsx("span", { style: m.required, children: "*" })
    ] }),
    /* @__PURE__ */ r.jsx("div", { style: m.inputGroup, onPaste: E, children: y.map((R, k) => /* @__PURE__ */ r.jsx(
      "input",
      {
        type: "text",
        inputMode: "numeric",
        maxLength: 1,
        value: R,
        disabled: t,
        onChange: (Y) => A(k, Y.target.value),
        onKeyDown: (Y) => z(k, Y),
        ref: (Y) => f.current[k] = Y,
        style: m.box
      },
      k
    )) }),
    g && /* @__PURE__ */ r.jsxs("span", { style: m.errorText, children: [
      "⚠️ ",
      w
    ] }),
    u && !g && /* @__PURE__ */ r.jsx("span", { style: m.helperText, children: u })
  ] });
}, ur = () => {
  const e = Q();
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
  const i = Object(this), l = Number.parseInt(i.length, 10) || 0;
  if (l !== 0)
    for (let t = 0; t < l; t++) {
      const o = i[t];
      if (e.call(n, o, t, i))
        return o;
    }
});
typeof Object.assign != "function" && Object.defineProperty(Object, "assign", {
  value: function(n, ...i) {
    if (n == null)
      throw new TypeError("Cannot convert undefined or null to object");
    const l = Object(n);
    for (let t = 0; t < i.length; t++) {
      const o = i[t];
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
  or as Autocomplete,
  Be as Button,
  Le as Checkbox,
  er as ColorPicker,
  sr as CurrencyField,
  Xe as DateField,
  Ze as FileUpload,
  Pe as Form,
  cr as FormGroup,
  we as FormProvider,
  dr as FormRow,
  rr as MultiSelect,
  qe as NumberField,
  pr as OtpInput,
  _e as PasswordField,
  nr as PhoneField,
  Oe as Radio,
  Qe as Rating,
  lr as SearchField,
  He as Select,
  Je as Slider,
  ar as Stepper,
  tr as TagsInput,
  Ne as TextField,
  Ue as Textarea,
  Ge as TimeField,
  Ke as Toggle,
  ir as URLField,
  se as debounce,
  K as defaultTheme,
  ce as throttle,
  re as useFieldValidation,
  ur as useForm,
  Q as useFormContext,
  ae as validate,
  We as validateAlphanumeric,
  Se as validateEmail,
  Ye as validateLength,
  $e as validateName,
  Ve as validateNumber,
  Te as validatePassword,
  Me as validatePasswordMatch,
  Fe as validatePhone,
  Re as validateUrl
};
