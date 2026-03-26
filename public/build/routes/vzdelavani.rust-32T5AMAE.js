import {
  require_sanity
} from "/build/_shared/chunk-ZCBD3Q24.js";
import {
  Button
} from "/build/_shared/chunk-OJZR66OH.js";
import "/build/_shared/chunk-B43JI2TA.js";
import {
  Badge
} from "/build/_shared/chunk-F537AGH2.js";
import "/build/_shared/chunk-LVTXE7EF.js";
import {
  Sparkles,
  Target,
  Wrench
} from "/build/_shared/chunk-3KFOPC32.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  require_cloudflare,
  require_supabase
} from "/build/_shared/chunk-4IYFJ33G.js";
import {
  Link,
  useLoaderData
} from "/build/_shared/chunk-44HCPI6G.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  createHotContext
} from "/build/_shared/chunk-CQLUSK5F.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import "/build/_shared/chunk-7M6SC7J5.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/vzdelavani.rust.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/vzdelavani.rust.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/vzdelavani.rust.tsx"
  );
  import.meta.hot.lastModified = "1774557886810.4763";
}
var subsectionConfig = {
  sciocile: {
    title: "Kurzy na ScioC\xEDle",
    description: "Specializovan\xE9 kurzy zam\u011B\u0159en\xE9 na ScioC\xEDle",
    icon: Target
  },
  remeslo: {
    title: "\u0158emeslo pr\u016Fvodce",
    description: "Praktick\xE9 dovednosti pro pr\xE1ci pr\u016Fvodce",
    icon: Wrench
  },
  osobni: {
    title: "Osobn\xED rozvoj",
    description: "Kurzy zam\u011B\u0159en\xE9 na osobn\xED r\u016Fst a seberozvoj",
    icon: Sparkles
  }
};
function VzdelavaniRust() {
  _s();
  const {
    subsections
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto p-6 max-w-7xl", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Vzd\u011Bl\xE1v\xE1n\xED a r\u016Fst pro ka\u017Ed\xE9ho" }, void 0, false, {
        fileName: "app/routes/vzdelavani.rust.tsx",
        lineNumber: 74,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-[#687A7C]", children: "Kurzy zam\u011B\u0159en\xE9 na osobn\xED rozvoj a odborn\xE9 dovednosti" }, void 0, false, {
        fileName: "app/routes/vzdelavani.rust.tsx",
        lineNumber: 77,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/vzdelavani.rust.tsx",
      lineNumber: 73,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-8", children: Object.entries(subsectionConfig).map(([key, config]) => {
      const Icon = config.icon;
      const courses = subsections[key];
      return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-10 h-10 rounded-lg bg-[#BADEDF] flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "w-5 h-5 text-[#1DA2AC]" }, void 0, false, {
            fileName: "app/routes/vzdelavani.rust.tsx",
            lineNumber: 90,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/vzdelavani.rust.tsx",
            lineNumber: 89,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { children: config.title }, void 0, false, {
              fileName: "app/routes/vzdelavani.rust.tsx",
              lineNumber: 93,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: config.description }, void 0, false, {
              fileName: "app/routes/vzdelavani.rust.tsx",
              lineNumber: 94,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/vzdelavani.rust.tsx",
            lineNumber: 92,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/vzdelavani.rust.tsx",
          lineNumber: 88,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/vzdelavani.rust.tsx",
          lineNumber: 87,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: courses.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-6 text-[#687A7C]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Moment\xE1ln\u011B nejsou k dispozici \u017E\xE1dn\xE9 kurzy" }, void 0, false, {
          fileName: "app/routes/vzdelavani.rust.tsx",
          lineNumber: 100,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "app/routes/vzdelavani.rust.tsx",
          lineNumber: 99,
          columnNumber: 41
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid md:grid-cols-2 gap-4", children: courses.map((course) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { className: "hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { className: "text-base", children: course.title }, void 0, false, {
                fileName: "app/routes/vzdelavani.rust.tsx",
                lineNumber: 105,
                columnNumber: 29
              }, this),
              course.is_external && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, { variant: "outline", className: "text-xs", children: "Extern\xED" }, void 0, false, {
                fileName: "app/routes/vzdelavani.rust.tsx",
                lineNumber: 106,
                columnNumber: 52
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/vzdelavani.rust.tsx",
              lineNumber: 104,
              columnNumber: 27
            }, this),
            course.highlight && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { className: "text-sm", children: course.highlight }, void 0, false, {
              fileName: "app/routes/vzdelavani.rust.tsx",
              lineNumber: 110,
              columnNumber: 48
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/vzdelavani.rust.tsx",
            lineNumber: 103,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-[#687A7C]", children: course.price ? `${course.price} K\u010D` : "Zdarma" }, void 0, false, {
              fileName: "app/routes/vzdelavani.rust.tsx",
              lineNumber: 114,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "accent", size: "sm", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/vzdelavani/kurz/${course.slug.current}`, children: "Detail" }, void 0, false, {
              fileName: "app/routes/vzdelavani.rust.tsx",
              lineNumber: 118,
              columnNumber: 31
            }, this) }, void 0, false, {
              fileName: "app/routes/vzdelavani.rust.tsx",
              lineNumber: 117,
              columnNumber: 29
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/vzdelavani.rust.tsx",
            lineNumber: 113,
            columnNumber: 27
          }, this) }, void 0, false, {
            fileName: "app/routes/vzdelavani.rust.tsx",
            lineNumber: 112,
            columnNumber: 25
          }, this)
        ] }, course._id, true, {
          fileName: "app/routes/vzdelavani.rust.tsx",
          lineNumber: 102,
          columnNumber: 44
        }, this)) }, void 0, false, {
          fileName: "app/routes/vzdelavani.rust.tsx",
          lineNumber: 101,
          columnNumber: 28
        }, this) }, void 0, false, {
          fileName: "app/routes/vzdelavani.rust.tsx",
          lineNumber: 98,
          columnNumber: 15
        }, this)
      ] }, key, true, {
        fileName: "app/routes/vzdelavani.rust.tsx",
        lineNumber: 86,
        columnNumber: 16
      }, this);
    }) }, void 0, false, {
      fileName: "app/routes/vzdelavani.rust.tsx",
      lineNumber: 82,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/vzdelavani.rust.tsx",
    lineNumber: 72,
    columnNumber: 10
  }, this);
}
_s(VzdelavaniRust, "PKjrEEQdAO3a5yLjGDXyVj/iTZs=", false, function() {
  return [useLoaderData];
});
_c = VzdelavaniRust;
var _c;
$RefreshReg$(_c, "VzdelavaniRust");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  VzdelavaniRust as default
};
//# sourceMappingURL=/build/routes/vzdelavani.rust-32T5AMAE.js.map
