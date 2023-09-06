import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Typography, Sheet } from "@mui/joy";
import { RootStoreI } from "../../Store";
import { CharacterStatI } from "../../Slices/DataSlice";

export default function StastisticTable() {
  const [data, setData] = useState<CharacterStatI[]>([]);
  const { characterMeta } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  useEffect(() => {
    const result: CharacterStatI[] = Object.keys(characterMeta).map((key) => {
      const { easyName, gender, importance, total, corefId } =
        characterMeta[key];
      return {
        name: easyName,
        gender,
        importance,
        appearance: total,
        corefId,
      };
    });
    result.sort((a, b) => b.appearance - a.appearance);
    setData(result.slice(0, 5));
  }, [characterMeta]);
  return (
    <div className={"block"}>
      <Typography level="title-lg" textAlign="center" sx={{ mb: 5 }}>
        Character statistics
      </Typography>
      <Sheet sx={{ height: 300, overflow: "auto" }}>
        <Table
          aria-label="character statistic"
          stickyHeader
          stickyFooter
          stripe="odd"
          hoverRow
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Importance</th>
              <th>Appearances</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.gender}</td>
                  <td>{item.importance}</td>
                  <td>{item.appearance}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Sheet>
    </div>
  );
}
