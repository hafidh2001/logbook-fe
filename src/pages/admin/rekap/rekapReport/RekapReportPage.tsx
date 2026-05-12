// import { Topbar } from "@/components/layout/Topbar";
// import { ROUTES } from "@/utils/routes";
// import { useNavigate } from "react-router-dom";
// import { Filter } from "./_components/Filter";
// import { BaseTable } from "@/components/basetable/BaseTable";
// import { useRekapStore } from "@/store/rekapStore";
// import type { ColumnDef } from "@tanstack/react-table";
// import type { Row } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { icons } from "@/assets/images/Icon";
// import useWindowDimensions from "@/hooks/useWindowDimension";
// import { useEffect } from "react";

// type TRekapReport = Record<string, any>;

export default function RekapReportPage() {
  // const { width } = useWindowDimensions();
  // const sm = width >= 480;
  // const navigate = useNavigate();

  // const { rekapReport, isLoading, loadRekapReport, reset } = useRekapStore();

  // useEffect(() => {
  //   loadRekapReport();
  //   return () => reset();
  // }, [loadRekapReport, reset]);

  // const handleExport = () => {
  //   // TODO: Implement export
  // };

  // const handleSearch = (query: string) => {
  //   // TODO: Implement search
  //   console.log("Search:", query);
  // };

  // const handleFilterSearch = (data: Record<string, unknown>) => {
  //   console.log("Filter search:", data);
  // };

  // const handleFilterReset = () => {
  //   console.log("Filter reset");
  // };

  // const handleRowClick = (row: Row<TRekapReport>) => {
  //   console.log("Row clicked:", row.original);
  //   navigate(ROUTES.rekapReportDetail(String(row.original.id)));
  // };

  // const handleView = (e: React.MouseEvent, id: number) => {
  //   e.stopPropagation();
  //   navigate(ROUTES.rekapReportDetail(String(id)));
  // };

  // // Define columns for Rekap Report table
  // const columns: ColumnDef<TRekapReport>[] = [
  //   {
  //     accessorKey: "name",
  //     header: "Nama",
  //     size: 200,
  //     cell: ({ row: { original } }) => (
  //       <span className="font-medium">{original.name ?? "-"}</span>
  //     ),
  //   },
  //   {
  //     accessorKey: "status",
  //     header: "Status",
  //     size: 120,
  //     cell: ({ row: { original } }) => (
  //       <div className="flex items-center justify-center">
  //         <span className="text-center capitalize">
  //           {original.status ?? "-"}
  //         </span>
  //       </div>
  //     ),
  //   },
  //   {
  //     accessorKey: "role",
  //     header: "Role",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <div className="flex items-center justify-center">
  //         <span className="text-center capitalize">{original.role ?? "-"}</span>
  //       </div>
  //     ),
  //   },
  //   {
  //     accessorKey: "semester",
  //     header: "Semester",
  //     size: 120,
  //     cell: ({ row: { original } }) => original.semester ?? "-",
  //   },
  //   {
  //     accessorKey: "jaga_igd_emergency",
  //     header: "Jaga / IGD / Emergency",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">
  //         {original.jaga_igd_emergency ?? 0}
  //       </span>
  //     ),
  //   },
  //   {
  //     accessorKey: "ilmiah_stase",
  //     header: "Ilmiah Stase",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">{original.ilmiah_stase ?? 0}</span>
  //     ),
  //   },
  //   {
  //     accessorKey: "poli_klinik",
  //     header: "Poli Klinik",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">{original.poli_klinik ?? 0}</span>
  //     ),
  //   },
  //   {
  //     accessorKey: "kamar_operasi",
  //     header: "Kamar Operasi",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">{original.kamar_operasi ?? 0}</span>
  //     ),
  //   },
  //   {
  //     accessorKey: "seminar_hasil",
  //     header: "Seminar Hasil",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">{original.seminar_hasil ?? 0}</span>
  //     ),
  //   },
  //   {
  //     accessorKey: "review_artikel",
  //     header: "Review Artikel",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">
  //         {original.review_artikel ?? 0}
  //       </span>
  //     ),
  //   },
  //   {
  //     accessorKey: "proposal_thesis",
  //     header: "Proposal Thesis",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">
  //         {original.proposal_thesis ?? 0}
  //       </span>
  //     ),
  //   },
  //   {
  //     accessorKey: "exam",
  //     header: "Exam",
  //     size: 80,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">{original.exam ?? 0}</span>
  //     ),
  //   },
  //   {
  //     accessorKey: "stase",
  //     header: "Stase",
  //     size: 80,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">{original.stase ?? 0}</span>
  //     ),
  //   },
  //   {
  //     accessorKey: "bimbingan_operasi",
  //     header: "Bimbingan Operasi",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">
  //         {original.bimbingan_operasi ?? 0}
  //       </span>
  //     ),
  //   },
  //   {
  //     accessorKey: "kegiatan_bangsal",
  //     header: "Kegiatan Bangsal",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">
  //         {original.kegiatan_bangsal ?? 0}
  //       </span>
  //     ),
  //   },
  //   {
  //     accessorKey: "publikasi",
  //     header: "Publikasi",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">{original.publikasi ?? 0}</span>
  //     ),
  //   },
  //   {
  //     accessorKey: "ilmiah_non_stase",
  //     header: "Ilmiah Non Stase",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">
  //         {original.ilmiah_non_stase ?? 0}
  //       </span>
  //     ),
  //   },
  //   {
  //     accessorKey: "course",
  //     header: "Course",
  //     size: 80,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">{original.course ?? 0}</span>
  //     ),
  //   },
  //   {
  //     accessorKey: "ekstrakulikuler",
  //     header: "Ekstrakulikuler",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">
  //         {original.ekstrakulikuler ?? 0}
  //       </span>
  //     ),
  //   },
  //   {
  //     accessorKey: "pengabdian_masyarakat",
  //     header: "Pengabdian",
  //     size: 150,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block">
  //         {original.pengabdian_masyarakat ?? 0}
  //       </span>
  //     ),
  //   },
  //   {
  //     accessorKey: "total",
  //     header: "Total",
  //     size: 80,
  //     cell: ({ row: { original } }) => (
  //       <span className="text-center block font-medium">
  //         {original.total ?? 0}
  //       </span>
  //     ),
  //   },
  //   {
  //     id: "actions",
  //     header: "Action",
  //     size: sm ? 120 : 80,
  //     cell: ({ row: { original } }) => {
  //       return (
  //         <div className="flex items-center justify-center gap-1">
  //           <Button
  //             variant="ghost"
  //             size="sm"
  //             onClick={(e) => handleView(e, original.id)}
  //             className="bg-blue-600 text-white hover:bg-blue-700"
  //           >
  //             <icons.Eye className="h-4 w-4" />
  //             <span className="hidden sm:inline">View</span>
  //           </Button>
  //         </div>
  //       );
  //     },
  //   },
  // ];

  return (<></>
    // <div className="h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
    //   <Topbar
    //     breadcrumbs={[{ label: "Rekap" }, { label: "Report" }]}
    //     searchPlaceholder="Cari report..."
    //     onExport={handleExport}
    //     onSearch={handleSearch}
    //   />
    //   <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
    //     <div className="h-full flex flex-col gap-2">
    //       {/* Filter Section */}
    //       <Filter onSearch={handleFilterSearch} onReset={handleFilterReset} />

    //       {/* Table Section */}
    //       <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
    //         <BaseTable
    //           data={rekapReport}
    //           columns={columns}
    //           isLoading={isLoading}
    //           isShowNumbering
    //           pagination={{
    //             enabled: true,
    //             initialPageIndex: 0,
    //             initialPageSize: 10,
    //           }}
    //           onRowClick={handleRowClick}
    //           noDataText="Tidak ada data report"
    //           className="h-full"
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
