import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

const FilesPage = lazy(() => import("./pages/FilesPage"));
const FileDetailPage = lazy(() => import("./pages/FileDetailPage"));

const PageLoader = () => (
  <div className="flex-1 p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {["s1", "s2", "s3", "s4", "s5", "s6"].map((id) => (
        <Skeleton key={id} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

const filesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/files",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <FilesPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const fileDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/files/$fileId",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <FileDetailPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  filesRoute,
  fileDetailRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
