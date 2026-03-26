import {
  Button
} from "/build/_shared/chunk-ACAEBKW3.js";
import "/build/_shared/chunk-B43JI2TA.js";
import "/build/_shared/chunk-LVTXE7EF.js";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  FileText
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

// app/routes/portal._index.tsx
var import_cloudflare = __toESM(require_cloudflare(), 1);
var import_supabase = __toESM(require_supabase(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/portal._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/portal._index.tsx"
  );
  import.meta.hot.lastModified = "1774554218071.9917";
}
function Portal() {
  _s();
  const {
    profile
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-[#F5F7F8]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto p-6 max-w-7xl", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: [
        "V\xEDtejte, ",
        profile?.full_name,
        "!"
      ] }, void 0, true, {
        fileName: "app/routes/portal._index.tsx",
        lineNumber: 55,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-[#687A7C]", children: "Co chcete dnes d\u011Blat?" }, void 0, false, {
        fileName: "app/routes/portal._index.tsx",
        lineNumber: 58,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/portal._index.tsx",
      lineNumber: 54,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid lg:grid-cols-2 gap-6 mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { className: "border-2 border-[#1DA2AC] shadow-lg", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-12 h-12 rounded-lg bg-[#1DA2AC] flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BookOpen, { className: "w-6 h-6 text-white" }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 68,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 67,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { className: "text-2xl", children: "Vzd\u011Bl\xE1v\xE1n\xED" }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 70,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/portal._index.tsx",
            lineNumber: 66,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { className: "text-base", children: "Objevte kurzy pro nov\xE1\u010Dky, pokro\u010Dil\xE9 pr\u016Fvodce i specializovan\xE9 t\xFDmov\xE9 programy" }, void 0, false, {
            fileName: "app/routes/portal._index.tsx",
            lineNumber: 72,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 65,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "accent", size: "lg", className: "w-full justify-between group", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/vzdelavani", children: [
            "Prohl\xE9dnout kurzy",
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 81,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/portal._index.tsx",
            lineNumber: 79,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/portal._index.tsx",
            lineNumber: 78,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-2 gap-2 pt-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "ghost", size: "sm", className: "justify-start", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/vzdelavani/novacek", children: "Pro nov\xE1\u010Dky" }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 86,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 85,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "ghost", size: "sm", className: "justify-start", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/vzdelavani/rust", children: "Osobn\xED r\u016Fst" }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 89,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 88,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "ghost", size: "sm", className: "justify-start", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/vzdelavani/tymy", children: "Pro t\xFDmy" }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 92,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 91,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "ghost", size: "sm", className: "justify-start", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/moje-kurzy", children: "Moje kurzy" }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 95,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 94,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/portal._index.tsx",
            lineNumber: 84,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 77,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 76,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/portal._index.tsx",
        lineNumber: 64,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { className: "shadow-lg", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-12 h-12 rounded-lg bg-[#687A7C] flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "w-6 h-6 text-white" }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 106,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 105,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { className: "text-2xl", children: "Koncepce" }, void 0, false, {
              fileName: "app/routes/portal._index.tsx",
              lineNumber: 108,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/portal._index.tsx",
            lineNumber: 104,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { className: "text-base", children: "Metodick\xE9 bal\xEDky, koncep\u010Dn\xED dokumenty a podcasty pro va\u0161i inspiraci" }, void 0, false, {
            fileName: "app/routes/portal._index.tsx",
            lineNumber: 110,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 103,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 rounded-lg bg-[#BADEDF]/30 border border-[#BADEDF]", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-[#687A7C] mb-3", children: "Sekce se p\u0159ipravuje \u2014 ale u\u017E te\u010F tu najdete u\u017Eite\u010Dn\xE9 zdroje" }, void 0, false, {
            fileName: "app/routes/portal._index.tsx",
            lineNumber: 117,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "outline", className: "w-full", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/koncepce", children: "Zobrazit dostupn\xE9 zdroje" }, void 0, false, {
            fileName: "app/routes/portal._index.tsx",
            lineNumber: 121,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/portal._index.tsx",
            lineNumber: 120,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 116,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 115,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 114,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/portal._index.tsx",
        lineNumber: 102,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/portal._index.tsx",
      lineNumber: 63,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-10 h-10 rounded-lg bg-[#BADEDF] flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "w-5 h-5 text-[#1DA2AC]" }, void 0, false, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 135,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 134,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { children: "Nadch\xE1zej\xEDc\xED ud\xE1losti" }, void 0, false, {
            fileName: "app/routes/portal._index.tsx",
            lineNumber: 138,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "P\u0159ehled \u0161kolen\xED a vzd\u011Bl\xE1vac\xEDch aktivit" }, void 0, false, {
            fileName: "app/routes/portal._index.tsx",
            lineNumber: 139,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 137,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/portal._index.tsx",
        lineNumber: 133,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/portal._index.tsx",
        lineNumber: 132,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-[#687A7C] mb-4", children: "Zobrazen\xED kalend\xE1\u0159e ud\xE1lost\xED bude brzy k dispozici" }, void 0, false, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 147,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/kalendar", children: "Zobrazit cel\xFD kalend\xE1\u0159" }, void 0, false, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 151,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/portal._index.tsx",
          lineNumber: 150,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/portal._index.tsx",
        lineNumber: 146,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/portal._index.tsx",
        lineNumber: 145,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/portal._index.tsx",
      lineNumber: 131,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/portal._index.tsx",
    lineNumber: 53,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/portal._index.tsx",
    lineNumber: 52,
    columnNumber: 10
  }, this);
}
_s(Portal, "6Tn5yyFZnzjmMVtfhGQIsThIAfU=", false, function() {
  return [useLoaderData];
});
_c = Portal;
var _c;
$RefreshReg$(_c, "Portal");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Portal as default
};
//# sourceMappingURL=/build/routes/portal._index-OJTMG5S4.js.map
