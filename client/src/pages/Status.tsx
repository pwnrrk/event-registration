import { useQuery } from "@tanstack/react-query";
import { getUserById, getUsers } from "../services/userService";
import Table from "../components/Table";
import TableHead from "../components/TableHead";
import TableCell from "../components/TableCell";
import { User } from "../interfaces/user";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import Input from "../components/Input";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import Spinner from "../components/Spinner";
import Select from "../components/Select";
import { Query } from "../interfaces/query";

function PhoneSearchForm() {
  const [isNotFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<User>();
  const navigate = useNavigate();

  async function onSubmit(data: User) {
    setLoading(true);
    const users = await getUsers({ phone: data.phone });
    setLoading(false);
    if (!users || users.length === 0) return setNotFound(true);
    navigate(`?u=${users[0]._id}`);
  }

  return (
    <>
      <main className="p-4">
        <div className="max-w-screen-lg mx-auto">
          <div className="grid w-full gap-4">
            <h2 className="text-2xl">ติดตามสถานะการลงทะเบียน</h2>
            <form
              className="lg:flex grid gap-4 items-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                placeholder="ใส่เบอร์โทรศัพท์ของท่าน"
                required
                {...register("phone")}
              />
              <Button
                type="submit"
                className="flex-none flex items-center justify-center gap-4"
                disabled={loading}
              >
                ตรวจสอบ
                {loading && <Spinner className="!size-4" />}
              </Button>
            </form>
            {isNotFound && (
              <span className="text-red-500">
                ไม่พบผู้เข้าร่วมด้วยเบอร์โทรนี้
              </span>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default function Status() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get("u") || undefined;

  const { register, handleSubmit } = useForm<Query>();

  const queries = useMemo(() => {
    const options: Record<string, string> = {};
    if (searchParams.has("search"))
      options.search = searchParams.get("search")!;
    return options;
  }, [searchParams]);

  const users = useQuery<User[] | null>({
    queryKey: ["users", queries],
    queryFn: () => getUsers(queries),
  });

  const userById = useQuery<User | null>({
    queryKey: ["users", userId],
    queryFn: () => getUserById(userId),
  });

  function handleQuery(data: Query) {
    setSearchParams((prev) => {
      const newState = new URLSearchParams(prev);

      if (data.search) newState.set("search", data.search);
      else newState.delete("search");

      return newState;
    });
  }

  return (
    <>
      <nav className="py-10">
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-3xl font-bold">Event Registration</h1>
        </div>
      </nav>
      {userById.data && (
        <main className="max-w-screen-lg mx-auto">
          <h1 className="font-medium">สถานะการลงทะเบียน</h1>
          <dl className="p-4 max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
            <div className="flex flex-col pb-3">
              <dt className="mb-1 text-gray-500  dark:text-gray-400">ชื่อ</dt>
              <dd className="font-semibold">
                {userById.isLoading && <Skeleton />}
                {userById.data?.firstName} {userById.data?.lastName}
              </dd>
            </div>
            <div className="flex flex-col pt-3">
              <dt className="mb-1 text-gray-500  dark:text-gray-400">
                เบอร์โทร
              </dt>
              <dd className="font-semibold">
                {userById.isLoading && <Skeleton />}
                {userById.data?.phone}
              </dd>
            </div>
            <div className="flex flex-col pt-3">
              <dt className="mb-1 text-gray-500  dark:text-gray-400">
                หมายเลขที่นั่ง
              </dt>
              <dd className="font-semibold">
                {userById.isLoading && <Skeleton />}
                กรุณารอผู้ดูแลเลือกที่นั่ง
              </dd>
            </div>
          </dl>
          <hr className="my-4 mb-6 border-gray-300" />
          <h3 className="text-lg mb-4">ผู้เข้าร่วมทั้งหมด</h3>
          <form onSubmit={handleSubmit(handleQuery)} className="flex mb-4">
            <Input
              placeholder="ค้นหา"
              className="w-96"
              {...register("search")}
            />
            <input type="submit" className="hidden" />
          </form>
          <Table>
            <TableHead>
              <tr>
                <TableCell head>ชื่อ</TableCell>
                <TableCell head>เบอร์โทร</TableCell>
                <TableCell head>หมายเลขที่นั่ง</TableCell>
              </tr>
            </TableHead>
            <tbody>
              {users.data?.map((user, index) => (
                <tr key={index}>
                  <TableCell>
                    <Link
                      to={`?u=${user._id}`}
                      className="font-medium text-black"
                    >
                      {user.firstName} {user.lastName}
                    </Link>
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>-</TableCell>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="flex justify-end items-center gap-4 pb-4">
            <div>จำนวนต่อหน้า</div>
            <Select className="w-20 py-2">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Select>
            <div>
              <Button variant="light" className="text-xs rounded-r-none">
                ก่อนหน้า
              </Button>
              <Button variant="light" className="text-xs rounded-l-none">
                ถัดไป
              </Button>
            </div>
          </div>
        </main>
      )}
      {!userById.data && <PhoneSearchForm />}
    </>
  );
}
