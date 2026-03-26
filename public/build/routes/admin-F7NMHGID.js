import {
  Badge
} from "/build/_shared/chunk-F537AGH2.js";
import "/build/_shared/chunk-LVTXE7EF.js";
import {
  Card,
  CardContent,
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

// app/routes/admin.tsx
var import_cloudflare = __toESM(require_cloudflare(), 1);
var import_supabase = __toESM(require_supabase(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/admin.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/admin.tsx"
  );
  import.meta.hot.lastModified = "1774557886809.3767";
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
function Admin() {
  _s();
  const {
    enrollments
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto p-6 max-w-7xl", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Administrace" }, void 0, false, {
        fileName: "app/routes/admin.tsx",
        lineNumber: 66,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-[#687A7C]", children: [
        "P\u0159ehled v\u0161ech p\u0159ihl\xE1\u0161ek (",
        enrollments.length,
        ")"
      ] }, void 0, true, {
        fileName: "app/routes/admin.tsx",
        lineNumber: 67,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/admin.tsx",
      lineNumber: 65,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, { children: "V\u0161echny p\u0159ihl\xE1\u0161ky" }, void 0, false, {
        fileName: "app/routes/admin.tsx",
        lineNumber: 74,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/admin.tsx",
        lineNumber: 73,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", { className: "w-full", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { className: "border-b", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "text-left py-3 px-4 font-semibold text-sm", children: "U\u017Eivatel" }, void 0, false, {
            fileName: "app/routes/admin.tsx",
            lineNumber: 81,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "text-left py-3 px-4 font-semibold text-sm", children: "Email" }, void 0, false, {
            fileName: "app/routes/admin.tsx",
            lineNumber: 82,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "text-left py-3 px-4 font-semibold text-sm", children: "Kurz ID" }, void 0, false, {
            fileName: "app/routes/admin.tsx",
            lineNumber: 83,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "text-left py-3 px-4 font-semibold text-sm", children: "Term\xEDn" }, void 0, false, {
            fileName: "app/routes/admin.tsx",
            lineNumber: 84,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "text-left py-3 px-4 font-semibold text-sm", children: "Datum p\u0159ihl\xE1\u0161en\xED" }, void 0, false, {
            fileName: "app/routes/admin.tsx",
            lineNumber: 85,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "text-left py-3 px-4 font-semibold text-sm", children: "Status" }, void 0, false, {
            fileName: "app/routes/admin.tsx",
            lineNumber: 86,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin.tsx",
          lineNumber: 80,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/admin.tsx",
          lineNumber: 79,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: [
          enrollments.map((enrollment) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { className: "border-b last:border-0 hover:bg-[#F5F7F8]", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "py-3 px-4 text-sm", children: enrollment.profile?.full_name || "N/A" }, void 0, false, {
              fileName: "app/routes/admin.tsx",
              lineNumber: 91,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "py-3 px-4 text-sm text-[#687A7C]", children: enrollment.profile?.id || "N/A" }, void 0, false, {
              fileName: "app/routes/admin.tsx",
              lineNumber: 92,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "py-3 px-4 text-sm font-mono text-xs", children: enrollment.course_id }, void 0, false, {
              fileName: "app/routes/admin.tsx",
              lineNumber: 93,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "py-3 px-4 text-sm", children: [
              "#",
              enrollment.term_index + 1
            ] }, void 0, true, {
              fileName: "app/routes/admin.tsx",
              lineNumber: 94,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "py-3 px-4 text-sm", children: new Date(enrollment.enrolled_at).toLocaleDateString("cs-CZ") }, void 0, false, {
              fileName: "app/routes/admin.tsx",
              lineNumber: 95,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "py-3 px-4 text-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, { variant: statusColors[enrollment.status], children: statusLabels[enrollment.status] }, void 0, false, {
              fileName: "app/routes/admin.tsx",
              lineNumber: 97,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/admin.tsx",
              lineNumber: 96,
              columnNumber: 21
            }, this)
          ] }, enrollment.id, true, {
            fileName: "app/routes/admin.tsx",
            lineNumber: 90,
            columnNumber: 48
          }, this)),
          enrollments.length === 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { colSpan: 6, className: "py-8 text-center text-[#687A7C]", children: "Zat\xEDm nejsou \u017E\xE1dn\xE9 p\u0159ihl\xE1\u0161ky" }, void 0, false, {
            fileName: "app/routes/admin.tsx",
            lineNumber: 103,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/admin.tsx",
            lineNumber: 102,
            columnNumber: 46
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin.tsx",
          lineNumber: 89,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/admin.tsx",
        lineNumber: 78,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/admin.tsx",
        lineNumber: 77,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/admin.tsx",
        lineNumber: 76,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/admin.tsx",
      lineNumber: 72,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/admin.tsx",
    lineNumber: 64,
    columnNumber: 10
  }, this);
}
_s(Admin, "0LelnyqHw5RWoMIx3sQ8BYXq60g=", false, function() {
  return [useLoaderData];
});
_c = Admin;
var _c;
$RefreshReg$(_c, "Admin");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Admin as default
};
//# sourceMappingURL=/build/routes/admin-F7NMHGID.js.map
