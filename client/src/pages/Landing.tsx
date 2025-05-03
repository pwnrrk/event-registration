import { useQuery } from "@tanstack/react-query";
import LinkButton from "../components/LinkButton";
import { getInformation } from "../services/indexService";

export default function Landing() {
  const info = useQuery({
    queryKey: ["index"],
    queryFn: getInformation,
  });
  return (
    <main className="max-w-screen-lg mx-auto h-screen flex flex-col justify-center items-center">
      <div className="grid gap-4">
        <h1 className="text-2xl font-medium">Event Registration</h1>
        <div>จำนวนที่นั่งทั้งหมด: {info.data?.totalSeat}</div>
        <div>จำนวนที่นั่งคงเหลือ: {info.data?.available}</div>
        <hr className="border-gray-300" />
        <LinkButton href="/register" className="text-lg/6">
          ลงชื่อเข้างาน
        </LinkButton>
        <LinkButton href="/status" className="text-lg/6">
          ตรวจสอบสถานะ
        </LinkButton>
      </div>
    </main>
  );
}
