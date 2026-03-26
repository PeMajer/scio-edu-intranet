import { createRequestHandler } from "@remix-run/cloudflare";
import * as build from "@remix-run/dev/server-build";

// @ts-ignore
export const onRequest: PagesFunction = async (context) => {
  const handler = createRequestHandler(build as any, process.env.NODE_ENV);
  return handler(context.request, {
    env: context.env,
    ctx: context,
  });
};
