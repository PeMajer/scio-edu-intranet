import {
  require_sanity
} from "/build/_shared/chunk-ZCBD3Q24.js";
import {
  Button
} from "/build/_shared/chunk-ACAEBKW3.js";
import "/build/_shared/chunk-B43JI2TA.js";
import {
  Badge
} from "/build/_shared/chunk-QXNWIAMC.js";
import "/build/_shared/chunk-LVTXE7EF.js";
import {
  Users
} from "/build/_shared/chunk-3KFOPC32.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  require_cloudflare,
  require_supabase
} from "/build/_shared/chunk-E7IXQJ4O.js";
import {
  Link,
  useLoaderData
} from "/build/_shared/chunk-ZC5ZMZF5.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  createHotContext
} from "/build/_shared/chunk-MKPQ2N7Z.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import "/build/_shared/chunk-7M6SC7J5.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/vzdelavani.tymy.tsx
var import_cloudflare = __toESM(require_cloudflare(), 1);
var import_supabase = __toESM(require_supabase(), 1);
var import_sanity = __toESM(require_sanity(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/vzdelavani.tymy.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/vzdelavani.tymy.tsx"
  );
  import.meta.hot.lastModified = "1774554218072.4304";
}
function VzdelavaniTymy() {
  _s();
  const {
    courses
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto p-6 max-w-7xl", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Rozvoj pro t\xFDmy a kvadri\xE1dy" }, void 0, false, {
        fileName: "app/routes/vzdelavani.tymy.tsx",
        lineNumber: 52,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-[#687A7C]", children: "Specializovan\xE9 programy pro t\xFDmovou spolupr\xE1ci a rozvoj kvadri\xE1d" }, void 0, false, {
        fileName: "app/routes/vzdelavani.tymy.tsx",
        lineNumber: 55,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/vzdelavani.tymy.tsx",
      lineNumber: 51,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-12 h-12 rounded-lg bg-[#687A7C] flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "w-6 h-6 text-white" }, void 0, false, {
          fileName: "app/routes/vzdelavani.tymy.tsx",
          lineNumber: 64,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/vzdelavani.tymy.tsx",
          lineNumber: 63,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { children: "T\xFDmov\xE9 kurzy" }, void 0, false, {
            fileName: "app/routes/vzdelavani.tymy.tsx",
            lineNumber: 67,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Kurzy zam\u011B\u0159en\xE9 na t\xFDmovou spolupr\xE1ci a veden\xED" }, void 0, false, {
            fileName: "app/routes/vzdelavani.tymy.tsx",
            lineNumber: 68,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/vzdelavani.tymy.tsx",
          lineNumber: 66,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/vzdelavani.tymy.tsx",
        lineNumber: 62,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/vzdelavani.tymy.tsx",
        lineNumber: 61,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: courses.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-12 text-[#687A7C]", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "w-16 h-16 mx-auto mb-4 opacity-50" }, void 0, false, {
          fileName: "app/routes/vzdelavani.tymy.tsx",
          lineNumber: 76,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mb-2", children: "Moment\xE1ln\u011B nejsou k dispozici \u017E\xE1dn\xE9 kurzy" }, void 0, false, {
          fileName: "app/routes/vzdelavani.tymy.tsx",
          lineNumber: 77,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm", children: "Brzy p\u0159id\xE1me nov\xE9 t\xFDmov\xE9 programy" }, void 0, false, {
          fileName: "app/routes/vzdelavani.tymy.tsx",
          lineNumber: 78,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/vzdelavani.tymy.tsx",
        lineNumber: 75,
        columnNumber: 35
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: courses.map((course) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { className: "hover:shadow-lg transition-shadow", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { className: "text-lg", children: course.title }, void 0, false, {
              fileName: "app/routes/vzdelavani.tymy.tsx",
              lineNumber: 83,
              columnNumber: 23
            }, this),
            course.is_external && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, { variant: "outline", className: "text-xs", children: "Extern\xED" }, void 0, false, {
              fileName: "app/routes/vzdelavani.tymy.tsx",
              lineNumber: 84,
              columnNumber: 46
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/vzdelavani.tymy.tsx",
            lineNumber: 82,
            columnNumber: 21
          }, this),
          course.highlight && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: course.highlight }, void 0, false, {
            fileName: "app/routes/vzdelavani.tymy.tsx",
            lineNumber: 88,
            columnNumber: 42
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/vzdelavani.tymy.tsx",
          lineNumber: 81,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-3", children: [
          course.price && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-[#687A7C]", children: [
            "Cena: ",
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-semibold", children: [
              course.price,
              " K\u010D"
            ] }, void 0, true, {
              fileName: "app/routes/vzdelavani.tymy.tsx",
              lineNumber: 93,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/vzdelavani.tymy.tsx",
            lineNumber: 92,
            columnNumber: 40
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "accent", size: "sm", className: "w-full", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/vzdelavani/kurz/${course.slug.current}`, children: "Zobrazit detail" }, void 0, false, {
            fileName: "app/routes/vzdelavani.tymy.tsx",
            lineNumber: 96,
            columnNumber: 25
          }, this) }, void 0, false, {
            fileName: "app/routes/vzdelavani.tymy.tsx",
            lineNumber: 95,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/vzdelavani.tymy.tsx",
          lineNumber: 91,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "app/routes/vzdelavani.tymy.tsx",
          lineNumber: 90,
          columnNumber: 19
        }, this)
      ] }, course._id, true, {
        fileName: "app/routes/vzdelavani.tymy.tsx",
        lineNumber: 80,
        columnNumber: 38
      }, this)) }, void 0, false, {
        fileName: "app/routes/vzdelavani.tymy.tsx",
        lineNumber: 79,
        columnNumber: 22
      }, this) }, void 0, false, {
        fileName: "app/routes/vzdelavani.tymy.tsx",
        lineNumber: 74,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/vzdelavani.tymy.tsx",
      lineNumber: 60,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/vzdelavani.tymy.tsx",
    lineNumber: 50,
    columnNumber: 10
  }, this);
}
_s(VzdelavaniTymy, "freR5hLJ574D9C0pHkq+VO0OK9E=", false, function() {
  return [useLoaderData];
});
_c = VzdelavaniTymy;
var _c;
$RefreshReg$(_c, "VzdelavaniTymy");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  VzdelavaniTymy as default
};
//# sourceMappingURL=/build/routes/vzdelavani.tymy-HR6W2SCP.js.map
