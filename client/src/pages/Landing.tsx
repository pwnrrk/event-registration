import LinkButton from "../components/LinkButton";

export default function Landing() {
  return (
    <main className="bg-blue-600 dark:bg-gray-900 text-white h-[calc(100vh-5rem)] flex flex-col justify-center items-center">
      <div className="grid text-center gap-4">
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
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
