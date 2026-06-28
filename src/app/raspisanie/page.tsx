import type { Metadata } from "next";
import ScheduleClient from "./ScheduleClient";

export const metadata: Metadata = {
  title: "Расписание",
  description: "Расписание занятий школы стрелковой подготовки «КАЛИБР» в Воскресенске.",
};

export default function SchedulePage() {
  return <ScheduleClient />;
}
