import LinkButton from "../components/LinkButton";
import { useSeatContext } from "../contexts/SeatContext";

export default function Landing() {
  const { total, available } = useSeatContext();
  return (
    <main className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white h-screen flex flex-col justify-center items-center">
      <div className="grid text-center gap-4">
        <h1 className="text-4xl font-bold">Event Registration</h1>
        <div>
          จำนวนที่นั่งคงเหลือ: {available}/{total}
        </div>
        <div className="grid lg:flex gap-4 items-center justify-center">
          <LinkButton variant="light" href="/register">
            ลงชื่อเข้างาน
          </LinkButton>
          <LinkButton
            variant="light"
            href="/status"
            className="!bg-transparent !text-white"
          >
            ตรวจสอบสถานะ
          </LinkButton>
        </div>
      </div>
    </main>
  );
}
