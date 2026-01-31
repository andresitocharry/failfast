import { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo";
import { Sidebar } from "@/app/components/Sidebar";
import { AdminDashboard } from "@/app/components/AdminDashboard";
import { ProjectManagerDashboard } from "@/app/components/ProjectManagerDashboard";

export default function App() {
  const [currentView, setCurrentView] = useState<"admin" | "project-manager">("admin");

  return (
    <ApolloProvider client={client}>
      <div className="size-full flex bg-[#0a0a0f] dark">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        {currentView === "admin" ? <AdminDashboard /> : <ProjectManagerDashboard />}
      </div>
    </ApolloProvider>
  );
}
