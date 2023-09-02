import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Typography, Sheet } from "@mui/joy";
import { RootStoreI } from "../../Store";

export default function StatisticTable() {
  const { storyMeta } = useSelector((store: RootStoreI) => store.dataReducer);
  const { topEvents } = storyMeta;

  return (
    <>
      {Object.keys(topEvents).map((key) => {
        if (topEvents[key].length === 0) return null;

        return (
          <div className={"block"}>
            <Typography level="title-lg" textAlign="center" sx={{ mb: 5 }}>
              {`Top ${key} events statistics`}
            </Typography>
            <Sheet sx={{ height: 300, overflow: "auto" }}>
              <Table
                aria-label={`Top ${key} events statistics`}
                stickyHeader
                stickyFooter
                stripe="odd"
                hoverRow
              >
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Argument</th>
                    <th>Odds</th>
                  </tr>
                </thead>
                <tbody>
                  {topEvents[key].map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.eventLemma}</td>
                        <td>
                          {item.argument === "subject" ? "agent" : "patient"}
                        </td>
                        <td>{item.odds}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot></tfoot>
              </Table>
            </Sheet>
          </div>
        );
      })}
    </>
  );
}
