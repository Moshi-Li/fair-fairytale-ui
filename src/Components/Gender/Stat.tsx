import React from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const Statistics = ({
  headerInfo,
  data,
  label,
}: {
  headerInfo: { accessor: string; header: string }[];
  data: any[];
  label: string;
}) => {
  const characterColumnHelper = createColumnHelper<any>();

  const columns = headerInfo.map(({ accessor, header }) => {
    return characterColumnHelper.accessor(accessor, {
      header: () => header,
      cell: (info) => info.getValue(),
    });
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="gender--table">
      <p className="section--label">{label}</p>
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

const Stat = () => {
  const { storyMeta } = useSelector((store: RootStoreI) => store.dataReducer);
  const { topEvents, counts } = storyMeta;

  const headerInfo = [
    { accessor: "eventLemma", header: "Event" },
    { accessor: "argument", header: "Argument" },
    { accessor: "odds", header: "Odds ratio" },
  ];

  return (
    <React.Fragment>
      {Object.keys(topEvents).map((key) => {
        return (
          <React.Fragment key={key}>
            <Statistics
              headerInfo={headerInfo}
              data={topEvents[key]}
              label={`Top ${key.toUpperCase()} Character Events`}
            ></Statistics>
          </React.Fragment>
        );
      })}

      <Statistics
        headerInfo={[
          { accessor: "gender", header: "Gender" },
          { accessor: "importance", header: "Importance" },
          { accessor: "subject", header: `As Agent` },
          { accessor: "directObject", header: "As Patient" },
          { accessor: "total", header: "Total" },
        ]}
        data={counts}
        label="Character statistics by gender"
      ></Statistics>
    </React.Fragment>
  );
};

export default Stat;
