import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Spinner from "../components/Spinner";
import Table from "../components/Table";
import TableCell from "../components/TableCell";
import TableHead from "../components/TableHead";
import { useAuthContext } from "../contexts/AuthContext";
import { Query } from "../interfaces/query";
import { User } from "../interfaces/user";
import { getUsers } from "../services/userService";
import { useSeatContext } from "../contexts/SeatContext";
import { Dialog, DialogPanel, DialogTitle, Field } from "@headlessui/react";
import Label from "../components/Label";
import {
  assignSeat,
  getSeats,
  removeUserFromSeat,
} from "../services/seatService";
import { useAppContext } from "../contexts/AppContext";
import { DEFAULT_LIMIT } from "../constants";
import Badge from "../components/Badge";

function PhoneSearchForm() {
  const [isNotFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<User>();

  const { login } = useAuthContext();

  async function onSubmit(data: User) {
    setLoading(true);
    const success = await login(data.phone);
    setLoading(false);
    if (!success) return setNotFound(true);
  }

  return (
    <>
      <main className="p-4 h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="max-w-screen-md w-full mx-auto">
          <div className="grid w-full gap-4">
            <h2 className="text-2xl">ติดตามสถานะการลงทะเบียน</h2>
            <form
              className="lg:flex grid gap-4 items-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                placeholder="ใส่เบอร์โทรศัพท์ที่ลงเบียนไว้"
                required
                {...register("phone")}
                className="w-full"
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

interface SelectSeatForm {
  seatId: string;
  userId: string;
}

function SelectSeatForUser({
  user,
  onClose,
}: {
  user?: User;
  onClose(): void;
}) {
  const { register, handleSubmit } = useForm<SelectSeatForm>({
    defaultValues: { userId: user?._id },
  });

  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({ sort: "created:asc" }),
  });

  const seatQuery = useQuery({
    queryKey: ["seats"],
    queryFn: () => getSeats({ sort: "seatNo:asc" }),
  });

  async function onSubmit(data: SelectSeatForm) {
    try {
      await assignSeat(data.seatId, data.userId);
      onClose();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog open={user !== undefined} onClose={onClose}>
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/10">
        <DialogPanel className="max-w-lg w-full space-y-4 border border-gray-300 rounded-2xl shadow-2xl bg-white p-4">
          <DialogTitle className="font-bold">เลือกที่นั่ง</DialogTitle>
          <form
            id="seat-select"
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Field>
              <Label>ผู้เข้าร่วม</Label>
              <Select className="w-full" {...register("userId")} required>
                {userQuery.data?.map((u) => (
                  <option
                    key={u._id}
                    value={u._id}
                    disabled={u.seat !== undefined && u.seat !== null}
                  >
                    {u?.firstName} {u?.lastName} ({u?.phone})
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>ที่นั่ง</Label>
              <Select className="w-full" {...register("seatId")} required>
                {seatQuery.data?.map((seat) => (
                  <option
                    key={seat._id}
                    value={seat._id}
                    disabled={seat.user !== undefined && seat.user !== null}
                  >
                    {seat.seatNo} {seat.user?.firstName}
                  </option>
                ))}
              </Select>
            </Field>
          </form>
          <div className="flex gap-4">
            <Button type="submit" form="seat-select">
              ยืนยัน
            </Button>
            <Button variant="alternative" onClick={onClose}>
              ยกเลิก
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

type UserFilterForm = Record<string, string> & Record<keyof Query, string>;

export default function Status() {
  const [searchParams, setSearchParams] = useSearchParams();
  const auth = useAuthContext();
  const seatContext = useSeatContext();
  const appContext = useAppContext();
  const [selectedUser, setSelectedUser] = useState<User>();
  const currentPage = searchParams.get("page") || "1";

  const { register, handleSubmit, setValue } = useForm<UserFilterForm>();

  const queries = useMemo(() => {
    const options: Record<string, string> = {};

    if (searchParams.has("search"))
      options.search = searchParams.get("search")!;

    if (searchParams.has("sort")) options.sort = searchParams.get("sort")!;

    if (searchParams.has("limit")) options.limit = searchParams.get("limit")!;
    else options.limit = DEFAULT_LIMIT;

    if (searchParams.has("page")) options.page = searchParams.get("page")!;
    else options.page = "1";

    return options;
  }, [searchParams]);

  const users = useQuery<User[] | null>({
    queryKey: ["users", queries],
    queryFn: () => getUsers(queries),
  });

  function handleQuery(data: UserFilterForm) {
    setSearchParams((prev) => {
      const newState = new URLSearchParams(prev);

      Object.keys(data).forEach((key) => {
        if (data[key]) newState.set(key, data[key]);
        else newState.delete(key);
      });

      return newState;
    });
  }

  function handleCloseSelectSeatDialog() {
    setSelectedUser(undefined);
    users.refetch();
    seatContext.refetch();
    appContext.refetch();
  }

  async function handleReturnSeat(id: string) {
    if (!confirm("ต้องการคืนที่นั่ง?")) return;
    await removeUserFromSeat(id);
    users.refetch();
    seatContext.refetch();
    appContext.refetch();
  }

  const sortOptions = [
    {
      label: "ชื่อ A-Z",
      value: "firstName:asc",
    },
    {
      label: "ชื่อ Z-A",
      value: "firstName:desc",
    },
    {
      label: "ลงทะเบียนล่าสุด",
      value: "created:desc",
    },
    {
      label: "ลงทะเบียนก่อน",
      value: "created:asc",
    },
  ];

  if (auth.user?.isAdmin) {
    sortOptions.push(
      {
        label: "เลขที่นั่ง A-Z",
        value: "seat:asc",
      },
      { label: "เลขที่นั่ง Z-A", value: "seat:desc" }
    );
  }

  function forceSubmit() {
    handleSubmit(handleQuery)();
  }
  const pageNum = Number(currentPage);
  const next =
    (pageNum - 1 + 1) * Number(searchParams.get("limit") || DEFAULT_LIMIT);
  const canGoNextPage = next < appContext.totalUser!;

  function nextPage() {
    if (canGoNextPage) {
      setValue("page", `${pageNum + 1}`);
      forceSubmit();
    }
  }

  const canGoPrevPage = pageNum - 1 >= 1;

  function prePage() {
    if (canGoPrevPage) {
      setValue("page", `${pageNum - 1}`);
      forceSubmit();
    }
  }

  return (
    <>
      <nav className="py-6 mb-4 px-4 bg-blue-600 text-white">
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-2xl font-bold">Event Registration</h1>
        </div>
      </nav>
      {auth.user && (
        <main className="max-w-screen-lg mx-auto">
          <div className="grid grid-cols-2 gap-4 mb-4 px-4">
            <div className="shadow border border-gray-300 rounded-2xl p-4">
              <div className="text-xl text-gray-500 font-semibold">
                ผู้เข้าร่วม
              </div>
              <div className="text-4xl">{appContext.totalUser}</div>
            </div>
            <div className="shadow border border-gray-300 rounded-2xl p-4">
              <div className="text-xl text-gray-500 font-semibold">
                จำนวนที่นั่ง
              </div>
              <div className="text-4xl">
                {appContext.available}/{appContext.totalSeat}
              </div>
            </div>
          </div>
          <div className="px-4 font-medium">สถานะการลงทะเบียน</div>
          <dl className="p-4  text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
            <div className="flex flex-col pb-3">
              <dt className="mb-1 text-gray-500  dark:text-gray-400">ชื่อ</dt>
              <dd className="font-semibold">
                {auth.user.firstName} {auth.user.lastName}
              </dd>
            </div>
            <div className="flex flex-col pt-3">
              <dt className="mb-1 text-gray-500  dark:text-gray-400">
                เบอร์โทร
              </dt>
              <dd className="font-semibold">{auth.user.phone}</dd>
            </div>
            <div className="flex flex-col pt-3">
              <dt className="mb-1 text-gray-500  dark:text-gray-400">
                หมายเลขที่นั่ง
              </dt>
              <dd className="font-semibold">
                {auth.user.seat?.seatNo || "กรุณารอผู้ดูแลเลือกที่นั่ง"}
              </dd>
            </div>
          </dl>
          <hr className="m-4 mb-6 border-gray-300" />
          <h3 className="text-lg mb-4 px-4">ผู้เข้าร่วมทั้งหมด</h3>
          <form
            onSubmit={handleSubmit(handleQuery)}
            className="flex mb-4 px-4 gap-4"
          >
            <Input
              placeholder="ค้นหา"
              className="w-96"
              {...register("search")}
            />
            <Select
              {...register("sort")}
              onChange={(ev) => {
                setValue("sort", ev.target.value);
                forceSubmit();
              }}
            >
              <option value="">เรียงลำดับ</option>
              {sortOptions.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </Select>
            <input type="submit" className="hidden" />
          </form>
          <Table>
            <TableHead>
              <tr>
                <TableCell head>ชื่อ</TableCell>
                <TableCell head className="hidden lg:table-cell">
                  ลงทะเบียนวันที่
                </TableCell>
                {auth.user.isAdmin && (
                  <>
                    <TableCell head className="hidden lg:table-cell">
                      เบอร์โทร
                    </TableCell>
                    <TableCell head className="hidden lg:table-cell">
                      หมายเลขที่นั่ง
                    </TableCell>
                    <TableCell head></TableCell>
                  </>
                )}
              </tr>
            </TableHead>
            <tbody>
              {users.data?.map((user, index) => (
                <tr key={index}>
                  <TableCell>
                    <span className="font-medium text-black">
                      {user.firstName} {user.lastName}
                    </span>
                    {auth.user?.isAdmin && (
                      <div className="lg:hidden text-xs">
                        {user.phone}{" "}
                        {user.seat?.seatNo && (
                          <Badge>{user.seat?.seatNo}</Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {new Date(user.created!).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  {auth.user?.isAdmin && (
                    <>
                      <TableCell className="hidden lg:table-cell">
                        {user.phone}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.seat?.seatNo && (
                          <Badge>{user.seat?.seatNo}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.seat ? (
                          <button
                            className="underline text-black cursor-pointer"
                            onClick={() => handleReturnSeat(user.seat!._id)}
                          >
                            คืนที่นั่ง
                          </button>
                        ) : (
                          <button
                            className="underline text-black cursor-pointer"
                            onClick={() => setSelectedUser(user)}
                          >
                            เลือกที่นั่ง
                          </button>
                        )}
                      </TableCell>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="flex justify-end items-center gap-4 pb-4">
            <div>จำนวนต่อหน้า</div>
            <Select
              className="w-20 py-2"
              {...register("limit")}
              onChange={(ev) => {
                setValue("limit", ev.target.value);
                forceSubmit();
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Select>
            <div className="flex">
              <Button
                variant="light"
                className="flex justify-center items-center text-xs rounded-r-none"
                onClick={prePage}
                disabled={!canGoPrevPage}
              >
                ก่อนหน้า
              </Button>
              <Button
                variant="light"
                className="text-xs rounded-l-none"
                onClick={nextPage}
                disabled={!canGoNextPage}
              >
                ถัดไป
              </Button>
            </div>
          </div>
        </main>
      )}
      {!auth.user && <PhoneSearchForm />}
      {selectedUser && (
        <SelectSeatForUser
          user={selectedUser}
          onClose={handleCloseSelectSeatDialog}
        />
      )}
    </>
  );
}
