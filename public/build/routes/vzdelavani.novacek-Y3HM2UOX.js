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
  BookOpen
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

// app/routes/vzdelavani.novacek.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/vzdelavani.novacek.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/vzdelavani.novacek.tsx"
  );
  import.meta.hot.lastModified = "1774554218072.299";
}
function VzdelavaniNovacek() {
  _s();
  const {
    courses
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto p-6 max-w-7xl", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Jsem ve ScioPolis nov\xE1\u010Dek" }, void 0, false, {
        fileName: "app/routes/vzdelavani.novacek.tsx",
        lineNumber: 52,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-[#687A7C]", children: "\xDAvodn\xED kurzy a informace pro nov\xE9 zam\u011Bstnance" }, void 0, false, {
        fileName: "app/routes/vzdelavani.novacek.tsx",
        lineNumber: 55,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/vzdelavani.novacek.tsx",
      lineNumber: 51,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid gap-6 mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { children: "Kurzy pro nov\xE1\u010Dky" }, void 0, false, {
            fileName: "app/routes/vzdelavani.novacek.tsx",
            lineNumber: 63,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Z\xE1kladn\xED vzd\u011Bl\xE1v\xE1n\xED pro nov\u011B p\u0159\xEDchoz\xED zam\u011Bstnance" }, void 0, false, {
            fileName: "app/routes/vzdelavani.novacek.tsx",
            lineNumber: 64,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/vzdelavani.novacek.tsx",
          lineNumber: 62,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: courses.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-8 text-[#687A7C]", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BookOpen, { className: "w-12 h-12 mx-auto mb-3 opacity-50" }, void 0, false, {
            fileName: "app/routes/vzdelavani.novacek.tsx",
            lineNumber: 70,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Moment\xE1ln\u011B nejsou k dispozici \u017E\xE1dn\xE9 kurzy" }, void 0, false, {
            fileName: "app/routes/vzdelavani.novacek.tsx",
            lineNumber: 71,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/vzdelavani.novacek.tsx",
          lineNumber: 69,
          columnNumber: 37
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid md:grid-cols-2 gap-4", children: courses.map((course) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { className: "hover:shadow-lg transition-shadow", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { className: "text-lg", children: course.title }, void 0, false, {
                fileName: "app/routes/vzdelavani.novacek.tsx",
                lineNumber: 76,
                columnNumber: 25
              }, this),
              course.is_external && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, { variant: "outline", className: "text-xs", children: "Extern\xED" }, void 0, false, {
                fileName: "app/routes/vzdelavani.novacek.tsx",
                lineNumber: 77,
                columnNumber: 48
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/vzdelavani.novacek.tsx",
              lineNumber: 75,
              columnNumber: 23
            }, this),
            course.highlight && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: course.highlight }, void 0, false, {
              fileName: "app/routes/vzdelavani.novacek.tsx",
              lineNumber: 81,
              columnNumber: 44
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/vzdelavani.novacek.tsx",
            lineNumber: 74,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-[#687A7C]", children: course.price ? `${course.price} K\u010D` : "Zdarma" }, void 0, false, {
              fileName: "app/routes/vzdelavani.novacek.tsx",
              lineNumber: 85,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "accent", size: "sm", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/vzdelavani/kurz/${course.slug.current}`, children: "Zobrazit detail" }, void 0, false, {
              fileName: "app/routes/vzdelavani.novacek.tsx",
              lineNumber: 89,
              columnNumber: 27
            }, this) }, void 0, false, {
              fileName: "app/routes/vzdelavani.novacek.tsx",
              lineNumber: 88,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/vzdelavani.novacek.tsx",
            lineNumber: 84,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "app/routes/vzdelavani.novacek.tsx",
            lineNumber: 83,
            columnNumber: 21
          }, this)
        ] }, course._id, true, {
          fileName: "app/routes/vzdelavani.novacek.tsx",
          lineNumber: 73,
          columnNumber: 40
        }, this)) }, void 0, false, {
          fileName: "app/routes/vzdelavani.novacek.tsx",
          lineNumber: 72,
          columnNumber: 24
        }, this) }, void 0, false, {
          fileName: "app/routes/vzdelavani.novacek.tsx",
          lineNumber: 68,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/vzdelavani.novacek.tsx",
        lineNumber: 61,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { className: "bg-[#BADEDF]/20", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { children: "Informace a koncepce" }, void 0, false, {
            fileName: "app/routes/vzdelavani.novacek.tsx",
            lineNumber: 102,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Dal\u0161\xED materi\xE1ly a dokumenty pro nov\xE1\u010Dky" }, void 0, false, {
            fileName: "app/routes/vzdelavani.novacek.tsx",
            lineNumber: 103,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/vzdelavani.novacek.tsx",
          lineNumber: 101,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/koncepce", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BookOpen, { className: "w-4 h-4 mr-2" }, void 0, false, {
            fileName: "app/routes/vzdelavani.novacek.tsx",
            lineNumber: 110,
            columnNumber: 17
          }, this),
          "P\u0159ej\xEDt na sekci Koncepce"
        ] }, void 0, true, {
          fileName: "app/routes/vzdelavani.novacek.tsx",
          lineNumber: 109,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/vzdelavani.novacek.tsx",
          lineNumber: 108,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/vzdelavani.novacek.tsx",
          lineNumber: 107,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/vzdelavani.novacek.tsx",
        lineNumber: 100,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/vzdelavani.novacek.tsx",
      lineNumber: 60,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/vzdelavani.novacek.tsx",
    lineNumber: 50,
    columnNumber: 10
  }, this);
}
_s(VzdelavaniNovacek, "freR5hLJ574D9C0pHkq+VO0OK9E=", false, function() {
  return [useLoaderData];
});
_c = VzdelavaniNovacek;
var _c;
$RefreshReg$(_c, "VzdelavaniNovacek");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  VzdelavaniNovacek as default
};
//# sourceMappingURL=/build/routes/vzdelavani.novacek-Y3HM2UOX.js.map
