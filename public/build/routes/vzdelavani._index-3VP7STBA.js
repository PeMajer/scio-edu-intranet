import {
  GraduationCap,
  Sparkles,
  Users
} from "/build/_shared/chunk-3KFOPC32.js";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  require_cloudflare,
  require_supabase
} from "/build/_shared/chunk-4IYFJ33G.js";
import {
  Link
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

// app/routes/vzdelavani._index.tsx
var import_cloudflare = __toESM(require_cloudflare(), 1);
var import_supabase = __toESM(require_supabase(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/vzdelavani._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/vzdelavani._index.tsx"
  );
  import.meta.hot.lastModified = "1774557886809.945";
}
var categories = [{
  title: "Jsem ve ScioPolis nov\xE1\u010Dek",
  description: "\xDAvodn\xED kurzy a informace pro nov\xE9 zam\u011Bstnance",
  href: "/vzdelavani/novacek",
  icon: GraduationCap,
  color: "bg-[#1DA2AC]"
}, {
  title: "Vzd\u011Bl\xE1v\xE1n\xED a r\u016Fst pro ka\u017Ed\xE9ho",
  description: "Kurzy zam\u011B\u0159en\xE9 na osobn\xED rozvoj a \u0159emeslo pr\u016Fvodce",
  href: "/vzdelavani/rust",
  icon: Sparkles,
  color: "bg-[#FCB813]"
}, {
  title: "Rozvoj pro t\xFDmy a kvadri\xE1dy",
  description: "Specializovan\xE9 programy pro t\xFDmovou spolupr\xE1ci",
  href: "/vzdelavani/tymy",
  icon: Users,
  color: "bg-[#687A7C]"
}];
function VzdelavaniIndex() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto p-6 max-w-7xl", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Vzd\u011Bl\xE1v\xE1n\xED" }, void 0, false, {
        fileName: "app/routes/vzdelavani._index.tsx",
        lineNumber: 59,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-[#687A7C]", children: "Vyberte si z na\u0161ich vzd\u011Bl\xE1vac\xEDch kategori\xED" }, void 0, false, {
        fileName: "app/routes/vzdelavani._index.tsx",
        lineNumber: 60,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/vzdelavani._index.tsx",
      lineNumber: 58,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: categories.map((category) => {
      const Icon = category.icon;
      return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: category.href, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { className: "h-full hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `w-14 h-14 rounded-lg ${category.color} flex items-center justify-center mb-3`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "w-7 h-7 text-white" }, void 0, false, {
          fileName: "app/routes/vzdelavani._index.tsx",
          lineNumber: 72,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "app/routes/vzdelavani._index.tsx",
          lineNumber: 71,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { className: "text-xl", children: category.title }, void 0, false, {
          fileName: "app/routes/vzdelavani._index.tsx",
          lineNumber: 74,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { className: "text-base", children: category.description }, void 0, false, {
          fileName: "app/routes/vzdelavani._index.tsx",
          lineNumber: 75,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/vzdelavani._index.tsx",
        lineNumber: 70,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/vzdelavani._index.tsx",
        lineNumber: 69,
        columnNumber: 15
      }, this) }, category.href, false, {
        fileName: "app/routes/vzdelavani._index.tsx",
        lineNumber: 68,
        columnNumber: 16
      }, this);
    }) }, void 0, false, {
      fileName: "app/routes/vzdelavani._index.tsx",
      lineNumber: 65,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/vzdelavani._index.tsx",
    lineNumber: 57,
    columnNumber: 10
  }, this);
}
_c = VzdelavaniIndex;
var _c;
$RefreshReg$(_c, "VzdelavaniIndex");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  VzdelavaniIndex as default
};
//# sourceMappingURL=/build/routes/vzdelavani._index-3VP7STBA.js.map
