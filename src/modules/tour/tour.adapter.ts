import { NAV_ITEMS } from "@/config/navigation";
import { projectsApi } from "@/redux/api/projectsApi";
import { store } from "@/redux/store";
import { showTourNotice } from "./tour-notice";
import type { TourNavTab } from "./tour.types";

// What the tour engine needs to know about this panel.

export const TOUR_NAV: TourNavTab[] = NAV_ITEMS.map((item) => ({
  label: item.tourLabel ?? item.title,
  path: item.path,
  subTabs: item.items?.length ? item.items : undefined,
}));

export const HOME_ROUTES = ["/", "/dashboard"];

export const PROJECT_PARAM = ":projectId";

export const notify = showTourNotice;

function hasPendingQuery(slice: unknown): boolean {
  if (!slice || typeof slice !== "object" || !("queries" in slice)) return false;
  return Object.values(slice.queries as Record<string, { status?: string } | undefined>).some(
    (query) => query?.status === "pending",
  );
}

export function isDataLoading(): boolean {
  return (
    Object.values(store.getState()).some(hasPendingQuery) ||
    !!document.querySelector("[data-tour-loading]")
  );
}

export async function fetchFirstProjectId(): Promise<string | null> {
  try {
    const result = await store
      .dispatch(
        projectsApi.endpoints.getProjects.initiate({ page: 1, limit: 1 }, { subscribe: false }),
      )
      .unwrap();
    return result.projects?.[0]?._id ?? null;
  } catch (error) {
    console.warn("[Tour] Unable to resolve a project ID.", error);
    return null;
  }
}
