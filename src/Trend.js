import React from "react";
import { useEffect, useState } from "react/cjs/react.development";
import { getTrend } from "./Service";

export const Trend = () => {
  const [data, setData] = useState({ items: [] });
  useEffect(() => {
    getTrend("KR").then((e) => setData(e));
  }, []);
  return (
    <div>
      {data["items"].map((item, i) => (
        <div key={i}>{item.title}</div>
      ))}
    </div>
  );
};
