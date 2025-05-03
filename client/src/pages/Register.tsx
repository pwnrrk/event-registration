import { Field, Label } from "@headlessui/react";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  return (
    <main className="max-w-screen-lg mx-auto h-screen flex p-4 flex-col justify-center items-center">
      <form className="grid gap-4 max-w-screen-lg w-full">
        <h1 className="text-2xl font-medium">ลงทะเบียนเข้างาน</h1>
        <Field>
          <Label>ชื่อ</Label>
          <Input type="text" required name="firstName" />
        </Field>
        <Field>
          <Label>นามสกุล</Label>
          <Input type="text" required name="lastName" />
        </Field>
        <Field>
          <Label>เบอร์โทรศัพท์</Label>
          <Input type="tel" required name="phone" />
        </Field>
        <Button type="submit">ลงทะเบียน</Button>
      </form>
    </main>
  );
}
