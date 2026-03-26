import {
  cva
} from "/build/_shared/chunk-LVTXE7EF.js";
import {
  cn
} from "/build/_shared/chunk-E7IXQJ4O.js";
import {
  createHotContext
} from "/build/_shared/chunk-MKPQ2N7Z.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/components/ui/badge.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/ui/badge.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/ui/badge.tsx"
  );
  import.meta.hot.lastModified = "1774554218070.681";
}
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-label", {
  variants: {
    variant: {
      default: "border-transparent bg-[#1DA2AC] text-white shadow",
      secondary: "border-transparent bg-[#BADEDF] text-[#1DA2AC] shadow-sm",
      accent: "border-transparent bg-[#FCB813] text-gray-900 shadow",
      destructive: "border-transparent bg-red-500 text-white shadow",
      outline: "text-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
function Badge({
  className,
  variant,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: cn(badgeVariants({
    variant
  }), className), ...props }, void 0, false, {
    fileName: "app/components/ui/badge.tsx",
    lineNumber: 43,
    columnNumber: 10
  }, this);
}
_c = Badge;
var _c;
$RefreshReg$(_c, "Badge");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  Badge
};
//# sourceMappingURL=/build/_shared/chunk-QXNWIAMC.js.map
