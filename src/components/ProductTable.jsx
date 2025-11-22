// src/components/ProductTable.jsx
import React, { useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender
} from "@tanstack/react-table";

export default function ProductTable({ data }) {

    // Definir columnas
    const columns = useMemo(() => [
        {
            accessorKey: "name",
            header: "Nombre",
            cell: info => info.getValue()
        },
        {
            accessorKey: "category",
            header: "Categoría",
            cell: info => info.getValue()
        },
        {
            accessorKey: "price",
            header: "Precio",
            cell: info => `$${info.getValue()}`
        },
        {
            accessorKey: "stock",
            header: "Stock",
            cell: info => {
                const stock = info.getValue();
                if (stock === 0)
                    return <span className="badge bg-danger">Agotado</span>;
                if (stock <= 5)
                    return <span className="badge bg-warning text-dark">Bajo ({stock})</span>;
                return stock;
            }
        }
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: {},
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    return (
        <div>

            {/* TABLA */}
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: " 🔼",
                                            desc: " 🔽"
                                        }[header.column.getIsSorted()] ?? ""}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINACIÓN */}
            <div className="d-flex gap-2 align-items-center mt-2">
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    ◀ Prev
                </button>

                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next ▶
                </button>

                <span className="ms-3">
                    Página {table.getState().pagination.pageIndex + 1} de{" "}
                    {table.getPageCount()}
                </span>
            </div>
        </div>
    );
}
