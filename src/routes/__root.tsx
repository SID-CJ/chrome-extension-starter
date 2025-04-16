import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ThemeProvider } from "../routes/-components/theme-provider.tsx"

export const Route = createRootRoute({
    component: () => (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                {<Outlet />}
            </ThemeProvider>
        <TanStackRouterDevtools />
        </>
    ),
})