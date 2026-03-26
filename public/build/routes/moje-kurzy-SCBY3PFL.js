import {
  Badge
} from "/build/_shared/chunk-F537AGH2.js";
import "/build/_shared/chunk-LVTXE7EF.js";
import {
  BookOpen,
  Calendar
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

// app/routes/moje-kurzy.tsx
var import_cloudflare = __toESM(require_cloudflare(), 1);
var import_supabase = __toESM(require_supabase(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/moje-kurzy.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/moje-kurzy.tsx"
  );
  import.meta.hot.lastModified = "1774557886809.7397";
}
var statusColors = {
  enrolled: "secondary",
  completed: "default",
  cancelled: "destructive"
};
var statusLabels = {
  enrolled: "P\u0159ihl\xE1\u0161en",
  completed: "Dokon\u010Deno",
  cancelled: "Zru\u0161eno"
};
function MojeKurzy() {
  _s();
  const {
    enrollments
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto p-6 max-w-7xl", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Moje kurzy" }, void 0, false, {
        fileName: "app/routes/moje-kurzy.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-[#687A7C]", children: "P\u0159ehled kurz\u016F, do kter\xFDch jste p\u0159ihl\xE1\u0161eni" }, void 0, false, {
        fileName: "app/routes/moje-kurzy.tsx",
        lineNumber: 66,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/moje-kurzy.tsx",
      lineNumber: 64,
      columnNumber: 7
    }, this),
    enrollments.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { className: "pt-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BookOpen, { className: "w-16 h-16 text-[#687A7C] mx-auto mb-4 opacity-50" }, void 0, false, {
        fileName: "app/routes/moje-kurzy.tsx",
        lineNumber: 74,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Zat\xEDm nem\xE1te \u017E\xE1dn\xE9 kurzy" }, void 0, false, {
        fileName: "app/routes/moje-kurzy.tsx",
        lineNumber: 75,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-[#687A7C] mb-6", children: "P\u0159ihlaste se do sv\xE9ho prvn\xEDho kurzu a za\u010Dn\u011Bte se vzd\u011Bl\xE1vat" }, void 0, false, {
        fileName: "app/routes/moje-kurzy.tsx",
        lineNumber: 78,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/vzdelavani", className: "inline-flex items-center justify-center rounded-md text-sm font-medium bg-[#FCB813] text-gray-900 hover:bg-[#FCB813]/90 h-10 px-8", children: "Prohl\xE9dnout kurzy" }, void 0, false, {
        fileName: "app/routes/moje-kurzy.tsx",
        lineNumber: 81,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/moje-kurzy.tsx",
      lineNumber: 73,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/moje-kurzy.tsx",
      lineNumber: 72,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/moje-kurzy.tsx",
      lineNumber: 71,
      columnNumber: 35
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid gap-4", children: enrollments.map((enrollment) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { className: "mb-2", children: [
            "Kurz ID: ",
            enrollment.course_id
          ] }, void 0, true, {
            fileName: "app/routes/moje-kurzy.tsx",
            lineNumber: 91,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { className: "flex items-center gap-4 text-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "w-4 h-4" }, void 0, false, {
              fileName: "app/routes/moje-kurzy.tsx",
              lineNumber: 96,
              columnNumber: 25
            }, this),
            "P\u0159ihl\xE1\u0161eno: ",
            new Date(enrollment.enrolled_at).toLocaleDateString("cs-CZ")
          ] }, void 0, true, {
            fileName: "app/routes/moje-kurzy.tsx",
            lineNumber: 95,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "app/routes/moje-kurzy.tsx",
            lineNumber: 94,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/moje-kurzy.tsx",
          lineNumber: 90,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, { variant: statusColors[enrollment.status], children: statusLabels[enrollment.status] }, void 0, false, {
          fileName: "app/routes/moje-kurzy.tsx",
          lineNumber: 101,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/moje-kurzy.tsx",
        lineNumber: 89,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/moje-kurzy.tsx",
        lineNumber: 88,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-[#687A7C]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
        "Term\xEDn #",
        enrollment.term_index + 1
      ] }, void 0, true, {
        fileName: "app/routes/moje-kurzy.tsx",
        lineNumber: 108,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "app/routes/moje-kurzy.tsx",
        lineNumber: 107,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/moje-kurzy.tsx",
        lineNumber: 106,
        columnNumber: 15
      }, this)
    ] }, enrollment.id, true, {
      fileName: "app/routes/moje-kurzy.tsx",
      lineNumber: 87,
      columnNumber: 42
    }, this)) }, void 0, false, {
      fileName: "app/routes/moje-kurzy.tsx",
      lineNumber: 86,
      columnNumber: 19
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/moje-kurzy.tsx",
    lineNumber: 63,
    columnNumber: 10
  }, this);
}
_s(MojeKurzy, "0LelnyqHw5RWoMIx3sQ8BYXq60g=", false, function() {
  return [useLoaderData];
});
_c = MojeKurzy;
var _c;
$RefreshReg$(_c, "MojeKurzy");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  MojeKurzy as default
};
//# sourceMappingURL=/build/routes/moje-kurzy-SCBY3PFL.js.map
