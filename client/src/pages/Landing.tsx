import { useQuery } from "@tanstack/react-query";
import LinkButton from "../components/LinkButton";
import { getInformation } from "../services/indexService";

export default function Landing() {
  const info = useQuery({
    queryKey: ["index"],
    queryFn: getInformation,
  });
  return (
    <main className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white h-screen flex flex-col justify-center items-center">
      <div className="grid text-center gap-4">
        <h1 className="text-4xl font-bold">Event Registration</h1>
        <div>
          จำนวนที่นั่งคงเหลือ: {info.data?.totalSeat}/{info.data?.available}
        </div>
        <div className="grid lg:flex gap-4 items-center">
          <LinkButton variant="light" href="/register" className="text-xl/6">
            ลงชื่อเข้างาน
          </LinkButton>
          <LinkButton
            variant="light"
            href="/status"
            className="text-xl/6 !bg-transparent !text-white"
          >
            ตรวจสอบสถานะ
          </LinkButton>
        </div>
      </div>
    </main>
  );
}
