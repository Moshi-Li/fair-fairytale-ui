import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Store as notificationStore } from "react-notifications-component";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { RootStoreI } from "../../Store";

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
      cell: (info) =>
        info.getValue() === "direct_object"
          ? "patient"
          : info.getValue() === "subject"
          ? "agent"
          : info.getValue(),
    });
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="gender--table--container">
      <p className="section--label">{label}</p>
      <table className="gender--table">
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
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
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
  const { topEvents } = storyMeta;

  const headerInfo = [
    { accessor: "eventLemma", header: "Event" },
    { accessor: "argument", header: "Argument" },
    { accessor: "odds", header: "Odds ratio" },
  ];

  useEffect(() => {
    if (Object.keys(topEvents).length === 0) {
      notificationStore.addNotification({
        message:
          "No enough information to generate bias analysis. Please try longer stories.",
        type: "danger",
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 10000,
          onScreen: true,
        },
        width: 600,
      });
    }
  }, [topEvents]);

  return (
    <React.Fragment>
      {Object.keys(topEvents).map((key) => {
        return topEvents[key] && topEvents[key].length ? (
          <React.Fragment key={key}>
            <Statistics
              headerInfo={headerInfo}
              data={topEvents[key]}
              label={`Top ${key} character events`}
            ></Statistics>
          </React.Fragment>
        ) : null;
      })}
    </React.Fragment>
  );
};

export default Stat;
