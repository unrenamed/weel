import { Link } from "@prisma/client";

type Params = {
  link: Link;
};

export default function LinkStats({ link }: Params) {
  return <section className="flex place-content-center"></section>;
}
