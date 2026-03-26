import {
  Button
} from "/build/_shared/chunk-OJZR66OH.js";
import "/build/_shared/chunk-B43JI2TA.js";
import "/build/_shared/chunk-LVTXE7EF.js";
import {
  BookOpen,
  Calendar,
  FileText,
  LogIn,
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
} from "/build/_shared/chunk-4IYFJ33G.js";
import {
  Form,
  useActionData,
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

// app/routes/_index.tsx
var import_cloudflare = __toESM(require_cloudflare(), 1);
var import_supabase = __toESM(require_supabase(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_index.tsx"
  );
  import.meta.hot.lastModified = "1774557886809.2964";
}
function Index() {
  _s();
  const actionData = useActionData();
  const loaderData = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-[#F5F7F8] flex items-center justify-center p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-12 h-12 rounded-full bg-[#1DA2AC] flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-white text-2xl font-bold", children: "\u221E" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 119,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 118,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold text-[#1DA2AC]", children: "ScioEdu" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 121,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 117,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-3xl font-bold text-gray-900", children: "Intern\xED port\xE1l pro vzd\u011Bl\xE1v\xE1n\xED ScioPolis" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 125,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-[#687A7C]", children: "V\xEDtejte na vzd\u011Bl\xE1vac\xED platform\u011B pro zam\u011Bstnance ScioPolis. P\u0159ihlaste se pomoc\xED va\u0161eho firemn\xEDho Google \xFA\u010Dtu a z\xEDskejte p\u0159\xEDstup k:" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 128,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 124,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1 w-8 h-8 rounded-lg bg-[#BADEDF] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BookOpen, { className: "w-5 h-5 text-[#1DA2AC]" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 137,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 136,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-semibold text-gray-900", children: "Vzd\u011Bl\xE1vac\xED kurzy" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 140,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-[#687A7C]", children: "Rozs\xE1hl\xE1 nab\xEDdka kurz\u016F pro nov\xE1\u010Dky i pokro\u010Dil\xE9 pr\u016Fvodce" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 141,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 139,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 135,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1 w-8 h-8 rounded-lg bg-[#BADEDF] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "w-5 h-5 text-[#1DA2AC]" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 147,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 146,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-semibold text-gray-900", children: "Kalend\xE1\u0159 akc\xED" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 150,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-[#687A7C]", children: "P\u0159ehled nadch\xE1zej\xEDc\xEDch \u0161kolen\xED a vzd\u011Bl\xE1vac\xEDch aktivit" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 151,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 149,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 145,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1 w-8 h-8 rounded-lg bg-[#BADEDF] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "w-5 h-5 text-[#1DA2AC]" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 157,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 156,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-semibold text-gray-900", children: "Rozvoj t\xFDm\u016F" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 160,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-[#687A7C]", children: "Specializovan\xE9 programy pro t\xFDmy a kvadri\xE1dy" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 161,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 159,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 155,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1 w-8 h-8 rounded-lg bg-[#BADEDF] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "w-5 h-5 text-[#1DA2AC]" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 167,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 166,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-semibold text-gray-900", children: "Koncep\u010Dn\xED materi\xE1ly" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 170,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-[#687A7C]", children: "Metodick\xE9 bal\xEDky, dokumenty a podcasty" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 171,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 169,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 165,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 134,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 116,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { className: "w-full max-w-md mx-auto", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { className: "space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { className: "text-2xl", children: "P\u0159ihl\xE1\u0161en\xED" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 179,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Pou\u017Eijte v\xE1\u0161 firemn\xED Google \xFA\u010Det (@scioskola.cz)" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 180,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 178,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { className: "space-y-4", children: [
        actionData?.error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm", children: actionData.error }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 185,
          columnNumber: 35
        }, this),
        !loaderData?.supabaseConfigured && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm", children: loaderData?.message || "Konfigurace se na\u010D\xEDt\xE1..." }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 189,
          columnNumber: 49
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "action", value: "google-login" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 194,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { type: "submit", variant: "accent", size: "lg", className: "w-full text-base font-semibold", disabled: !loaderData?.supabaseConfigured, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogIn, { className: "w-5 h-5 mr-2" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 196,
              columnNumber: 17
            }, this),
            "P\u0159ihl\xE1sit se p\u0159es Google"
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 195,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 193,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pt-4 border-t", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-center text-[#687A7C]", children: "P\u0159\xEDstup je povolen pouze zam\u011Bstnanc\u016Fm ScioPolis s emailovou adresou @scioskola.cz" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 202,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 201,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 184,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 177,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 115,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 114,
    columnNumber: 10
  }, this);
}
_s(Index, "qo01Qi6sIko5PX2IpWLAxdk5Zac=", false, function() {
  return [useActionData, useLoaderData];
});
_c = Index;
var _c;
$RefreshReg$(_c, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default
};
//# sourceMappingURL=/build/routes/_index-RJSKIWUI.js.map
