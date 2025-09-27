"use server";

import { Button } from "@mantine/core";
import "./page.scss";
import Link from "next/link";

export default async function Page() {
  return (
    <main className="home-container">
      <header className="home-header">
        <h1>Nextjs App Template</h1>
      </header>

      <section className="home-stack-features-container">
        <h2>Features</h2>
        <section className="home-features-row">
          {features.map(([title, href], idx) => {
            return <Item key={idx} href={href} title={title} />;
          })}
        </section>

        <h2>Stack</h2>
        <section className="home-stack-row">
          {stack.map(([title, href], idx) => {
            return <Item key={idx} href={href} title={title} />;
          })}
        </section>
      </section>
    </main>
  );
}

function Item({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  return (
    <Link href={href} target={href.length === 0 ? "_self" : "_blank"}>
      <Button fullWidth variant="outline" color="gray" fz="md">
        {title}
      </Button>
    </Link>
  );
}
const features = [
  ["Admin", ""],
  ["Authentication", ""],
  ["Authorization", ""],
  ["OAuth", ""],
  ["Sessions", ""],
  ["Data access & control layer", ""],
  ["Form validation: client & server", ""],
  ["Uploads", ""],
  ["Emails", ""],
  ["Test: e2e", ""],
  ["Test: unit", ""],
  ["Test: component", ""],
];

const stack = [
  ["Vercel", "https://www.vercel.com/"],
  ["Nextjs", "https://www.nextjs.org/"],
  ["Vercel Blob", "https://vercel.com/storage/blob"],
  ["Prisma", "https://www.prisma.io/"],
  ["Postgres", "www.postgresql.org"],
  ["Authjs", "https://authjs.dev/"],
  ["Valibot", "https://valibot.dev/"],
  ["Mantine UI", "https://mantine.dev/"],
  ["Cypress", "https://www.cypress.io/"],
  ["Jest", "https://jestjs.io/"],
];
