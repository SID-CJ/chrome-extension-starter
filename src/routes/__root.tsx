import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from "../routes/-components/theme-provider.tsx"
import { useTheme } from "../routes/-components/theme-provider.tsx"

// Create a wrapper component to apply theme classes
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  // Determine if we should use dark mode
  const isDarkMode = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {children}
    </div>
  );
}

export const Route = createRootRoute({
    component: () => (
        <>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <ThemeWrapper>
                    <Outlet />
                </ThemeWrapper>
            </ThemeProvider>
        </>
    ),
})