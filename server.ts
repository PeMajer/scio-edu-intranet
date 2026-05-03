import { createRequestHandler, type ServerBuild } from "@remix-run/cloudflare";
import * as build from "@remix-run/dev/server-build";
import type { Env } from "./app/load-context";

export const onRequest: PagesFunction<Env> = async (context) => {
  const handler = createRequestHandler(
    build as unknown as ServerBuild,
    process.env.NODE_ENV
  );
  return handler(context.request, {
    env: context.env,
    ctx: context,
  });
};
