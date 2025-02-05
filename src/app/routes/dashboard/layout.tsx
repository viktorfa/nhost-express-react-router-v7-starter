"use client";
import { Outlet } from "react-router";
import { NhostContext, GraphqlContext } from "@/lib/NhostContext";
import { ClientOnly } from "@/components/ClientOnly";

export default function DashboardLayout() {
  return (
    <ClientOnly>
      <NhostContext>
        <GraphqlContext>
          <Outlet />
        </GraphqlContext>
      </NhostContext>
    </ClientOnly>
  );
}
