"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  LogOut,
  RefreshCw,
  Download,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { createPortal } from "react-dom";

import ProtectedRoute from "../auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedBackground from "@/app/_components/layout/AnimatedBackground";
import OverviewStatsSection from "../_components/dashboard/OverviewStatsSection";
import ChartsSection from "../_components/dashboard/ChartsSection";
import WorkspacesSection from "../_components/dashboard/WorkspacesSection";
import { useDashboard } from "@/hooks/useDashboard";
import { DashboardData } from "@/lib/data-loader";
import Link from "next/link";
import Image from "next/image";

// Download functionality (fixed)
async function generateDownload(data: DashboardData, format: string) {
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `lookout-dashboard-${timestamp}`;

  try {
    switch (format) {
      case "pdf":
        generatePDFReport(data, filename);
        break;
      case "excel":
        generateExcelReport(data, filename);
        break;
      case "csv":
        generateCSVReport(data, filename);
        break;
      case "json":
        generateJSONReport(data, filename);
        break;
      default:
        throw new Error("Unsupported format");
    }
  } catch (error) {
    console.error("Download generation failed:", error);
    throw error;
  }
}

function generatePDFReport(data: DashboardData, filename: string) {
  try {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("LookOut Dashboard Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Report Period: Last 24 hours`, 20, 40);

    // Summary Statistics
    doc.setFontSize(16);
    doc.text("Overview", 20, 60);

    const stats = [
      ["Total Workspaces", data.workspaces?.length?.toString() || "0"],
      ["Total Endpoints", data.overview?.total_endpoints?.toString() || "0"],
      ["Active Endpoints", data.overview?.active_endpoints?.toString() || "0"],
      ["Active Incidents", data.recentIncidents?.length?.toString() || "0"],
    ];

    // Use autoTable function directly
    autoTable(doc, {
      startY: 70,
      head: [["Metric", "Value"]],
      body: stats,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    // Workspaces Detail
    if (data.workspaces && data.workspaces.length > 0) {
      const yPosition = (doc as any).lastAutoTable?.finalY + 20 || 150;
      doc.setFontSize(16);
      doc.text("Workspaces", 20, yPosition);

      const workspaceData = data.workspaces.map((ws) => [
        ws.name || "Unknown",
        ws.status || "Unknown",
        ws.uptime ? `${ws.uptime.toFixed(1)}%` : "N/A",
        ws.endpointCount?.toString() || "0",
        ws.activeIncidents?.toString() || "0",
      ]);

      autoTable(doc, {
        startY: yPosition + 10,
        head: [["Workspace", "Status", "Uptime", "Endpoints", "Incidents"]],
        body: workspaceData,
        theme: "grid",
        styles: { fontSize: 9 },
      });
    }

    // Recent Incidents
    if (data.recentIncidents && data.recentIncidents.length > 0) {
      const yPosition = (doc as any).lastAutoTable?.finalY + 20 || 200;
      doc.setFontSize(16);
      doc.text("Recent Incidents", 20, yPosition);

      const incidentData = data.recentIncidents
        .slice(0, 10)
        .map((incident) => [
          incident.endpointName || "Unknown",
          incident.status || "Unknown",
          (incident.cause || "Unknown").substring(0, 50) + "...",
          new Date(incident.startTime).toLocaleString(),
        ]);

      autoTable(doc, {
        startY: yPosition + 10,
        head: [["Endpoint", "Status", "Cause", "Started"]],
        body: incidentData,
        theme: "grid",
        styles: { fontSize: 8 },
      });
    }

    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw new Error("Failed to generate PDF report");
  }
}

function generateExcelReport(data: DashboardData, filename: string) {
  try {
    const workbook = XLSX.utils.book_new();

    // Overview Sheet
    const overviewData = [
      ["Metric", "Value"],
      ["Total Workspaces", data.workspaces?.length || 0],
      ["Total Endpoints", data.overview?.total_endpoints || 0],
      ["Active Endpoints", data.overview?.active_endpoints || 0],
      ["Active Incidents", data.recentIncidents?.length || 0],
      ["Generated", new Date().toISOString()],
    ];
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, "Overview");

    // Workspaces Sheet
    if (data.workspaces && data.workspaces.length > 0) {
      const workspaceData = [
        [
          "Name",
          "Status",
          "Uptime %",
          "Endpoints",
          "Active Incidents",
          "Avg Response Time",
          "Last Check",
        ],
        ...data.workspaces.map((ws) => [
          ws.name || "Unknown",
          ws.status || "Unknown",
          ws.uptime || 0,
          ws.endpointCount || 0,
          ws.activeIncidents || 0,
          ws.avgResponseTime || 0,
          ws.lastCheck || "",
        ]),
      ];
      const workspaceSheet = XLSX.utils.aoa_to_sheet(workspaceData);
      XLSX.utils.book_append_sheet(workbook, workspaceSheet, "Workspaces");

      // Endpoints Sheet
      const endpointData = [
        [
          "Workspace",
          "Name",
          "URL",
          "Status",
          "Method",
          "Expected Status",
          "Active",
        ],
        ...data.workspaces.flatMap((ws) =>
          (ws.endpoints || []).map((ep) => [
            ws.name || "Unknown",
            ep.name || "Unknown",
            ep.url || "",
            ep.status || "unknown",
            ep.method || "GET",
            ep.expected_status || 200,
            ep.is_active || false,
          ])
        ),
      ];
      const endpointSheet = XLSX.utils.aoa_to_sheet(endpointData);
      XLSX.utils.book_append_sheet(workbook, endpointSheet, "Endpoints");
    }

    // Incidents Sheet
    if (data.recentIncidents && data.recentIncidents.length > 0) {
      const incidentData = [
        [
          "Endpoint",
          "Status",
          "Cause",
          "Duration (min)",
          "Response Code",
          "Started",
          "Ended",
        ],
        ...data.recentIncidents.map((incident) => [
          incident.endpointName || "Unknown",
          incident.status || "Unknown",
          incident.cause || "Unknown",
          Math.round((incident.duration || 0) / 60),
          incident.responseCode || "N/A",
          incident.startTime || "",
          incident.endTime || "",
        ]),
      ];
      const incidentSheet = XLSX.utils.aoa_to_sheet(incidentData);
      XLSX.utils.book_append_sheet(workbook, incidentSheet, "Incidents");
    }

    // Response Time History
    if (
      data.overview?.responseTimeHistory &&
      data.overview.responseTimeHistory.length > 0
    ) {
      const responseTimeData = [
        ["Timestamp", "Avg Response Time (ms)"],
        ...data.overview.responseTimeHistory.map((point) => [
          point.timestamp || "",
          point.avgResponseTime || 0,
        ]),
      ];
      const responseTimeSheet = XLSX.utils.aoa_to_sheet(responseTimeData);
      XLSX.utils.book_append_sheet(
        workbook,
        responseTimeSheet,
        "Response Times"
      );
    }

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${filename}.xlsx`);
  } catch (error) {
    console.error("Excel generation failed:", error);
    throw new Error("Failed to generate Excel report");
  }
}

function generateCSVReport(data: DashboardData, filename: string) {
  try {
    const csvData = [
      [
        "Workspace",
        "Endpoint",
        "URL",
        "Status",
        "Uptime",
        "Response Time",
        "Active",
      ],
      ...(data.workspaces || []).flatMap((ws) =>
        (ws.endpoints || []).map((ep) => [
          ws.name || "Unknown",
          ep.name || "Unknown",
          ep.url || "",
          ep.status || "unknown",
          ws.uptime || 0,
          ws.avgResponseTime || 0,
          ep.is_active || false,
        ])
      ),
    ];

    const csvContent = csvData
      .map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${filename}.csv`);
  } catch (error) {
    console.error("CSV generation failed:", error);
    throw new Error("Failed to generate CSV report");
  }
}

function generateJSONReport(data: DashboardData, filename: string) {
  try {
    const reportData = {
      generated_at: new Date().toISOString(),
      report_period: "24_hours",
      summary: {
        total_workspaces: data.workspaces?.length || 0,
        total_endpoints: data.overview?.total_endpoints || 0,
        active_endpoints: data.overview?.active_endpoints || 0,
        active_incidents: data.recentIncidents?.length || 0,
      },
      data: data,
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    saveAs(blob, `${filename}.json`);
  } catch (error) {
    console.error("JSON generation failed:", error);
    throw new Error("Failed to generate JSON report");
  }
}

// Portal-based Dropdown Component
interface DownloadDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (format: "pdf" | "excel" | "csv" | "json") => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

function DownloadDropdown({
  isOpen,
  onClose,
  onDownload,
  triggerRef,
}: DownloadDropdownProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 224,
      });
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click is outside both the trigger button and dropdown
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const dropdownContent = (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          zIndex: 9999,
        }}
        className="w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-xl"
      >
        <div className="py-2">
          <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-600">
            Download Format
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload("pdf");
            }}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition-colors flex items-center gap-3"
          >
            <span className="text-lg">📄</span>
            <div>
              <div className="font-medium text-white">PDF Report</div>
              <div className="text-xs text-gray-400">
                Executive summary with charts
              </div>
            </div>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload("excel");
            }}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition-colors flex items-center gap-3"
          >
            <span className="text-lg">📊</span>
            <div>
              <div className="font-medium text-white">Excel Workbook</div>
              <div className="text-xs text-gray-400">
                Multi-sheet data analysis
              </div>
            </div>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload("csv");
            }}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition-colors flex items-center gap-3"
          >
            <span className="text-lg">📋</span>
            <div>
              <div className="font-medium text-white">CSV Data</div>
              <div className="text-xs text-gray-400">Simple data export</div>
            </div>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload("json");
            }}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition-colors flex items-center gap-3"
          >
            <span className="text-lg">🔧</span>
            <div>
              <div className="font-medium text-white">JSON Data</div>
              <div className="text-xs text-gray-400">Raw API data</div>
            </div>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  // Use portal to render outside the component tree
  return typeof window !== "undefined"
    ? createPortal(dropdownContent, document.body)
    : null;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const downloadButtonRef = useRef<HTMLButtonElement>(null);

  const {
    data: dashboardData,
    isLoading: loading,
    error,
    refetch,
    isFetching,
  } = useDashboard();

  // OAuth success handling
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "oauth") {
      window.history.replaceState({}, "", window.location.pathname);
      toast.success("Welcome back!");
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSettings = () => {
    toast.info("Settings coming soon!", {
      description: "User settings page is being built",
      duration: 3000,
    });
  };

  const handleDownload = async (format: "pdf" | "excel" | "csv" | "json") => {
    if (!dashboardData) {
      toast.error("No data to download");
      return;
    }

    try {
      setShowDownloadOptions(false);

      const downloadPromise = generateDownload(dashboardData, format);

      await toast.promise(downloadPromise, {
        loading: `Generating ${format.toUpperCase()} report...`,
        success: `${format.toUpperCase()} report downloaded!`,
        error: (error) =>
          `Failed to generate ${format.toUpperCase()} report: ${
            error?.message || "Unknown error"
          }`,
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(
        `Download failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleRefresh = async () => {
    const refreshPromise = refetch();

    toast.promise(refreshPromise, {
      loading: "Refreshing dashboard...",
      success: "Dashboard updated!",
      error: "Failed to refresh dashboard",
    });
  };

  // Error state
  if (error && !loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white">
          <AnimatedBackground particleCount={20} />

          <main className="relative z-10 px-6 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-3xl font-bold mb-4">
                  Unable to Load Dashboard
                </h1>
                <p className="text-gray-400 text-lg mb-8">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong while loading your dashboard data."}
                </p>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRefresh}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  // Loading state
  if (loading || !dashboardData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
          <AnimatedBackground particleCount={50} />
          <div className="relative z-10 container mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <AnimatedBackground particleCount={50} />

        {/* Header */}
        <header className="relative z-10 px-6 py-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                 <Link href='/' className="flex items-center space-x-2">
                  <Image
                    src="/icon.png"
                    alt="LookOut Logo"
                    className="w-8 h-8"
                    width={32}
                    height={32}
                  />
                  <span>LookOut</span>  
                  </Link>
                  
                </motion.div>

                <motion.div
                  className="text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {user?.email}
                </motion.div>
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handleRefresh}
                  className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || isFetching}
                  whileHover={{ scale: loading || isFetching ? 1 : 1.05 }}
                  whileTap={{ scale: loading || isFetching ? 1 : 0.95 }}
                  title="Refresh dashboard"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${
                      loading || isFetching ? "animate-spin" : ""
                    }`}
                  />
                </motion.button>

                {/* Download Button with Portal Dropdown */}
                <motion.button
                  ref={downloadButtonRef}
                  onClick={() => {
                    // Check if there's any data to download
                    const hasData =
                      dashboardData &&
                      (dashboardData.workspaces?.length > 0 ||
                        dashboardData.overview?.total_endpoints > 0);

                    if (!hasData) {
                      toast.error("No data available to download", {
                        description: "Add some endpoints to start monitoring",
                        duration: 3000,
                      });
                      return;
                    }
                    setShowDownloadOptions(!showDownloadOptions);
                  }}
                  className={`flex items-center gap-1 p-2 transition-colors ${
                    !dashboardData ||
                    (dashboardData.workspaces?.length === 0 &&
                      dashboardData.overview?.total_endpoints === 0)
                      ? "text-gray-600 cursor-not-allowed opacity-50"
                      : "text-gray-400 hover:text-white cursor-pointer"
                  }`}
                  whileHover={
                    dashboardData &&
                    (dashboardData.workspaces?.length > 0 ||
                      dashboardData.overview?.total_endpoints > 0)
                      ? { scale: 1.05 }
                      : {}
                  }
                  whileTap={
                    dashboardData &&
                    (dashboardData.workspaces?.length > 0 ||
                      dashboardData.overview?.total_endpoints > 0)
                      ? { scale: 0.95 }
                      : {}
                  }
                  title={
                    !dashboardData ||
                    (dashboardData.workspaces?.length === 0 &&
                      dashboardData.overview?.total_endpoints === 0)
                      ? "No data to download"
                      : "Download dashboard data"
                  }
                >
                  <Download className="w-5 h-5" />
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      showDownloadOptions ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <motion.button
                  onClick={handleSettings}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </motion.button>

                <motion.button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Portal Dropdown */}
        <DownloadDropdown
          isOpen={showDownloadOptions}
          onClose={() => setShowDownloadOptions(false)}
          onDownload={handleDownload}
          triggerRef={downloadButtonRef}
        />

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Welcome Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
              <p className="text-gray-400">
                Here's how your endpoints have been performing recently.
              </p>
            </div>

            {/* Overview Stats */}
            <OverviewStatsSection data={dashboardData} loading={false} />

            {/* Charts Section */}
            <ChartsSection data={dashboardData} loading={false} />

            {/* Workspaces Section */}
            <WorkspacesSection data={dashboardData} loading={false} />
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
