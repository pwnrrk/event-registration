import LinkButton from "../components/LinkButton";

export default function Landing() {
  return (
    <main className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white h-screen flex flex-col justify-center items-center">
      <div className="grid text-center gap-4">
        <h1 className="text-4xl font-bold mb-4">Event Registration</h1>
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
