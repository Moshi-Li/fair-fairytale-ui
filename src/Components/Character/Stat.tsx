import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface CharacterStatI {
  name: string;
  gender: string;
  importance: string;
  appearance: number;
}

const characterColumnHelper = createColumnHelper<CharacterStatI>();

const columns = [
  characterColumnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => info.getValue(),
  }),
  characterColumnHelper.accessor("gender", {
    header: () => "Gender",
    cell: (info) => info.getValue(),
  }),
  characterColumnHelper.accessor("importance", {
    header: () => "Importance",
    cell: (info) => info.getValue(),
  }),
  characterColumnHelper.accessor("appearance", {
    header: () => "Appearance",
    cell: (info) => info.getValue(),
  }),
];

const Stat = () => {
  const [data, setData] = useState<CharacterStatI[]>([]);
  const { characterMeta } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  useEffect(() => {
    const result: CharacterStatI[] = Object.keys(characterMeta).map((key) => {
      const { easyName, gender, importance, total } = characterMeta[key];
      return {
        name: easyName,
        gender,
        importance,
        appearance: total,
      };
    });
    result.sort((a, b) => b.appearance - a.appearance);
    setData(result.slice(0, 5));
  }, [characterMeta]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="character--table">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};

export default Stat;
