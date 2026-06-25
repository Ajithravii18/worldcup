
import { BottomNavigation } from "../components/BottomNavigation";

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-app-bg">
      <main className="mx-auto min-h-screen max-w-[480px] px-4 pb-28 pt-5 sm:px-5">
        {children}
      </main>
      <BottomNavigation />
    </div>);

}