import type { Metadata } from "next";
import ScheduleClient from "./ScheduleClient";
import { getUpcomingSlots, getWeeklySchedule } from "@/db/queries";

export const metadata: Metadata = {
  title: "Расписание",
  description: "Расписание занятий школы стрелковой подготовки «КАЛИБР» в Воскресенске.",
};

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const [slots, weekly] = await Promise.all([getUpcomingSlots(), getWeeklySchedule()]);
  return <ScheduleClient slots={slots} weekly={weekly} />;
}
