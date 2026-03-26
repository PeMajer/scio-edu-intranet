import {
  Button
} from "/build/_shared/chunk-OJZR66OH.js";
import "/build/_shared/chunk-B43JI2TA.js";
import "/build/_shared/chunk-LVTXE7EF.js";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Headphones
} from "/build/_shared/chunk-3KFOPC32.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  require_cloudflare,
  require_supabase
} from "/build/_shared/chunk-4IYFJ33G.js";
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

// app/routes/koncepce.tsx
var import_cloudflare = __toESM(require_cloudflare(), 1);
var import_supabase = __toESM(require_supabase(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/koncepce.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/koncepce.tsx"
  );
  import.meta.hot.lastModified = "1774557886809.6575";
}
var resources = [{
  type: "podcast",
  title: "Podcasty",
  items: [{
    label: "Podcast o vzd\u011Bl\xE1v\xE1n\xED v ScioPolis",
    url: "#"
  }, {
    label: "Rozhovory s lektory",
    url: "#"
  }]
}, {
  type: "methodological",
  title: "Metodick\xE9 bal\xEDky",
  items: [{
    label: "Metodick\xFD bal\xEDk pro nov\xE1\u010Dky",
    url: "#"
  }, {
    label: "Pr\u016Fvodce facilit ac\xED",
    url: "#"
  }]
}, {
  type: "conceptual",
  title: "Koncep\u010Dn\xED dokumenty",
  items: [{
    label: "Strategie vzd\u011Bl\xE1v\xE1n\xED 2024",
    url: "#"
  }, {
    label: "Koncep\u010Dn\xED r\xE1mec ScioPolis",
    url: "#"
  }]
}];
var iconMap = {
  podcast: Headphones,
  methodological: BookOpen,
  conceptual: FileText
};
function Koncepce() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto p-6 max-w-7xl", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Koncepce" }, void 0, false, {
        fileName: "app/routes/koncepce.tsx",
        lineNumber: 76,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-[#687A7C]", children: "Metodick\xE9 bal\xEDky, koncep\u010Dn\xED dokumenty a podcasty" }, void 0, false, {
        fileName: "app/routes/koncepce.tsx",
        lineNumber: 77,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/koncepce.tsx",
      lineNumber: 75,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { className: "mb-8 bg-[#BADEDF]/20 border-[#1DA2AC]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { className: "pt-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-[#687A7C] mb-2", children: "Sekce se p\u0159ipravuje \u2014 ale u\u017E te\u010F tu najdete u\u017Eite\u010Dn\xE9 zdroje pro va\u0161i pr\xE1ci." }, void 0, false, {
        fileName: "app/routes/koncepce.tsx",
        lineNumber: 84,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-[#687A7C]", children: "Postupn\u011B budeme p\u0159id\xE1vat dal\u0161\xED materi\xE1ly a dokumenty." }, void 0, false, {
        fileName: "app/routes/koncepce.tsx",
        lineNumber: 87,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/koncepce.tsx",
      lineNumber: 83,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/koncepce.tsx",
      lineNumber: 82,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: resources.map((category) => {
      const Icon = iconMap[category.type];
      return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-10 h-10 rounded-lg bg-[#BADEDF] flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "w-5 h-5 text-[#1DA2AC]" }, void 0, false, {
            fileName: "app/routes/koncepce.tsx",
            lineNumber: 100,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/koncepce.tsx",
            lineNumber: 99,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { className: "text-xl", children: category.title }, void 0, false, {
            fileName: "app/routes/koncepce.tsx",
            lineNumber: 102,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/koncepce.tsx",
          lineNumber: 98,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/koncepce.tsx",
          lineNumber: 97,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-2", children: category.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "ghost", className: "w-full justify-between text-left h-auto py-3 px-3", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: item.url, target: "_blank", rel: "noopener noreferrer", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm", children: item.label }, void 0, false, {
            fileName: "app/routes/koncepce.tsx",
            lineNumber: 109,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "w-4 h-4 flex-shrink-0" }, void 0, false, {
            fileName: "app/routes/koncepce.tsx",
            lineNumber: 110,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/koncepce.tsx",
          lineNumber: 108,
          columnNumber: 23
        }, this) }, idx, false, {
          fileName: "app/routes/koncepce.tsx",
          lineNumber: 107,
          columnNumber: 54
        }, this)) }, void 0, false, {
          fileName: "app/routes/koncepce.tsx",
          lineNumber: 106,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/koncepce.tsx",
          lineNumber: 105,
          columnNumber: 15
        }, this)
      ] }, category.type, true, {
        fileName: "app/routes/koncepce.tsx",
        lineNumber: 96,
        columnNumber: 16
      }, this);
    }) }, void 0, false, {
      fileName: "app/routes/koncepce.tsx",
      lineNumber: 93,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/koncepce.tsx",
    lineNumber: 74,
    columnNumber: 10
  }, this);
}
_c = Koncepce;
var _c;
$RefreshReg$(_c, "Koncepce");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Koncepce as default
};
//# sourceMappingURL=/build/routes/koncepce-PJBXVR66.js.map
